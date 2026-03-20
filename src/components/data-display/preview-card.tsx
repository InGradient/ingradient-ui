import React from 'react'
import styled from 'styled-components'
import { Text, surfacePanel } from '../../primitives'
import { ActionBar } from './layout'

const PreviewCardRoot = styled.div`
  ${surfacePanel}
  border-radius: var(--ig-radius-2xl);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`

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

const PreviewBody = styled.div`
  padding: var(--ig-space-6) var(--ig-space-7) var(--ig-space-7);
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-3);
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
    <PreviewCardRoot>
      <PreviewMedia>
        <img src={imageSrc} alt={typeof title === 'string' ? title : 'Preview card'} />
      </PreviewMedia>
      <PreviewBody>
        <ActionBar>
          <Text size="14px" weight={700}>{title}</Text>
          {meta}
        </ActionBar>
        {description ? <Text size="12px" tone="muted">{description}</Text> : null}
        {actions}
      </PreviewBody>
    </PreviewCardRoot>
  )
}
