import type { Meta, StoryObj } from '@storybook/react-vite'
import { LabelValueRow } from './label-value-row'
import { Badge } from '../../components/feedback/badge'
import { Button } from '../../components/inputs/button'
import { Switch } from '../../components/inputs/toggles'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Patterns/Cards/LabelValueRow',
  component: LabelValueRow,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof LabelValueRow>

export default meta

type Story = StoryObj<typeof meta>

export const Review: Story = {
  args: { title: 'Title' },
  render: () => (
    <StorybookPage
      title="LabelValueRow"
      description="Two-column row: title + description (+ optional meta) on left, control on right. Use for settings-style toggle/dropdown lists, role assignment lists, etc."
    >
      <StorybookSection title="Variants">
        <StorybookGrid columns="1fr">
          <StorybookCard title="Title + description + Switch control">
            <LabelValueRow
              title="Auto-sync new captures"
              description="Automatically upload images to platform when captured."
              control={<Switch defaultChecked aria-label="Auto-sync new captures" />}
            />
          </StorybookCard>
          <StorybookCard title="Title + meta + Button control">
            <LabelValueRow
              title="Owner"
              meta={<Badge $tone="accent">Admin</Badge>}
              description="Has full access to project settings and members."
              control={<Button size="sm" variant="secondary">Change owner</Button>}
            />
          </StorybookCard>
          <StorybookCard title="Title only" subtitle="no description, simple row">
            <LabelValueRow
              title="Notifications"
              control={<Switch aria-label="Notifications" />}
            />
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
