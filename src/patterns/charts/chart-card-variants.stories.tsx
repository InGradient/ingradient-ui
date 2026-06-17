import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from '../../components/feedback/badge'
import { BarChartCard } from './bar-chart-card'
import { LineChartCard } from './line-chart-card'
import { PieChartCard } from './pie-chart-card'
import { chartPalette } from '../../components/charts/types'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Patterns/Charts/Variants',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const verticalCategoryData = [
  { name: 'S3 standard', gb: 124 },
  { name: 'S3 IA', gb: 88 },
  { name: 'Glacier instant', gb: 56 },
  { name: 'Glacier deep', gb: 22 },
]

const stackedSyncData = [
  { day: 'Mon', synced: 320, pending: 40, failed: 8 },
  { day: 'Tue', synced: 410, pending: 28, failed: 4 },
  { day: 'Wed', synced: 380, pending: 56, failed: 12 },
  { day: 'Thu', synced: 460, pending: 22, failed: 6 },
  { day: 'Fri', synced: 510, pending: 31, failed: 9 },
]

const perCellResolutionData = [
  { bucket: '<1MP', count: 12 },
  { bucket: '1-3MP', count: 48 },
  { bucket: '3-5MP', count: 36 },
  { bucket: '5-10MP', count: 22 },
  { bucket: '10MP+', count: 8 },
]

const dualAxisTrendData = [
  { ts: '12:00', exposure: 1200, gain: 8.4 },
  { ts: '12:30', exposure: 1500, gain: 9.1 },
  { ts: '13:00', exposure: 1100, gain: 7.8 },
  { ts: '13:30', exposure: 1800, gain: 10.5 },
  { ts: '14:00', exposure: 1300, gain: 8.0 },
]

const formatPieData = [
  { name: 'JPEG', value: 1240 },
  { name: 'PNG', value: 580 },
  { name: 'TIFF', value: 240 },
  { name: 'BMP', value: 60 },
]

export const Review: Story = {
  render: () => (
    <StorybookPage
      title="Chart Card Variants"
      description="Configuration variants for bar layout, stacking, per-Cell color, dual-axis line, and pie radius/labels. Reference when wiring consumer charts to ui chart cards."
    >
      <StorybookSection title="BarChartCard" description="layout, stacked, per-Cell color, header extra slot.">
        <StorybookGrid columns="repeat(auto-fit, minmax(var(--ig-popup-lg), 1fr))">
          <StorybookCard title="Horizontal bars (default)" subtitle="layout omitted → vertical bars, X axis at bottom">
            <BarChartCard
              title="Pipeline volume"
              description="Categorical counts across pipeline stages."
              data={[
                { stage: 'Queued', items: 84 },
                { stage: 'Labeling', items: 56 },
                { stage: 'Review', items: 28 },
                { stage: 'Export', items: 12 },
              ]}
              xKey="stage"
              series={[{ key: 'items', label: 'Items' }]}
              height={240}
            />
          </StorybookCard>
          <StorybookCard title="Vertical bars" subtitle='layout="vertical" → category on Y axis (long labels)'>
            <BarChartCard
              title="Storage by tier"
              description="GB per S3 tier."
              data={verticalCategoryData}
              xKey="name"
              series={[{ key: 'gb', label: 'GB' }]}
              layout="vertical"
              height={240}
            />
          </StorybookCard>
          <StorybookCard title="Stacked bars" subtitle="stacked=true + 3 series">
            <BarChartCard
              title="Sync state breakdown"
              description="Stacked sync status per day."
              data={stackedSyncData}
              xKey="day"
              series={[
                { key: 'synced', label: 'Synced', color: 'var(--ig-color-success)' },
                { key: 'pending', label: 'Pending', color: 'var(--ig-color-warning)' },
                { key: 'failed', label: 'Failed', color: 'var(--ig-color-danger)' },
              ]}
              stacked
              height={240}
            />
          </StorybookCard>
          <StorybookCard title="Per-cell color" subtitle="single series + getCellColor → distinct color per row">
            <BarChartCard
              title="Resolution distribution"
              description="Bucket count with palette per bucket."
              data={perCellResolutionData}
              xKey="bucket"
              series={[{ key: 'count', label: 'Images' }]}
              getCellColor={(_row, idx) => chartPalette[idx % chartPalette.length]}
              height={240}
            />
          </StorybookCard>
          <StorybookCard title="Header extra slot" subtitle="headerExtra prop → status badge next to legend">
            <BarChartCard
              title="Daily captures"
              description="With a status pill in the header."
              data={[
                { day: 'Mon', count: 320 },
                { day: 'Tue', count: 410 },
                { day: 'Wed', count: 380 },
                { day: 'Thu', count: 460 },
                { day: 'Fri', count: 510 },
              ]}
              xKey="day"
              series={[{ key: 'count', label: 'Captures' }]}
              headerExtra={<Badge $tone="success">Live</Badge>}
              height={240}
            />
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="LineChartCard" description="secondaryAxisKeys for dual-Y-axis layout.">
        <StorybookGrid columns="1fr">
          <StorybookCard title="Dual Y-axis line chart" subtitle='secondaryAxisKeys=["gain"] → right axis for gain'>
            <LineChartCard
              title="Camera parameter trend"
              description="Exposure (μs) on left axis, gain on right axis."
              data={dualAxisTrendData}
              xKey="ts"
              series={[
                { key: 'exposure', label: 'Exposure (μs)' },
                { key: 'gain', label: 'Gain' },
              ]}
              secondaryAxisKeys={['gain']}
              height={260}
            />
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="PieChartCard" description="innerRadius, outerRadius, paddingAngle, labelRender.">
        <StorybookGrid columns="repeat(auto-fit, minmax(var(--ig-popup-sm), 1fr))">
          <StorybookCard title="Full pie + slice labels" subtitle="innerRadius=0 + labelRender">
            <PieChartCard
              title="Upload format"
              description="Format share with inline labels."
              data={formatPieData}
              innerRadius={0}
              outerRadius={88}
              paddingAngle={1}
              labelRender={(entry, pct) => `${entry.name} ${(pct * 100).toFixed(0)}%`}
              height={260}
            />
          </StorybookCard>
          <StorybookCard title="Compact donut" subtitle="smaller innerRadius=36, outerRadius=64">
            <PieChartCard
              title="Sync status"
              description="Compact donut for dashboards."
              data={[
                { name: 'Synced', value: 320, color: 'var(--ig-color-success)' },
                { name: 'Pending', value: 64, color: 'var(--ig-color-warning)' },
                { name: 'Failed', value: 12, color: 'var(--ig-color-danger)' },
              ]}
              innerRadius={36}
              outerRadius={64}
              height={220}
            />
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
