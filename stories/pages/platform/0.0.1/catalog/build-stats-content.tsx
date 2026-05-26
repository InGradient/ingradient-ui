import {
  AnalysisDashboard,
  DashboardWidget,
  DistributionHeatmap,
} from '@ingradient/ui/patterns'
import { BarChartCard, LineChartCard, PieChartCard } from '@ingradient/ui/patterns'
import { SegmentedProgressBar } from '@ingradient/ui/components'
import { Inline, Stack } from '@ingradient/ui/primitives'
import {
  classRatioData, dashboardStats, dataCollectionData, datasetDistribution, defectsBySourceData,
  labelingByPersonData, labelingProgress, labelingStatusData, timelineData,
} from './mock-dashboard'

const NAME_STYLE: React.CSSProperties = { color: 'var(--ig-color-text-secondary)', fontSize: 'var(--ig-font-size-sm)' }
const VALUE_STYLE: React.CSSProperties = { color: 'var(--ig-color-text-primary)', fontVariantNumeric: 'tabular-nums', fontSize: 'var(--ig-font-size-sm)' }
const PCT_STYLE: React.CSSProperties = { color: 'var(--ig-color-text-muted)' }

export function buildStatsContent() {
  return (
    <AnalysisDashboard
      stats={dashboardStats}
      widgetColumns={2}
      widgets={[
        {
          id: 'data-collection',
          content: (
            <DashboardWidget title="Images by dataset" subtitle="Last 30 days">
              <BarChartCard
                data={dataCollectionData}
                series={[{ key: 'count', label: 'Images', color: 'var(--ig-color-accent)' }]}
                xKey="dataset"
                height={200}
              />
            </DashboardWidget>
          ),
        },
        {
          id: 'timeline',
          content: (
            <DashboardWidget title="Images over time" subtitle="Weekly uploads">
              <LineChartCard
                data={timelineData}
                series={[{ key: 'count', label: 'Images', color: 'var(--ig-color-accent)' }]}
                xKey="period"
                height={200}
              />
            </DashboardWidget>
          ),
        },
        {
          id: 'labeling-status',
          content: (
            <DashboardWidget title="Labeled vs unlabeled">
              <PieChartCard data={labelingStatusData} height={200} />
            </DashboardWidget>
          ),
        },
        {
          id: 'class-ratio',
          content: (
            <DashboardWidget title="Class distribution">
              <PieChartCard data={classRatioData} height={200} />
            </DashboardWidget>
          ),
        },
        {
          id: 'labeling-by-person',
          content: (
            <DashboardWidget title="Uploader activity" subtitle="Top contributors">
              <Stack gap={2}>
                {labelingByPersonData.map((p) => (
                  <Inline key={p.uploader} justify="space-between" align="center">
                    <span style={NAME_STYLE}>{p.uploader}</span>
                    <span style={VALUE_STYLE}>
                      {p.count.toLocaleString()} <span style={PCT_STYLE}>({p.percentage}%)</span>
                    </span>
                  </Inline>
                ))}
              </Stack>
            </DashboardWidget>
          ),
        },
        {
          id: 'defects-by-source',
          content: (
            <DashboardWidget title="Source breakdown" subtitle="Capture device">
              <BarChartCard
                data={defectsBySourceData}
                series={[{ key: 'count', label: 'Defects', color: 'var(--ig-color-warning)' }]}
                xKey="source"
                height={200}
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
              subtitle={`${labelingProgress.processed.toLocaleString()} of ${(labelingProgress.processed + labelingProgress.pending).toLocaleString()}`}
            >
              <SegmentedProgressBar
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
            <DashboardWidget title="Per-dataset class counts" span={2}>
              <DistributionHeatmap {...datasetDistribution} />
            </DashboardWidget>
          ),
        },
      ]}
    />
  )
}
