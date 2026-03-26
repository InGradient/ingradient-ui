import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Alert } from './alert'

describe('Alert', () => {
  it('renders children text', () => {
    render(<Alert>Test message</Alert>)
    expect(screen.getByText('Test message')).toBeInTheDocument()
  })

  it('accepts $tone prop without crashing', () => {
    const { container } = render(<Alert $tone="danger">Error</Alert>)
    expect(container.firstChild).toBeInTheDocument()
  })
})
