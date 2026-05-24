import React from 'react'
import styled from 'styled-components'
import { Card } from '../../components/data-display/card'
import { ActionBar } from '../../components/data-display/layout'

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-3);
`

const StatLabel = styled.span`
  font-size: var(--ig-font-size-xs);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--ig-color-text-soft);
`

const StatValue = styled.span`
  font-size: var(--ig-font-size-3xl);
  line-height: 1;
  font-weight: 800;
  color: var(--ig-color-text-primary);
`

const StatHint = styled.span`
  font-size: var(--ig-font-size-sm);
  color: var(--ig-color-text-muted);
`

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
      <Body>
        <ActionBar>
          <StatLabel>{label}</StatLabel>
          {meta}
        </ActionBar>
        <StatValue>{value}</StatValue>
        {hint ? <StatHint>{hint}</StatHint> : null}
      </Body>
    </Card>
  )
}

export const MetricCard = StatCard
