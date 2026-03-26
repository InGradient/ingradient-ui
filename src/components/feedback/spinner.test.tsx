import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Spinner } from './spinner'

describe('Spinner', () => {
  it('renders with role="status"', () => {
    const { container } = render(<Spinner />)
    expect(container.querySelector('[role="status"]')).toBeInTheDocument()
  })

  it('has accessible aria-label', () => {
    const { container } = render(<Spinner aria-label="Loading data" />)
    expect(container.querySelector('[aria-label="Loading data"]')).toBeInTheDocument()
  })
})
