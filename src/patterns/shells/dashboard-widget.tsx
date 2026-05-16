import React from 'react'
import styled from 'styled-components'
import { surfaceCard } from '../../primitives'

const Root = styled.div<{ $span: number }>`
  ${surfaceCard}
  border-radius: var(--ig-radius-xl);
  padding: var(--ig-space-5);
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-4);
  grid-column: span ${(p) => p.$span};
  min-width: 0;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ig-space-3);
`

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const Title = styled.h4`
  margin: 0;
  font-size: var(--ig-font-size-md);
  font-weight: 600;
  color: var(--ig-color-text-primary);
`

const Subtitle = styled.span`
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-text-muted);
`

const Actions = styled.div`
  display: inline-flex;
  align-items: center;
  gap: var(--ig-space-2);
`

const Body = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
`

export interface DashboardWidgetProps {
  title: React.ReactNode
  subtitle?: React.ReactNode
  actions?: React.ReactNode
  span?: number
  children: React.ReactNode
  className?: string
}

export function DashboardWidget({
  title, subtitle, actions, span = 1, children, className,
}: DashboardWidgetProps) {
  return (
    <Root $span={span} className={className}>
      <Header>
        <TitleBlock>
          <Title>{title}</Title>
          {subtitle ? <Subtitle>{subtitle}</Subtitle> : null}
        </TitleBlock>
        {actions ? <Actions>{actions}</Actions> : null}
      </Header>
      <Body>{children}</Body>
    </Root>
  )
}
