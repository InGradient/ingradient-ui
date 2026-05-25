import React from 'react'
import styled from 'styled-components'
import { Stack, Text } from '../../primitives'
import { Card } from '../../components/data-display/card'
import { ActionBar } from '../../components/data-display/layout'

const BODY_STYLE = { padding: 'var(--ig-space-6) var(--ig-space-7) var(--ig-space-7)' }
const CARD_STYLE = { display: 'flex' as const, flexDirection: 'column' as const }

const PreviewMedia = styled.div`
  aspect-ratio: 16 / 10;
  background: linear-gradient(135deg, var(--ig-color-image-card-gradient-a) 0%, var(--ig-color-image-card-gradient-b) 100%), var(--ig-color-surface-interactive);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`


export function PreviewCard({
  title,
  description,
  imageSrc,
  meta,
  actions,
}: {
  title: React.ReactNode
  description?: React.ReactNode
  imageSrc: string
  meta?: React.ReactNode
  actions?: React.ReactNode
}) {
  return (
    <Card
      elevation="panel"
      radius="var(--ig-radius-2xl)"
      padding="0"
      overflow="hidden"
      style={CARD_STYLE}
    >
      <PreviewMedia>
        <img src={imageSrc} alt={typeof title === 'string' ? title : 'Preview card'} />
      </PreviewMedia>
      <Stack gap={3} style={BODY_STYLE}>
        <ActionBar>
          <Text size="14px" weight={700}>{title}</Text>
          {meta}
        </ActionBar>
        {description ? <Text size="12px" tone="muted">{description}</Text> : null}
        {actions}
      </Stack>
    </Card>
  )
}
