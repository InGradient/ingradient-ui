import type { Meta, StoryObj } from '@storybook/react-vite'
import { Textarea } from './textarea'

const meta = {
  title: 'Components/Inputs/Textarea',
  component: Textarea,
  parameters: { layout: 'centered' },
  decorators: [(Story) => <div style={{ width: 360 }}><Story /></div>],
} satisfies Meta<typeof Textarea>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { placeholder: 'Add a comment…' },
}

export const Monospace: Story = {
  args: {
    variant: 'monospace',
    minHeight: 72,
    readOnly: true,
    value: 'TOKEN-aB3cD4eF5gH6iJ7kL8mN9oP0qR1sT2uV3wX4yZ5',
  },
}

export const LargerMinHeight: Story = {
  args: {
    minHeight: 120,
    placeholder: 'Multi-line description…',
  },
}

export const Disabled: Story = {
  args: { placeholder: 'Disabled', disabled: true },
}
