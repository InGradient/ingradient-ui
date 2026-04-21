import { Bar, BarChart as RechartsBarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts'
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
}: {
  title: string
  description?: string
  data: T[]
  series: CartesianSeries[]
  xKey: keyof T & string
  height?: number
  loading?: boolean
}) {
  const legend = <ChartLegend items={series.map((item, index) => ({ label: item.label, color: item.color ?? chartPalette[index % chartPalette.length] }))} />
  return (
    <ChartContainer title={title} description={description} height={height} loading={loading} empty={!data.length} legend={legend}>
      <ChartResponsive height={height}>
        {({ width, height: chartHeight }) => (
          <RechartsBarChart width={width} height={chartHeight} data={data}>
            <CartesianGrid stroke="var(--ig-color-chart-grid)" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey={xKey as string} stroke="var(--ig-color-text-soft)" tickLine={false} axisLine={false} />
            <YAxis stroke="var(--ig-color-text-soft)" tickLine={false} axisLine={false} />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend content={() => null} />
            {series.map((item, index) => (
              <Bar key={item.key} dataKey={item.key} name={item.label} fill={item.color ?? chartPalette[index % chartPalette.length]} radius={[8, 8, 4, 4]} />
            ))}
          </RechartsBarChart>
        )}
      </ChartResponsive>
    </ChartContainer>
  )
}
