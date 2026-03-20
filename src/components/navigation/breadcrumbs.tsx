import React from 'react'

export function Breadcrumbs({
  items,
}: {
  items: Array<{ label: string; href?: string }>
}) {
  return (
    <nav aria-label="Breadcrumb">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ig-color-text-muted)', fontSize: 13 }}>
        {items.map((item, index) => (
          <React.Fragment key={`${item.label}-${index}`}>
            {index > 0 ? <span>/</span> : null}
            {item.href ? <a href={item.href} style={{ textDecoration: 'none' }}>{item.label}</a> : <span style={{ color: 'var(--ig-color-text-primary)' }}>{item.label}</span>}
          </React.Fragment>
        ))}
      </div>
    </nav>
  )
}
