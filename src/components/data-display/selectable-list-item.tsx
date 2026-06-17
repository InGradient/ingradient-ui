import React, { forwardRef } from 'react'
import styled, { css } from 'styled-components'

export type SelectableListItemVariant = 'flat' | 'card'

const flatStyles = css`
  padding: var(--ig-space-3) var(--ig-space-7);
  border: none;
  background: transparent;
`

const cardStyles = css`
  padding: var(--ig-space-3) var(--ig-space-4);
  border: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  background: var(--ig-color-surface-interactive);
`

const Root = styled.button<{
  $variant: SelectableListItemVariant
  $selected: boolean
  $dragOver: boolean
}>`
  display: flex;
  align-items: center;
  gap: var(--ig-space-3);
  width: 100%;
  border-radius: var(--ig-radius-sm);
  color: var(--ig-color-text-primary);
  font-size: var(--ig-font-size-sm);
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  transition: background-color var(--ig-motion-fast), border-color var(--ig-motion-fast);

  ${(p) => (p.$variant === 'flat' ? flatStyles : cardStyles)}

  ${(p) =>
    p.$selected &&
    css`
      background: var(--ig-color-selection-bg);
      ${p.$variant === 'card' && 'border-color: var(--ig-color-accent);'}
      color: var(--ig-color-accent);
    `}

  ${(p) =>
    p.$dragOver &&
    css`
      background: var(--ig-color-accent-soft-surface-hover);
      outline: var(--ig-border-2px) solid var(--ig-color-accent);
      outline-offset: var(--ig-space-neg-2px);
    `}

  &:hover:not(:disabled) {
    background: ${(p) =>
      p.$selected ? 'var(--ig-color-accent-soft-surface-hover)' : 'var(--ig-color-surface-interactive-hover)'};
  }
`

export interface SelectableListItemProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: SelectableListItemVariant
  selected?: boolean
  dragOver?: boolean
  /** Render element. default 'button' (clickable). use 'li' for semantic list rows. */
  as?: 'button' | 'li'
  'data-ig-component'?: string
  'data-ig-slot'?: string
  children: React.ReactNode
}

export const SelectableListItem = forwardRef<HTMLElement, SelectableListItemProps>(
  ({
    variant = 'card',
    selected = false,
    dragOver = false,
    as = 'button',
    type,
    children,
    'data-ig-component': componentHint,
    'data-ig-slot': slotHint,
    ...rest
  }, ref) => {
    const componentName = 'SelectableListItem'
    const slotName = slotHint ?? (componentHint && componentHint !== componentName ? componentHint : undefined)

    return (
    <Root
      as={as}
      ref={ref as React.Ref<HTMLButtonElement>}
      type={as === 'button' ? type ?? 'button' : undefined}
      $variant={variant}
      $selected={selected}
      $dragOver={dragOver}
      data-ig-component={componentName}
      data-ig-layer="components"
      data-ig-slot={slotName}
      {...rest}
    >
      {children}
    </Root>
    )
  },
)
SelectableListItem.displayName = 'SelectableListItem'
