import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ImageContextMenu } from './image-context-menu'

const meta: Meta<typeof ImageContextMenu> = {
  title: 'Components/Overlays/ImageContextMenu',
  component: ImageContextMenu,
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => <div style={{ minHeight: 400, padding: 40 }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

const TRIGGER_STYLE = {
  alignSelf: 'flex-start' as const,
  padding: 'var(--ig-space-3) var(--ig-space-6)',
  fontSize: 13,
  borderRadius: 6,
  border: '1px solid var(--ig-color-border-subtle)',
  background: 'var(--ig-color-surface-raised)',
  color: 'var(--ig-color-text-primary)',
  cursor: 'pointer' as const,
}

function ButtonTriggered({ items, label = 'Open menu' }: { items: { key: string; label: string; disabled?: boolean; onClick?: () => void }[]; label?: string }) {
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ig-space-5)' }}>
      <button
        type="button"
        style={TRIGGER_STYLE}
        onClick={(event) => {
          const rect = event.currentTarget.getBoundingClientRect()
          setPos(pos ? null : { top: rect.bottom + 4, left: rect.left })
        }}
      >
        {pos ? 'Close menu' : label}
      </button>
      <ImageContextMenu position={pos} items={items} onClose={() => setPos(null)} />
    </div>
  )
}

export const SingleItem: Story = {
  render: () => <ButtonTriggered items={[{ key: 'add-ref', label: 'Add to Reference Image' }]} />,
}

export const Pending: Story = {
  render: () => <ButtonTriggered items={[{ key: 'add-ref', label: 'Adding…', disabled: true }]} />,
}

export const MultiItem: Story = {
  render: () => (
    <ButtonTriggered items={[
      { key: 'open', label: 'Open in lightbox' },
      { key: 'ref', label: 'Add to Reference Image' },
      { key: 'copy-id', label: 'Copy image ID' },
    ]} />
  ),
}

export const Closed: Story = {
  args: { position: null, items: [], onClose: () => undefined },
}

export const Interactive: Story = {
  render: () => {
    const [pos, setPos] = useState<{ top: number; left: number } | null>(null)
    return (
      <div
        onContextMenu={(e) => { e.preventDefault(); setPos({ top: e.clientY, left: e.clientX }) }}
        style={{ width: '100%', height: 320, background: 'var(--ig-color-surface-raised)', border: '1px dashed var(--ig-color-border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ig-color-text-muted)' }}
      >
        Right-click anywhere
        <ImageContextMenu
          position={pos}
          items={[{ key: 'add-ref', label: 'Add to Reference Image' }]}
          onClose={() => setPos(null)}
        />
      </div>
    )
  },
}
