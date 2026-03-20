import styled from 'styled-components'
import { surfaceRaised } from '../../primitives'

const ChartTooltipCard = styled.div`
  ${surfaceRaised}
  border-radius: 14px;
  padding: 10px 12px;
  min-width: 140px;
`

const ChartTooltipLabel = styled.div`
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 700;
  color: var(--ig-color-text-primary);
`

const ChartTooltipRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  font-size: 12px;
  color: var(--ig-color-text-secondary);

  &:not(:last-child) {
    margin-bottom: 6px;
  }
`

export function ChartTooltipContent({
  active,
  label,
  payload,
}: {
  active?: boolean
  label?: string
  payload?: Array<{ name?: string; value?: string | number; color?: string }>
}) {
  if (!active || !payload?.length) return null
  return (
    <ChartTooltipCard>
      {label ? <ChartTooltipLabel>{label}</ChartTooltipLabel> : null}
      {payload.map((item, index) => (
        <ChartTooltipRow key={`${item.name ?? 'series'}-${index}`}>
          <span>{item.name}</span>
          <span>{item.value}</span>
        </ChartTooltipRow>
      ))}
    </ChartTooltipCard>
  )
}
