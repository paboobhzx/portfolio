import { useState } from 'react'
import { DICT, PROFILE } from '../data/content'
import { useLang } from '../lib/prefs'

const INITIAL_VISIBLE = 1

export default function ResumePage() {
  const { lang } = useLang()
  const copy = DICT[lang]

  const [expVisible, setExpVisible] = useState(INITIAL_VISIBLE)
  const [eduVisible, setEduVisible] = useState(INITIAL_VISIBLE)

  return (
    <div className="page-content">
      <header className="section-header">
        <span className="section-eyebrow">{copy.ui.sectionTitleResume}</span>
        <h2 className="section-title">{copy.ui.sectionTitleResume}</h2>
      </header>

      <div className="resume-summary">
        {copy.resume.summary.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <div className="stats-grid">
        {copy.resume.stats.map((stat) => (
          <article key={stat.label} className="stat-card">
            <strong className="stat-value">{stat.value}</strong>
            <span className="stat-label">{stat.label}</span>
          </article>
        ))}
      </div>

      <div className="resume-split">
        {/* Experience timeline */}
        <section className="subsection">
          <h3 className="subsection-title">{copy.ui.experience}</h3>
          <div className="timeline">
            {copy.resume.experience.slice(0, expVisible).map((item, i) => (
              <article key={`${item.role}-${i}`} className="timeline-item">
                <span className="timeline-period">{item.period}</span>
                <h4 className="timeline-role">
                  {item.role} · {item.company}
                </h4>
                <p className="timeline-desc">{item.description}</p>
              </article>
            ))}
          </div>
          {copy.resume.experience.length > INITIAL_VISIBLE && (
            <button
              type="button"
              className="ghost-btn"
              onClick={() =>
                setExpVisible(expVisible === INITIAL_VISIBLE ? copy.resume.experience.length : INITIAL_VISIBLE)
              }
            >
              {expVisible === INITIAL_VISIBLE ? copy.ui.showMore : copy.ui.showLess}
            </button>
          )}
        </section>

        {/* Education timeline */}
        <section className="subsection">
          <h3 className="subsection-title">{copy.ui.education}</h3>
          <div className="timeline">
            {copy.resume.education.slice(0, eduVisible).map((item, i) => (
              <article key={`${item.title}-${i}`} className="timeline-item">
                <span className="timeline-period">{item.period}</span>
                <h4 className="timeline-role">{item.title}</h4>
                <p className="timeline-desc">{item.school}</p>
              </article>
            ))}
          </div>
          {copy.resume.education.length > INITIAL_VISIBLE && (
            <button
              type="button"
              className="ghost-btn"
              onClick={() =>
                setEduVisible(eduVisible === INITIAL_VISIBLE ? copy.resume.education.length : INITIAL_VISIBLE)
              }
            >
              {eduVisible === INITIAL_VISIBLE ? copy.ui.showMore : copy.ui.showLess}
            </button>
          )}
        </section>
      </div>

      <div className="resume-split">
        <section className="subsection">
          <h3 className="subsection-title">{copy.ui.coreCompetencies}</h3>
          <ul className="competency-list">
            {copy.resume.competencies.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="subsection">
          <h3 className="subsection-title">{copy.ui.toolsAndTech}</h3>
          <div className="tools-grid">
            {copy.resume.tools.map((tool) => (
              <article key={tool.name} className="tool-card">
                <strong>{tool.name}</strong>
                <span>{tool.level}</span>
              </article>
            ))}
          </div>
        </section>
      </div>

      <div className="resume-cv-row">
        <a className="primary-btn" href={PROFILE.cvUrl[lang]} target="_blank" rel="noreferrer">
          {copy.ui.downloadCv} CV ({lang.toUpperCase()})
        </a>
      </div>
    </div>
  )
}
