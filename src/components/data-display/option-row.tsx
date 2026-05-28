import React, { forwardRef } from 'react'
import styled from 'styled-components'

const Root = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ig-space-5);
  padding: var(--ig-space-4) var(--ig-space-5);
  border: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  border-radius: var(--ig-radius-sm);
  background: var(--ig-color-surface-interactive);
  color: var(--ig-color-text-primary);
  cursor: pointer;
  text-align: left;
  font: inherit;
  &:hover:not(:disabled) {
    border-color: var(--ig-color-accent);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const TextStack = styled.span`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-2px);
  min-width: 0;
  font-size: var(--ig-font-size-sm);
`

const Secondary = styled.span`
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-text-muted);
`

const Action = styled.span`
  font-size: var(--ig-font-size-xs);
  white-space: nowrap;
  flex-shrink: 0;
`

export interface OptionRowProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  primary: React.ReactNode
  secondary?: React.ReactNode
  actionLabel: React.ReactNode
}

export const OptionRow = forwardRef<HTMLButtonElement, OptionRowProps>(
  ({ primary, secondary, actionLabel, type, ...rest }, ref) => (
    <Root ref={ref} type={type ?? 'button'} {...rest}>
      <TextStack>
        <span>{primary}</span>
        {secondary != null && <Secondary>{secondary}</Secondary>}
      </TextStack>
      <Action>{actionLabel}</Action>
    </Root>
  ),
)
OptionRow.displayName = 'OptionRow'
