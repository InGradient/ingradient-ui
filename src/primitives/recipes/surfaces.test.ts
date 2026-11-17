import { describe, expect, it } from 'vitest'
import { paddingInsideBorder } from './surfaces'

describe('paddingInsideBorder', () => {
  it('subtracts the border from every non-zero part', () => {
    expect(paddingInsideBorder('var(--ig-space-6)')).toBe('calc(var(--ig-space-6) - var(--ig-border-1px))')
    expect(paddingInsideBorder('0 var(--ig-space-4)')).toBe('0 calc(var(--ig-space-4) - var(--ig-border-1px))')
  })
  it('keeps calc() parts with spaces intact', () => {
    expect(paddingInsideBorder('calc(var(--a) + 2px) 0')).toBe('calc(calc(var(--a) + 2px) - var(--ig-border-1px)) 0')
  })
})
