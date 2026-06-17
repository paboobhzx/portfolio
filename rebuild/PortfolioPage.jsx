import { useMemo, useState } from 'react'
import { DICT } from '../data/content'
import { useLang } from '../lib/prefs'

export default function PortfolioPage() {
  const { lang } = useLang()
  const copy = DICT[lang]

  const filters = useMemo(
    () => [
      { key: 'all', label: copy.ui.all, category: null },
      { key: 'certifications', label: copy.ui.certifications, category: 'certifications' },
      { key: 'projects', label: copy.ui.projects, category: 'projects' },
      { key: 'badges', label: copy.ui.badges, category: 'badges' },
    ],
    [copy],
  )

  const [activeFilter, setActiveFilter] = useState('all')

  const items = copy.portfolio.items

  const counts = useMemo(
    () => ({
      all: items.length,
      certifications: items.filter((i) => i.category === 'certifications').length,
      projects: items.filter((i) => i.category === 'projects').length,
      badges: items.filter((i) => i.category === 'badges').length,
    }),
    [items],
  )

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return items
    return items.filter((i) => i.category === activeFilter)
  }, [activeFilter, items])

  return (
    <div className="page-content">
      <header className="section-header">
        <span className="section-eyebrow">{copy.ui.sectionTitlePortfolio}</span>
        <h2 className="section-title">{copy.ui.sectionTitlePortfolio}</h2>
      </header>

      <div className="filter-row">
        {filters.map((f) => (
          <button
            key={f.key}
            type="button"
            className={activeFilter === f.key ? 'filter-pill active' : 'filter-pill'}
            onClick={() => setActiveFilter(f.key)}
          >
            {f.label} <span className="filter-count">{counts[f.key]}</span>
          </button>
        ))}
      </div>

      <div className="portfolio-grid">
        {filtered.map((item) => (
          <a key={item.id} className="portfolio-card" href={item.href}>
            <div className={`portfolio-cover ${item.coverClass}`}>
              <span className="portfolio-category">{copy.ui[item.category] || item.category}</span>
            </div>
            <h4 className="portfolio-title">{item.title}</h4>
            <p className="portfolio-desc">{item.description}</p>
          </a>
        ))}
      </div>
    </div>
  )
}
