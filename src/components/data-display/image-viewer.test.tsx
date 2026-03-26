import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ImageViewer } from './image-viewer'

describe('ImageViewer', () => {
  it('renders an image with src and alt', () => {
    render(<ImageViewer src="/test.png" alt="Test image" />)
    const img = screen.getByAltText('Test image')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', '/test.png')
  })

  it('renders children overlay', () => {
    render(
      <ImageViewer src="/test.png">
        <div data-testid="overlay">overlay</div>
      </ImageViewer>,
    )
    expect(screen.getByTestId('overlay')).toBeInTheDocument()
  })

  it('renders without crashing when no alt provided', () => {
    const { container } = render(<ImageViewer src="/test.png" />)
    expect(container.querySelector('img')).toBeInTheDocument()
  })
})
