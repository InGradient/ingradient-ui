import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ConfirmDialog, DialogShell } from './dialog-shell'

describe('DialogShell', () => {
  it('renders title + body + actions', () => {
    render(
      <DialogShell title="Hello" actions={<button>OK</button>} onClose={() => {}}>
        <p>Body text</p>
      </DialogShell>,
    )
    expect(screen.getByText('Hello')).toBeInTheDocument()
    expect(screen.getByText('Body text')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument()
  })

  it('has role="dialog" + aria-modal="true"', () => {
    render(<DialogShell title="T" onClose={() => {}}>x</DialogShell>)
    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    expect(dialog).toHaveAttribute('aria-modal', 'true')
  })

  it('calls onClose when Escape key pressed', () => {
    const onClose = vi.fn()
    render(<DialogShell title="T" onClose={onClose}>x</DialogShell>)
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('does NOT call onClose if onClose prop is undefined', () => {
    // Component renders without close button — Escape shouldn't throw
    render(<DialogShell title="T">x</DialogShell>)
    expect(() => fireEvent.keyDown(window, { key: 'Escape' })).not.toThrow()
    // No close button rendered
    expect(screen.queryByLabelText(/close/i)).not.toBeInTheDocument()
  })

  it('shows close button when onClose provided', () => {
    render(<DialogShell title="T" onClose={() => {}}>x</DialogShell>)
    expect(screen.getByLabelText(/close/i)).toBeInTheDocument()
  })

  it('calls onClose when close button clicked', () => {
    const onClose = vi.fn()
    render(<DialogShell title="T" onClose={onClose}>x</DialogShell>)
    fireEvent.click(screen.getByLabelText(/close/i))
    expect(onClose).toHaveBeenCalledOnce()
  })
})

describe('ConfirmDialog', () => {
  it('renders confirm + cancel buttons', () => {
    render(
      <ConfirmDialog
        title="Delete item"
        description="This cannot be undone"
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    )
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    expect(screen.getByText('This cannot be undone')).toBeInTheDocument()
  })

  it('calls onConfirm when Confirm clicked', () => {
    const onConfirm = vi.fn()
    render(
      <ConfirmDialog
        title="T" description="d"
        onConfirm={onConfirm}
        onCancel={() => {}}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
    expect(onConfirm).toHaveBeenCalledOnce()
  })

  it('calls onCancel when Cancel clicked', () => {
    const onCancel = vi.fn()
    render(
      <ConfirmDialog
        title="T" description="d"
        onConfirm={() => {}}
        onCancel={onCancel}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onCancel).toHaveBeenCalledOnce()
  })

  it('honors custom confirm/cancel labels', () => {
    render(
      <ConfirmDialog
        title="T" description="d"
        confirmLabel="Delete"
        cancelLabel="Keep"
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    )
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Keep' })).toBeInTheDocument()
  })
})
