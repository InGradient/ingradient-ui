import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FormGroup, FieldRow } from './form-section'

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

describe('FieldRow', () => {
  it('renders label and children', () => {
    render(<FieldRow label="Name"><input /></FieldRow>)
    expect(screen.getByText('Name')).toBeInTheDocument()
  })

  it('renders hint', () => {
    render(<FieldRow label="Email" hint="We won't share this."><input /></FieldRow>)
    expect(screen.getByText("We won't share this.")).toBeInTheDocument()
  })
})
