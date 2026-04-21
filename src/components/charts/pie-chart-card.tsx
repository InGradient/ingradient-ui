import { Cell, Legend, Pie, PieChart as RechartsPieChart, Tooltip } from 'recharts'
import { ChartContainer } from './chart-container'
import { ChartLegend } from './chart-legend'
import { ChartResponsive } from './chart-responsive'
import { ChartTooltipContent } from './chart-tooltip'
import { chartPalette, type PieDatum } from './types'

export function PieChartCard({
  title,
  description,
  data,
  height = 260,
  loading = false,
}: {
  title: string
  description?: string
  data: PieDatum[]
  height?: number
  loading?: boolean
}) {
  const legendItems = data.map((item, index) => ({ label: item.name, color: item.color ?? chartPalette[index % chartPalette.length] }))
  return (
    <ChartContainer title={title} description={description} height={height} loading={loading} empty={!data.length} legend={<ChartLegend items={legendItems} />}>
      <ChartResponsive height={height}>
        {({ width, height: chartHeight }) => (
          <RechartsPieChart width={width} height={chartHeight}>
            <Tooltip content={<ChartTooltipContent />} />
            <Legend content={() => null} />
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={3}>
              {data.map((item, index) => (
                <Cell key={`${item.name}-${index}`} fill={item.color ?? chartPalette[index % chartPalette.length]} />
              ))}
            </Pie>
          </RechartsPieChart>
        )}
      </ChartResponsive>
    </ChartContainer>
  )
}
