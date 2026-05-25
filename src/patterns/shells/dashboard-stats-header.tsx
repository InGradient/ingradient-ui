import { Inline, Stack, Text } from '../../primitives'

const VALUE_STYLE = { marginLeft: 'var(--ig-space-7)' }

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
    <Stack gap={1} className={className}>
      {items.map((item) => (
        <Inline as="span" key={item.label} justify="space-between">
          <Text as="span" size="12px" tone="muted">{item.label}</Text>
          <Text as="strong" size="12px" weight={700} style={VALUE_STYLE}>{item.value}</Text>
        </Inline>
      ))}
    </Stack>
  )
}
