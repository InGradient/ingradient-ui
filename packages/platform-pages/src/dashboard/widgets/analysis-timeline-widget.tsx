import { chartColors, chartHeights } from '@ingradient/ui'
import { LineChartCard } from '@ingradient/ui/patterns'

export type AnalysisTimelineGranularity = 'hour' | 'daily' | string

export interface AnalysisTimelineWidgetProps {
  granularity: AnalysisTimelineGranularity
  chartData: Array<{ label: string; total: number; labeled: number; unlabeled: number }>
}

/**
 * 시간별 누적 이미지 수 LineChart. Header 에 granularity 표시.
 * Platform 의 `TimelineWidget` 와 시각·구조 동일.
 */
export function AnalysisTimelineWidget({ granularity, chartData }: AnalysisTimelineWidgetProps) {
  return (
    <LineChartCard
      title="Images over time"
      data={chartData}
      xKey="label"
      series={[
        { key: 'total', label: 'Total', color: 'var(--ig-color-accent)' },
        { key: 'labeled', label: 'Labeled', color: chartColors.teal },
        { key: 'unlabeled', label: 'Unlabeled', color: chartColors.amber },
      ]}
      height={chartHeights['2xl']}
      emptyMessage="No time-series data in the current range."
      headerExtra={
        <span style={{ fontSize: 'var(--ig-font-size-xs)', color: 'var(--ig-color-text-muted)' }}>
          Granularity:{' '}
          <strong style={{ color: 'var(--ig-color-text-primary)' }}>
            {granularity === 'hour' ? 'Hourly' : 'Daily'}
          </strong>
        </span>
      }
    />
  )
}
