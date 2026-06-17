import type { Meta, StoryObj } from '@storybook/react-vite'
import { Bar, BarChart, CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartContainer } from './chart-container'
import { ChartLegend } from '../../components/charts/chart-legend'
import { ChartResponsive } from '../../components/charts/chart-responsive'
import { ChartTooltipContent } from '../../components/charts/chart-tooltip'
import { chartPalette } from '../../components/charts/types'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Patterns/Charts/ChartContainer',
  component: ChartContainer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof ChartContainer>

export default meta

type Story = StoryObj<typeof meta>

const trendData = [
  { period: 'Mon', value: 380 },
  { period: 'Tue', value: 520 },
  { period: 'Wed', value: 470 },
  { period: 'Thu', value: 610 },
  { period: 'Fri', value: 580 },
  { period: 'Sat', value: 320 },
  { period: 'Sun', value: 410 },
]

const syncBreakdown = [
  { day: 'Mon', synced: 320, pending: 40, failed: 8 },
  { day: 'Tue', synced: 410, pending: 28, failed: 4 },
  { day: 'Wed', synced: 380, pending: 56, failed: 12 },
  { day: 'Thu', synced: 460, pending: 22, failed: 6 },
  { day: 'Fri', synced: 510, pending: 31, failed: 9 },
  { day: 'Sat', synced: 290, pending: 14, failed: 3 },
  { day: 'Sun', synced: 340, pending: 18, failed: 5 },
]

const sampleLegend = [
  { label: 'Synced', color: 'var(--ig-color-success)' },
  { label: 'Pending', color: 'var(--ig-color-warning)' },
  { label: 'Failed', color: 'var(--ig-color-danger)' },
]

function SampleLineChart({ height }: { height: number }) {
  return (
    <ChartResponsive height={height}>
      {({ width, height: h }) => (
        <LineChart width={width} height={h} data={trendData}>
          <CartesianGrid stroke="var(--ig-color-chart-grid)" strokeDasharray="3 3" />
          <XAxis dataKey="period" stroke="var(--ig-color-text-soft)" tickLine={false} axisLine={false} />
          <YAxis stroke="var(--ig-color-text-soft)" tickLine={false} axisLine={false} />
          <Tooltip content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey="value"
            name="Captures"
            stroke={chartPalette[0]}
            strokeWidth={2.4}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      )}
    </ChartResponsive>
  )
}

function SampleStackedBar({ height }: { height: number }) {
  return (
    <ChartResponsive height={height}>
      {({ width, height: h }) => (
        <BarChart width={width} height={h} data={syncBreakdown}>
          <CartesianGrid stroke="var(--ig-color-chart-grid)" strokeDasharray="3 3" />
          <XAxis dataKey="day" stroke="var(--ig-color-text-soft)" tickLine={false} axisLine={false} />
          <YAxis stroke="var(--ig-color-text-soft)" tickLine={false} axisLine={false} />
          <Tooltip content={<ChartTooltipContent />} />
          <Bar dataKey="synced" name="Synced" stackId="a" fill="var(--ig-color-success)" />
          <Bar dataKey="pending" name="Pending" stackId="a" fill="var(--ig-color-warning)" />
          <Bar dataKey="failed" name="Failed" stackId="a" fill="var(--ig-color-danger)" />
        </BarChart>
      )}
    </ChartResponsive>
  )
}

export const Review: Story = {
  args: { title: 'Container', children: null },
  render: () => (
    <StorybookPage
      title="ChartContainer"
      description="Chart shell with title, description, height, optional legend slot, and loading/empty states. Use as wrapper around recharts (or any visualization) for consistent presentation."
    >
      <StorybookSection title="Basic" description="Title + description + chart area.">
        <StorybookGrid columns="1fr">
          <StorybookCard title="Default (height=260)">
            <ChartContainer
              title="Capture volume"
              description="Daily image capture trend across all datasets."
            >
              <SampleLineChart height={260} />
            </ChartContainer>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="With legend" description="Legend slot in header (right-aligned).">
        <StorybookGrid columns="1fr">
          <StorybookCard title="Sync state breakdown" subtitle="legend prop accepts any ReactNode">
            <ChartContainer
              title="Sync state"
              description="Image sync status across the last 7 days."
              legend={<ChartLegend items={sampleLegend} />}
            >
              <SampleStackedBar height={260} />
            </ChartContainer>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="States" description="Loading and empty.">
        <StorybookGrid columns="repeat(auto-fit, minmax(var(--ig-popup-lg), 1fr))">
          <StorybookCard title="Loading" subtitle="loading=true → skeleton">
            <ChartContainer title="Capture volume" description="Loading recent data" loading>
              <SampleLineChart height={260} />
            </ChartContainer>
          </StorybookCard>
          <StorybookCard title="Empty" subtitle="empty=true → empty message">
            <ChartContainer
              title="Capture volume"
              description="No captures recorded yet."
              empty
              emptyMessage="No data for the selected range."
            >
              <SampleLineChart height={260} />
            </ChartContainer>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="Custom height" description="height prop in pixels.">
        <StorybookGrid columns="1fr">
          <StorybookCard title="height=180 (compact)">
            <ChartContainer title="Compact chart" description="Smaller frame for dashboard tile" height={180}>
              <SampleLineChart height={180} />
            </ChartContainer>
          </StorybookCard>
          <StorybookCard title="height=380 (large)">
            <ChartContainer title="Large chart" description="More vertical space for dense data" height={380}>
              <SampleLineChart height={380} />
            </ChartContainer>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
