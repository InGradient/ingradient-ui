import { useRef, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ContextMenuWithSubmenus, type ContextMenuWithSubmenusAction } from './context-menu-with-submenus'

const meta: Meta<typeof ContextMenuWithSubmenus> = {
  title: 'Components/Overlays/ContextMenuWithSubmenus',
  component: ContextMenuWithSubmenus,
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof meta>

const FLAT_ACTIONS: ContextMenuWithSubmenusAction[] = [
  { key: 'rename', label: 'Rename' },
  { key: 'dup', label: 'Duplicate' },
  { key: 'export', label: 'Export' },
  { key: 'sep', label: '', separator: true },
  { key: 'delete', label: 'Delete', tone: 'danger' },
]

const NESTED_ACTIONS: ContextMenuWithSubmenusAction[] = [
  { key: 'open', label: 'Open in labeling' },
  { key: 'sep', label: '', separator: true },
  {
    key: 'copy-to',
    label: 'Copy to…',
    subActions: [
      { key: 'copy-1', label: 'Wafer line A' },
      { key: 'copy-2', label: 'Surface defects' },
    ],
  },
  {
    key: 'move-to',
    label: 'Move to…',
    subActions: [
      { key: 'move-1', label: 'Wafer line A' },
      { key: 'move-2', label: 'Surface defects' },
    ],
  },
  { key: 'archive', label: 'Archive' },
  { key: 'sep-2', label: '', separator: true },
  { key: 'delete', label: 'Delete', tone: 'danger' },
]

function MenuDemo({ actions }: { actions: ContextMenuWithSubmenusAction[] }) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  return (
    <div style={{ padding: 24, minHeight: 360, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setAnchorEl(anchorEl ? null : btnRef.current)}
        style={{
          alignSelf: 'flex-start',
          padding: '8px 14px',
          fontSize: 13,
          borderRadius: 6,
          border: '1px solid var(--ig-color-border-subtle)',
          background: 'var(--ig-color-surface-raised)',
          color: 'var(--ig-color-text-primary)',
          cursor: 'pointer',
        }}
      >
        {anchorEl ? 'Close menu' : 'Open menu'}
      </button>
      <ContextMenuWithSubmenus
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        actions={actions}
      />
    </div>
  )
}

export const Flat: Story = {
  render: () => <MenuDemo actions={FLAT_ACTIONS} />,
}

export const WithSubmenus: Story = {
  render: () => <MenuDemo actions={NESTED_ACTIONS} />,
}
