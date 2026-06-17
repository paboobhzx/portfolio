const KEY = 'lang'
export const SUPPORTED_LANGS = ['en', 'pt-BR']

export function normalizeLang(input) {
  const value = String(input || '').toLowerCase()
  if (value.startsWith('pt')) {
    return 'pt-BR'
  }
  return 'en'
}

export function getInitialLang() {
  const stored = localStorage.getItem(KEY)
  if (stored) {
    return normalizeLang(stored)
  }
  return normalizeLang(navigator.language)
}

export function persistLang(lang) {
  localStorage.setItem(KEY, normalizeLang(lang))
}
