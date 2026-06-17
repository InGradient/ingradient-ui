import { chartHeights } from '@ingradient/ui'
import { useMemo } from 'react'
import { BarChartCard, LineChartCard } from '@ingradient/ui/patterns'
import { PanelGrid } from './StaticsView.styles'
import { CHART_PURPLE, CHART_WARNING } from './chart-helpers'
import type { CameraChartsViewProps } from './types'

export function CameraChartsView({ data, labels }: CameraChartsViewProps): JSX.Element {
  const paramTrends = useMemo(
    () => data.param_trends.map((row) => ({
      ts: row.captured_at.slice(5, 16).replace('T', ' '),
      exposure: row.exposure ?? 0,
      gain: row.gain ?? 0,
    })),
    [data.param_trends],
  )

  return (
    <PanelGrid>
      <BarChartCard
        title={labels.exposureDist}
        data={data.exposure_distribution}
        xKey="bucket"
        series={[{ key: 'count', label: labels.count, color: CHART_WARNING }]}
        height={chartHeights.md}
        emptyMessage={labels.noCameraData}
      />
      <BarChartCard
        title={labels.gainDist}
        data={data.gain_distribution}
        xKey="bucket"
        series={[{ key: 'count', label: labels.count, color: CHART_PURPLE }]}
        height={chartHeights.md}
        emptyMessage={labels.noCameraData}
      />
      <div style={{ gridColumn: '1 / span 2', minHeight: 0 }}>
        <LineChartCard
          title={labels.paramTrend}
          data={paramTrends}
          xKey="ts"
          series={[
            { key: 'exposure', label: 'Exposure (μs)', color: CHART_WARNING },
            { key: 'gain', label: 'Gain', color: CHART_PURPLE },
          ]}
          secondaryAxisKeys={['gain']}
          height={chartHeights.lg}
          emptyMessage={labels.noCameraData}
        />
      </div>
    </PanelGrid>
  )
}
