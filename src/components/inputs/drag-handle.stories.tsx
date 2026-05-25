import type { Meta, StoryObj } from '@storybook/react-vite'
import { DragHandle } from './drag-handle'

const meta = {
  title: 'Components/Inputs/DragHandle',
  component: DragHandle,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div
        style={{
          width: 240,
          height: 80,
          background: 'var(--ig-color-surface-panel)',
          border: '1px solid var(--ig-color-border-subtle)',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: 12,
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DragHandle>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const CustomLabel: Story = {
  args: { ariaLabel: 'Drag Class distribution', title: 'Drag Class distribution' },
}
