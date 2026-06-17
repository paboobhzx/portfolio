import { useEffect, useState } from 'react'
import { DICT, PROFILE } from '../data/content'
import { useLang } from '../lib/prefs'

const INITIAL_EXPERIENCE_ITEMS = 2

export default function ResumePage() {
  const { lang } = useLang()
  const copy = DICT[lang]
  const [showAllExperience, setShowAllExperience] = useState(false)

  useEffect(() => {
    setShowAllExperience(false)
  }, [lang])

  const visibleExperience = showAllExperience
    ? copy.resume.experience
    : copy.resume.experience.slice(0, INITIAL_EXPERIENCE_ITEMS)

  return (
    <div className="page-content">
      <header className="section-header">
        <span className="section-eyebrow">{copy.ui.sectionTitleResume}</span>
        <h2 className="section-title">{copy.ui.sectionTitleResume}</h2>
      </header>

      <section className="resume-summary-block">
        <div className="resume-summary">
          {copy.resume.summary.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      <section className="subsection resume-experience-block">
        <h3 className="subsection-title">{copy.ui.experience}</h3>
        <div className="timeline">
          {visibleExperience.map((item, i) => (
            <article key={`${item.role}-${i}`} className="timeline-item">
              <span className="timeline-period">{item.period}</span>
              <h4 className="timeline-role">
                {item.role} · {item.company}
              </h4>
              <p className="timeline-desc">{item.description}</p>
              {item.highlights?.length ? (
                <ul className="timeline-highlights">
                  {item.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
        {copy.resume.experience.length > INITIAL_EXPERIENCE_ITEMS ? (
          <button
            type="button"
            className="ghost-btn"
            onClick={() => setShowAllExperience((value) => !value)}
          >
            {showAllExperience ? copy.ui.showLess : copy.ui.showMore}
          </button>
        ) : null}
      </section>

      <section className="subsection resume-education-block">
        <h3 className="subsection-title">{copy.ui.education}</h3>
        <div className="timeline">
          {copy.resume.education.map((item, i) => (
            <article key={`${item.title}-${i}`} className="timeline-item">
              <span className="timeline-period">{item.period}</span>
              <h4 className="timeline-role">{item.title}</h4>
              <p className="timeline-desc">{item.school}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="resume-skills-block">
        <div className="resume-two-col">
          <section className="subsection">
            <h3 className="subsection-title">{copy.ui.coreCompetencies}</h3>
            <article className="competency-card">
              <ul className="competency-list">
                {copy.resume.competencies.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
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
      </section>

      <div className="resume-cv-row">
        <a className="primary-btn" href={PROFILE.cvUrl[lang]} target="_blank" rel="noreferrer">
          {lang === 'pt' ? copy.ui.downloadCvPtBr : copy.ui.downloadCvEn}
        </a>
      </div>
    </div>
  )
}
