import { BarChartCard } from '@ingradient/ui/patterns'

export interface AnalysisClassRatioWidgetProps {
  classRatio: Array<unknown>
  chartData: Array<{ name: string; count: number; ratio: number; color: string }>
}

/**
 * Class 분포 vertical BarChart. row 별 색상은 chartData 가 정함.
 * Platform 의 `ClassRatioWidget` 와 시각·구조 동일.
 */
export function AnalysisClassRatioWidget({ classRatio, chartData }: AnalysisClassRatioWidgetProps) {
  return (
    <BarChartCard
      title="Class distribution"
      data={classRatio.length === 0 ? [] : chartData}
      xKey="name"
      series={[{ key: 'count', label: 'Count' }]}
      layout="vertical"
      height={260}
      emptyMessage="No classes or no labels yet."
      getCellColor={(row) => (row as { color: string }).color}
    />
  )
}
