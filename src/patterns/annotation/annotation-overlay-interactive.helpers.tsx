import React from 'react'

export { coverCropRegion } from '../../utils/cover-crop'

export const IMAGE_WIDTH = 640
export const IMAGE_HEIGHT = 360
export const MIN_BBOX_SIZE = 0.005

export const classOptions: Array<{ id: string; label: string; color: string }> = [
  { id: 'dent', label: 'Dent', color: '#ff7f66' },
  { id: 'scratch', label: 'Scratch', color: '#6fb6ff' },
  { id: 'glare', label: 'Glare', color: '#7ce0be' },
]

export const classColorMap: Record<string, string> = Object.fromEntries(
  classOptions.map((c) => [c.id, c.color]),
)

export function svgThumb(label: string, a: string, b: string) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${IMAGE_WIDTH} ${IMAGE_HEIGHT}"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="${a}" /><stop offset="100%" stop-color="${b}" /></linearGradient></defs><rect width="${IMAGE_WIDTH}" height="${IMAGE_HEIGHT}" fill="url(#g)" /><text x="20" y="320" font-family="sans-serif" font-size="22" fill="white">${label}</text></svg>`)}`
}

export function ToolGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ color: 'var(--ig-color-text-soft)', fontSize: 12 }}>{label}:</span>
      <div style={{ display: 'flex', gap: 4 }}>{children}</div>
    </div>
  )
}

export function ToolButton({
  children, active, onClick, accentColor,
}: {
  children: React.ReactNode
  active?: boolean
  onClick: () => void
  accentColor?: string
}) {
  // Active 상태: 컬러 border + soft surface 배경 + 본문 텍스트 (text-primary).
  // 솔리드 accent 배경 위 text-primary 는 contrast 부족 (a11y 4.5:1 fail).
  const borderColor = active ? accentColor ?? 'var(--ig-color-accent)' : 'var(--ig-color-border-subtle)'
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '6px 12px',
        borderRadius: 6,
        border: `2px solid ${borderColor}`,
        background: active ? 'var(--ig-color-accent-soft-surface)' : 'transparent',
        color: active ? 'var(--ig-color-text-primary)' : 'var(--ig-color-text-secondary)',
        fontSize: 12,
        fontWeight: 600,
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  )
}
