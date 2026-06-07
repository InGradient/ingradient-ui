import { Inline, Stack, Text } from '@ingradient/ui/primitives'

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
    <Stack gap="var(--ig-space-1)" className={className}>
      {items.map((item) => (
        <Inline as="span" key={item.label} justify="space-between">
          <Text as="span" size="var(--ig-font-size-xs)" tone="muted">{item.label}</Text>
          <Text as="strong" size="var(--ig-font-size-xs)" weight={700} style={VALUE_STYLE}>{item.value}</Text>
        </Inline>
      ))}
    </Stack>
  )
}
