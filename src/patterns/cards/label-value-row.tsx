import React from 'react'
import styled from 'styled-components'
import { Text } from '../../primitives'
import { Card } from '../../components/data-display/card'
import { ActionBar } from '../../components/data-display/layout'

const RowGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: var(--ig-space-5);
  align-items: center;
`

const LabelValueCopy = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-1);
  min-width: 0;
`

export function LabelValueRow({
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
    <Card
      elevation="panel"
      radius="var(--ig-radius-lg)"
      padding="var(--ig-space-6) var(--ig-space-7)"
    >
      <RowGrid>
        <LabelValueCopy>
          <ActionBar>
            <Text size="14px" weight={700}>{title}</Text>
            {meta}
          </ActionBar>
          {description ? <Text size="12px" tone="muted">{description}</Text> : null}
        </LabelValueCopy>
        {control}
      </RowGrid>
    </Card>
  )
}
