import { PieChartCard } from '@ingradient/ui/patterns'
import { DashboardStatsHeader } from '@ingradient/ui/patterns'

export interface AnalysisPendingProcessedWidgetProps {
  pending: number
  processed: number
  pieData: Array<{ name: string; value: number; color: string }>
}

/**
 * Pending vs Processed doughnut. Header 에 두 줄 통계.
 * Platform 의 `PendingProcessedWidget` 와 시각·구조 동일.
 */
export function AnalysisPendingProcessedWidget({
  pending,
  processed,
  pieData,
}: AnalysisPendingProcessedWidgetProps) {
  return (
    <PieChartCard
      title="Labeling progress"
      data={pieData}
      height={304}
      innerRadius={56}
      outerRadius={100}
      emptyMessage="No labeling progress yet."
      headerExtra={
        <DashboardStatsHeader
          items={[
            { label: 'Pending (unlabeled)', value: pending.toLocaleString() },
            { label: 'Processed (labeled)', value: processed.toLocaleString() },
          ]}
        />
      }
    />
  )
}
