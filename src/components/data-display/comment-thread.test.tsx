import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CommentThread, CommentItem, CommentInput } from './comment-thread'

describe('CommentItem', () => {
  it('renders author and body', () => {
    render(<CommentItem author="Alice" body="Hello world" />)
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Hello world')).toBeInTheDocument()
  })

  it('renders timestamp when provided', () => {
    render(<CommentItem author="Bob" body="test" timestamp="2026-03-27" />)
    expect(screen.getByText('2026-03-27')).toBeInTheDocument()
  })
})

describe('CommentThread', () => {
  it('renders children', () => {
    render(
      <CommentThread>
        <CommentItem author="A" body="first" />
        <CommentItem author="B" body="second" />
      </CommentThread>,
    )
    expect(screen.getByText('first')).toBeInTheDocument()
    expect(screen.getByText('second')).toBeInTheDocument()
  })
})

describe('CommentInput', () => {
  it('calls onChange on typing', () => {
    const onChange = vi.fn()
    render(<CommentInput value="" onChange={onChange} />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'hi' } })
    expect(onChange).toHaveBeenCalledWith('hi')
  })

  it('calls onSubmit on Ctrl+Enter', () => {
    const onSubmit = vi.fn()
    render(<CommentInput value="test" onChange={() => {}} onSubmit={onSubmit} />)
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter', ctrlKey: true })
    expect(onSubmit).toHaveBeenCalledOnce()
  })

  it('disables send button when value is empty', () => {
    render(<CommentInput value="" onChange={() => {}} onSubmit={() => {}} />)
    expect(screen.getByText('Send')).toBeDisabled()
  })
})
