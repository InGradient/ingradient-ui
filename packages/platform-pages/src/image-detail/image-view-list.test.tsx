import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ImageViewList } from './image-view-list'

const VIEWS = [
  { id: 'v1', name: 'Original' },
  { id: 'v2', name: 'View A' },
]

describe('ImageViewList', () => {
  it('renders nothing when there are no views', () => {
    const { container } = render(<ImageViewList views={[]} onSelect={() => undefined} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('marks the current view and reports the selected id', () => {
    const onSelect = vi.fn()
    render(<ImageViewList views={VIEWS} currentId="v1" onSelect={onSelect} />)
    expect(screen.getByRole('option', { name: 'Original' })).toHaveAttribute('aria-selected', 'true')
    fireEvent.click(screen.getByRole('option', { name: 'View A' }))
    expect(onSelect).toHaveBeenCalledWith('v2')
  })
})
