import React from 'react'
import styled from 'styled-components'
import { Text, surfacePanel } from '../../primitives'
import { ActionBar } from './layout'

const AssignmentRowRoot = styled.div`
  ${surfacePanel}
  border-radius: var(--ig-radius-lg);
  padding: var(--ig-space-6) var(--ig-space-7);
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: var(--ig-space-5);
  align-items: center;
`

const AssignmentCopy = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-1);
  min-width: 0;
`

export function AssignmentRow({
  title,
  description,
  meta,
  control,
}: {
  title: React.ReactNode
  description?: React.ReactNode
  meta?: React.ReactNode
  control?: React.ReactNode
}) {
  return (
    <AssignmentRowRoot>
      <AssignmentCopy>
        <ActionBar>
          <Text size="14px" weight={700}>{title}</Text>
          {meta}
        </ActionBar>
        {description ? <Text size="12px" tone="muted">{description}</Text> : null}
      </AssignmentCopy>
      {control}
    </AssignmentRowRoot>
  )
}
