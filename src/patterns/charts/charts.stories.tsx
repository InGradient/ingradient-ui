import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { BarChartCard } from './bar-chart-card'
import { LineChartCard } from './line-chart-card'
import { PieChartCard } from './pie-chart-card'
import { buildChartData, resolveReviewScale, type ReviewScale } from '@storybook-support/../builders/review-builders'
import { StorybookCard, StorybookGrid, StorybookMetaBar, StorybookPage, StorybookSection, StorybookStack } from '@storybook-support/storybook-layout'

type ChartsStoryArgs = {
  dataset: ReviewScale | 'auto'
}

const meta = {
  title: 'Patterns/Charts/Overview',
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
      test: 'error',
    },
  },
} satisfies Meta<ChartsStoryArgs>

export default meta

type Story = StoryObj<ChartsStoryArgs>

const keyboardPointData = [
  { period: 'Mon', reviewed: 24, approved: 18 },
  { period: 'Tue', reviewed: 31, approved: 21 },
  { period: 'Wed', reviewed: 28, approved: 25 },
]

function KeyboardDataAccessDemo() {
  const [selectedPoint, setSelectedPoint] = React.useState<string | null>(null)

  return (
    <StorybookStack gap={12}>
      <LineChartCard
        title="Weekly review throughput"
        description="Keyboard users can access the same data through a screen-reader table and select a point with Enter or Space."
        data={keyboardPointData}
        xKey="period"
        series={[
          { key: 'reviewed', label: 'Reviewed' },
          { key: 'approved', label: 'Approved' },
        ]}
        onPointClick={(entry) => setSelectedPoint(`${entry.period}: ${entry.reviewed} reviewed, ${entry.approved} approved`)}
      />
      <p aria-live="polite">
        {selectedPoint ? `Selected: ${selectedPoint}` : 'No data point selected.'}
      </p>
    </StorybookStack>
  )
}

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
          <StorybookGrid columns="repeat(auto-fit, minmax(var(--ig-popup-md), 1fr))">
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
        <StorybookSection
          title="State variants"
          description="Loading skeletons, empty data, and compact summaries side by side for visual review."
        >
          <StorybookGrid columns="repeat(auto-fit, minmax(var(--ig-popup-sm), 1fr))">
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
        </StorybookSection>
      </StorybookPage>
    )
  },
}

export const KeyboardDataAccess: Story = {
  render: () => (
    <StorybookPage
      title="Chart keyboard data access"
      description="Interactive line charts expose an equivalent, visually-hidden data table. Screen-reader and keyboard users can focus a row and press Enter or Space to trigger the same point-selection callback as a pointer click."
    >
      <StorybookSection
        title="Interactive point selection"
        description="Tab to a data row with assistive technology, then press Enter or Space. The status message confirms the selected point."
      >
        <StorybookGrid columns="1fr">
          <StorybookCard title="LineChartCard" subtitle="onPointClick + accessible data table">
            <KeyboardDataAccessDemo />
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
  play: async ({ canvas, userEvent }) => {
    const rows = canvas.getAllByRole('row')
    const firstDataRow = rows[1]
    firstDataRow.focus()
    await userEvent.keyboard('{Enter}')
    await expect(canvas.getByText('Selected: Mon: 24 reviewed, 18 approved')).toBeInTheDocument()
  },
}
