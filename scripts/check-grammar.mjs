/**
 * Grammar verification script — checks all i18n strings across all pages
 * using OpenAI GPT-4o.
 *
 * Usage:
 *   OPENAI_API_KEY=sk-... node scripts/check-grammar.mjs
 */

import { readFileSync } from 'fs'
import { join } from 'path'

const API_KEY = process.env.OPENAI_API_KEY
if (!API_KEY) {
  console.error('Error: OPENAI_API_KEY environment variable is not set.')
  process.exit(1)
}

const PAGES = [
  'src/pages/index.html',
  'src/pages/project-map-cosmo.html',
  'src/pages/project-map-superzap.html',
  'src/pages/project-map-kuiper.html',
  'src/pages/project-map-starman.html',
  'src/pages/project-map-datalake.html',
]

const LANG_NAMES = {
  en: 'English',
  pt: 'Brazilian Portuguese',
  de: 'German',
  es: 'Spanish',
}

// Extract and merge all i18n dicts from all pages
const combined = {}

for (const page of PAGES) {
  const content = readFileSync(page, 'utf8')
  // Match the window.__I18N__ = { ... } block before </script>
  const match = content.match(/window\.__I18N__\s*=\s*(\{[\s\S]*?\})\s*\n\s*<\/script>/)
  if (!match) {
    console.warn(`[warn] No i18n block found in ${page}`)
    continue
  }
  try {
    const i18n = new Function(`return ${match[1]}`)()
    for (const [lang, dict] of Object.entries(i18n)) {
      if (!combined[lang]) combined[lang] = {}
      Object.assign(combined[lang], dict)
    }
  } catch (e) {
    console.warn(`[warn] Parse error in ${page}: ${e.message}`)
  }
}

const langs = Object.keys(combined).filter(l => LANG_NAMES[l])
console.log(`\nLanguages found: ${langs.join(', ')}`)
console.log(`Pages scanned:   ${PAGES.length}\n`)

// Strip HTML tags from values before sending (keeps the text content)
function stripHtml(str) {
  return str.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
}

function sanitizeDict(dict) {
  const out = {}
  for (const [k, v] of Object.entries(dict)) {
    // Skip non-translatable keys (numbers, technical strings, URLs)
    if (/^[0-9.%+/]+$/.test(v)) continue
    if (v.startsWith('http') || v.startsWith('©')) continue
    out[k] = stripHtml(v)
  }
  return out
}

let hasIssues = false

for (const lang of langs) {
  const langName = LANG_NAMES[lang]
  const dict = sanitizeDict(combined[lang])
  const keyCount = Object.keys(dict).length

  console.log(`${'─'.repeat(60)}`)
  console.log(`Checking ${langName} (${keyCount} strings)...`)
  console.log(`${'─'.repeat(60)}`)

  const prompt = JSON.stringify(dict, null, 2)

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      temperature: 0,
      messages: [
        {
          role: 'system',
          content: `You are a professional ${langName} proofreader reviewing UI copy for a software engineer's personal portfolio website. The audience is senior engineering managers and tech leads at companies.

Check ONLY for:
- Grammar errors
- Spelling mistakes
- Unnatural phrasing or awkward word order
- Wrong verb conjugations
- Gender/number agreement errors (for Spanish, German, Portuguese)

Do NOT suggest:
- Style changes or tone adjustments
- Alternative vocabulary (unless the current word is wrong)
- Punctuation preferences

Format your response as:
- For each error found: key: "original" → "corrected" — reason
- If no errors: respond with exactly "✓ No issues found."`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  })

  const data = await res.json()
  if (data.error) {
    console.error(`API Error: ${data.error.message}\n`)
    continue
  }

  const result = data.choices[0].message.content.trim()
  console.log(result)
  console.log()

  if (!result.startsWith('✓')) {
    hasIssues = true
  }
}

console.log('─'.repeat(60))
if (hasIssues) {
  console.log('Grammar check complete — issues found above. Review and apply corrections.')
} else {
  console.log('✓ Grammar check complete — all languages clean.')
}
