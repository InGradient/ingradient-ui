import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar, Badge, Chip } from './badge'
import { StatusPill } from './status'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Feedback/Avatar And Badge',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: {
      test: 'todo',
    },
  },
} satisfies Meta<typeof Avatar>

export default meta

type Story = StoryObj<typeof meta>

export const Review: Story = {
  args: {
    initials: 'IG',
  },
  render: () => (
    <StorybookPage
      title="Avatar And Badge"
      description="Identity and metadata surfaces should be reviewed as one family so teams can choose between Avatar, Badge, Chip, and StatusPill intentionally."
    >
      <StorybookSection
        title="Identity and metadata review"
        description="Compare neutral metadata, semantic status, and identity markers in one place."
      >
        <StorybookGrid columns="repeat(auto-fit, minmax(240px, 1fr))">
          <StorybookCard title="Avatar" subtitle="identity marker">
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <Avatar initials="JK" />
              <Avatar initials="MP" size={44} />
              <Avatar src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%234d88ff'/%3E%3Ctext x='40' y='48' text-anchor='middle' font-size='24' fill='white'%3EIG%3C/text%3E%3C/svg%3E" alt="Ingradient" />
            </div>
          </StorybookCard>

          <StorybookCard title="Badge and Chip" subtitle="neutral and highlighted metadata">
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <Badge>Default</Badge>
              <Badge $tone="accent">Accent</Badge>
              <Badge $tone="success">Stable</Badge>
              <Chip>Design System</Chip>
              <Chip $tone="warning">Pending</Chip>
            </div>
          </StorybookCard>

          <StorybookCard title="StatusPill" subtitle="semantic state">
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <StatusPill $tone="running">Running</StatusPill>
              <StatusPill $tone="completed">Completed</StatusPill>
              <StatusPill $tone="warning">Warning</StatusPill>
              <StatusPill $tone="failed">Failed</StatusPill>
            </div>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
