import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from './badge'

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>admin</Badge>)
    expect(screen.getByText('admin')).toBeInTheDocument()
  })

  it('renders with tone prop', () => {
    const { container } = render(<Badge $tone="success">OK</Badge>)
    expect(container.firstChild).toBeInTheDocument()
  })
})
