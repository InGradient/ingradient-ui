import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ChipGroup } from './chip-group'

const items = [
  { id: '1', label: 'Red', color: '#f00' },
  { id: '2', label: 'Green', color: '#0f0' },
  { id: '3', label: 'Blue', color: '#00f' },
  { id: '4', label: 'Yellow', color: '#ff0' },
]

describe('ChipGroup', () => {
  it('renders all items', () => {
    render(<ChipGroup items={items} />)
    expect(screen.getByText('Red')).toBeInTheDocument()
    expect(screen.getByText('Yellow')).toBeInTheDocument()
  })

  it('shows overflow count with maxVisible', () => {
    render(<ChipGroup items={items} maxVisible={2} />)
    expect(screen.getByText('Red')).toBeInTheDocument()
    expect(screen.getByText('Green')).toBeInTheDocument()
    expect(screen.queryByText('Blue')).not.toBeInTheDocument()
    expect(screen.getByText('+2 more')).toBeInTheDocument()
  })

  it('calls onItemClick', () => {
    const onClick = vi.fn()
    render(<ChipGroup items={items} onItemClick={onClick} />)
    fireEvent.click(screen.getByText('Green'))
    expect(onClick).toHaveBeenCalledWith('2')
  })
})
