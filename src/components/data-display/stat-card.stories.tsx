import type { Meta, StoryObj } from '@storybook/react-vite'
import { StatCard } from './stat-card'
import { Badge } from '../feedback/badge'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Data Display/StatCard',
  component: StatCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'todo' },
  },
} satisfies Meta<typeof StatCard>

export default meta

type Story = StoryObj<typeof meta>

export const Review: Story = {
  args: { label: 'Stat', value: '0' },
  render: () => (
    <StorybookPage
      title="StatCard"
      description="Single-metric card with label, large value, and optional hint + meta. Use for dashboard KPIs and summary panels. (StatCard is also exported as MetricCard for legacy use.)"
    >
      <StorybookSection title="Variants">
        <StorybookGrid columns="repeat(auto-fit, minmax(220px, 1fr))">
          <StorybookCard title="Number value">
            <StatCard label="Total images" value="12,450" />
          </StorybookCard>
          <StorybookCard title="With hint">
            <StatCard label="Datasets" value="42" hint="+3 this week" />
          </StorybookCard>
          <StorybookCard title="With meta">
            <StatCard
              label="Sync rate"
              value="98.5%"
              meta={<Badge $tone="success">Healthy</Badge>}
            />
          </StorybookCard>
          <StorybookCard title="Full">
            <StatCard
              label="Images today"
              value="284"
              hint="vs 312 yesterday"
              meta={<Badge $tone="warning">-9%</Badge>}
            />
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="Dashboard layout" description="Multiple cards in a row.">
        <StorybookGrid columns="repeat(auto-fit, minmax(180px, 1fr))">
          <StatCard label="Datasets" value="42" />
          <StatCard label="Images" value="12.4k" hint="this month" />
          <StatCard label="Active users" value="8" meta={<Badge $tone="accent">live</Badge>} />
          <StatCard label="Storage used" value="248 GB" hint="of 1 TB" />
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
