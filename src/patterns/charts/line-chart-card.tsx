import React from 'react'
import { chartHeights, svgStrokeWidths } from '../../tokens/core'
import { CartesianGrid, Legend, Line, LineChart as RechartsLineChart, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartContainer } from './chart-container'
import { ChartLegend } from '../../components/charts/chart-legend'
import { ChartResponsive } from '../../components/charts/chart-responsive'
import { ChartTooltipContent } from '../../components/charts/chart-tooltip'
import { chartAxisTick, chartPalette, type CartesianSeries } from '../../components/charts/types'

export function LineChartCard<T extends Record<string, string | number>>({
  title,
  description,
  data,
  series,
  xKey,
  height = chartHeights.lg,
  loading = false,
  emptyMessage,
  onPointClick,
  secondaryAxisKeys,
  tooltipContent,
  headerExtra,
}: {
  title?: string
  description?: string
  data: T[]
  series: CartesianSeries[]
  xKey: keyof T & string
  height?: number
  loading?: boolean
  emptyMessage?: string
  onPointClick?: (entry: T, index: number) => void
  /** Series keys that should bind to a right-side secondary Y-axis. Triggers dual-axis layout. */
  secondaryAxisKeys?: string[]
  tooltipContent?: React.ReactElement
  headerExtra?: React.ReactNode
}) {
  const legend = (
    <ChartLegend
      items={series.map((item, index) => ({
        label: item.label,
        color: item.color ?? chartPalette[index % chartPalette.length],
      }))}
    />
  )
  const dualAxis = !!secondaryAxisKeys && secondaryAxisKeys.length > 0
  const rightKeys = new Set(secondaryAxisKeys ?? [])
  return (
    <ChartContainer
      title={title}
      description={description}
      height={height}
      loading={loading}
      empty={!data.length}
      emptyMessage={emptyMessage}
      legend={legend}
      headerExtra={headerExtra}
    >
      <ChartResponsive height={height}>
        {({ width, height: chartHeight }) => (
          <RechartsLineChart
            width={width}
            height={chartHeight}
            data={data}
            onClick={onPointClick ? (state: any) => { if (state?.activePayload?.[0]) onPointClick(state.activePayload[0].payload as T, state.activeTooltipIndex ?? 0) } : undefined}
          >
            <CartesianGrid stroke="var(--ig-color-chart-grid)" strokeDasharray="3 3" />
            <XAxis dataKey={xKey as string} stroke="var(--ig-color-text-soft)" tick={chartAxisTick} tickLine={false} axisLine={false} />
            {dualAxis ? (
              <>
                <YAxis yAxisId="left" stroke="var(--ig-color-text-soft)" tick={chartAxisTick} tickLine={false} axisLine={false} />
                <YAxis yAxisId="right" orientation="right" stroke="var(--ig-color-text-soft)" tick={chartAxisTick} tickLine={false} axisLine={false} />
              </>
            ) : (
              <YAxis stroke="var(--ig-color-text-soft)" tick={chartAxisTick} tickLine={false} axisLine={false} />
            )}
            <Tooltip
              content={tooltipContent ?? <ChartTooltipContent />}
              cursor={{ stroke: 'var(--ig-color-border-subtle)' }}
            />
            <Legend content={() => null} />
            {series.map((item, index) => {
              const color = item.color ?? chartPalette[index % chartPalette.length]
              const yAxisId = dualAxis ? (rightKeys.has(item.key) ? 'right' : 'left') : undefined
              return (
                <Line
                  key={item.key}
                  type="monotone"
                  dataKey={item.key}
                  name={item.label}
                  stroke={color}
                  strokeWidth={svgStrokeWidths.midBold}
                  dot={false}
                  activeDot={{ r: 4 }}
                  yAxisId={yAxisId}
                />
              )
            })}
          </RechartsLineChart>
        )}
      </ChartResponsive>
    </ChartContainer>
  )
}
