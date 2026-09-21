import { useRef, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, waitFor, within } from 'storybook/test'
import { TwoColumnDialog } from './two-column-dialog'
import { ContextMenuWithSubmenus, type ContextMenuWithSubmenusAction } from './context-menu-with-submenus'

const meta: Meta<typeof ContextMenuWithSubmenus> = {
  title: 'Components/Overlays/ContextMenuWithSubmenus',
  component: ContextMenuWithSubmenus,
  parameters: { layout: 'fullscreen', a11y: { test: 'error' }, docs: { description: { component: 'Escape, backdrop dismissal and selection restore the anchor before closing. An action that opens a dialog owns subsequent focus. Escape in a submenu returns to its parent; Tab dismisses without trapping focus.' } } },
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
  const [selected, setSelected] = useState('No action')
  const bindAction = (action: ContextMenuWithSubmenusAction): ContextMenuWithSubmenusAction => ({
    ...action, onClick: () => { action.onClick?.(); setSelected(action.label) }, subActions: action.subActions?.map(bindAction),
  })
  return (
    <div style={{ padding: 'var(--ig-space-9)', minHeight: 'var(--ig-popup-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--ig-space-7)' }}>
      <button
        ref={btnRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={!!anchorEl}
        onClick={() => setAnchorEl(anchorEl ? null : btnRef.current)}
        style={{
          alignSelf: 'flex-start',
          padding: 'var(--ig-space-3) var(--ig-space-6)',
          fontSize: 'var(--ig-font-size-sm)',
          borderRadius: 'var(--ig-radius-xs)',
          border: 'var(--ig-border-1px) solid var(--ig-color-border-subtle)',
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
        actions={actions.map(bindAction)}
      />
      <output>{selected}</output>
      <button type="button">Next control</button>
    </div>
  )
}

export const Flat: Story = {
  render: () => <MenuDemo actions={FLAT_ACTIONS} />,
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Open menu' })
    await userEvent.click(trigger)
    await waitFor(() => expect(canvas.getByRole('menuitem', { name: 'Rename' })).toHaveFocus())
    await userEvent.keyboard('{Escape}')
    await expect(trigger).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await userEvent.click(canvas.getByRole('menuitem', { name: 'Export' }))
    await expect(canvas.getByRole('status')).toHaveTextContent('Export')
    await expect(trigger).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await waitFor(() => expect(canvas.getByRole('menuitem', { name: 'Rename' })).toHaveFocus())
    await userEvent.tab()
    await expect(canvas.queryByRole('menu')).not.toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Next control' })).toHaveFocus()
  },
}

export const WithSubmenus: Story = {
  render: () => <MenuDemo actions={NESTED_ACTIONS} />,
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Open menu' })
    await userEvent.click(trigger)
    await waitFor(() => expect(canvas.getByRole('menuitem', { name: 'Open in labeling' })).toHaveFocus())
    await userEvent.keyboard('{ArrowDown}{ArrowRight}')
    await waitFor(() => expect(canvas.getByRole('menuitem', { name: 'Wafer line A' })).toHaveFocus())
    await userEvent.keyboard('{Escape}')
    await expect(canvas.getByRole('menuitem', { name: 'Copy to…' })).toHaveFocus()
    await expect(canvas.getAllByRole('menu')).toHaveLength(1)
    await userEvent.keyboard('{ArrowRight}')
    await waitFor(() => expect(canvas.getByRole('menuitem', { name: 'Wafer line A' })).toHaveFocus())
    await userEvent.keyboard('{End}{Enter}')
    await expect(canvas.getByRole('status')).toHaveTextContent('Surface defects')
    await expect(trigger).toHaveFocus()
  },
}

export const DialogFocusHandoff: Story = {
  render: () => {
    const trigger = useRef<HTMLButtonElement>(null)
    const [open, setOpen] = useState(false)
    const [dialog, setDialog] = useState(false)
    return <>
      <button type="button" ref={trigger} aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(true)}>Actions</button>
      {open && <ContextMenuWithSubmenus anchorEl={trigger.current} onClose={() => setOpen(false)} actions={[
        { key: 'dialog', label: 'Open dialog', onClick: () => setDialog(true) },
      ]} />}
      {dialog && <TwoColumnDialog title="Action dialog" onClose={() => setDialog(false)}><button type="button">Dialog action</button></TwoColumnDialog>}
    </>
  },
  play: async ({ canvas, canvasElement, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Actions' })
    await userEvent.click(trigger)
    await waitFor(() => expect(canvas.getByRole('menuitem', { name: 'Open dialog' })).toHaveFocus())
    await userEvent.keyboard('{Enter}')
    const dialog = await within(canvasElement.ownerDocument.body).findByRole('dialog', { name: 'Action dialog' })
    await waitFor(() => expect(dialog).toHaveFocus())
    await userEvent.keyboard('{Escape}')
    await expect(dialog).not.toBeInTheDocument()
    await expect(trigger).toHaveFocus()
  },
}
