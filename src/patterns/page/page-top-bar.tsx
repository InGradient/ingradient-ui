import React from 'react'
import styled from 'styled-components'
import { Text } from '../../primitives'

const TITLE_STYLE = { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }

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
        <Text as="h1" size="var(--ig-font-size-lg)" weight={600} style={TITLE_STYLE}>{title}</Text>
        {subtitle ? <Text as="p" tone="muted" size="var(--ig-font-size-xs)" style={TITLE_STYLE}>{subtitle}</Text> : null}
      </TitleBlock>
      {rightSlot ? <RightSlot>{rightSlot}</RightSlot> : null}
    </Bar>
  )
}
