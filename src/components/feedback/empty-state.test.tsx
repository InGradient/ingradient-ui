import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { EmptyState } from './empty-state'

describe('EmptyState', () => {
  it('renders title', () => {
    render(<EmptyState title="No data" />)
    expect(screen.getByText('No data')).toBeInTheDocument()
  })

  it('renders description', () => {
    render(<EmptyState description="Try a different search." />)
    expect(screen.getByText('Try a different search.')).toBeInTheDocument()
  })

  it('renders action button and fires onClick', () => {
    const onClick = vi.fn()
    render(<EmptyState action={{ label: 'Add item', onClick }} />)
    fireEvent.click(screen.getByText('Add item'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('renders icon when provided', () => {
    render(<EmptyState icon={<span data-testid="icon">📭</span>} />)
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('renders children', () => {
    render(<EmptyState><p>Custom content</p></EmptyState>)
    expect(screen.getByText('Custom content')).toBeInTheDocument()
  })
})
