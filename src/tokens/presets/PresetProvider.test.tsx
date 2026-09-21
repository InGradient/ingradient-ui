import React from 'react'
import { createPortal } from 'react-dom'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { PresetProvider } from './PresetProvider'
import { edgeV001 } from './edge'
import { medicalV001 } from './medical'
import { platformV001 } from './platform'
import type { DensityId } from './types'

const root = document.documentElement
const heights = () => ['sm', 'md', 'lg'].map((size) => root.style.getPropertyValue(`--ig-control-height-${size}`))
afterEach(cleanup)

describe('single-document preset scope', () => {
  it.each([edgeV001, platformV001, medicalV001])('applies and cleans up $id metadata', (preset) => {
    const { unmount } = render(<PresetProvider preset={preset}><span>Story</span></PresetProvider>)
    expect(root).toHaveAttribute('data-ig-preset', preset.id)
    expect(root).toHaveAttribute('data-ig-service', preset.service)
    expect(root).toHaveAttribute('data-ig-version', '0.0.1')
    expect(root).toHaveAttribute('data-ig-density', preset.density)
    expect(root).toHaveAttribute('data-theme', preset.mode)
    unmount()
    expect(root).not.toHaveAttribute('data-ig-preset')
    expect(heights()).toEqual(['', '', ''])
  })

  it.each<[DensityId, string[]]>([
    ['compact', ['28px', '32px', '40px']],
    ['comfortable', ['32px', '36px', '44px']],
    ['ultra-dense', ['24px', '28px', '32px']],
  ])('applies %s on both preset and no-preset documents', (density, expected) => {
    const { rerender } = render(<PresetProvider preset={edgeV001} densityOverride={density}>Story</PresetProvider>)
    expect(heights()).toEqual(expected)
    expect(root).toHaveAttribute('data-ig-density', density)
    rerender(<PresetProvider densityOverride={density} modeOverride="light">Sandbox</PresetProvider>)
    expect(heights()).toEqual(expected)
    expect(root).not.toHaveAttribute('data-ig-preset')
    expect(root).toHaveAttribute('data-theme', 'light')
    rerender(<PresetProvider>Default sandbox</PresetProvider>)
    expect(heights()).toEqual(['', '', ''])
    expect(root).not.toHaveAttribute('data-ig-density')
    expect(root).toHaveAttribute('data-theme', 'dark')
  })

  it('restores preset density after a toolbar override is removed', () => {
    const { rerender } = render(<PresetProvider preset={edgeV001} densityOverride="comfortable">Story</PresetProvider>)
    rerender(<PresetProvider preset={edgeV001}>Story</PresetProvider>)
    expect(heights()).toEqual(['28px', '32px', '40px'])
    expect(root).toHaveAttribute('data-ig-density', 'compact')
  })

  it('puts tokens on the common ancestor of story and body portal, not a wrapper', () => {
    const { container } = render(<PresetProvider preset={edgeV001}>
      <span>Story</span>{createPortal(<div role="dialog">Portal</div>, document.body)}
    </PresetProvider>)
    expect(container).not.toContainElement(screen.getByRole('dialog'))
    expect(root).toContainElement(container)
    expect(root).toContainElement(screen.getByRole('dialog'))
    expect(heights()).toEqual(['28px', '32px', '40px'])
    // Actual computed CSS inheritance is verified by tests/probes/edge.mjs, not jsdom.
  })
})
