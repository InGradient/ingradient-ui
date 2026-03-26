import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ModeSwitcher } from './mode-switcher'

const options = [
  { value: 'cursor', label: 'Cursor' },
  { value: 'rect', label: 'Rect' },
  { value: 'point', label: 'Point' },
]

describe('ModeSwitcher', () => {
  it('renders all options', () => {
    render(<ModeSwitcher options={options} value="cursor" onChange={() => {}} />)
    expect(screen.getByText('Cursor')).toBeInTheDocument()
    expect(screen.getByText('Rect')).toBeInTheDocument()
    expect(screen.getByText('Point')).toBeInTheDocument()
  })

  it('marks active option with aria-checked', () => {
    render(<ModeSwitcher options={options} value="rect" onChange={() => {}} />)
    expect(screen.getByText('Rect')).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByText('Cursor')).toHaveAttribute('aria-checked', 'false')
  })

  it('calls onChange on click', () => {
    const onChange = vi.fn()
    render(<ModeSwitcher options={options} value="cursor" onChange={onChange} />)
    fireEvent.click(screen.getByText('Point'))
    expect(onChange).toHaveBeenCalledWith('point')
  })
})
