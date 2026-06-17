import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import AboutPage from './pages/AboutPage'
import ResumePage from './pages/ResumePage'
import PortfolioPage from './pages/PortfolioPage'
import ContactPage from './pages/ContactPage'
import AdminPage from './pages/AdminPage'

const SUPPORTED_LANGS = ['en', 'pt']
const DEFAULT_LANG = 'en'

function detectInitialLang() {
  const stored = typeof window !== 'undefined' ? localStorage.getItem('lang') : null
  if (stored && SUPPORTED_LANGS.includes(stored)) return stored

  if (typeof navigator !== 'undefined') {
    const nav = (navigator.language || '').toLowerCase()
    if (nav.startsWith('pt')) return 'pt'
  }
  return DEFAULT_LANG
}

export default function App() {
  return (
    <Routes>
      {/* Root → redirect to user's preferred language, About section */}
      <Route path="/" element={<Navigate to={`/${detectInitialLang()}/about`} replace />} />

      {/* Language root → About */}
      <Route path="/:lang" element={<Navigate to="about" replace />} />

      {/* Language + section routes (each a real, shareable URL) */}
      <Route path="/:lang" element={<Layout />}>
        <Route path="about" element={<AboutPage />} />
        <Route path="resume" element={<ResumePage />} />
        <Route path="portfolio" element={<PortfolioPage />} />
        <Route path="contact" element={<ContactPage />} />
      </Route>

      {/* Admin (kept as-is, no lang prefix) */}
      <Route path="/admin" element={<AdminPage />} />

      {/* Catch-all → home */}
      <Route path="*" element={<Navigate to={`/${detectInitialLang()}/about`} replace />} />
    </Routes>
  )
}
