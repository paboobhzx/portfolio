import { useState } from 'react'
import { DICT, PROFILE } from '../data/content'
import { useLang } from '../lib/prefs'

export default function ContactPage() {
  const { lang } = useLang()
  const copy = DICT[lang]

  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleSubmit = (event) => {
    event.preventDefault()
    const subject = encodeURIComponent(copy.ui.messageSubject)
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`,
    )
    window.location.href = `mailto:${PROFILE.email}?subject=${subject}&body=${body}`
  }

  const channels = [
    { key: 'email', label: 'Email', value: PROFILE.email, href: `mailto:${PROFILE.email}` },
    { key: 'whatsapp', label: 'WhatsApp', value: PROFILE.whatsapp, href: PROFILE.whatsappLink },
    { key: 'linkedin', label: 'LinkedIn', value: 'linkedin.com/in/pablobhz', href: PROFILE.linkedin },
    { key: 'github', label: 'GitHub', value: 'github.com/pablobhz', href: PROFILE.github },
  ]

  return (
    <div className="page-content">
      <header className="section-header">
        <span className="section-eyebrow">{copy.ui.sectionTitleContact}</span>
        <h2 className="section-title">{copy.ui.contactChannels}</h2>
      </header>

      <p className="prose">{copy.contact.intro}</p>

      <div className="contact-grid">
        {channels.map((channel) => (
          <a
            key={channel.key}
            className="contact-card"
            href={channel.href}
            target={channel.key === 'email' || channel.key === 'whatsapp' ? undefined : '_blank'}
            rel="noreferrer"
          >
            <span className="contact-label">{channel.label}</span>
            <strong className="contact-value">{channel.value}</strong>
          </a>
        ))}
      </div>

      <section className="subsection">
        <h3 className="subsection-title">{copy.ui.contactForm}</h3>
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <input
              type="text"
              required
              placeholder={copy.ui.namePlaceholder}
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
            <input
              type="email"
              required
              placeholder={copy.ui.emailPlaceholder}
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
          </div>
          <textarea
            required
            rows="6"
            placeholder={copy.ui.messagePlaceholder}
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          />
          <button type="submit" className="primary-btn">{copy.ui.send}</button>
        </form>
      </section>
    </div>
  )
}
