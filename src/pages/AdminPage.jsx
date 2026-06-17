import { useState } from 'react'
import BlockEditor from '../admin/BlockEditor'
import { adminLogin, adminLogout, loadAdminData, saveAdminData } from '../cms/api'
import { seedContent } from '../cms/seedContent'

export default function AdminPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [lang, setLang] = useState('en')
  const [settings, setSettings] = useState(seedContent.settings)
  const [blocks, setBlocks] = useState(seedContent.page.blocks)
  const [status, setStatus] = useState('')

  async function handleLogin(event) {
    event.preventDefault()
    setStatus('Signing in...')
    try {
      await adminLogin(username, password)
      const data = await loadAdminData().catch(() => ({ page: seedContent.page, settings: seedContent.settings }))
      setSettings(data.settings)
      setBlocks(data.page.blocks || [])
      setAuthed(true)
      setStatus('')
    } catch {
      setStatus('Authentication failed. If backend is not configured, use seeded content mode.')
    }
  }

  async function handleSave() {
    setStatus('Saving...')
    try {
      await saveAdminData('home', blocks, settings)
      setStatus('Saved.')
    } catch {
      setStatus('Saved locally only (API not configured).')
    }
  }

  async function handleLogout() {
    await adminLogout().catch(() => null)
    setAuthed(false)
  }

  if (!authed) {
    return (
      <main className="admin-auth">
        <form onSubmit={handleLogin}>
          <h2>CMS Admin</h2>
          <input placeholder="Username" value={username} onChange={(event) => setUsername(event.target.value)} />
          <input placeholder="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          <button type="submit">Sign in</button>
          {status && <p>{status}</p>}
        </form>
      </main>
    )
  }

  return (
    <main className="admin-page">
      <header>
        <h2>Portfolio CMS</h2>
        <div>
          <button type="button" className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</button>
          <button type="button" className={lang === 'pt-BR' ? 'active' : ''} onClick={() => setLang('pt-BR')}>PT-BR</button>
          <button type="button" onClick={handleSave}>Save</button>
          <button type="button" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <section className="settings-panel">
        <h3>Site settings</h3>
        <input
          placeholder="Profile image URL"
          value={settings.profileImageUrl || ''}
          onChange={(event) => setSettings({ ...settings, profileImageUrl: event.target.value })}
        />
      </section>

      <BlockEditor blocks={blocks} lang={lang} onChange={setBlocks} />
      {status && <p className="status-line">{status}</p>}
    </main>
  )
}
