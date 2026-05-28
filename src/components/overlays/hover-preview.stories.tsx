import type { Meta, StoryObj } from '@storybook/react-vite'
import { HoverPreview } from './hover-preview'
import { Card } from '../data-display/card'
import { Stack, Inline } from '../../primitives'

const meta: Meta<typeof HoverPreview> = {
  title: 'Components/Overlays/HoverPreview',
  component: HoverPreview,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof meta>

// transform: translateZ(0) → fixed preview 가 wrapper 안에 contained.
// production 에서는 viewport-fixed 라 hovered target 옆 viewport 어디든 떠도 OK.
// 단 storybook 에서는 panel 크기에 따라 preview 가 화면 밖으로 나갈 수 있어 wrapper 안으로 가두는 게 demo 에 자연스러움.
const DEMO_WRAPPER_STYLE: React.CSSProperties = {
  position: 'relative',
  transform: 'translateZ(0)',
  minHeight: 320,
  padding: 24,
  border: '1px dashed var(--ig-color-border-subtle)',
  borderRadius: 12,
}

export const Basic: Story = {
  render: () => (
    <div style={DEMO_WRAPPER_STYLE}>
      <Inline gap={4}>
        <HoverPreview preview={<div style={{ width: 200, height: 200, background: 'var(--ig-color-accent-soft-surface)', borderRadius: 'var(--ig-radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Preview content</div>}>
          <Card>
            <div style={{ padding: 'var(--ig-space-5)' }}>Hover me (right)</div>
          </Card>
        </HoverPreview>
        <HoverPreview placement="bottom" preview={<div style={{ padding: 'var(--ig-space-4)', background: 'var(--ig-color-accent-soft-surface)', borderRadius: 'var(--ig-radius-md)' }}>Bottom preview</div>}>
          <Card>
            <div style={{ padding: 'var(--ig-space-5)' }}>Hover me (bottom)</div>
          </Card>
        </HoverPreview>
      </Inline>
    </div>
  ),
}

export const NoDelay: Story = {
  render: () => (
    <div style={DEMO_WRAPPER_STYLE}>
      <HoverPreview delay={0} preview={<div style={{ padding: 'var(--ig-space-4)', background: 'var(--ig-color-accent-soft-surface)', borderRadius: 'var(--ig-radius-md)' }}>Instant preview</div>}>
        <Card>
          <div style={{ padding: 'var(--ig-space-5)' }}>Hover me (no delay)</div>
        </Card>
      </HoverPreview>
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div style={DEMO_WRAPPER_STYLE}>
      <Stack gap={3}>
        <span style={{ color: 'var(--ig-color-text-muted)', fontSize: 'var(--ig-font-size-xs)' }}>disabled — no preview on hover</span>
        <HoverPreview disabled preview={<div>Should never appear</div>}>
          <Card>
            <div style={{ padding: 'var(--ig-space-5)' }}>Hover me</div>
          </Card>
        </HoverPreview>
      </Stack>
    </div>
  ),
}
