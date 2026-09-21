import { describe, it, expect, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { createPortal } from 'react-dom'
import { TwoColumnDialog } from './two-column-dialog'
import { DialogShell } from './dialog-shell'

describe('TwoColumnDialog focus', () => {
  it('cycles both boundaries including initial shell focus, and restores its trigger', () => {
    const rects = vi.spyOn(HTMLElement.prototype, 'getClientRects').mockReturnValue(Object.assign([new DOMRect()], { item: () => new DOMRect() }))
    const trigger = document.createElement('button')
    document.body.append(trigger)
    trigger.focus()
    const { unmount } = render(<TwoColumnDialog title="Settings" onClose={() => {}}><button>Last</button></TwoColumnDialog>)
    const dialog = screen.getByRole('dialog')
    expect(screen.getByRole('heading', { name: 'Settings', level: 2 })).toBeInTheDocument()
    const first = screen.getByRole('button', { name: /close/i })
    const last = screen.getByRole('button', { name: 'Last' })
    expect(dialog).toHaveFocus()
    fireEvent.keyDown(dialog, { key: 'Tab', shiftKey: true })
    expect(last).toHaveFocus()
    fireEvent.keyDown(last, { key: 'Tab' })
    expect(first).toHaveFocus()
    fireEvent.keyDown(first, { key: 'Tab', shiftKey: true })
    expect(last).toHaveFocus()
    unmount()
    expect(trigger).toHaveFocus()
    trigger.remove()
    rects.mockRestore()
  })
  it('closes only the nested modal on Escape', () => {
    const outer = vi.fn()
    const inner = vi.fn()
    render(<TwoColumnDialog title="Settings" onClose={outer}><DialogShell title="Confirm" onClose={inner}>Confirmation</DialogShell></TwoColumnDialog>)
    fireEvent.keyDown(screen.getByRole('dialog', { name: 'Confirm' }), { key: 'Escape' })
    expect(inner).toHaveBeenCalledOnce()
    expect(outer).not.toHaveBeenCalled()
  })
  it('does not steal portal dropdown keys', () => {
    const close = vi.fn()
    render(<TwoColumnDialog title="Settings" onClose={close}>{createPortal(<button>Portal option</button>, document.body)}</TwoColumnDialog>)
    const option = screen.getByRole('button', { name: 'Portal option' })
    option.focus()
    fireEvent.keyDown(option, { key: 'Tab' })
    fireEvent.keyDown(option, { key: 'Escape' })
    expect(option).toHaveFocus()
    expect(close).not.toHaveBeenCalled()
  })
  it('closes itself once on Escape', () => {
    const close = vi.fn()
    render(<TwoColumnDialog title="Settings" onClose={close}>Content</TwoColumnDialog>)
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })
    expect(close).toHaveBeenCalledOnce()
  })
})
