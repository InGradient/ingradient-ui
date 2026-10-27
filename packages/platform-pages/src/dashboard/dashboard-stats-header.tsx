import { Inline, Stack, Text } from '@ingradient/ui/primitives'

const VALUE_STYLE = { marginLeft: 'var(--ig-spacing-16)' }

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
    <Stack gap="var(--ig-spacing-4)" className={className}>
      {items.map((item) => (
        <Inline as="span" key={item.label} justify="space-between">
          <Text as="span" size="var(--ig-text-caption)" tone="muted">{item.label}</Text>
          <Text as="strong" size="var(--ig-text-caption)" weight="bold" style={VALUE_STYLE}>{item.value}</Text>
        </Inline>
      ))}
    </Stack>
  )
}
