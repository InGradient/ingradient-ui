import React from 'react'

/** Inline SVG icons for the labeling demo toolbar. */

export function CursorIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 4l6 16 2-7 7-2-15-7z" />
    </svg>
  )
}
export function BboxIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="4" y="4" width="16" height="16" rx="1.4" strokeDasharray="3 2" />
    </svg>
  )
}
export function PointIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <circle cx="12" cy="12" r="4" />
    </svg>
  )
}
export function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 6h18" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
    </svg>
  )
}
export function ZoomInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}
export function ZoomOutIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

export const sampleClasses = [
  { id: 'dent', label: 'Dent', color: '#ff7f66' },
  { id: 'scratch', label: 'Scratch', color: '#6fb6ff' },
  { id: 'glare', label: 'Glare', color: '#7ce0be' },
]

export function ClassChip({ klass, active, onClick }: { klass: typeof sampleClasses[number]; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={{
        padding: '6px 12px',
        borderRadius: 6,
        border: `2px solid ${active ? klass.color : 'var(--ig-color-border-subtle)'}`,
        background: active ? 'var(--ig-color-accent-soft-surface)' : 'transparent',
        color: active ? 'var(--ig-color-text-primary)' : 'var(--ig-color-text-secondary)',
        fontSize: 12,
        fontWeight: 600,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}
    >
      <span style={{ width: 10, height: 10, borderRadius: 999, background: klass.color }} />
      {klass.label}
    </button>
  )
}
