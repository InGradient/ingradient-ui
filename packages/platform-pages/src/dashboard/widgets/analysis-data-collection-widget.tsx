import { chartHeights } from '@ingradient/ui'
import { iconSizeNumbers } from '@ingradient/ui'
import { BarChartCard } from '@ingradient/ui/patterns'

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
      height={chartHeights.lg}
      emptyMessage="No datasets yet."
      headerExtra={
        <span style={{ fontSize: 'var(--ig-font-size-xs)', color: 'var(--ig-color-text-muted)' }}>
          Total:{' '}
          <strong style={{ color: 'var(--ig-color-text-primary)' }}>
            {totalImages.toLocaleString()}
          </strong>
        </span>
      }
    />
  )
}
