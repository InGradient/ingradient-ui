import React from 'react'
import { MediaDialogShell } from '../../src/patterns'
import sampleImage1 from '../assets/20230808.jpg'
import sampleImage2 from '../assets/20230816.jpg'
import sampleImage3 from '../assets/20230823.jpg'
import sampleImage4 from '../assets/20230830.jpg'
import sampleImage5 from '../assets/20230906.jpg'

export const sampleImages = [sampleImage1, sampleImage2, sampleImage3, sampleImage4, sampleImage5]

export function MockToolbar({ label }: { label: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 12px',
        background: 'var(--ig-color-surface-header)',
        borderBottom: '1px solid var(--ig-color-border-subtle)',
        flexShrink: 0,
      }}
    >
      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ig-color-text-primary)' }}>{label}</span>
    </div>
  )
}

export function MockCanvas({ src, alt = 'Sample image' }: { src: string; alt?: string }) {
  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--ig-color-bg-canvas)',
        overflow: 'hidden',
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' }}
      />
    </div>
  )
}

export function MockSidebar({ title, items }: { title: string; items: string[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--ig-color-border-subtle)', fontSize: 13, fontWeight: 600 }}>
        {title}
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '8px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {items.map((it) => (
          <div key={it} style={{ padding: 8, borderRadius: 6, background: 'var(--ig-color-white-04)', fontSize: 12, color: 'var(--ig-color-text-secondary)' }}>
            {it}
          </div>
        ))}
      </div>
    </div>
  )
}

export function ResizableDemo() {
  const [width, setWidth] = React.useState(320)
  const startResize = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    const startX = event.clientX
    const startWidth = width
    const onMove = (e: MouseEvent) => {
      const next = Math.max(220, Math.min(560, startWidth - (e.clientX - startX)))
      setWidth(next)
    }
    const onUp = () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }
  return (
    <MediaDialogShell
      main={<><MockToolbar label="Resizable demo · width 220~560" /><MockCanvas src={sampleImages[0]} /></>}
      sidebar={<MockSidebar title="Sidebar (drag the divider)" items={['Item A', 'Item B', 'Item C']} />}
      sidebarWidth={width}
      onSidebarResize={startResize}
      ariaLabel="Resizable demo dialog"
      positioning="absolute"
    />
  )
}
