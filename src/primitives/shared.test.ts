import { describe, it, expect } from 'vitest'
import { space, tokenSpace, numberOrString, type TokenSpace } from './shared'

describe('space', () => {
  it('converts number to raw px string', () => {
    expect(space(3)).toBe('3px')
    expect(space(0)).toBe('0px')
    expect(space(32)).toBe('32px')
  })

  it('passes string through unchanged', () => {
    expect(space('var(--ig-space-3)')).toBe('var(--ig-space-3)')
    expect(space('1rem')).toBe('1rem')
  })

  it('returns undefined for null/undefined input', () => {
    expect(space(undefined)).toBeUndefined()
    expect(space(null as unknown as undefined)).toBeUndefined()
  })
})

describe('tokenSpace', () => {
  it('maps scale index to CSS custom property', () => {
    expect(tokenSpace(0)).toBe('var(--ig-space-0)')
    expect(tokenSpace(3)).toBe('var(--ig-space-3)')
    expect(tokenSpace(7)).toBe('var(--ig-space-7)')
    expect(tokenSpace(13)).toBe('var(--ig-space-13)')
  })

  it('returns undefined for null/undefined input', () => {
    expect(tokenSpace(undefined)).toBeUndefined()
  })

  it('does not produce raw px (unlike space)', () => {
    expect(tokenSpace(3)).not.toBe('3px')
    expect(tokenSpace(3)).toBe('var(--ig-space-3)')
  })

  it('type-level: TokenSpace accepts 0–13', () => {
    const valid: TokenSpace[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
    expect(valid.length).toBe(14)
  })
})

describe('numberOrString', () => {
  it('converts number to raw px string', () => {
    expect(numberOrString(8)).toBe('8px')
  })

  it('passes string through unchanged', () => {
    expect(numberOrString('auto')).toBe('auto')
  })

  it('returns undefined for null/undefined input', () => {
    expect(numberOrString(undefined)).toBeUndefined()
  })
})