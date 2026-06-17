import { DICT } from '../data/content'
import { useLang } from '../lib/prefs'

export default function AboutPage() {
  const { lang } = useLang()
  const copy = DICT[lang]

  return (
    <div className="page-content">
      <header className="section-header">
        <span className="section-eyebrow">{copy.ui.sectionTitleAbout}</span>
        <h2 className="section-title">{copy.about.headline}</h2>
      </header>

      <div className="prose">
        {copy.about.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <div className="stats-grid">
        {copy.about.stats.map((stat) => (
          <article key={stat.label} className="stat-card">
            <strong className="stat-value">{stat.value}</strong>
            <span className="stat-label">{stat.label}</span>
          </article>
        ))}
      </div>

      <section className="subsection">
        <h3 className="subsection-title">{copy.ui.whatIDo}</h3>
        <div className="services-grid">
          {copy.about.services.map((service) => (
            <article key={service.title} className="service-card">
              <div className="service-icon" aria-hidden="true" />
              <div className="service-text">
                <h4>{service.title}</h4>
                <p>{service.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="subsection">
        <h3 className="subsection-title">{copy.ui.techStack}</h3>
        <div className="pill-wrap">
          {copy.about.stack.map((item) => (
            <span key={item} className="pill">{item}</span>
          ))}
        </div>
      </section>

      <section className="subsection">
        <h3 className="subsection-title">{copy.ui.clients}</h3>
        <div className="clients-grid">
          {copy.about.clients.map((client) => (
            <div key={client} className="client-tile">{client}</div>
          ))}
        </div>
      </section>
    </div>
  )
}
