import styled from 'styled-components'

const ChartLegendList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--ig-space-4) var(--ig-space-6);
`

const ChartLegendItem = styled.div`
  display: inline-flex;
  align-items: center;
  gap: var(--ig-space-3);
  color: var(--ig-color-text-secondary);
  font-size: var(--ig-font-size-xs);
`

const ChartLegendSwatch = styled.span<{ $color: string }>`
  width: 10px;
  height: 10px;
  border-radius: var(--ig-radius-pill);
  background: ${(p) => p.$color};
`

export function ChartLegend({
  items,
}: {
  items: Array<{ label: string; color: string }>
}) {
  return (
    <ChartLegendList>
      {items.map((item) => (
        <ChartLegendItem key={`${item.label}-${item.color}`}>
          <ChartLegendSwatch $color={item.color} />
          <span>{item.label}</span>
        </ChartLegendItem>
      ))}
    </ChartLegendList>
  )
}
