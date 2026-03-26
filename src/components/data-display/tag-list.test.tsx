import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TagList } from './tag-list'

const items = [
  { id: '1', color: '#f00', label: 'Red' },
  { id: '2', color: '#0f0', label: 'Green' },
  { id: '3', color: '#00f', label: 'Blue', count: 42 },
]

describe('TagList', () => {
  it('renders all items', () => {
    render(<TagList items={items} />)
    expect(screen.getByText('Red')).toBeInTheDocument()
    expect(screen.getByText('Green')).toBeInTheDocument()
    expect(screen.getByText('Blue')).toBeInTheDocument()
  })

  it('shows count when provided', () => {
    render(<TagList items={items} />)
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('calls onItemClick', () => {
    const onClick = vi.fn()
    render(<TagList items={items} onItemClick={onClick} />)
    fireEvent.click(screen.getByText('Green'))
    expect(onClick).toHaveBeenCalledWith('2')
  })

  it('highlights selectedId', () => {
    const { container } = render(<TagList items={items} selectedId="1" />)
    expect(container.querySelectorAll('button').length).toBe(3)
  })
})
