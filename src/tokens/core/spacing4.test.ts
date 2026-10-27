import { describe, expect, it } from 'vitest'
import { renderTokensCss } from '../globals/css-contract'
import { spacing4, spacingRoles } from './spacing'

describe('4px spacing scale', () => {
  it('keeps every step on the 4px grid except the single 2px optical step', () => {
    for (const [key, value] of Object.entries(spacing4)) {
      const px = Number.parseInt(value, 10)
      expect(String(px)).toBe(key)
      if (px !== 2) expect(px % 4).toBe(0)
    }
  })

  it('maps roles onto the scale', () => {
    expect(spacingRoles).toEqual({ gapInline: '4px', gapRelated: '8px', insetCard: '16px', gapSection: '24px', insetPage: '24px' })
  })

  it('emits the new variables next to the legacy ones', () => {
    const css = renderTokensCss().replace(/\s/g, '')
    expect(css).toContain('--ig-spacing-12:12px')
    expect(css).toContain('--ig-gap-related:8px')
    expect(css).toContain('--ig-inset-card:16px')
    expect(css).toContain('--ig-space-3:8px')
  })
})
