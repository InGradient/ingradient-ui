import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconButton } from '../inputs/icon-button'
import { NotificationBadge } from './notification-badge'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Feedback/NotificationBadge',
  component: NotificationBadge,
  tags: ['autodocs'],
  parameters: {
    a11y: {
      test: 'todo',
    },
  },
} satisfies Meta<typeof NotificationBadge>

export default meta

type Story = StoryObj<typeof meta>

export const Review: Story = {
  args: {
    children: null,
  },
  render: () => (
    <StorybookPage
      title="NotificationBadge"
      description="NotificationBadge attaches unread or pending counters to compact triggers without changing the underlying trigger component."
    >
      <StorybookSection
        title="Compact trigger review"
        description="Review accent and danger usage on icon-sized controls."
      >
        <StorybookGrid columns="repeat(auto-fit, minmax(220px, 1fr))">
          <StorybookCard title="Danger tone" subtitle="urgent count">
            <NotificationBadge value="9" tone="danger">
              <IconButton variant="secondary" aria-label="Notifications">
                <span aria-hidden>🔔</span>
              </IconButton>
            </NotificationBadge>
          </StorybookCard>
          <StorybookCard title="Accent tone" subtitle="supporting status">
            <NotificationBadge value="2" tone="accent">
              <IconButton variant="secondary" aria-label="Pending items">
                <span aria-hidden>✓</span>
              </IconButton>
            </NotificationBadge>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
