import { describe, it, expect } from 'vitest'
import { alertToneStyles } from './alerts'

describe('alertToneStyles', () => {
  const tones = ['info', 'success', 'warning', 'danger'] as const

  it('has all expected tones', () => {
    for (const tone of tones) {
      expect(alertToneStyles[tone]).toBeDefined()
    }
  })

  it('each tone has background, border, and color', () => {
    for (const tone of tones) {
      const style = alertToneStyles[tone]
      expect(style.background).toMatch(/^var\(--ig-/)
      expect(style.border).toMatch(/^var\(--ig-/)
      expect(style.color).toMatch(/^var\(--ig-/)
    }
  })
})
