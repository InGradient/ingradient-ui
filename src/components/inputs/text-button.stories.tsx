import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChevronDown, Plus } from 'lucide-react'
import { TextButton } from './text-button'

const meta = {
  title: 'Components/Inputs/TextButton',
  component: TextButton,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof TextButton>

export default meta

type Story = StoryObj<typeof meta>

export const AccentSm: Story = {
  args: { tone: 'accent', size: 'sm', children: 'Select all' },
}

export const AccentXs: Story = {
  args: { tone: 'accent', size: 'xs', children: 'Reset' },
}

export const Muted: Story = {
  args: { tone: 'muted', size: 'xs', children: 'Deselect all' },
}

export const WithLeadingIcon: Story = {
  args: {
    tone: 'accent',
    size: 'sm',
    iconLeading: <ChevronDown size={14} />,
    children: 'Show details',
  },
}

export const WithTrailingIcon: Story = {
  args: {
    tone: 'accent',
    size: 'sm',
    iconTrailing: <Plus size={14} />,
    children: 'Add item',
  },
}

export const Disabled: Story = {
  args: { tone: 'accent', size: 'sm', disabled: true, children: 'Disabled' },
}
