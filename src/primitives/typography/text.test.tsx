import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import * as React from 'react'
import { Text, resolveWeight, resolveLetterSpacing } from './text'

describe('Text', () => {
  it('renders children', () => {
    const { container } = render(<Text>Hello</Text>)
    expect(container.textContent).toBe('Hello')
  })

  it('renders as span by default', () => {
    const { container } = render(<Text>Default</Text>)
    expect(container.querySelector('span')).not.toBeNull()
  })

  it('renders as a custom element via `as`', () => {
    const { container } = render(<Text as="p">Paragraph</Text>)
    expect(container.querySelector('p')?.textContent).toBe('Paragraph')
  })
})

describe('resolveWeight', () => {
  it('returns undefined when weight is not specified (regression for F-03)', () => {
    // Before fix: returned 'var(--ig-font-weight-regular)' — made CSS fallback dead code.
    // After fix: returns undefined — CSS fallback `var(--ig-font-weight-regular)` fires.
    expect(resolveWeight(undefined)).toBeUndefined()
  })

  it('resolves regular alias to token', () => {
    expect(resolveWeight('regular')).toBe('var(--ig-font-weight-regular)')
  })

  it('resolves medium alias to token', () => {
    expect(resolveWeight('medium')).toBe('var(--ig-font-weight-medium)')
  })

  it('resolves semibold alias to token', () => {
    expect(resolveWeight('semibold')).toBe('var(--ig-font-weight-semibold)')
  })

  it('resolves bold alias to token', () => {
    expect(resolveWeight('bold')).toBe('var(--ig-font-weight-bold)')
  })

  it('resolves black alias to token', () => {
    expect(resolveWeight('black')).toBe('var(--ig-font-weight-black)')
  })

  it('passes numeric weight as raw value (backward compat)', () => {
    expect(resolveWeight(500)).toBe(500)
    expect(resolveWeight(400)).toBe(400)
  })
})

describe('resolveLetterSpacing', () => {
  it('returns undefined when not specified', () => {
    expect(resolveLetterSpacing(undefined)).toBeUndefined()
    expect(resolveLetterSpacing('')).toBeUndefined()
  })

  it('resolves tight alias to token', () => {
    expect(resolveLetterSpacing('tight')).toBe('var(--ig-letter-spacing-tight)')
  })

  it('resolves normal alias to token', () => {
    expect(resolveLetterSpacing('normal')).toBe('var(--ig-letter-spacing-normal)')
  })

  it('resolves wide alias to token', () => {
    expect(resolveLetterSpacing('wide')).toBe('var(--ig-letter-spacing-wide)')
  })

  it('resolves wider alias to token', () => {
    expect(resolveLetterSpacing('wider')).toBe('var(--ig-letter-spacing-wider)')
  })

  it('resolves widest alias to token', () => {
    expect(resolveLetterSpacing('widest')).toBe('var(--ig-letter-spacing-widest)')
  })

  it('passes raw string through', () => {
    expect(resolveLetterSpacing('0.04em')).toBe('0.04em')
    expect(resolveLetterSpacing('1px')).toBe('1px')
  })
})