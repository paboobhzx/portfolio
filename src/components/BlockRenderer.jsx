function textFor(block, lang) {
  return block.content?.[lang] || block.content?.en || {}
}

function renderSimpleList(items) {
  return (
    <ul>
      {items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  )
}

function renderProjectList(items, lang) {
  const labelResources = lang === 'pt-BR' ? 'Recursos usados' : 'Resources used'
  const labelUsage = lang === 'pt-BR' ? 'Como foram usados' : 'How they were used'

  return (
    <div className="project-list">
      {items.map((item) => (
        <article key={item.name} className="project-item">
          <h4>{item.name}</h4>
          <p>{item.summary}</p>
          <p><strong>{labelResources}:</strong> {item.resources}</p>
          <p><strong>{labelUsage}:</strong> {item.usage}</p>
        </article>
      ))}
    </div>
  )
}

export default function BlockRenderer({ block, lang }) {
  const data = textFor(block, lang)

  if (block.type === 'headline') {
    return <section className="section section-hero"><h2>{data.title}</h2></section>
  }

  if (block.type === 'about') {
    return (
      <section className="section">
        <h3>{data.title}</h3>
        <p>{data.text}</p>
      </section>
    )
  }

  if (block.type === 'experience' || block.type === 'certifications') {
    return (
      <section className="section">
        <h3>{data.title}</h3>
        {renderSimpleList(data.items || [])}
      </section>
    )
  }

  if (block.type === 'projects') {
    return (
      <section className="section">
        <h3>{data.title}</h3>
        {renderProjectList(data.items || [], lang)}
      </section>
    )
  }

  if (block.type === 'contact') {
    return (
      <section className="section">
        <h3>{data.title}</h3>
        <p>{data.cta}</p>
      </section>
    )
  }

  return null
}
