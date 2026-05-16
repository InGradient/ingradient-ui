import type { Meta, StoryObj } from '@storybook/react-vite'
import { HoverPreview } from './hover-preview'
import { Card } from '../../components'
import { Stack, Inline } from '../../primitives'

const meta: Meta<typeof HoverPreview> = {
  title: 'Patterns/HoverPreview',
  component: HoverPreview,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {
  render: () => (
    <Inline gap={4}>
      <HoverPreview preview={<div style={{ width: 200, height: 200, background: 'var(--ig-color-accent-soft-surface)', borderRadius: 'var(--ig-radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Preview content</div>}>
        <Card>
          <div style={{ padding: 'var(--ig-space-5)' }}>Hover me (right)</div>
        </Card>
      </HoverPreview>
      <HoverPreview placement="bottom" preview={<div>Bottom preview</div>}>
        <Card>
          <div style={{ padding: 'var(--ig-space-5)' }}>Hover me (bottom)</div>
        </Card>
      </HoverPreview>
    </Inline>
  ),
}

export const NoDelay: Story = {
  render: () => (
    <HoverPreview delay={0} preview={<div>Instant preview</div>}>
      <Card>
        <div style={{ padding: 'var(--ig-space-5)' }}>Hover me (no delay)</div>
      </Card>
    </HoverPreview>
  ),
}

export const Disabled: Story = {
  render: () => (
    <Stack gap={3}>
      <span style={{ color: 'var(--ig-color-text-muted)', fontSize: 'var(--ig-font-size-xs)' }}>disabled — no preview on hover</span>
      <HoverPreview disabled preview={<div>Should never appear</div>}>
        <Card>
          <div style={{ padding: 'var(--ig-space-5)' }}>Hover me</div>
        </Card>
      </HoverPreview>
    </Stack>
  ),
}
