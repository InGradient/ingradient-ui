import React from 'react'
import styled from 'styled-components'
import { Text } from '../../primitives'
import { ProgressBar } from '../../components/feedback/progress'
import { Card } from '../../components/data-display/card'
import { ActionBar } from '../../components/data-display/layout'

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-4);
`

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
      <Body>
        <ActionBar>
          <Text size="13px" weight={700}>{label}</Text>
          <Text size="12px" tone="soft">{Math.round(value)}%</Text>
        </ActionBar>
        <ProgressBar value={value} />
        {hint ? <Text size="12px" tone="muted">{hint}</Text> : null}
      </Body>
    </Card>
  )
}
