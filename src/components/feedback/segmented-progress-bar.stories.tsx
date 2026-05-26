import type { Meta, StoryObj } from '@storybook/react-vite'
import { SegmentedProgressBar } from './segmented-progress-bar'

const meta: Meta<typeof SegmentedProgressBar> = {
  title: 'Components/Feedback/SegmentedProgressBar',
  component: SegmentedProgressBar,
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div style={{ width: 360 }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

export const PendingVsProcessed: Story = {
  args: {
    segments: [
      { label: 'Processed', value: 892, color: 'var(--ig-color-success)' },
      { label: 'Pending', value: 321, color: 'var(--ig-color-warning)' },
    ],
  },
}

export const ThreeSegments: Story = {
  args: {
    segments: [
      { label: 'Labeled', value: 600, color: 'var(--ig-color-success)' },
      { label: 'Reviewing', value: 250, color: 'var(--ig-color-accent)' },
      { label: 'Pending', value: 150, color: 'var(--ig-color-warning)' },
    ],
  },
}
