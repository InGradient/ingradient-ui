import styled from 'styled-components'

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-1);
`

const Row = styled.span`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--ig-color-text-muted);
`

const Value = styled.strong`
  color: var(--ig-color-text-primary);
  margin-left: var(--ig-space-7);
`

export interface DashboardStatItem {
  label: string
  value: string
}

export interface DashboardStatsHeaderProps {
  items: DashboardStatItem[]
  className?: string
}

export function DashboardStatsHeader({ items, className }: DashboardStatsHeaderProps) {
  return (
    <Stack className={className}>
      {items.map((item) => (
        <Row key={item.label}>
          <span>{item.label}</span>
          <Value>{item.value}</Value>
        </Row>
      ))}
    </Stack>
  )
}
