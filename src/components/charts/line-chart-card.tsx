import { CartesianGrid, Legend, Line, LineChart as RechartsLineChart, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartContainer } from './chart-container'
import { ChartLegend } from './chart-legend'
import { ChartResponsive } from './chart-responsive'
import { ChartTooltipContent } from './chart-tooltip'
import { chartPalette, type CartesianSeries } from './types'

export function LineChartCard<T extends Record<string, string | number>>({
  title,
  description,
  data,
  series,
  xKey,
  height = 260,
  loading = false,
  onPointClick,
}: {
  title: string
  description?: string
  data: T[]
  series: CartesianSeries[]
  xKey: keyof T & string
  height?: number
  loading?: boolean
  onPointClick?: (entry: T, index: number) => void
}) {
  const legend = <ChartLegend items={series.map((item, index) => ({ label: item.label, color: item.color ?? chartPalette[index % chartPalette.length] }))} />
  return (
    <ChartContainer title={title} description={description} height={height} loading={loading} empty={!data.length} legend={legend}>
      <ChartResponsive height={height}>
        {({ width, height: chartHeight }) => (
          <RechartsLineChart
            width={width}
            height={chartHeight}
            data={data}
            onClick={onPointClick ? (state: any) => { if (state?.activePayload?.[0]) onPointClick(state.activePayload[0].payload as T, state.activeTooltipIndex ?? 0) } : undefined}
          >
            <CartesianGrid stroke="var(--ig-color-chart-grid)" strokeDasharray="3 3" />
            <XAxis dataKey={xKey as string} stroke="var(--ig-color-text-soft)" tickLine={false} axisLine={false} />
            <YAxis stroke="var(--ig-color-text-soft)" tickLine={false} axisLine={false} />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend content={() => null} />
            {series.map((item, index) => (
              <Line key={item.key} type="monotone" dataKey={item.key} name={item.label} stroke={item.color ?? chartPalette[index % chartPalette.length]} strokeWidth={2.4} dot={false} activeDot={{ r: 4 }} />
            ))}
          </RechartsLineChart>
        )}
      </ChartResponsive>
    </ChartContainer>
  )
}
