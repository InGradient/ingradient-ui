import type { Meta, StoryObj } from '@storybook/react-vite'
import { AssignmentRow } from './assignment-row'
import { Badge } from '../feedback/badge'
import { Button } from '../inputs/button'
import { Switch } from '../inputs/toggles'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Data Display/AssignmentRow',
  component: AssignmentRow,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'todo' },
  },
} satisfies Meta<typeof AssignmentRow>

export default meta

type Story = StoryObj<typeof meta>

export const Review: Story = {
  args: { title: 'Title' },
  render: () => (
    <StorybookPage
      title="AssignmentRow"
      description="Two-column row: title + description (+ optional meta) on left, control on right. Use for settings-style toggle/dropdown lists, role assignment lists, etc."
    >
      <StorybookSection title="Variants">
        <StorybookGrid columns="1fr">
          <StorybookCard title="Title + description + Switch control">
            <AssignmentRow
              title="Auto-sync new captures"
              description="Automatically upload images to platform when captured."
              control={<Switch defaultChecked />}
            />
          </StorybookCard>
          <StorybookCard title="Title + meta + Button control">
            <AssignmentRow
              title="Owner"
              meta={<Badge $tone="accent">Admin</Badge>}
              description="Has full access to project settings and members."
              control={<Button size="sm" variant="secondary">Change owner</Button>}
            />
          </StorybookCard>
          <StorybookCard title="Title only" subtitle="no description, simple row">
            <AssignmentRow
              title="Notifications"
              control={<Switch />}
            />
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
