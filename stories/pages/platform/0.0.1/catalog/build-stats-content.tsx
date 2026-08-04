import {
  DashboardWidget,
  DistributionHeatmap,
  LayoutDashboard,
} from '@ingradient/platform-pages'
import { BarChartCard, LineChartCard, PieChartCard } from '@ingradient/ui/patterns'
import { SegmentedProgressBar } from '@ingradient/ui/components'
import { Inline, Stack, Text } from '@ingradient/ui/primitives'
import { chartHeights } from '@ingradient/ui/tokens'
import {
  classRatioData, dashboardStats, dataCollectionData, datasetDistribution, defectsBySourceData,
  labelingByPersonData, labelingProgress, labelingStatusData, timelineData,
} from './mock-dashboard'

export function buildStatsContent() {
  return (
    <LayoutDashboard
      stats={dashboardStats}
      widgetColumns={2}
      widgets={[
        {
          id: 'data-collection',
          content: (
            <DashboardWidget title="Images by dataset" titleAs="h2" subtitle="Last 30 days">
              <BarChartCard
                data={dataCollectionData}
                series={[{ key: 'count', label: 'Images', color: 'var(--ig-color-accent)' }]}
                xKey="dataset"
                height={chartHeights.sm}
              />
            </DashboardWidget>
          ),
        },
        {
          id: 'timeline',
          content: (
            <DashboardWidget title="Images over time" titleAs="h2" subtitle="Weekly uploads">
              <LineChartCard
                data={timelineData}
                series={[{ key: 'count', label: 'Images', color: 'var(--ig-color-accent)' }]}
                xKey="period"
                height={chartHeights.sm}
              />
            </DashboardWidget>
          ),
        },
        {
          id: 'labeling-status',
          content: (
            <DashboardWidget title="Labeled vs unlabeled" titleAs="h2">
              <PieChartCard data={labelingStatusData} height={chartHeights.sm} />
            </DashboardWidget>
          ),
        },
        {
          id: 'class-ratio',
          content: (
            <DashboardWidget title="Class distribution" titleAs="h2">
              <PieChartCard data={classRatioData} height={chartHeights.sm} />
            </DashboardWidget>
          ),
        },
        {
          id: 'labeling-by-person',
          content: (
            <DashboardWidget title="Uploader activity" titleAs="h2" subtitle="Top contributors">
              <Stack gap="var(--ig-space-2)">
                {labelingByPersonData.map((p) => (
                  <Inline key={p.uploader} justify="space-between" align="center">
                    <Text as="span" size="var(--ig-font-size-sm)" tone="secondary">{p.uploader}</Text>
                    <Text as="span" size="var(--ig-font-size-sm)" tabularNums>
                      {p.count.toLocaleString()}{' '}
                      <Text as="span" size="var(--ig-font-size-sm)" tone="muted">({p.percentage}%)</Text>
                    </Text>
                  </Inline>
                ))}
              </Stack>
            </DashboardWidget>
          ),
        },
        {
          id: 'defects-by-source',
          content: (
            <DashboardWidget title="Source breakdown" titleAs="h2" subtitle="Capture device">
              <BarChartCard
                data={defectsBySourceData}
                series={[{ key: 'count', label: 'Defects', color: 'var(--ig-color-warning)' }]}
                xKey="source"
                height={chartHeights.sm}
                layout="vertical"
              />
            </DashboardWidget>
          ),
        },
        {
          id: 'pending-processed',
          span: 2,
          content: (
            <DashboardWidget
              title="Labeling progress"
              titleAs="h2"
              subtitle={`${labelingProgress.processed.toLocaleString()} of ${(labelingProgress.processed + labelingProgress.pending).toLocaleString()}`}
            >
              <SegmentedProgressBar
                ariaLabel="Labeling progress"
                segments={[
                  { label: 'Processed', value: labelingProgress.processed, color: 'var(--ig-color-success)' },
                  { label: 'Pending', value: labelingProgress.pending, color: 'var(--ig-color-warning)' },
                ]}
              />
            </DashboardWidget>
          ),
        },
        {
          id: 'dataset-distribution',
          span: 2,
          content: (
            <DashboardWidget title="Per-dataset class counts" titleAs="h2" span={2}>
              <DistributionHeatmap {...datasetDistribution} rowHeaderLabel="Class" />
            </DashboardWidget>
          ),
        },
      ]}
    />
  )
}
