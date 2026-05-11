import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SelectField } from './select-field'

describe('SelectField', () => {
  it('renders selected option label in trigger', () => {
    render(
      <SelectField value="b" onChange={() => {}}>
        <option value="a">Apple</option>
        <option value="b">Banana</option>
        <option value="c">Cherry</option>
      </SelectField>,
    )
    // Selected label appears in the visible trigger
    const trigger = screen.getByRole('button')
    expect(trigger.textContent).toContain('Banana')
  })

  it('opens menu on trigger click', () => {
    render(
      <SelectField value="a" onChange={() => {}}>
        <option value="a">Apple</option>
        <option value="b">Banana</option>
      </SelectField>,
    )
    const trigger = screen.getByRole('button', { expanded: false })
    fireEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
  })

  it('trigger has aria-expanded toggling on open/close', () => {
    render(
      <SelectField value="a" onChange={() => {}}>
        <option value="a">Apple</option>
      </SelectField>,
    )
    const trigger = screen.getByRole('button')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
  })

  it('renders disabled trigger when disabled prop set', () => {
    render(
      <SelectField value="a" onChange={() => {}} disabled>
        <option value="a">Apple</option>
      </SelectField>,
    )
    const trigger = screen.getByRole('button')
    expect(trigger).toBeDisabled()
  })
})
