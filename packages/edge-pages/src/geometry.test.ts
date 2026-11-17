import { describe, expect, it } from 'vitest'
import { edgeGeometry } from './geometry'

describe('edge geometry', () => {
  it('uses pixel values on the 4px grid, like the core layout sizes', () => {
    for (const [name, value] of Object.entries(edgeGeometry)) {
      expect(value, name).toMatch(/^\d+px$/)
      expect(Number.parseInt(value, 10) % 4, name).toBe(0)
    }
  })
})
