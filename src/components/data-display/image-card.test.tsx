import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import axe from 'axe-core'
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

  it('uses a native button for the primary open action', () => {
    const onOpen = vi.fn()
    render(<ImageCard image={image} onOpen={onOpen} />)
    const card = screen.getByRole('button', { name: /open image/i })
    expect(card.tagName).toBe('BUTTON')
    fireEvent.click(card)
    expect(onOpen).toHaveBeenCalledWith('img-1')
  })

  it('calls onSelect when onOpen is not provided', () => {
    const onSelect = vi.fn()
    render(<ImageCard image={image} onSelect={onSelect} />)
    const card = screen.getByRole('button', { name: /select image/i })
    fireEvent.click(card)
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

  it('keeps the primary action and overlay controls as accessible siblings', async () => {
    const { container } = render(
      <ImageCard
        image={image}
        onOpen={() => {}}
        onOpenMenu={() => {}}
        topRightSlot={<button type="button">Sync details</button>}
      />,
    )
    const primary = screen.getByRole('button', { name: 'Open image wafer-001.jpg' })
    const menu = screen.getByRole('button', { name: 'Open menu for wafer-001.jpg' })
    const slot = screen.getByRole('button', { name: 'Sync details' })

    expect(primary.contains(menu)).toBe(false)
    expect(primary.contains(slot)).toBe(false)
    expect(menu.contains(primary)).toBe(false)
    expect(await axe.run(container)).toMatchObject({ violations: [] })
  })
})
