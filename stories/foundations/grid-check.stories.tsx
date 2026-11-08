import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { findOffGridBoxes, gridCheckAfterEach } from '../support/grid-check'

/**
 * Proves the 4px grid check that runs after every Platform 0.0.1 / Edge 0.0.6 page story:
 * it must report the known-bad boxes and stay quiet on the on-grid and exempt ones.
 * The automatic check is off here because this story renders off-grid boxes on purpose.
 */
const meta = {
  title: 'Foundations/4px Grid Check',
  parameters: { layout: 'padded', grid4px: 'off' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const box = {
  border: 'var(--ig-border-1px) solid var(--ig-color-border-subtle)',
  borderRadius: 'var(--ig-radius-xs)',
  fontSize: 'var(--ig-font-size-sm)',
  lineHeight: 'var(--ig-leading-sm)',
  width: 'var(--ig-popup-xs)',
} as const

const spin = `@keyframes grid-check-spin { to { transform: rotate(360deg) } }`

export const Cases: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 'var(--ig-spacing-16)' }}>
      <style>{spin}</style>
      {/* Off-grid: the 1px border adds to 16px padding + 20px line = 54px. */}
      <div style={{ ...box, padding: 'var(--ig-spacing-16)' }}>bad border</div>
      {/* Off-grid: two lines with a 2px gap, 20 + 2 + 16 = 38px inside an inset box. */}
      <div style={{ ...box, padding: 'calc(var(--ig-spacing-8) - var(--ig-border-1px))', display: 'flex', flexDirection: 'column', gap: 'var(--ig-spacing-2)' }}>
        <span>bad gap</span>
        <span style={{ fontSize: 'var(--ig-font-size-xs)', lineHeight: 'var(--ig-leading-xs)' }}>meta</span>
      </div>
      {/* On grid: padding gives the border back, 15 + 1 + 20 + 1 + 15 = 52px. */}
      <div style={{ ...box, padding: 'calc(var(--ig-spacing-16) - var(--ig-border-1px))' }}>good inset</div>
      {/* Exempt: a rotating box changes its bounding size every frame. */}
      <div style={{ ...box, height: 'var(--ig-spacing-20)', width: 'var(--ig-spacing-20)', animation: 'grid-check-spin 1s linear infinite' }} aria-label="exempt spinner" />
      {/* Exempt: height follows the width through an aspect-ratio child. */}
      <div style={{ ...box, padding: 'var(--ig-spacing-4)' }} aria-label="exempt fluid">
        <div style={{ aspectRatio: '3 / 1.07', background: 'var(--ig-color-surface-muted)' }} />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const found = findOffGridBoxes(canvasElement).map((i) => i.text)
    await expect(found).toContain('bad border')
    await expect(found.some((t) => t.startsWith('bad gap'))).toBe(true)
    await expect(found).not.toContain('good inset')
    await expect(found).not.toContain('exempt spinner')
    await expect(found).not.toContain('exempt fluid')
    // The preview hook fails a checked page story with these boxes and skips an opted-out one.
    await expect(gridCheckAfterEach({ title: 'Pages/Platform/0.0.1/Probe', parameters: {}, canvasElement })).rejects.toThrow(/off the 4px grid/)
    await expect(gridCheckAfterEach({ title: 'Pages/Platform/0.0.1/Probe', parameters: { grid4px: 'off' }, canvasElement })).resolves.toBeUndefined()
  },
}
