import { describe, expect, it } from 'vitest'
import { layoutSizes } from './layout-sizes'

describe('layout sizes', () => {
  it('are pixel values on the 4px grid', () => {
    for (const [name, value] of Object.entries(layoutSizes)) {
      expect(value, name).toMatch(/^\d+px$/)
      expect(Number.parseInt(value, 10) % 4, name).toBe(0)
    }
  })
})
