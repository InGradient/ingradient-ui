import styled from 'styled-components'
import { LegendItem } from '../data-display/legend-item'

const ChartLegendList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: var(--ig-space-4) var(--ig-space-6);
`

export function ChartLegend({
  items,
}: {
  items: Array<{ label: string; color: string }>
}) {
  return (
    <ChartLegendList>
      {items.map((item) => (
        <LegendItem key={`${item.label}-${item.color}`} color={item.color} label={item.label} />
      ))}
    </ChartLegendList>
  )
}
