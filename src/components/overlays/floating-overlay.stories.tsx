import type { Meta, StoryObj } from '@storybook/react-vite'
import { FloatingOverlay } from './floating-overlay'

const meta = {
  title: 'Components/Overlays/FloatingOverlay',
  component: FloatingOverlay,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div
        style={{
          position: 'relative',
          height: 360,
          padding: 40,
          background: 'var(--ig-color-bg-canvas)',
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FloatingOverlay>

export default meta

type Story = StoryObj<typeof meta>

export const Tooltip: Story = {
  args: {
    variant: 'tooltip',
    top: 60,
    left: 60,
    style: { padding: 'var(--ig-space-3)', maxWidth: 240 },
    children: 'pointer-events: none / z-tooltip — hover preview / class hover card 같은 곳에서 사용',
  },
}

export const Menu: Story = {
  args: {
    variant: 'menu',
    top: 60,
    left: 60,
    style: { padding: 'var(--ig-space-2)', minWidth: 220 },
    children: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ig-space-1)' }}>
        <div style={{ padding: 'var(--ig-space-2) var(--ig-space-5)' }}>Menu item 1</div>
        <div style={{ padding: 'var(--ig-space-2) var(--ig-space-5)' }}>Menu item 2</div>
        <div style={{ padding: 'var(--ig-space-2) var(--ig-space-5)' }}>Menu item 3</div>
      </div>
    ),
  },
}
