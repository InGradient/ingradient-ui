import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SelectionActionBar } from './selection-action-bar'

describe('SelectionActionBar', () => {
  it('renders nothing when selectedCount is 0', () => {
    const { container } = render(
      <SelectionActionBar selectedCount={0} onClearSelection={() => {}} />,
    )
    expect(container.firstChild).toBeNull()
  })

  it('shows selected count', () => {
    render(<SelectionActionBar selectedCount={5} onClearSelection={() => {}} />)
    expect(screen.getByText('5 selected')).toBeInTheDocument()
  })

  it('shows total count when provided', () => {
    render(<SelectionActionBar selectedCount={3} totalCount={10} onClearSelection={() => {}} />)
    expect(screen.getByText('3 selected / 10')).toBeInTheDocument()
  })

  it('calls onClearSelection on clear click', () => {
    const onClear = vi.fn()
    render(<SelectionActionBar selectedCount={2} onClearSelection={onClear} />)
    fireEvent.click(screen.getByText('Clear'))
    expect(onClear).toHaveBeenCalledOnce()
  })

  it('shows select all button when onSelectAll is provided', () => {
    const onSelectAll = vi.fn()
    render(<SelectionActionBar selectedCount={1} onClearSelection={() => {}} onSelectAll={onSelectAll} />)
    fireEvent.click(screen.getByText('Select all'))
    expect(onSelectAll).toHaveBeenCalledOnce()
  })

  it('renders custom actions', () => {
    render(
      <SelectionActionBar selectedCount={1} onClearSelection={() => {}} actions={<button>Delete</button>} />,
    )
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })
})
