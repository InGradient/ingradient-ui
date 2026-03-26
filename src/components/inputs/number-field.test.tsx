import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { NumberField } from './number-field'

describe('NumberField', () => {
  it('renders the formatted value', () => {
    render(<NumberField value={42} onChange={() => {}} />)
    expect(screen.getByDisplayValue('42')).toBeInTheDocument()
  })

  it('calls onChange with clamped value on blur', () => {
    const onChange = vi.fn()
    render(<NumberField value={5} onChange={onChange} min={0} max={10} />)
    const input = screen.getByDisplayValue('5')
    fireEvent.change(input, { target: { value: '15' } })
    fireEvent.blur(input)
    expect(onChange).toHaveBeenCalledWith(10)
  })

  it('calls onChange on Enter key', () => {
    const onChange = vi.fn()
    render(<NumberField value={5} onChange={onChange} min={0} max={10} />)
    const input = screen.getByDisplayValue('5')
    fireEvent.change(input, { target: { value: '7' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(onChange).toHaveBeenCalledWith(7)
  })

  it('increments on ArrowUp', () => {
    const onChange = vi.fn()
    render(<NumberField value={5} onChange={onChange} step={1} max={10} />)
    fireEvent.keyDown(screen.getByDisplayValue('5'), { key: 'ArrowUp' })
    expect(onChange).toHaveBeenCalledWith(6)
  })

  it('decrements on ArrowDown', () => {
    const onChange = vi.fn()
    render(<NumberField value={5} onChange={onChange} step={1} min={0} />)
    fireEvent.keyDown(screen.getByDisplayValue('5'), { key: 'ArrowDown' })
    expect(onChange).toHaveBeenCalledWith(4)
  })

  it('reverts to original value on invalid input blur', () => {
    const onChange = vi.fn()
    render(<NumberField value={5} onChange={onChange} />)
    const input = screen.getByDisplayValue('5')
    fireEvent.change(input, { target: { value: 'abc' } })
    fireEvent.blur(input)
    expect(onChange).not.toHaveBeenCalled()
    expect(screen.getByDisplayValue('5')).toBeInTheDocument()
  })

  it('uses format function for display', () => {
    render(<NumberField value={0.5} onChange={() => {}} format={(v) => `${(v * 100).toFixed(0)}%`} />)
    expect(screen.getByDisplayValue('50%')).toBeInTheDocument()
  })
})
