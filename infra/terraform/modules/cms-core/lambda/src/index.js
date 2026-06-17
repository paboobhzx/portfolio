import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { CognitoIdentityProviderClient, GetGroupCommand, AdminGetUserCommand } from '@aws-sdk/client-cognito-identity-provider'
import crypto from 'crypto'

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}))
const s3 = new S3Client({})
const cognito = new CognitoIdentityProviderClient({})

const TABLE = process.env.PAGES_TABLE_NAME
const BUCKET = process.env.MEDIA_BUCKET_NAME
const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Authorization,Content-Type',
  'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
}

function response(statusCode, body) {
  return {
    statusCode,
    headers: CORS,
    body: JSON.stringify(body),
  }
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function withRetry(fn, { retries = 3, baseDelayMs = 120 } = {}) {
  let lastError
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      if (attempt === retries) {
        break
      }
      const jitter = Math.floor(Math.random() * 80)
      await wait(baseDelayMs * (2 ** attempt) + jitter)
    }
  }
  throw lastError
}

function parseBody(event) {
  if (!event.body) {
    return {}
  }
  try {
    return JSON.parse(event.body)
  } catch {
    return {}
  }
}

async function ensureAdmin(event) {
  const token = event.headers?.authorization || event.headers?.Authorization
  if (!token || !token.startsWith('Bearer ')) {
    throw new Error('Missing token')
  }

  const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString('utf8'))
  const groups = payload['cognito:groups'] || []
  if (!Array.isArray(groups) || !groups.includes('admin')) {
    throw new Error('Forbidden')
  }

  if (USER_POOL_ID && payload.username) {
    await withRetry(() => cognito.send(new AdminGetUserCommand({
      UserPoolId: USER_POOL_ID,
      Username: payload.username,
    })))
    await withRetry(() => cognito.send(new GetGroupCommand({
      GroupName: 'admin',
      UserPoolId: USER_POOL_ID,
    })))
  }
}

async function getPage(pageId) {
  const entry = await withRetry(() => ddb.send(new GetCommand({
    TableName: TABLE,
    Key: { pageId: `page:${pageId}` },
  })))

  return entry.Item || { pageId, blocks: [] }
}

async function getSettings() {
  const entry = await withRetry(() => ddb.send(new GetCommand({
    TableName: TABLE,
    Key: { pageId: 'site_settings' },
  })))
  return entry.Item || {}
}

async function putPage(pageId, blocks) {
  const item = {
    pageId: `page:${pageId}`,
    blocks: blocks || [],
    updatedAt: new Date().toISOString(),
  }
  await withRetry(() => ddb.send(new PutCommand({ TableName: TABLE, Item: item })))
  return item
}

async function putSettings(data) {
  const item = {
    pageId: 'site_settings',
    ...data,
    updatedAt: new Date().toISOString(),
  }
  await withRetry(() => ddb.send(new PutCommand({ TableName: TABLE, Item: item })))
  return item
}

function mapPublicBlocks(blocks, lang) {
  return (blocks || []).map((block) => {
    const localized = block.content?.[lang] || block.content?.en || {}
    return { ...block, content: localized }
  })
}

export async function handler(event) {
  if (event.requestContext?.http?.method === 'OPTIONS') {
    return response(204, {})
  }

  const method = event.requestContext?.http?.method || 'GET'
  const path = event.rawPath || '/'

  try {
    if (method === 'GET' && path === '/public/settings') {
      const settings = await getSettings()
      return response(200, settings)
    }

    if (method === 'GET' && path.startsWith('/public/page/')) {
      const pageId = path.replace('/public/page/', '')
      const lang = event.queryStringParameters?.lang || 'en'
      const [settings, page] = await Promise.all([getSettings(), getPage(pageId)])
      return response(200, {
        settings,
        page: {
          ...page,
          blocks: mapPublicBlocks(page.blocks, lang),
        },
      })
    }

    await ensureAdmin(event)

    if (method === 'GET' && path.startsWith('/admin/pages/')) {
      const pageId = path.replace('/admin/pages/', '')
      return response(200, await getPage(pageId))
    }

    if (method === 'PUT' && path.startsWith('/admin/pages/')) {
      const pageId = path.replace('/admin/pages/', '')
      const body = parseBody(event)
      return response(200, await putPage(pageId, body.blocks || []))
    }

    if (method === 'GET' && path === '/admin/settings') {
      return response(200, await getSettings())
    }

    if (method === 'PUT' && path === '/admin/settings') {
      return response(200, await putSettings(parseBody(event)))
    }

    if (method === 'GET' && path === '/admin/fonts') {
      const entry = await withRetry(() => ddb.send(new GetCommand({
        TableName: TABLE,
        Key: { pageId: 'custom_fonts' },
      })))
      return response(200, entry.Item?.fonts || [])
    }

    if (method === 'POST' && path === '/admin/fonts') {
      const body = parseBody(event)
      const entry = await withRetry(() => ddb.send(new GetCommand({
        TableName: TABLE,
        Key: { pageId: 'custom_fonts' },
      })))
      const fonts = entry.Item?.fonts || []
      const item = {
        fontId: crypto.randomBytes(8).toString('hex'),
        name: body.name,
        url: body.url,
        createdAt: new Date().toISOString(),
      }
      fonts.push(item)
      await withRetry(() => ddb.send(new PutCommand({
        TableName: TABLE,
        Item: { pageId: 'custom_fonts', fonts },
      })))
      return response(200, item)
    }

    if (method === 'DELETE' && path === '/admin/fonts') {
      const fontId = event.queryStringParameters?.fontId
      const entry = await withRetry(() => ddb.send(new GetCommand({
        TableName: TABLE,
        Key: { pageId: 'custom_fonts' },
      })))
      const filtered = (entry.Item?.fonts || []).filter((font) => font.fontId !== fontId)
      await withRetry(() => ddb.send(new PutCommand({
        TableName: TABLE,
        Item: { pageId: 'custom_fonts', fonts: filtered },
      })))
      return response(200, { deleted: fontId })
    }

    if (method === 'POST' && path === '/admin/upload') {
      const body = parseBody(event)
      const extension = body.filename?.includes('.') ? body.filename.split('.').pop() : 'bin'
      const key = `uploads/${crypto.randomBytes(12).toString('hex')}.${extension}`
      const uploadUrl = await getSignedUrl(s3, new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        ContentType: body.contentType || 'application/octet-stream',
      }), { expiresIn: 300 })

      return response(200, {
        uploadUrl,
        publicUrl: `https://${BUCKET}.s3.amazonaws.com/${key}`,
        key,
      })
    }

    return response(404, { message: 'Route not found' })
  } catch (error) {
    if (error.message === 'Missing token' || error.message === 'Forbidden') {
      return response(403, { message: error.message })
    }
    return response(500, { message: 'Internal error', detail: error.message })
  }
}
