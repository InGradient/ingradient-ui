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
  const btnRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(true)
  return (
    <div style={{ padding: 24 }}>
      <button ref={btnRef} type="button" onClick={() => setOpen((v) => !v)}>
        Toggle menu
      </button>
      {open ? (
        <ContextMenuWithSubmenus
          anchorEl={btnRef.current}
          onClose={() => setOpen(false)}
          actions={actions}
        />
      ) : null}
    </div>
  )
}

export const Flat: Story = {
  render: () => <MenuDemo actions={FLAT_ACTIONS} />,
}

export const WithSubmenus: Story = {
  render: () => <MenuDemo actions={NESTED_ACTIONS} />,
}
