import { describe, expect, it } from 'vitest'
import { renderTokensCss } from '../globals/css-contract'
import { componentSizeVars, componentSizes } from './component-sizes'

describe('component sizes', () => {
  it('are plain pixel values', () => {
    for (const value of Object.values(componentSizes)) expect(value).toMatch(/^\d+px$/)
  })

  it('emit one --ig-size-* variable per size', () => {
    expect(Object.keys(componentSizeVars)).toHaveLength(Object.keys(componentSizes).length)
    const css = renderTokensCss().replace(/\s/g, '')
    expect(css).toContain('--ig-size-checkbox:18px')
    expect(css).toContain('--ig-size-switch-thumb-travel:18px')
    expect(css).toContain('--ig-size-dot-xs:5px')
  })
})
