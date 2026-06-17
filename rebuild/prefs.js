import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { SUPPORTED_LANGS, DEFAULT_LANG } from '../data/content'

const LANG_KEY = 'lang'
const THEME_KEY = 'theme'

/**
 * Reads the :lang segment from the URL, validates it, and exposes a setter
 * that navigates to the same section under the other language.
 * Also persists the choice to localStorage so it survives reloads.
 */
export function useLang() {
  const params = useParams()
  const navigate = useNavigate()

  const lang = SUPPORTED_LANGS.includes(params.lang) ? params.lang : DEFAULT_LANG

  useEffect(() => {
    if (SUPPORTED_LANGS.includes(lang)) {
      localStorage.setItem(LANG_KEY, lang)
      document.documentElement.setAttribute('lang', lang === 'pt' ? 'pt-BR' : 'en')
    }
  }, [lang])

  const setLang = (nextLang) => {
    if (!SUPPORTED_LANGS.includes(nextLang) || nextLang === lang) return

    // Replace only the first segment of the path, keep the section.
    const path = window.location.pathname
    const segments = path.split('/').filter(Boolean)
    if (segments.length === 0) {
      navigate(`/${nextLang}/about`, { replace: false })
      return
    }
    segments[0] = nextLang
    if (segments.length === 1) segments.push('about')
    navigate('/' + segments.join('/'), { replace: false })
  }

  return { lang, setLang }
}

/** Persisted dark/light theme. Applied via [data-theme] on <html>. */
export function useTheme() {
  const apply = (value) => {
    document.documentElement.setAttribute('data-theme', value)
    localStorage.setItem(THEME_KEY, value)
  }

  useEffect(() => {
    const stored = localStorage.getItem(THEME_KEY)
    apply(stored === 'light' ? 'light' : 'dark')
  }, [])

  const getTheme = () =>
    typeof document !== 'undefined'
      ? document.documentElement.getAttribute('data-theme') || 'dark'
      : 'dark'

  const setTheme = (value) => {
    apply(value === 'light' ? 'light' : 'dark')
    // Force a re-render of consumers that look at the attribute.
    window.dispatchEvent(new Event('themechange'))
  }

  return { getTheme, setTheme }
}
