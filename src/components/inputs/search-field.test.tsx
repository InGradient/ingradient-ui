import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SearchField } from './search-field'

describe('SearchField', () => {
  it('renders with placeholder', () => {
    render(<SearchField placeholder="Search..." value="" onChange={() => {}} />)
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
  })

  it('shows clear button when value is non-empty and onClear is provided', () => {
    render(<SearchField value="hello" onChange={() => {}} onClear={() => {}} />)
    expect(screen.getByLabelText('Clear search')).toBeInTheDocument()
  })

  it('hides clear button when value is empty', () => {
    render(<SearchField value="" onChange={() => {}} onClear={() => {}} />)
    expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument()
  })

  it('calls onClear when clear button is clicked', () => {
    const onClear = vi.fn()
    render(<SearchField value="test" onChange={() => {}} onClear={onClear} />)
    fireEvent.click(screen.getByLabelText('Clear search'))
    expect(onClear).toHaveBeenCalledOnce()
  })

  it('passes onChange events', () => {
    const onChange = vi.fn()
    render(<SearchField value="" onChange={onChange} />)
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'new' } })
    expect(onChange).toHaveBeenCalled()
  })
})
