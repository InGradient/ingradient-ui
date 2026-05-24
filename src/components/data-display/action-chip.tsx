import React, { forwardRef } from 'react'
import styled from 'styled-components'
import { ColorSwatch } from './color-swatch'

const Chip = styled.button`
  display: inline-flex;
  align-items: center;
  gap: var(--ig-space-2);
  padding: var(--ig-space-1) var(--ig-space-3);
  border: 1px solid var(--ig-color-border-subtle);
  border-radius: var(--ig-radius-pill);
  background: var(--ig-color-surface-muted);
  color: var(--ig-color-text-primary);
  font-size: var(--ig-font-size-2xs);
  cursor: pointer;
  white-space: nowrap;
  transition: background var(--ig-motion-fast);
  &:hover { background: var(--ig-color-surface-interactive); }
`

export interface ActionChipProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  /** Optional color swatch (xs size) displayed before the label. */
  color?: string
  /** Chip label. */
  children: React.ReactNode
}

/**
 * Interactive pill chip with optional color swatch + label. Used in chip groups
 * (`ChipGroup`), tag selectors, filter rows. For static (non-interactive) tag
 * display, use `Chip` (feedback) which is span-based.
 */
export const ActionChip = forwardRef<HTMLButtonElement, ActionChipProps>(
  ({ color, children, type, ...rest }, ref) => (
    <Chip ref={ref} type={type ?? 'button'} {...rest}>
      {color && <ColorSwatch $color={color} $size="xs" />}
      {children}
    </Chip>
  ),
)
ActionChip.displayName = 'ActionChip'
