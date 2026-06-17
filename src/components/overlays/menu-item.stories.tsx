import type { Meta, StoryObj } from '@storybook/react-vite'
import { Trash2 } from 'lucide-react'
import { MenuItem } from './menu-item'

const meta = {
  title: 'Components/Overlays/MenuItem',
  component: MenuItem,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div
        style={{
          width: 240,
          padding: 'var(--ig-space-2)',
          background: 'var(--ig-color-surface-raised)',
          border: '1px solid var(--ig-color-border-strong)',
          borderRadius: 'var(--ig-radius-md)',
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MenuItem>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { children: 'Rename' },
}

export const Active: Story = {
  args: { active: true, children: 'Selected option', 'aria-selected': true },
}

export const Danger: Story = {
  args: {
    tone: 'danger',
    iconLeading: <Trash2 size={14} />,
    children: 'Delete',
  },
}

export const SizeMd: Story = {
  args: { size: 'md', children: 'Open in new tab' },
}

export const Disabled: Story = {
  args: { disabled: true, children: 'Unavailable' },
}
