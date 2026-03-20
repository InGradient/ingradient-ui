import { CartesianGrid, Legend, Line, LineChart as RechartsLineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartContainer } from './chart-container'
import { ChartLegend } from './chart-legend'
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
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data}>
          <CartesianGrid stroke="var(--ig-color-chart-grid)" strokeDasharray="3 3" />
          <XAxis dataKey={xKey as string} stroke="var(--ig-color-text-soft)" tickLine={false} axisLine={false} />
          <YAxis stroke="var(--ig-color-text-soft)" tickLine={false} axisLine={false} />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend content={() => null} />
          {series.map((item, index) => (
            <Line key={item.key} type="monotone" dataKey={item.key} name={item.label} stroke={item.color ?? chartPalette[index % chartPalette.length]} strokeWidth={2.4} dot={false} activeDot={{ r: 4 }} />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
