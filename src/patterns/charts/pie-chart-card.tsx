import React from 'react'
import { chartHeights } from '../../tokens/core'
import { Cell, Legend, Pie, PieChart as RechartsPieChart, Tooltip } from 'recharts'
import { ChartContainer } from './chart-container'
import { ChartLegend } from '../../components/charts/chart-legend'
import { ChartResponsive } from '../../components/charts/chart-responsive'
import { ChartTooltipContent } from '../../components/charts/chart-tooltip'
import { chartPalette, type PieDatum } from '../../components/charts/types'

export function PieChartCard({
  title,
  description,
  data,
  height = chartHeights.lg,
  loading = false,
  emptyMessage,
  innerRadius = 60,
  outerRadius = 90,
  paddingAngle = 0,
  separator = 'subtle',
  labelRender,
  tooltipContent,
  headerExtra,
}: {
  title?: string
  description?: string
  data: PieDatum[]
  height?: number
  loading?: boolean
  emptyMessage?: string
  /** Inner radius of the donut. Set to 0 for a full pie. Default 60. */
  innerRadius?: number
  /** Outer radius. Default 90. */
  outerRadius?: number
  /** Padding angle (degrees) between slices. Default 0 keeps slices flush. */
  paddingAngle?: number
  /** Slice separator. `subtle` keeps adjacent colors readable without creating gaps. */
  separator?: 'none' | 'subtle'
  /** Slice label renderer. `pct` is value/total in [0,1]. */
  labelRender?: (entry: PieDatum, pct: number) => React.ReactNode
  tooltipContent?: React.ReactElement
  headerExtra?: React.ReactNode
}) {
  const legendItems = data.map((item, index) => ({
    label: item.name,
    color: item.color ?? chartPalette[index % chartPalette.length],
  }))
  const total = data.reduce((sum, d) => sum + (Number(d.value) || 0), 0) || 1
  const labelFn = labelRender
    ? (props: { payload?: unknown }) => {
        const entry = props.payload as PieDatum
        return labelRender(entry, (Number(entry.value) || 0) / total) as string | number
      }
    : undefined
  const separatorStroke = separator === 'subtle' ? 'var(--ig-color-chart-separator)' : 'none'
  const separatorWidth = separator === 'subtle' ? 1.5 : 0
  return (
    <ChartContainer
      title={title}
      description={description}
      height={height}
      loading={loading}
      empty={!data.length}
      emptyMessage={emptyMessage}
      legend={<ChartLegend items={legendItems} />}
      headerExtra={headerExtra}
    >
      <ChartResponsive height={height}>
        {({ width, height: chartHeight }) => (
          <RechartsPieChart width={width} height={chartHeight}>
            <Tooltip
              content={tooltipContent ?? <ChartTooltipContent />}
              cursor={{ fill: 'var(--ig-color-surface-interactive)' }}
            />
            <Legend content={() => null} />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={paddingAngle}
              label={labelFn}
            >
              {data.map((item, index) => (
                <Cell
                  key={`${item.name}-${index}`}
                  fill={item.color ?? chartPalette[index % chartPalette.length]}
                  stroke={separatorStroke}
                  strokeWidth={separatorWidth}
                />
              ))}
            </Pie>
          </RechartsPieChart>
        )}
      </ChartResponsive>
    </ChartContainer>
  )
}
