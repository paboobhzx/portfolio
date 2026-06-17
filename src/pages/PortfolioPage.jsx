import { DICT } from '../data/content'
import { useLang } from '../lib/prefs'

export default function PortfolioPage() {
  const { lang } = useLang()
  const copy = DICT[lang]

  return (
    <div className="page-content">
      <header className="section-header">
        <span className="section-eyebrow">{copy.ui.sectionTitlePortfolio}</span>
        <h2 className="section-title">{copy.ui.sectionTitlePortfolio}</h2>
      </header>

      <div className="portfolio-grid">
        {copy.portfolio.items.map((item) => (
          <article key={item.id} className="portfolio-card">
            <div className={`portfolio-cover ${item.coverClass}`}>
              <span className="portfolio-category">{copy.ui.projects}</span>
            </div>
            <h4 className="portfolio-title">{item.title}</h4>
            <p className="portfolio-desc">{item.description}</p>
            <div className="portfolio-actions">
              <a className="portfolio-action-btn" href={item.liveUrl} target="_blank" rel="noreferrer">
                {copy.ui.projectLiveSite}
              </a>
              <a className="portfolio-action-btn" href={item.mapUrl}>
                {copy.ui.projectMap}
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
