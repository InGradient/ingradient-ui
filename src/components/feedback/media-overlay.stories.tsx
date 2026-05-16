import type { Meta, StoryObj } from '@storybook/react-vite'
import { MediaOverlay } from './media-overlay'
import { Inline } from '../../primitives'

const meta: Meta<typeof MediaOverlay> = {
  title: 'Components/Feedback/MediaOverlay',
  component: MediaOverlay,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ position: 'relative', width: 220, height: 160, background: 'var(--ig-color-surface-panel)', borderRadius: 'var(--ig-radius-md)', overflow: 'hidden' }}>
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof meta>

export const Archived: Story = { args: { variant: 'archived' } }
export const Processing: Story = { args: { variant: 'processing' } }
export const CustomLabel: Story = { args: { variant: 'processing', label: 'Uploading…' } }

export const SideBySide: Story = {
  decorators: [],
  render: () => (
    <Inline gap={4}>
      <div style={{ position: 'relative', width: 220, height: 160, background: 'var(--ig-color-surface-panel)', borderRadius: 'var(--ig-radius-md)', overflow: 'hidden' }}>
        <MediaOverlay variant="archived" />
      </div>
      <div style={{ position: 'relative', width: 220, height: 160, background: 'var(--ig-color-surface-panel)', borderRadius: 'var(--ig-radius-md)', overflow: 'hidden' }}>
        <MediaOverlay variant="processing" />
      </div>
    </Inline>
  ),
}
