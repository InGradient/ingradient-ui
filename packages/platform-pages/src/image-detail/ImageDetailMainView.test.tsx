import { createRef } from 'react'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ImageDetailMainView } from './ImageDetailMainView'
import type { ImageDetailMainViewProps } from './image-detail-main.types'

const noop = () => undefined

const baseProps = (overrides: Partial<ImageDetailMainViewProps> = {}): ImageDetailMainViewProps => ({
  canvas: {
    imageUrl: 'image.png', alt: 'image.png', imageAspect: 1, zoom: 1, pan: { x: 0, y: 0 }, objects: [],
    mouseHandlers: { onMouseDown: noop, onMouseMove: noop, onMouseUp: noop, onMouseLeave: noop }, cursor: 'default',
  },
  onZoomIn: noop,
  onZoomOut: noop,
  onClose: noop,
  toolbar: {
    mode: 'cursor', tools: ['cursor', 'bbox', 'point', 'classification'], onSelectTool: noop,
    canUndo: false, canRedo: false, canReset: false, onUndo: noop, onRedo: noop, onReset: noop,
  },
  ...overrides,
})
const toolbar = () => within(screen.getByRole('toolbar', { name: 'Image detail toolbar' }))

describe('ImageDetailMainView', () => {
  it('reports zoom and close, and turns zoom-out off at the minimum zoom', () => {
    const onZoomIn = vi.fn()
    const onClose = vi.fn()
    const { rerender } = render(<ImageDetailMainView {...baseProps({ onZoomIn, onClose })} />)
    expect(screen.getByRole('button', { name: 'Zoom out' })).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: 'Zoom in' }))
    fireEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(onZoomIn).toHaveBeenCalledTimes(1)
    expect(onClose).toHaveBeenCalledTimes(1)
    rerender(<ImageDetailMainView {...baseProps({ canvas: { ...baseProps().canvas, zoom: 2 } })} />)
    expect(screen.getByRole('button', { name: 'Zoom out' })).toBeEnabled()
  })

  it('shows only the tools it is given and reports the chosen tool', () => {
    const onSelectTool = vi.fn()
    render(<ImageDetailMainView {...baseProps({ toolbar: { ...baseProps().toolbar, tools: ['cursor', 'bbox'], onSelectTool } })} />)
    expect(toolbar().getByRole('button', { name: 'Cursor (select & move)' })).toHaveAttribute('aria-pressed', 'true')
    expect(toolbar().queryByRole('button', { name: 'Add point' })).not.toBeInTheDocument()
    expect(toolbar().queryByRole('button', { name: 'Classification' })).not.toBeInTheDocument()
    fireEvent.click(toolbar().getByRole('button', { name: 'Draw bbox' }))
    expect(onSelectTool).toHaveBeenCalledWith('bbox')
  })

  it('enables history and delete only when the app allows them', () => {
    const onDelete = vi.fn()
    const { rerender } = render(<ImageDetailMainView {...baseProps()} />)
    for (const name of ['Undo (Ctrl+Z)', 'Redo (Ctrl+Y)', 'Reset (clear all bboxes & points)', 'Delete image']) {
      expect(toolbar().getByRole('button', { name })).toBeDisabled()
    }
    rerender(<ImageDetailMainView {...baseProps({ toolbar: { ...baseProps().toolbar, canUndo: true, onDelete } })} />)
    expect(toolbar().getByRole('button', { name: 'Undo (Ctrl+Z)' })).toBeEnabled()
    fireEvent.click(toolbar().getByRole('button', { name: 'Delete image' }))
    expect(onDelete).toHaveBeenCalledTimes(1)
    rerender(<ImageDetailMainView {...baseProps({ toolbar: { ...baseProps().toolbar, onDelete, deleting: true } })} />)
    expect(toolbar().getByRole('button', { name: 'Delete image' })).toBeDisabled()
  })

  it('shows the loading spinner, the hi-res notice, and the archived hatch on request', () => {
    const { rerender, container } = render(<ImageDetailMainView {...baseProps({ loading: true, hiResLoading: true })} />)
    expect(screen.getByRole('status', { name: 'Loading image' })).toBeInTheDocument()
    expect(screen.queryByText('Loading hi-res…')).not.toBeInTheDocument()
    rerender(<ImageDetailMainView {...baseProps({ hiResLoading: true, archived: true })} />)
    expect(screen.getByText('Loading hi-res…')).toBeInTheDocument()
    expect(container.querySelector('[data-ig-slot="archived-overlay"]')).toBeInTheDocument()
  })

  it('shows group tabs in place of the view switcher slot and exposes the tab bar ref', () => {
    const onSelect = vi.fn()
    const tabBarRef = createRef<HTMLDivElement>()
    const group = { items: [{ id: '0', name: 'a.png' }, { id: '1', name: 'b.png' }], currentId: '0', onSelect, tabBarRef }
    const { rerender } = render(<ImageDetailMainView {...baseProps({ viewSwitcherSlot: <div>views</div> })} />)
    expect(screen.getByText('views')).toBeInTheDocument()
    rerender(<ImageDetailMainView {...baseProps({ group, viewSwitcherSlot: <div>views</div> })} />)
    expect(screen.queryByText('views')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('tab', { name: 'b.png' }))
    expect(onSelect).toHaveBeenCalledWith('1')
    expect(tabBarRef.current).toContainElement(screen.getByRole('tablist', { name: 'Group images' }))
  })

  it('shows the mobile info toggle only when the app passes it', () => {
    const onToggle = vi.fn()
    const { rerender } = render(<ImageDetailMainView {...baseProps()} />)
    expect(screen.queryByRole('button', { name: 'Info & classes', hidden: true })).not.toBeInTheDocument()
    rerender(<ImageDetailMainView {...baseProps({ mobileInfo: { active: false, onToggle } })} />)
    fireEvent.click(screen.getByRole('button', { name: 'Info & classes', hidden: true }))
    expect(onToggle).toHaveBeenCalledTimes(1)
  })
})
