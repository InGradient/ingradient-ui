import { useRef, useState } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContextMenuWithSubmenus } from './context-menu-with-submenus'
import { TwoColumnDialog } from './two-column-dialog'

function Demo({ onAction = () => {}, onEscape = () => {} }: { onAction?: () => void; onEscape?: () => void }) {
  const trigger = useRef<HTMLButtonElement>(null)
  const destination = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  const [dialog, setDialog] = useState(false)
  return <div onKeyDown={(event) => { if (event.key === 'Escape') onEscape() }}>
    <button ref={trigger} aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(true)}>Actions</button>
    <button ref={destination}>Destination</button>
    {open && <ContextMenuWithSubmenus anchorEl={trigger.current} onClose={() => setOpen(false)} actions={[
      { key: 'disabled', label: 'Disabled', disabled: true, onClick: onAction },
      { key: 'select', label: 'Select', onClick: onAction },
      { key: 'nested', label: 'Submenu', subActions: [
        { key: 'unavailable', label: 'Unavailable', disabled: true },
        { key: 'first', label: 'First child', onClick: onAction },
        { key: 'separator', label: '', separator: true },
        { key: 'last', label: 'Last child', onClick: onAction },
      ] },
      { key: 'dialog', label: 'Open dialog', onClick: () => setDialog(true) },
      { key: 'focus', label: 'Move focus', onClick: () => destination.current?.focus() },
    ]} />}
    {dialog && <TwoColumnDialog title="Action dialog" onClose={() => setDialog(false)}><button>Dialog action</button></TwoColumnDialog>}
  </div>
}

async function openMenu() {
  fireEvent.click(screen.getByRole('button', { name: 'Actions' }))
  await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Select' })).toHaveFocus())
}

describe('ContextMenuWithSubmenus focus ownership', () => {
  it('keeps Escape available even when every action is disabled', async () => {
    const close = vi.fn()
    const { rerender } = render(<button>Trigger</button>)
    const anchor = screen.getByRole('button', { name: 'Trigger' })
    rerender(<><button>Trigger</button><ContextMenuWithSubmenus anchorEl={anchor} onClose={close} actions={[{ key: 'none', label: 'Unavailable', disabled: true }]} /></>)
    await waitFor(() => expect(screen.getByRole('menu')).toHaveFocus())
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' })
    expect(close).toHaveBeenCalledOnce()
    expect(anchor).toHaveFocus()
  })
  it.each(['escape', 'outside', 'select'] as const)('restores the trigger on %s dismissal', async (reason) => {
    const action = vi.fn()
    const escape = vi.fn()
    render(<Demo onAction={action} onEscape={escape} />)
    await openMenu()
    const item = screen.getByRole('menuitem', { name: 'Select' })
    if (reason === 'escape') fireEvent.keyDown(item, { key: 'Escape' })
    if (reason === 'outside') fireEvent.click(screen.getByRole('menu').previousElementSibling!)
    if (reason === 'select') fireEvent.click(item)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Actions' })).toHaveFocus()
    expect(action).toHaveBeenCalledTimes(reason === 'select' ? 1 : 0)
    expect(escape).not.toHaveBeenCalled()
  })
  it('restores the trigger before an action opens a dialog and never steals dialog focus', async () => {
    render(<Demo />)
    await openMenu()
    fireEvent.click(screen.getByRole('menuitem', { name: 'Open dialog' }))
    await waitFor(() => expect(screen.getByRole('dialog', { name: 'Action dialog' })).toHaveFocus())
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Actions' })).toHaveFocus()
  })
  it('does not override an action-owned focus destination', async () => {
    render(<Demo />)
    await openMenu()
    fireEvent.click(screen.getByRole('menuitem', { name: 'Move focus' }))
    await waitFor(() => expect(screen.getByRole('button', { name: 'Destination' })).toHaveFocus())
  })
  it('navigates enabled submenu items and consumes Escape one level at a time', async () => {
    const escape = vi.fn()
    render(<Demo onEscape={escape} />)
    await openMenu()
    fireEvent.keyDown(screen.getByRole('menuitem', { name: 'Select' }), { key: 'ArrowDown' })
    const parent = screen.getByRole('menuitem', { name: 'Submenu' })
    expect(parent).toHaveFocus()
    fireEvent.keyDown(parent, { key: 'ArrowRight' })
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'First child' })).toHaveFocus())
    fireEvent.keyDown(screen.getByRole('menuitem', { name: 'First child' }), { key: 'End' })
    expect(screen.getByRole('menuitem', { name: 'Last child' })).toHaveFocus()
    fireEvent.keyDown(screen.getByRole('menuitem', { name: 'Last child' }), { key: 'ArrowDown' })
    expect(screen.getByRole('menuitem', { name: 'First child' })).toHaveFocus()
    fireEvent.keyDown(screen.getByRole('menuitem', { name: 'First child' }), { key: 'Escape' })
    expect(parent).toHaveFocus()
    expect(parent).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getAllByRole('menu')).toHaveLength(1)
    fireEvent.keyDown(parent, { key: 'Escape' })
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Actions' })).toHaveFocus()
    expect(escape).not.toHaveBeenCalled()
  })
  it('opens submenus by click, closes with ArrowLeft and restores after child selection', async () => {
    const action = vi.fn()
    render(<Demo onAction={action} />)
    await openMenu()
    const parent = screen.getByRole('menuitem', { name: 'Submenu' })
    fireEvent.click(parent)
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'First child' })).toHaveFocus())
    fireEvent.keyDown(screen.getByRole('menuitem', { name: 'First child' }), { key: 'ArrowLeft' })
    expect(parent).toHaveFocus()
    fireEvent.keyDown(parent, { key: 'Enter' })
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'First child' })).toHaveFocus())
    fireEvent.keyDown(screen.getByRole('menuitem', { name: 'First child' }), { key: 'Enter' })
    expect(action).toHaveBeenCalledOnce()
    expect(screen.getByRole('button', { name: 'Actions' })).toHaveFocus()
  })
  it('lets real Tab continue to the next control after dismissal', async () => {
    render(<Demo />)
    await openMenu()
    await userEvent.setup().tab()
    expect(screen.getByRole('button', { name: 'Destination' })).toHaveFocus()
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })
  it('consumes Tab before an enclosing dialog can handle the stale popup target', async () => {
    render(<Demo />)
    await openMenu()
    const allowed = fireEvent.keyDown(screen.getByRole('menuitem', { name: 'Select' }), { key: 'Tab' })
    expect(allowed).toBe(false)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Destination' })).toHaveFocus()
  })
})
