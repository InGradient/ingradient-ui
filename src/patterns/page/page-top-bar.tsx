import React from 'react'
import styled from 'styled-components'

const Bar = styled.header`
  display: flex;
  align-items: center;
  gap: var(--ig-space-5);
  min-height: 72px;
  padding: 0 var(--ig-space-7);
  background: var(--ig-color-surface-header);
  border-bottom: 1px solid var(--ig-color-border-subtle);
  flex-shrink: 0;
`

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1;
`

const Title = styled.h1`
  margin: 0;
  font-size: var(--ig-font-size-lg);
  font-weight: 600;
  color: var(--ig-color-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const Subtitle = styled.p`
  margin: 0;
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const RightSlot = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ig-space-3);
  flex-shrink: 0;
`

export interface PageTopBarProps {
  title: React.ReactNode
  subtitle?: React.ReactNode
  rightSlot?: React.ReactNode
  className?: string
}

export function PageTopBar({ title, subtitle, rightSlot, className }: PageTopBarProps) {
  return (
    <Bar className={className}>
      <TitleBlock>
        <Title>{title}</Title>
        {subtitle ? <Subtitle>{subtitle}</Subtitle> : null}
      </TitleBlock>
      {rightSlot ? <RightSlot>{rightSlot}</RightSlot> : null}
    </Bar>
  )
}
