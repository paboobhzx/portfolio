/*
  Minimal runtime i18n for static pages.

  Usage:
    1) Add translations to window.__I18N__ = { en: {...}, pt: {...}, de: {...}, es: {...} }
    2) Add language buttons with .lang-btn[data-lang="en|pt|de|es"]
    3) Mark nodes:
       - data-i18n="key"       (textContent)
       - data-i18n-html="key"  (innerHTML)
*/

const STORAGE_KEY = "pablobhz_lang"
const SUPPORTED_LANGS = ["en", "pt", "de", "es"]

function normalizeLang(input) {
  const v = String(input || "").toLowerCase()

  if (v.startsWith("pt")) {
    return "pt"
  }
  if (v.startsWith("de")) {
    return "de"
  }
  if (v.startsWith("es")) {
    return "es"
  }
  return "en"
}

function pickInitialLang() {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    return normalizeLang(stored)
  }
  return normalizeLang(navigator.language)
}

function applyTranslations(dict, lang) {
  document.querySelectorAll("[data-i18n]").forEach(function (el) {
    const k = el.dataset.i18n
    if (k && dict[lang] && dict[lang][k] != null) {
      el.textContent = dict[lang][k]
    }
  })

  document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
    const k = el.dataset.i18nHtml
    if (k && dict[lang] && dict[lang][k] != null) {
      el.innerHTML = dict[lang][k]
    }
  })
}

function updateHtmlLang(lang) {
  if (lang === "pt") {
    document.documentElement.lang = "pt-BR"
  } else if (lang === "de") {
    document.documentElement.lang = "de"
  } else if (lang === "es") {
    document.documentElement.lang = "es"
  } else {
    document.documentElement.lang = "en"
  }
}

export function setLang(lang) {
  const dict = window.__I18N__ || {}
  const next = normalizeLang(lang)

  localStorage.setItem(STORAGE_KEY, next)
  updateHtmlLang(next)

  document.querySelectorAll(".lang-btn").forEach(function (btn) {
    const isActive = normalizeLang(btn.dataset.lang) === next
    btn.classList.toggle("active", isActive)
  })

  applyTranslations(dict, next)
}

export function initI18n() {
  const dict = window.__I18N__ || {}
  const missing = SUPPORTED_LANGS.filter(function (l) {
    return !dict[l]
  })

  if (missing.length > 0) {
    console.warn("[i18n] window.__I18N__ missing dictionaries for: " + missing.join(", "))
  }

  document.querySelectorAll(".lang-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setLang(btn.dataset.lang)
    })
  })

  setLang(pickInitialLang())
}

// Convenience for inline scripts without module imports
window.PABLO_I18N = { initI18n, setLang }
