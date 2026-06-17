import { fetchAuthSession, signIn, signOut } from 'aws-amplify/auth'
import { appConfig } from '../lib/config'
import { seedContent } from './seedContent'

async function authHeader() {
  const session = await fetchAuthSession()
  const token = session.tokens?.idToken?.toString()
  if (!token) {
    throw new Error('Not authenticated')
  }
  return { Authorization: `Bearer ${token}` }
}

async function callApi(path, options = {}, useAuth = false) {
  if (!appConfig.apiUrl) {
    return null
  }

  const headers = { 'Content-Type': 'application/json' }
  if (useAuth) {
    Object.assign(headers, await authHeader())
  }

  const response = await fetch(`${appConfig.apiUrl}${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) },
  })

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}))
    throw new Error(payload.message || `HTTP ${response.status}`)
  }

  return response.json()
}

export async function loadPublicPage(lang) {
  const data = await callApi(`/public/page/home?lang=${encodeURIComponent(lang)}`)
  if (!data) {
    return {
      settings: seedContent.settings,
      page: seedContent.page,
    }
  }
  return data
}

export async function adminLogin(username, password) {
  return signIn({ username, password })
}

export async function adminLogout() {
  return signOut()
}

export async function loadAdminData() {
  const [page, settings, fonts] = await Promise.all([
    callApi('/admin/pages/home', {}, true),
    callApi('/admin/settings', {}, true),
    callApi('/admin/fonts', {}, true).catch(() => []),
  ])

  return {
    page: page || seedContent.page,
    settings: settings || seedContent.settings,
    fonts: fonts || [],
  }
}

export async function saveAdminData(pageId, blocks, settings) {
  if (!appConfig.apiUrl) {
    return
  }

  await Promise.all([
    callApi(`/admin/pages/${pageId}`, {
      method: 'PUT',
      body: JSON.stringify({ blocks }),
    }, true),
    callApi('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    }, true),
  ])
}
