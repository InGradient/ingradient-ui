import { act, fireEvent, render, renderHook, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ClassHoverCard, useClassHoverCard } from './class-hover-card'
import { ImageDetailConfirmDialogs } from './image-detail-confirm-dialogs'
import { ImageDetailContextMenu, type ImageDetailContextMenuProps } from './image-detail-context-menu'

const noop = () => undefined
const CLASSES = [
  { id: 'c1', name: 'Scratch', color: 'red', description: 'A thin line.' },
  { id: 'c2', name: 'Dent', color: 'blue' },
]
const menuProps = (overrides: Partial<ImageDetailContextMenuProps> = {}): ImageDetailContextMenuProps => ({
  position: { x: 10, y: 20 }, onClose: noop, classes: CLASSES, onAssignClass: noop, ...overrides,
})

describe('ImageDetailContextMenu', () => {
  afterEach(() => vi.useRealTimers())

  it('stays closed without a position and shows Delete and Archive only when given handlers', () => {
    const { rerender } = render(<ImageDetailContextMenu {...menuProps({ position: null })} />)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    rerender(<ImageDetailContextMenu {...menuProps()} />)
    expect(screen.queryByRole('menuitem', { name: 'Delete' })).not.toBeInTheDocument()
    expect(screen.queryByRole('menuitem', { name: 'Archive image' })).not.toBeInTheDocument()
    const onDelete = vi.fn()
    rerender(<ImageDetailContextMenu {...menuProps({ onDelete, onToggleArchive: noop, archived: true })} />)
    expect(screen.getByRole('menuitem', { name: 'Unarchive image' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('menuitem', { name: 'Delete' }))
    expect(onDelete).toHaveBeenCalledTimes(1)
  })

  it('opens the class list on hover, keeps it open across the gap, and closes it after the delay', () => {
    vi.useFakeTimers()
    render(<ImageDetailContextMenu {...menuProps()} />)
    const classRow = screen.getByRole('menuitem', { name: 'Class' })
    fireEvent.mouseEnter(classRow)
    expect(screen.getByRole('menuitem', { name: 'Dent' })).toBeInTheDocument()
    fireEvent.mouseLeave(classRow)
    fireEvent.mouseEnter(screen.getByRole('menu', { name: 'Class' }))
    act(() => { vi.advanceTimersByTime(500) })
    expect(screen.getByRole('menuitem', { name: 'Dent' })).toBeInTheDocument()
    fireEvent.mouseLeave(screen.getByRole('menu', { name: 'Class' }))
    act(() => { vi.advanceTimersByTime(500) })
    expect(screen.queryByRole('menuitem', { name: 'Dent' })).not.toBeInTheDocument()
  })

  it('assigns the chosen class, then asks to close, and reports class hover', () => {
    const calls: string[] = []
    const onHoverClass = vi.fn()
    render(<ImageDetailContextMenu {...menuProps({
      onAssignClass: (id) => calls.push(`assign:${id}`), onClose: () => calls.push('close'), onHoverClass,
    })} />)
    fireEvent.mouseEnter(screen.getByRole('menuitem', { name: 'Class' }))
    const dent = screen.getByRole('menuitem', { name: 'Dent' })
    fireEvent.mouseEnter(dent)
    expect(onHoverClass).toHaveBeenCalledWith('c2', dent)
    fireEvent.click(dent)
    expect(calls).toEqual(['assign:c2', 'close'])
  })
})

describe('ImageDetailConfirmDialogs', () => {
  it('asks about one image, or offers both scopes for a grouped image', () => {
    const onConfirm = vi.fn()
    const base = { open: true, onCancel: noop, onConfirm }
    const { rerender } = render(<ImageDetailConfirmDialogs deleteImage={base} />)
    expect(screen.getByRole('alertdialog', { name: 'Delete image?' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
    rerender(<ImageDetailConfirmDialogs deleteImage={{ ...base, grouped: true, error: 'Failed' }} />)
    expect(screen.getByRole('alert')).toHaveTextContent('Failed')
    fireEvent.click(screen.getByRole('button', { name: 'This image' }))
    fireEvent.click(screen.getByRole('button', { name: 'Entire group' }))
    expect(onConfirm.mock.calls.map(([scope]) => scope)).toEqual(['image', 'image', 'group'])
  })

  it('locks the comment question while saving', () => {
    const onCancel = vi.fn()
    const onConfirm = vi.fn()
    const { rerender } = render(<ImageDetailConfirmDialogs archiveComment={{ open: true, onCancel, onConfirm }} />)
    fireEvent.click(screen.getByRole('button', { name: 'Archive' }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
    rerender(<ImageDetailConfirmDialogs archiveComment={{ open: true, saving: true, onCancel, onConfirm }} />)
    expect(screen.getByRole('button', { name: 'Archiving…' })).toBeDisabled()
    fireEvent.click(screen.getByRole('alertdialog').parentElement as HTMLElement)
    expect(onCancel).not.toHaveBeenCalled()
    rerender(<ImageDetailConfirmDialogs archiveComment={{ open: false, onCancel, onConfirm }} />)
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
  })
})

describe('ClassHoverCard', () => {
  it('shows nothing for a class without image or description', () => {
    const { rerender } = render(<ClassHoverCard item={{ id: 'c2', name: 'Dent' }} top={0} left={0} />)
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    rerender(<ClassHoverCard item={{ id: 'c1', name: 'Scratch', reference_image_url: 'ref.png' }} top={0} left={0} resolveAssetUrl={(path) => `/assets/${path}`} />)
    expect(screen.getByRole('img', { name: 'Scratch reference', hidden: true })).toHaveAttribute('src', '/assets/ref.png')
  })

  it('tracks one hovered class and ignores classes with nothing to show', () => {
    const anchor = document.createElement('button')
    const { result } = renderHook(() => useClassHoverCard(CLASSES))
    act(() => result.current.show('c2', anchor))
    expect(result.current.item).toBeNull()
    act(() => result.current.show('c1', anchor))
    expect(result.current.item?.name).toBe('Scratch')
    expect(result.current.position).not.toBeNull()
    act(() => result.current.hide('c2'))
    expect(result.current.item?.name).toBe('Scratch')
    act(() => result.current.hide('c1'))
    expect(result.current.item).toBeNull()
  })
})
