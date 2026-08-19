import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ImageCard } from './image-card'

const image = {
  id: 'img-1',
  name: 'wafer-001.jpg',
  thumb_url: 'https://example.com/thumb.jpg',
}

describe('ImageCard', () => {
  it('renders the image', () => {
    render(<ImageCard image={image} onOpen={() => {}} />)
    expect(screen.getByRole('button', { name: /open image wafer-001/i })).toBeInTheDocument()
  })

  it('calls onOpen on Enter keydown', () => {
    const onOpen = vi.fn()
    render(<ImageCard image={image} onOpen={onOpen} />)
    const card = screen.getByRole('button', { name: /open image/i })
    fireEvent.keyDown(card, { key: 'Enter' })
    expect(onOpen).toHaveBeenCalledWith('img-1')
  })

  it('calls onOpen on Space keydown', () => {
    const onOpen = vi.fn()
    render(<ImageCard image={image} onOpen={onOpen} />)
    const card = screen.getByRole('button', { name: /open image/i })
    fireEvent.keyDown(card, { key: ' ' })
    expect(onOpen).toHaveBeenCalledWith('img-1')
  })

  it('calls onSelect on Enter when onOpen is not provided', () => {
    const onSelect = vi.fn()
    render(<ImageCard image={image} onSelect={onSelect} />)
    const card = screen.getByRole('button', { name: /select image/i })
    fireEvent.keyDown(card, { key: 'Enter' })
    expect(onSelect).toHaveBeenCalledWith('img-1', expect.any(Object))
  })

  it('is not keyboard-focusable when neither onOpen nor onSelect is provided', () => {
    render(<ImageCard image={image} showKebab={false} />)
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('has aria-label for open action', () => {
    render(<ImageCard image={image} onOpen={() => {}} />)
    expect(screen.getByRole('button', { name: 'Open image wafer-001.jpg' })).toBeInTheDocument()
  })

  it('has aria-label for select action when only onSelect is provided', () => {
    render(<ImageCard image={image} onSelect={() => {}} />)
    expect(screen.getByRole('button', { name: 'Select image wafer-001.jpg' })).toBeInTheDocument()
  })
})