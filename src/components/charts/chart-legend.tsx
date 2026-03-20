import styled from 'styled-components'

const ChartLegendList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px 14px;
`

const ChartLegendItem = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--ig-color-text-secondary);
  font-size: 12px;
`

const ChartLegendSwatch = styled.span<{ $color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 999px;
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
