import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ImageViewerToolbar } from './image-viewer-toolbar'

describe('ImageViewerToolbar', () => {
  it('shows zoom percentage', () => {
    render(<ImageViewerToolbar zoom={2} onZoomIn={() => {}} onZoomOut={() => {}} onReset={() => {}} />)
    expect(screen.getByText('200%')).toBeInTheDocument()
  })

  it('calls onZoomIn', () => {
    const onZoomIn = vi.fn()
    render(<ImageViewerToolbar zoom={1} onZoomIn={onZoomIn} onZoomOut={() => {}} onReset={() => {}} />)
    fireEvent.click(screen.getByLabelText('Zoom in'))
    expect(onZoomIn).toHaveBeenCalledOnce()
  })

  it('calls onZoomOut', () => {
    const onZoomOut = vi.fn()
    render(<ImageViewerToolbar zoom={2} onZoomIn={() => {}} onZoomOut={onZoomOut} onReset={() => {}} />)
    fireEvent.click(screen.getByLabelText('Zoom out'))
    expect(onZoomOut).toHaveBeenCalledOnce()
  })

  it('disables zoom out at zoom=1', () => {
    render(<ImageViewerToolbar zoom={1} onZoomIn={() => {}} onZoomOut={() => {}} onReset={() => {}} />)
    expect(screen.getByLabelText('Zoom out')).toBeDisabled()
  })

  it('renders children slot', () => {
    render(
      <ImageViewerToolbar zoom={1} onZoomIn={() => {}} onZoomOut={() => {}} onReset={() => {}}>
        <button>Custom</button>
      </ImageViewerToolbar>,
    )
    expect(screen.getByText('Custom')).toBeInTheDocument()
  })
})
