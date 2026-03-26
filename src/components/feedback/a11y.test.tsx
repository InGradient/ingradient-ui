import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import axe from 'axe-core'
import { Alert } from './alert'
import { Spinner } from './spinner'

async function checkA11y(container: HTMLElement) {
  const results = await axe.run(container)
  return results.violations
}

describe('Accessibility', () => {
  it('Alert has no a11y violations', async () => {
    const { container } = render(<Alert $tone="info">Accessible message</Alert>)
    const violations = await checkA11y(container)
    expect(violations).toEqual([])
  })

  it('Spinner has no a11y violations', async () => {
    const { container } = render(<Spinner aria-label="Loading" />)
    const violations = await checkA11y(container)
    expect(violations).toEqual([])
  })
})
