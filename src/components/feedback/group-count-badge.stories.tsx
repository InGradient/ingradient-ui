import type { Meta, StoryObj } from '@storybook/react-vite'
import { GroupCountBadge } from './group-count-badge'
import { Inline, Stack } from '../../primitives'

const meta: Meta<typeof GroupCountBadge> = {
  title: 'Components/Feedback/GroupCountBadge',
  component: GroupCountBadge,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof meta>

export const Sizes: Story = {
  render: () => (
    <Stack gap={3}>
      <Inline gap={3} align="center">
        <GroupCountBadge count={2} size="sm" />
        <GroupCountBadge count={5} size="sm" />
        <GroupCountBadge count={42} size="sm" />
      </Inline>
      <Inline gap={3} align="center">
        <GroupCountBadge count={2} />
        <GroupCountBadge count={5} />
        <GroupCountBadge count={42} />
        <GroupCountBadge count={120} />
        <GroupCountBadge count={1500} />
        <GroupCountBadge count={12000} />
      </Inline>
    </Stack>
  ),
}

export const Single: Story = { args: { count: 3 } }
export const Large: Story = { args: { count: 1234 } }
export const NoBadgeWhenOne: Story = { args: { count: 1 } }
