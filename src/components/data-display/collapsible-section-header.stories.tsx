import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Badge } from '../feedback/badge'
import { CollapsibleSectionHeader } from './collapsible-section-header'

const meta = {
  title: 'Components/Data Display/CollapsibleSectionHeader',
  component: CollapsibleSectionHeader,
  parameters: { layout: 'centered' },
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>],
} satisfies Meta<typeof CollapsibleSectionHeader>

export default meta

type Story = StoryObj<typeof meta>

export const Closed: Story = {
  args: { title: 'Comments', open: false, onClick: () => {} },
}

export const OpenWithBadge: Story = {
  args: {
    title: 'Labelers',
    open: true,
    onClick: () => {},
    badge: <Badge $tone="accent">3</Badge>,
  },
}

export const Interactive: Story = {
  args: { title: 'Click to toggle', open: false, onClick: () => {} },
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <CollapsibleSectionHeader
        title="Click to toggle"
        open={open}
        onClick={() => setOpen((v) => !v)}
        badge={<Badge $tone={open ? 'accent' : 'neutral'}>{open ? 'open' : 'closed'}</Badge>}
      />
    )
  },
}
