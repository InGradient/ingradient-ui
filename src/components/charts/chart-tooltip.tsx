import styled from 'styled-components'
import { TooltipCard } from '../feedback/tooltip-card'
import { KeyValueRow } from '../data-display/key-value-row'

const ChartTooltipLabel = styled.div`
  margin-bottom: var(--ig-space-3);
  font-size: var(--ig-font-size-xs);
  font-weight: var(--ig-font-weight-bold);
  color: var(--ig-color-text-primary);
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
    <TooltipCard>
      {label ? <ChartTooltipLabel>{label}</ChartTooltipLabel> : null}
      {payload.map((item, index) => (
        <KeyValueRow
          key={`${item.name ?? 'series'}-${index}`}
          label={item.name}
          value={item.value}
        />
      ))}
    </TooltipCard>
  )
}
