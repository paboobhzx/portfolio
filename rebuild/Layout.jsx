import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { DICT, NAV_ITEMS, PROFILE } from '../data/content'
import { useLang, useTheme } from '../lib/prefs'

export default function Layout() {
  const { lang, setLang } = useLang()
  const { getTheme, setTheme } = useTheme()
  const [themeTick, setThemeTick] = useState(0)
  const location = useLocation()

  useEffect(() => {
    const handler = () => setThemeTick((n) => n + 1)
    window.addEventListener('themechange', handler)
    return () => window.removeEventListener('themechange', handler)
  }, [])

  const theme = getTheme()
  const copy = DICT[lang]

  // Update <title> per route for shareable links + bookmarks.
  useEffect(() => {
    const section = location.pathname.split('/').filter(Boolean)[1] || 'about'
    const key = `sectionTitle${section.charAt(0).toUpperCase()}${section.slice(1)}`
    const sectionLabel = copy.ui[key] || copy.nav[section] || ''
    document.title = `${PROFILE.name} · ${sectionLabel}`
  }, [location.pathname, copy])

  return (
    <div className="page-shell">
      <div className="layout-wrap">
        {/* SIDEBAR CARD — left column on desktop, top card on tablet/mobile */}
        <aside className="sidebar-card">
          <div className="sidebar-head">
            <p className="sidebar-name">{PROFILE.name}</p>
            <p className="sidebar-role">{PROFILE.role}</p>
          </div>

          <nav className="side-nav" aria-label="Sections">
            {NAV_ITEMS.map((view) => (
              <NavLink
                key={view}
                to={`/${lang}/${view}`}
                className={({ isActive }) => (isActive ? 'side-nav-item active' : 'side-nav-item')}
              >
                {copy.nav[view]}
              </NavLink>
            ))}
          </nav>

          <div className="sidebar-controls">
            <div className="toggle-group" role="group" aria-label="Language">
              <button
                type="button"
                className={lang === 'en' ? 'toggle active' : 'toggle'}
                onClick={() => setLang('en')}
              >
                EN
              </button>
              <button
                type="button"
                className={lang === 'pt' ? 'toggle active' : 'toggle'}
                onClick={() => setLang('pt')}
              >
                PT
              </button>
            </div>

            <div className="toggle-group" role="group" aria-label="Theme">
              <button
                type="button"
                key={`dark-${themeTick}`}
                className={theme === 'dark' ? 'toggle active' : 'toggle'}
                onClick={() => setTheme('dark')}
              >
                {copy.ui.dark}
              </button>
              <button
                type="button"
                key={`light-${themeTick}`}
                className={theme === 'light' ? 'toggle active' : 'toggle'}
                onClick={() => setTheme('light')}
              >
                {copy.ui.light}
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN COLUMN — banner stays across all routes; only Outlet content changes */}
        <div className="main-column">
          <header className="profile-banner">
            <div className="banner-identity">
              <div className="avatar-box">
                <div className="avatar-inner">
                  {/* Replace with <img src={PROFILE.avatar} alt={PROFILE.name} /> when ready */}
                  <span className="avatar-letter">P</span>
                </div>
              </div>
              <div className="banner-text">
                <h1 className="banner-name">{PROFILE.name}</h1>
                <p className="banner-role">{PROFILE.role}</p>
                <div className="banner-links">
                  <a href={PROFILE.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
                  <a href={PROFILE.github} target="_blank" rel="noreferrer">GitHub</a>
                </div>
              </div>
            </div>

            <div className="banner-meta">
              <div className="meta-block">
                <span className="meta-label">{copy.ui.labelEmail}</span>
                <a className="meta-value" href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
              </div>
              <div className="meta-block">
                <span className="meta-label">{copy.ui.labelLocation}</span>
                <span className="meta-value">{PROFILE.location}</span>
              </div>
              <div className="meta-block">
                <span className="meta-label">{copy.ui.labelStatus}</span>
                <span className="meta-value status-open">
                  <span className="status-dot" />
                  {copy.ui.statusOpenToWork}
                </span>
              </div>
            </div>
          </header>

          {/* Per-route nav row — mirrors sidebar but visible above content */}
          <div className="route-nav">
            <nav className="route-nav-pills" aria-label="Sections">
              {NAV_ITEMS.map((view) => (
                <NavLink
                  key={view}
                  to={`/${lang}/${view}`}
                  className={({ isActive }) => (isActive ? 'route-pill active' : 'route-pill')}
                >
                  {copy.nav[view]}
                </NavLink>
              ))}
            </nav>

            <div className="route-nav-toggles">
              <div className="toggle-group" role="group" aria-label="Language">
                <button
                  type="button"
                  className={lang === 'en' ? 'toggle active' : 'toggle'}
                  onClick={() => setLang('en')}
                >
                  EN
                </button>
                <button
                  type="button"
                  className={lang === 'pt' ? 'toggle active' : 'toggle'}
                  onClick={() => setLang('pt')}
                >
                  PT
                </button>
              </div>
              <div className="toggle-group" role="group" aria-label="Theme">
                <button
                  type="button"
                  className={theme === 'dark' ? 'toggle active' : 'toggle'}
                  onClick={() => setTheme('dark')}
                >
                  {copy.ui.dark}
                </button>
                <button
                  type="button"
                  className={theme === 'light' ? 'toggle active' : 'toggle'}
                  onClick={() => setTheme('light')}
                >
                  {copy.ui.light}
                </button>
              </div>
            </div>
          </div>

          {/* The actual page content (About / Resume / Portfolio / Contact) */}
          <section className="view-panel" key={location.pathname}>
            <Outlet />
          </section>
        </div>
      </div>
    </div>
  )
}
