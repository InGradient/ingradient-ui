import React from 'react'
import styled from 'styled-components'
import { Text, surfacePanel } from '../../primitives'
import { ProgressBar } from '../feedback/progress'
import { ActionBar } from './layout'

const ProgressBlockRoot = styled.div`
  ${surfacePanel}
  border-radius: var(--ig-radius-lg);
  padding: var(--ig-space-7);
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
    <ProgressBlockRoot>
      <ActionBar>
        <Text size="13px" weight={700}>{label}</Text>
        <Text size="12px" tone="soft">{Math.round(value)}%</Text>
      </ActionBar>
      <ProgressBar value={value} />
      {hint ? <Text size="12px" tone="muted">{hint}</Text> : null}
    </ProgressBlockRoot>
  )
}
