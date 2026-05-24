import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FieldRow, FormField } from './form-section'

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

describe('FormField', () => {
  it('renders label and children', () => {
    render(<FormField label="Workspace"><input /></FormField>)
    expect(screen.getByText('Workspace')).toBeInTheDocument()
  })
})
