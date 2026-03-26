import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MentionTextarea } from './mention-textarea'

const candidates = [
  { id: '1', name: 'Alice', secondary: 'alice@test.com' },
  { id: '2', name: 'Bob', secondary: 'bob@test.com' },
]

describe('MentionTextarea', () => {
  it('renders with placeholder', () => {
    render(<MentionTextarea value="" onChange={() => {}} candidates={candidates} placeholder="Comment..." />)
    expect(screen.getByPlaceholderText('Comment...')).toBeInTheDocument()
  })

  it('renders current value', () => {
    render(<MentionTextarea value="hello" onChange={() => {}} candidates={candidates} />)
    expect(screen.getByDisplayValue('hello')).toBeInTheDocument()
  })

  it('calls onChange on typing', () => {
    const onChange = vi.fn()
    render(<MentionTextarea value="" onChange={onChange} candidates={candidates} />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'hi' } })
    expect(onChange).toHaveBeenCalledWith('hi')
  })

  it('calls onSubmit with Ctrl+Enter', () => {
    const onSubmit = vi.fn()
    render(<MentionTextarea value="hello @Alice" onChange={() => {}} candidates={candidates} onSubmit={onSubmit} />)
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter', ctrlKey: true })
    expect(onSubmit).toHaveBeenCalledWith('hello @Alice', ['1'])
  })

  it('respects maxLength', () => {
    render(<MentionTextarea value="" onChange={() => {}} candidates={candidates} maxLength={10} />)
    expect(screen.getByRole('textbox')).toHaveAttribute('maxlength', '10')
  })
})
