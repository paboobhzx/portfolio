import { useState } from 'react'

function parseItems(value) {
  return value.split('\n').map((item) => item.trim()).filter(Boolean)
}

function projectText(items) {
  return (items || []).map((item) => {
    return `${item.name}\n${item.summary}\n${item.resources}\n${item.usage}`
  }).join('\n\n---\n\n')
}

function parseProjects(value) {
  const chunks = value.split('\n\n---\n\n').map((part) => part.trim()).filter(Boolean)
  return chunks.map((chunk) => {
    const lines = chunk.split('\n')
    return {
      name: lines[0] || '',
      summary: lines[1] || '',
      resources: lines[2] || '',
      usage: lines.slice(3).join(' ') || '',
    }
  })
}

export default function BlockEditor({ blocks, lang, onChange }) {
  const [selected, setSelected] = useState(0)
  const block = blocks[selected]
  const data = block?.content?.[lang] || {}

  function updateField(name, value) {
    const next = blocks.map((entry, index) => {
      if (index !== selected) {
        return entry
      }
      return {
        ...entry,
        content: {
          ...entry.content,
          [lang]: {
            ...entry.content?.[lang],
            [name]: value,
          },
        },
      }
    })
    onChange(next)
  }

  return (
    <div className="editor-grid">
      <aside>
        <h3>Blocks</h3>
        <ul className="editor-list">
          {blocks.map((entry, index) => (
            <li key={`${entry.type}-${index}`}>
              <button type="button" className={index === selected ? 'active' : ''} onClick={() => setSelected(index)}>{entry.type}</button>
            </li>
          ))}
        </ul>
      </aside>

      <section>
        <h3>{block?.type} ({lang})</h3>
        {block?.type === 'headline' && (
          <textarea value={data.title || ''} onChange={(event) => updateField('title', event.target.value)} />
        )}
        {block?.type === 'about' && (
          <>
            <input value={data.title || ''} onChange={(event) => updateField('title', event.target.value)} />
            <textarea value={data.text || ''} onChange={(event) => updateField('text', event.target.value)} />
          </>
        )}
        {(block?.type === 'experience' || block?.type === 'certifications') && (
          <>
            <input value={data.title || ''} onChange={(event) => updateField('title', event.target.value)} />
            <textarea value={(data.items || []).join('\n')} onChange={(event) => updateField('items', parseItems(event.target.value))} />
          </>
        )}
        {block?.type === 'projects' && (
          <>
            <input value={data.title || ''} onChange={(event) => updateField('title', event.target.value)} />
            <textarea value={projectText(data.items)} onChange={(event) => updateField('items', parseProjects(event.target.value))} />
          </>
        )}
        {block?.type === 'contact' && (
          <>
            <input value={data.title || ''} onChange={(event) => updateField('title', event.target.value)} />
            <textarea value={data.cta || ''} onChange={(event) => updateField('cta', event.target.value)} />
          </>
        )}
      </section>
    </div>
  )
}
