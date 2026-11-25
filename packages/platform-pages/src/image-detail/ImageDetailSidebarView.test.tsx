import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ImageDetailCameraParams } from './image-detail-camera-params'
import { ImageDetailSidebarView, type ImageDetailSidebarViewProps } from './ImageDetailSidebarView'

const noop = () => undefined

const baseProps = (overrides: Partial<ImageDetailSidebarViewProps> = {}): ImageDetailSidebarViewProps => ({
  info: { image: { name: 'image_0412.png' }, detailsOpen: false, onToggleDetails: noop },
  classes: { items: [{ id: 'c1', name: 'Scratch', color: 'red' }, { id: 'c2', name: 'Dent', color: 'blue' }], onSelectClass: noop },
  comments: { comments: [] },
  ...overrides,
})

describe('ImageDetailSidebarView', () => {
  it('renders info, the class list, and comments, and reports the selected class id', () => {
    const onSelectClass = vi.fn()
    render(<ImageDetailSidebarView {...baseProps({ classes: { ...baseProps().classes, onSelectClass } })} />)
    expect(screen.getByText('image_0412.png')).toBeInTheDocument()
    expect(screen.getByText('Class')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Dent'))
    expect(onSelectClass).toHaveBeenCalledWith('c2')
  })

  it('reports class hover by id with the hovered row', () => {
    const onHoverClass = vi.fn()
    const onHoverLeave = vi.fn()
    render(<ImageDetailSidebarView {...baseProps({ classes: { ...baseProps().classes, onHoverClass, onHoverLeave } })} />)
    const row = screen.getByText('Scratch')
    fireEvent.mouseEnter(row)
    fireEvent.mouseLeave(row)
    expect(onHoverClass).toHaveBeenCalledWith('c1', expect.any(HTMLElement))
    expect(onHoverLeave).toHaveBeenCalledWith('c1')
  })

  it('shows the labelers section only when there are labelers', () => {
    const labelers = { users: [{ id: 'a@x.io', label: 'Alex' }], selectedIds: new Set(['a@x.io']), onToggle: noop }
    const { rerender } = render(<ImageDetailSidebarView {...baseProps()} />)
    expect(screen.queryByText('Users')).not.toBeInTheDocument()
    rerender(<ImageDetailSidebarView {...baseProps({ labelers: { ...labelers, users: [] } })} />)
    expect(screen.queryByText('Users')).not.toBeInTheDocument()
    rerender(<ImageDetailSidebarView {...baseProps({ labelers })} />)
    expect(screen.getByText('Users')).toBeInTheDocument()
  })

  it('renders the mobile backdrop only while the drawer is visible and closes from it', () => {
    const onClose = vi.fn()
    const { container, rerender } = render(<ImageDetailSidebarView {...baseProps({ mobile: { visible: false, onClose } })} />)
    expect(container.querySelector('[data-ig-slot="mobile-backdrop"]')).toBeNull()
    rerender(<ImageDetailSidebarView {...baseProps({ mobile: { visible: true, onClose } })} />)
    fireEvent.click(container.querySelector('[data-ig-slot="mobile-backdrop"]') as Element)
    expect(onClose).toHaveBeenCalled()
  })
})

describe('ImageDetailCameraParams', () => {
  const rows = [{ label: 'Exposure', value: '12000 µs' }]

  it('renders nothing without rows', () => {
    const { container } = render(<ImageDetailCameraParams rows={[]} open onToggle={noop} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('shows rows only while open and toggles through the app', () => {
    const onToggle = vi.fn()
    const { rerender } = render(<ImageDetailCameraParams rows={rows} open={false} onToggle={onToggle} />)
    expect(screen.queryByText('12000 µs')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Camera Parameters' }))
    expect(onToggle).toHaveBeenCalled()
    rerender(<ImageDetailCameraParams rows={rows} open onToggle={onToggle} />)
    expect(screen.getByText('12000 µs')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Hide camera parameters' })).toHaveAttribute('aria-expanded', 'true')
  })
})
