import React from 'react'
import { Stack, Text } from '../../primitives'
import { Card } from '../../components/data-display/card'
import { ActionBar } from '../../components/data-display/layout'

const VALUE_STYLE = { lineHeight: 1 }

export function StatCard({
  label,
  value,
  hint,
  meta,
}: {
  label: React.ReactNode
  value: React.ReactNode
  hint?: React.ReactNode
  meta?: React.ReactNode
}) {
  return (
    <Card elevation="card" radius="var(--ig-radius-xl)" padding="var(--ig-space-8)">
      <Stack gap={3}>
        <ActionBar>
          <Text size="var(--ig-font-size-xs)" tone="soft" uppercase letterSpacing="0.05em">{label}</Text>
          {meta}
        </ActionBar>
        <Text size="var(--ig-font-size-3xl)" weight="black" style={VALUE_STYLE}>{value}</Text>
        {hint ? <Text size="var(--ig-font-size-sm)" tone="muted">{hint}</Text> : null}
      </Stack>
    </Card>
  )
}

export const MetricCard = StatCard
