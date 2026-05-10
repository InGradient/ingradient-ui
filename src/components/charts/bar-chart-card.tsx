import React from 'react'
import { Bar, BarChart as RechartsBarChart, CartesianGrid, Cell, Legend, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartContainer } from './chart-container'
import { ChartLegend } from './chart-legend'
import { ChartResponsive } from './chart-responsive'
import { ChartTooltipContent } from './chart-tooltip'
import { chartPalette, type CartesianSeries } from './types'

export function BarChartCard<T extends Record<string, string | number>>({
  title,
  description,
  data,
  series,
  xKey,
  height = 260,
  loading = false,
  layout = 'horizontal',
  stacked = false,
  getCellColor,
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
  /** 'horizontal' (default) = vertical bars / X axis at bottom. 'vertical' = horizontal bars / category on Y axis. */
  layout?: 'horizontal' | 'vertical'
  /** When true, all series share `stackId='a'` to render as a stacked bar chart. */
  stacked?: boolean
  /** Per-row color override (only applied when `series.length === 1`). */
  getCellColor?: (datum: T, index: number) => string
  /** Custom tooltip ReactElement passed to `<Tooltip content={...} />`. */
  tooltipContent?: React.ReactElement
  /** Header right-slot rendered next to the legend (e.g. dropdowns, status pills). */
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
  const isVertical = layout === 'vertical'
  const barRadius: [number, number, number, number] = isVertical ? [0, 4, 4, 0] : [8, 8, 4, 4]
  const useCells = !!getCellColor && series.length === 1
  return (
    <ChartContainer
      title={title}
      description={description}
      height={height}
      loading={loading}
      empty={!data.length}
      legend={legend}
      headerExtra={headerExtra}
    >
      <ChartResponsive height={height}>
        {({ width, height: chartHeight }) => (
          <RechartsBarChart width={width} height={chartHeight} data={data} layout={layout}>
            <CartesianGrid stroke="var(--ig-color-chart-grid)" strokeDasharray="3 3" vertical={isVertical} horizontal={!isVertical} />
            {isVertical ? (
              <>
                <XAxis type="number" stroke="var(--ig-color-text-soft)" tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey={xKey as string} stroke="var(--ig-color-text-soft)" tickLine={false} axisLine={false} />
              </>
            ) : (
              <>
                <XAxis dataKey={xKey as string} stroke="var(--ig-color-text-soft)" tickLine={false} axisLine={false} />
                <YAxis stroke="var(--ig-color-text-soft)" tickLine={false} axisLine={false} />
              </>
            )}
            <Tooltip content={tooltipContent ?? <ChartTooltipContent />} />
            <Legend content={() => null} />
            {series.map((item, index) => {
              const fill = item.color ?? chartPalette[index % chartPalette.length]
              const stackId = stacked ? 'a' : undefined
              return (
                <Bar key={item.key} dataKey={item.key} name={item.label} fill={fill} radius={barRadius} stackId={stackId}>
                  {useCells
                    ? data.map((row, idx) => (
                        <Cell key={`${item.key}-${idx}`} fill={getCellColor!(row, idx)} />
                      ))
                    : null}
                </Bar>
              )
            })}
          </RechartsBarChart>
        )}
      </ChartResponsive>
    </ChartContainer>
  )
}
