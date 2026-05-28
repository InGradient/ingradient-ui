import React from 'react'
import styled from 'styled-components'

const Wrap = styled.div`
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
  font-size: var(--ig-font-size-sm);
  font-weight: var(--ig-font-weight-semibold);
  color: var(--ig-color-text-primary);
`

const Description = styled.div`
  font-size: var(--ig-font-size-xs);
  line-height: var(--ig-line-height-relaxed);
  max-width: 320px;
`

const ActionBtn = styled.button`
  border: var(--ig-border-1px) solid var(--ig-color-border-strong);
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
  'data-ig-component'?: string
  'data-ig-slot'?: string
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  children,
  'data-ig-component': componentHint,
  'data-ig-slot': slotHint,
}: EmptyStateProps) {
  const componentName = 'EmptyState'
  const slotName = slotHint ?? (componentHint && componentHint !== componentName ? componentHint : undefined)

  return (
    <Wrap
      className={className}
      data-ig-component={componentName}
      data-ig-layer="components"
      data-ig-slot={slotName}
      data-ig-kind="empty-state"
      data-ig-label={title ?? description ?? 'Empty state'}
    >
      {icon ? (
        <IconWrap data-ig-slot="EmptyState.Icon" data-ig-kind="icon" data-ig-label="Empty state icon">
          {icon}
        </IconWrap>
      ) : null}
      {title ? (
        <Title data-ig-slot="EmptyState.Title" data-ig-kind="text" data-ig-label={title}>
          {title}
        </Title>
      ) : null}
      {description ? (
        <Description data-ig-slot="EmptyState.Description" data-ig-kind="text" data-ig-label={description}>
          {description}
        </Description>
      ) : null}
      {action ? (
        <ActionBtn
          type="button"
          onClick={action.onClick}
          data-ig-slot="EmptyState.Action"
          data-ig-kind="button"
          data-ig-label={action.label}
        >
          {action.label}
        </ActionBtn>
      ) : null}
      {children}
    </Wrap>
  )
}
