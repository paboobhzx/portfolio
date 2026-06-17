export default function Sidebar({ settings, lang, onLangChange }) {
  const role = settings.role?.[lang] || settings.role?.en || ''

  return (
    <aside className="sidebar">
      <div className="profile">
        <div className="avatar" aria-label="Profile picture placeholder">
          {settings.profileImageUrl ? <img src={settings.profileImageUrl} alt={settings.fullName} /> : <span>{settings.profileInitials || 'PC'}</span>}
        </div>
        <h1>{settings.fullName}</h1>
        <p>{role}</p>
      </div>

      <div className="lang-switch">
        <button type="button" className={lang === 'en' ? 'active' : ''} onClick={() => onLangChange('en')}>EN</button>
        <button type="button" className={lang === 'pt-BR' ? 'active' : ''} onClick={() => onLangChange('pt-BR')}>PT-BR</button>
      </div>

      <ul className="meta">
        <li>{settings.location}</li>
        <li><a href={settings.contacts?.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></li>
        <li><a href={settings.contacts?.github} target="_blank" rel="noreferrer">GitHub</a></li>
        <li><a href={`mailto:${settings.contacts?.email}`}>{settings.contacts?.email}</a></li>
      </ul>
    </aside>
  )
}
