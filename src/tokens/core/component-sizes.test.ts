import { describe, expect, it } from 'vitest'
import { renderTokensCss } from '../globals/css-contract'
import { componentSizeVars, componentSizes } from './component-sizes'

describe('component sizes', () => {
  it('are pixel values on the 4px grid', () => {
    for (const value of Object.values(componentSizes)) {
      expect(value).toMatch(/^\d+px$/)
      expect(Number.parseInt(value, 10) % 4).toBe(0)
    }
  })

  it('emit one --ig-size-* variable per size', () => {
    expect(Object.keys(componentSizeVars)).toHaveLength(Object.keys(componentSizes).length)
    const css = renderTokensCss().replace(/\s/g, '')
    expect(css).toContain('--ig-size-checkbox:16px')
    expect(css).toContain('--ig-size-switch-track-width:40px')
    expect(css).toContain('--ig-size-dot-xs:4px')
  })
})
