import { PieChartCard } from '@ingradient/ui/patterns'
import { DashboardStatsHeader } from '../dashboard-stats-header'

export interface AnalysisLabelingStatusWidgetProps {
  totalLabeled: number
  totalUnlabeled: number
  totalImages: number
  labeledPct: number
  pieData: Array<{ name: string; value: number; color: string }>
}

/**
 * Labeled vs Unlabeled PieChart. Header 에 통계 행 3개.
 * Platform 의 `LabelingStatusWidget` 와 시각·구조 동일.
 */
export function AnalysisLabelingStatusWidget({
  totalLabeled,
  totalUnlabeled,
  totalImages,
  labeledPct,
  pieData,
}: AnalysisLabelingStatusWidgetProps) {
  return (
    <PieChartCard
      title="Labeled vs unlabeled"
      data={pieData}
      height={260}
      innerRadius={0}
      outerRadius={92}
      emptyMessage="No labeling data yet."
      headerExtra={
        <DashboardStatsHeader
          items={[
            { label: 'Labeled', value: `${totalLabeled.toLocaleString()} (${labeledPct}%)` },
            { label: 'Unlabeled', value: totalUnlabeled.toLocaleString() },
            { label: 'Total', value: totalImages.toLocaleString() },
          ]}
        />
      }
    />
  )
}
