import type React from 'react'

export const pageStyle: React.CSSProperties = {
  padding: 'var(--ig-space-7)',
  background: 'var(--ig-color-bg-canvas)',
  minHeight: '100vh',
}

export const sectionTitle: React.CSSProperties = {
  fontSize: 'var(--ig-font-size-lg)',
  fontWeight: 600,
  color: 'var(--ig-color-text-secondary)',
  margin: 0,
}

export const cardBody: React.CSSProperties = {
  padding: 'var(--ig-space-5)',
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--ig-space-3)',
}

export const codeStyle: React.CSSProperties = {
  padding: 'var(--ig-space-4)',
  background: 'var(--ig-color-surface-muted)',
  border: '1px solid var(--ig-color-border-subtle)',
  borderRadius: 'var(--ig-radius-md)',
  fontFamily: 'var(--ig-font-mono)',
  fontSize: 'var(--ig-font-size-xs)',
  color: 'var(--ig-color-text-secondary)',
  whiteSpace: 'pre',
  overflow: 'auto',
}

export const overrideKeyStyle: React.CSSProperties = {
  fontFamily: 'var(--ig-font-mono)',
  fontSize: 'var(--ig-font-size-xs)',
  color: 'var(--ig-color-text-muted)',
}
