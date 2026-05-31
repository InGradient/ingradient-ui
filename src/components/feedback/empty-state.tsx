import React from 'react'
import styled from 'styled-components'
import { stateCenteredLayout, stateDescriptionText, stateTitleText } from '../../primitives'

const Wrap = styled.div`
  ${stateCenteredLayout}
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--ig-space-4);
  padding: var(--ig-space-10) var(--ig-space-6);
  text-align: center;
  color: var(--ig-color-text-muted);
`

const IconWrap = styled.div`
  color: var(--ig-color-text-soft);
  opacity: 0.6;
`

const Title = styled.div`
  ${stateTitleText}
`

const Description = styled.div`
  ${stateDescriptionText}
  max-width: 320px;
`

const ActionBtn = styled.button`
  border: 1px solid var(--ig-color-border-strong);
  border-radius: var(--ig-radius-sm);
  background: transparent;
  color: var(--ig-color-text-primary);
  font-size: var(--ig-font-size-xs);
  padding: var(--ig-space-2) var(--ig-space-5);
  cursor: pointer;
  transition: background var(--ig-motion-fast);
  &:hover { background: var(--ig-color-surface-interactive); }
`

export interface EmptyStateProps {
  icon?: React.ReactNode
  title?: string
  description?: string
  action?: { label: string; onClick: () => void }
  className?: string
  children?: React.ReactNode
}

export function EmptyState({ icon, title, description, action, className, children }: EmptyStateProps) {
  return (
    <Wrap className={className}>
      {icon && <IconWrap>{icon}</IconWrap>}
      {title && <Title>{title}</Title>}
      {description && <Description>{description}</Description>}
      {action && <ActionBtn type="button" onClick={action.onClick}>{action.label}</ActionBtn>}
      {children}
    </Wrap>
  )
}
