import React from 'react'
import styled from 'styled-components'
import { chartHeights, svgStrokeWidths } from '../../tokens/core'
import { CartesianGrid, Legend, Line, LineChart as RechartsLineChart, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartContainer } from './chart-container'
import { ChartLegend } from '../../components/charts/chart-legend'
import { ChartResponsive } from '../../components/charts/chart-responsive'
import { ChartTooltipContent } from '../../components/charts/chart-tooltip'
import { chartAxisTick, chartPalette, type CartesianSeries } from '../../components/charts/types'

const SrOnly = styled.div`
  position: absolute;
  width: var(--ig-space-1px);
  height: var(--ig-space-1px);
  padding: 0;
  margin: var(--ig-space-neg-1px);
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`

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
    <>
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
      {onPointClick && !loading && data.length > 0 ? (
        <SrOnly>
          <table aria-label={`${title ?? 'Chart'} data — Enter on a row to select`}>
            <thead>
              <tr>
                <th scope="col">{xKey}</th>
                {series.map((s) => (
                  <th key={s.key} scope="col">{s.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((entry, i) => (
                <tr
                  key={i}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onPointClick(entry, i)
                    }
                  }}
                >
                  <th scope="row">{String(entry[xKey])}</th>
                  {series.map((s) => (
                    <td key={s.key}>{String(entry[s.key] ?? '')}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </SrOnly>
      ) : null}
    </>
  )
}
