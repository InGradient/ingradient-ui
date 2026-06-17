import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CheckboxGroup } from './checkbox-group'

const items = [
  { id: 'a', label: 'Apple', color: '#f00' },
  { id: 'b', label: 'Banana' },
  { id: 'c', label: 'Cherry', color: '#900' },
]

describe('CheckboxGroup', () => {
  it('renders all items with labels', () => {
    render(<CheckboxGroup items={items} selectedIds={new Set()} onChange={() => {}} />)
    expect(screen.getByText('Apple')).toBeInTheDocument()
    expect(screen.getByText('Banana')).toBeInTheDocument()
    expect(screen.getByText('Cherry')).toBeInTheDocument()
  })

  it('reflects selectedIds via checkbox state', () => {
    render(<CheckboxGroup items={items} selectedIds={new Set(['a', 'c'])} onChange={() => {}} />)
    const boxes = screen.getAllByRole('checkbox')
    expect(boxes[0]).toBeChecked()
    expect(boxes[1]).not.toBeChecked()
    expect(boxes[2]).toBeChecked()
  })

  it('toggles selection on item click (add)', () => {
    const onChange = vi.fn()
    render(<CheckboxGroup items={items} selectedIds={new Set(['a'])} onChange={onChange} />)
    fireEvent.click(screen.getAllByRole('checkbox')[1])
    expect(onChange).toHaveBeenCalledWith(new Set(['a', 'b']))
  })

  it('toggles selection on item click (remove)', () => {
    const onChange = vi.fn()
    render(<CheckboxGroup items={items} selectedIds={new Set(['a', 'b'])} onChange={onChange} />)
    fireEvent.click(screen.getAllByRole('checkbox')[0])
    expect(onChange).toHaveBeenCalledWith(new Set(['b']))
  })

  it('Select All chooses every item id', () => {
    const onChange = vi.fn()
    render(<CheckboxGroup items={items} selectedIds={new Set()} onChange={onChange} />)
    fireEvent.click(screen.getByText('Select All'))
    expect(onChange).toHaveBeenCalledWith(new Set(['a', 'b', 'c']))
  })

  it('Deselect All clears selection', () => {
    const onChange = vi.fn()
    render(<CheckboxGroup items={items} selectedIds={new Set(['a', 'b', 'c'])} onChange={onChange} />)
    fireEvent.click(screen.getByText('Deselect All'))
    expect(onChange).toHaveBeenCalledWith(new Set())
  })

  it('hides Select All header when showSelectAll=false', () => {
    render(
      <CheckboxGroup
        items={items}
        selectedIds={new Set()}
        onChange={() => {}}
        showSelectAll={false}
      />,
    )
    expect(screen.queryByText('Select All')).not.toBeInTheDocument()
    expect(screen.queryByText('Deselect All')).not.toBeInTheDocument()
  })
})
