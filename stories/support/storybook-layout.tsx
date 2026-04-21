import React from 'react'

export function StorybookPage({
  title,
  description,
  meta,
  children,
}: {
  title: string
  description?: string
  meta?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <header style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--ig-color-text-soft)',
          }}
        >
          Ingradient UI
        </div>
        <h1 style={{ margin: 0, fontSize: 32, lineHeight: 1.1 }}>{title}</h1>
        {description ? (
          <p
            style={{
              margin: 0,
              maxWidth: 760,
              fontSize: 15,
              lineHeight: 1.7,
              color: 'var(--ig-color-text-muted)',
            }}
          >
            {description}
          </p>
        ) : null}
        {meta}
      </header>
      {children}
    </div>
  )
}

export function StorybookSection({
  title,
  description,
  meta,
  children,
}: {
  title: string
  description?: string
  meta?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        padding: 20,
        border: '1px solid var(--ig-color-border-subtle)',
        borderRadius: 'var(--ig-radius-xl)',
        background: 'var(--ig-color-surface-panel)',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <h2 style={{ margin: 0, fontSize: 18 }}>{title}</h2>
        {description ? (
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: 'var(--ig-color-text-muted)' }}>
            {description}
          </p>
        ) : null}
        {meta}
      </div>
      {children}
    </section>
  )
}

export function StorybookGrid({
  columns = 'repeat(auto-fit, minmax(220px, 1fr))',
  children,
}: {
  columns?: string
  children: React.ReactNode
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: columns, gap: 16 }}>
      {children}
    </div>
  )
}

export function StorybookCard({
  title,
  subtitle,
  meta,
  children,
}: {
  title: string
  subtitle?: string
  meta?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        padding: 16,
        border: '1px solid var(--ig-color-border-subtle)',
        borderRadius: 'var(--ig-radius-lg)',
        background: 'var(--ig-color-surface-raised)',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <strong style={{ fontSize: 14 }}>{title}</strong>
        {subtitle ? (
          <span style={{ fontSize: 12, color: 'var(--ig-color-text-soft)' }}>{subtitle}</span>
        ) : null}
        {meta}
      </div>
      {children}
    </div>
  )
}

export function StorybookStack({
  gap = 16,
  children,
}: {
  gap?: number
  children: React.ReactNode
}) {
  return <div style={{ display: 'flex', flexDirection: 'column', gap }}>{children}</div>
}

export function StorybookMetaBar({
  items,
}: {
  items: Array<{ label: string; tone?: 'neutral' | 'success' | 'warning' | 'accent' | 'danger' }>
}) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {items.map((item) => (
        <StorybookMetaPill key={`${item.label}-${item.tone ?? 'neutral'}`} label={item.label} tone={item.tone} />
      ))}
    </div>
  )
}

export function StorybookMetaPill({
  label,
  tone = 'neutral',
}: {
  label: string
  tone?: 'neutral' | 'success' | 'warning' | 'accent' | 'danger'
}) {
  const palette = {
    neutral: {
      background: 'rgba(255, 255, 255, 0.06)',
      border: 'rgba(255, 255, 255, 0.14)',
      color: 'var(--ig-color-text-soft)',
    },
    success: {
      background: 'rgba(61, 181, 126, 0.14)',
      border: 'rgba(61, 181, 126, 0.3)',
      color: '#9ce0bb',
    },
    warning: {
      background: 'rgba(240, 184, 64, 0.14)',
      border: 'rgba(240, 184, 64, 0.3)',
      color: '#f6d58f',
    },
    accent: {
      background: 'rgba(93, 160, 255, 0.14)',
      border: 'rgba(93, 160, 255, 0.32)',
      color: '#b7d3ff',
    },
    danger: {
      background: 'rgba(255, 127, 102, 0.14)',
      border: 'rgba(255, 127, 102, 0.3)',
      color: '#ffb6a8',
    },
  } as const

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        minHeight: 24,
        padding: '0 10px',
        borderRadius: 999,
        border: `1px solid ${palette[tone].border}`,
        background: palette[tone].background,
        color: palette[tone].color,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.02em',
        textTransform: 'uppercase',
      }}
    >
      {label}
    </span>
  )
}
