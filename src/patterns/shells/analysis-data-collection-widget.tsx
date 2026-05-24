import { BarChartCard } from '../charts/bar-chart-card'

export interface AnalysisDataCollectionWidgetProps {
  totalImages: number
  chartData: Array<{ name: string; count: number }>
}

/**
 * Dataset 별 이미지 수 BarChart. Header 에 총합 표시.
 * Platform 의 `DataCollectionWidget` 와 시각·구조 동일.
 */
export function AnalysisDataCollectionWidget({
  totalImages,
  chartData,
}: AnalysisDataCollectionWidgetProps) {
  return (
    <BarChartCard
      title="Images by dataset"
      data={chartData}
      xKey="name"
      series={[{ key: 'count', label: 'Images', color: 'var(--ig-color-accent)' }]}
      height={260}
      emptyMessage="No datasets yet."
      headerExtra={
        <span style={{ fontSize: 12, color: 'var(--ig-color-text-muted)' }}>
          Total:{' '}
          <strong style={{ color: 'var(--ig-color-text-primary)' }}>
            {totalImages.toLocaleString()}
          </strong>
        </span>
      }
    />
  )
}
