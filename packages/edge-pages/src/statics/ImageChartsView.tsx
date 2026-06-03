import { chartHeights } from '@ingradient/ui'
import { BarChartCard, PieChartCard } from '@ingradient/ui/patterns'
import { PanelGrid } from './StaticsView.styles'
import {
  CHART_BLUE, CHART_NEUTRAL, CHART_GOLD, CHART_SUCCESS, CHART_DANGER,
} from './chart-helpers'
import type { ImageChartsViewProps } from './types'

const SYNC_COLORS: Record<string, string> = {
  local_only: CHART_NEUTRAL,
  uploading: CHART_GOLD,
  synced: CHART_SUCCESS,
  upload_failed: CHART_DANGER,
}

export function ImageChartsView({ data, labels }: ImageChartsViewProps): JSX.Element {
  const exportData = [
    { name: labels.exported, value: data.exported_count, color: CHART_SUCCESS },
    { name: labels.notExported, value: data.not_exported_count, color: CHART_NEUTRAL },
  ].filter((d) => d.value > 0)

  const syncData = data.sync_distribution.map((d) => ({
    name: d.status.replace(/_/g, ' '),
    value: d.count,
    color: SYNC_COLORS[d.status] ?? 'var(--ig-color-text-muted)',
  }))

  const pieData = syncData.length > 0 ? syncData : exportData

  return (
    <PanelGrid>
      <BarChartCard
        title={labels.dailyCaptureTrend}
        data={data.daily_captures}
        xKey="date"
        series={[{ key: 'count', label: labels.captures, color: CHART_BLUE }]}
        height={chartHeights.md}
        emptyMessage={labels.noImageData}
      />
      <PieChartCard
        title={labels.syncStatus}
        data={pieData}
        innerRadius={44}
        outerRadius={72}
        paddingAngle={3}
        height={chartHeights.md}
        emptyMessage={labels.noImageData}
      />
    </PanelGrid>
  )
}
