import type { Meta, StoryObj } from '@storybook/react-vite'
import { BarChartCard } from './bar-chart-card'
import { LineChartCard } from './line-chart-card'
import { PieChartCard } from './pie-chart-card'
import { buildChartData, resolveReviewScale, type ReviewScale } from '@storybook-support/../builders/review-builders'
import { StorybookCard, StorybookGrid, StorybookMetaBar, StorybookPage, StorybookSection, StorybookStack } from '@storybook-support/storybook-layout'

type ChartsStoryArgs = {
  dataset: ReviewScale | 'auto'
}

const meta = {
  title: 'Components/Charts/Overview',
  tags: ['autodocs'],
  args: {
    dataset: 'auto',
  },
  argTypes: {
    dataset: {
      control: 'inline-radio',
      options: ['auto', 'sparse', 'realistic', 'overloaded'],
    },
  },
  parameters: {
    layout: 'fullscreen',
    a11y: {
      test: 'todo',
    },
  },
} satisfies Meta<ChartsStoryArgs>

export default meta

type Story = StoryObj<ChartsStoryArgs>

export const Review: Story = {
  render: (args, context) => {
    const scale = args.dataset === 'auto' ? resolveReviewScale(context.globals.dataScale) : args.dataset
    const { trend, pipeline, distribution } = buildChartData(scale)

    return (
      <StorybookPage
        title="Chart Cards"
        description="Chart primitives should be reviewed as reusable cards with consistent shell, legend, tooltip, empty state, and loading behavior."
        meta={
          <StorybookMetaBar
            items={[
              { label: 'stable', tone: 'success' },
              { label: `${scale} data`, tone: scale === 'overloaded' ? 'warning' : 'neutral' },
              { label: 'visual-baseline', tone: 'accent' },
            ]}
          />
        }
      >
        <StorybookSection
          title="Operational dashboard review"
          description="Compare line, bar, and pie cards under the same shell before wiring them into a page-level dashboard."
        >
          <StorybookGrid columns="repeat(auto-fit, minmax(320px, 1fr))">
            <LineChartCard
              title="Weekly review throughput"
              description="Reviewed vs approved items across the working week."
              data={trend}
              xKey="period"
              series={[
                { key: 'reviewed', label: 'Reviewed' },
                { key: 'approved', label: 'Approved' },
              ]}
            />
            <BarChartCard
              title="Pipeline volume"
              description="Count of items in each pipeline stage."
              data={pipeline}
              xKey="stage"
              series={[{ key: 'items', label: 'Items' }]}
            />
            <PieChartCard
              title="Current status share"
              description="Share of active work by current status."
              data={distribution}
            />
          </StorybookGrid>
        </StorybookSection>
      </StorybookPage>
    )
  },
}

export const States: Story = {
  render: (args, context) => {
    const scale = args.dataset === 'auto' ? resolveReviewScale(context.globals.dataScale) : args.dataset
    const { distribution } = buildChartData(scale)

    return (
      <StorybookPage
        title="Chart States"
        description="Loading and empty states are first-class chart states and should be visible in Storybook, not hidden in app-only code."
      >
        <StorybookGrid columns="repeat(auto-fit, minmax(280px, 1fr))">
          <StorybookCard title="Loading line chart" subtitle="skeleton-like waiting state">
            <LineChartCard
              title="Weekly review throughput"
              description="Loading state"
              data={[]}
              xKey="period"
              series={[
                { key: 'reviewed', label: 'Reviewed' },
                { key: 'approved', label: 'Approved' },
              ]}
              loading
              height={220}
            />
          </StorybookCard>
          <StorybookCard title="Empty bar chart" subtitle="no rows returned yet">
            <BarChartCard
              title="Pipeline volume"
              description="Empty state"
              data={[]}
              xKey="stage"
              series={[{ key: 'items', label: 'Items' }]}
              height={220}
            />
          </StorybookCard>
          <StorybookCard title="Compact pie chart" subtitle="summary widget size">
            <StorybookStack gap={12}>
              <PieChartCard
                title="Current status share"
                description="Compact summary"
                data={distribution}
                height={220}
              />
            </StorybookStack>
          </StorybookCard>
        </StorybookGrid>
      </StorybookPage>
    )
  },
}
