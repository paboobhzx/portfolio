import { useMemo, useState } from 'react'
import { DICT } from '../data/content'
import { useLang } from '../lib/prefs'

export default function CertificationsPage() {
  const { lang } = useLang()
  const copy = DICT[lang]
  const [filter, setFilter] = useState('all')
  const isPt = lang === 'pt'

  const filterOptions = useMemo(
    () => [
      { id: 'all', label: copy.ui.all },
      { id: 'certification', label: copy.ui.certificationsOnly },
      { id: 'microcredential', label: copy.ui.microcredentials },
    ],
    [copy.ui.all, copy.ui.certificationsOnly, copy.ui.microcredentials]
  )

  const filteredItems = useMemo(() => {
    if (filter === 'all') return copy.certifications.items
    return copy.certifications.items.filter((item) => item.kind === filter)
  }, [copy.certifications.items, filter])

  return (
    <div className="page-content">
      <header className="section-header">
        <span className="section-eyebrow">{copy.ui.sectionTitleCertifications}</span>
        <h2 className="section-title">{copy.ui.sectionTitleCertifications}</h2>
      </header>

      <div className="filter-row">
        {filterOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            className={filter === option.id ? 'filter-pill active' : 'filter-pill'}
            onClick={() => setFilter(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="portfolio-grid">
        {filteredItems.map((item) => (
          <a key={item.id} className="portfolio-card" href={item.href} target="_blank" rel="noreferrer">
            <div className="portfolio-cover portfolio-cover-cert">
              <span className="portfolio-category">
                {item.kind === 'microcredential'
                  ? copy.ui.microcredentials
                  : isPt
                    ? 'Certificação'
                    : 'Certification'}
              </span>
              <img className="portfolio-badge-image" src={item.image} alt={item.title} loading="lazy" />
            </div>
            <h4 className="portfolio-title">{item.title}</h4>
            <p className="portfolio-desc">{item.description}</p>
          </a>
        ))}
      </div>
    </div>
  )
}
