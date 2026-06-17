import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FormGroup } from './form-group'

describe('FormGroup', () => {
  it('renders title and children', () => {
    render(<FormGroup title="Settings"><div>content</div></FormGroup>)
    expect(screen.getByText('Settings')).toBeInTheDocument()
    expect(screen.getByText('content')).toBeInTheDocument()
  })

  it('renders description', () => {
    render(<FormGroup description="Some help text"><div>content</div></FormGroup>)
    expect(screen.getByText('Some help text')).toBeInTheDocument()
  })
})
