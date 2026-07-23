import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { SortOptionList } from './sort-popover-trigger'

const options = [
  { value: 'recent', label: 'Most recent' },
  { value: 'name-asc', label: 'Name (A-Z)' },
]

describe('SortOptionList', () => {
  it('exposes the selected option and reports the next value', () => {
    const onChange = vi.fn()
    render(
      <SortOptionList
        ariaLabel="Sort images"
        options={options}
        value="recent"
        onChange={onChange}
      />,
    )

    expect(screen.getByRole('option', { name: 'Most recent' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    fireEvent.click(screen.getByRole('option', { name: 'Name (A-Z)' }))
    expect(onChange).toHaveBeenCalledWith('name-asc')
  })
})
