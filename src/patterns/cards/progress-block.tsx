import React from 'react'
import { Stack, Text } from '../../primitives'
import { ProgressBar } from '../../components/feedback/progress'
import { Card } from '../../components/data-display/card'
import { ActionBar } from '../../components/data-display/layout'

export function ProgressBlock({
  label,
  value,
  hint,
}: {
  label: React.ReactNode
  value: number
  hint?: React.ReactNode
}) {
  return (
    <Card elevation="panel" radius="var(--ig-radius-lg)" padding="var(--ig-space-7)">
      <Stack gap={4}>
        <ActionBar>
          <Text size="13px" weight={700}>{label}</Text>
          <Text size="12px" tone="soft">{Math.round(value)}%</Text>
        </ActionBar>
        <ProgressBar value={value} />
        {hint ? <Text size="12px" tone="muted">{hint}</Text> : null}
      </Stack>
    </Card>
  )
}
