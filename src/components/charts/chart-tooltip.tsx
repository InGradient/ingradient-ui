import styled from 'styled-components'
import { surfaceRaised } from '../../primitives'

const ChartTooltipCard = styled.div`
  ${surfaceRaised}
  border-radius: var(--ig-radius-md);
  padding: var(--ig-space-4) var(--ig-space-5);
  min-width: 140px;
`

const ChartTooltipLabel = styled.div`
  margin-bottom: var(--ig-space-3);
  font-size: var(--ig-font-size-xs);
  font-weight: 700;
  color: var(--ig-color-text-primary);
`

const ChartTooltipRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ig-space-4);
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-text-secondary);

  &:not(:last-child) {
    margin-bottom: var(--ig-space-2);
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
