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

export const SingleItem: Story = {
  args: {
    position: { top: 120, left: 200 },
    items: [{ key: 'add-ref', label: 'Add to Reference Image' }],
    onClose: () => undefined,
  },
}

export const Pending: Story = {
  args: {
    position: { top: 120, left: 200 },
    items: [{ key: 'add-ref', label: 'Adding…', disabled: true }],
    onClose: () => undefined,
  },
}

export const MultiItem: Story = {
  args: {
    position: { top: 120, left: 200 },
    items: [
      { key: 'open', label: 'Open in lightbox' },
      { key: 'ref', label: 'Add to Reference Image' },
      { key: 'copy-id', label: 'Copy image ID' },
    ],
    onClose: () => undefined,
  },
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
