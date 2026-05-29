import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import styled, { css } from 'styled-components'

export type DropZoneVariant = 'outlined' | 'filled'

const variantBase = {
  outlined: css`
    border: var(--ig-border-2px) dashed var(--ig-color-border-subtle);
    border-radius: var(--ig-radius-lg);
    background: transparent;
  `,
  filled: css`
    border: var(--ig-border-1px) solid var(--ig-color-border-subtle);
    border-radius: var(--ig-radius-xxs);
    background: var(--ig-color-surface-raised);
  `,
}

const Root = styled.div<{ $variant: DropZoneVariant; $active: boolean; $disabled: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(p) => (p.$disabled ? 'var(--ig-color-text-soft)' : 'var(--ig-color-text-muted)')};
  cursor: ${(p) => (p.$disabled ? 'not-allowed' : 'inherit')};
  opacity: ${(p) => (p.$disabled ? 'var(--ig-opacity-muted)' : 1)};
  transition:
    border-color var(--ig-motion-fast),
    background var(--ig-motion-fast),
    color var(--ig-motion-fast);
  ${(p) => variantBase[p.$variant]}
  ${(p) =>
    p.$active &&
    !p.$disabled &&
    css`
      border-color: var(--ig-color-accent);
      background: var(--ig-color-accent-soft-surface);
    `}
  ${(p) =>
    p.$disabled &&
    p.$variant === 'outlined' &&
    css`
      background: repeating-linear-gradient(
        135deg,
        var(--ig-color-surface-muted) 0 10px,
        var(--ig-color-bg-canvas) 10px 20px
      );
    `}
`

export interface DropZoneProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  variant?: DropZoneVariant
  active?: boolean
  disabled?: boolean
  children: ReactNode
}

/**
 * Universal drop target surface. Caller wires the drag event handlers and
 * decides what to do with `dataTransfer`; this component only renders the
 * visual chrome (border / background / active highlight / disabled state).
 *
 * `variant="outlined"` for file-upload boxes (dashed, large). `variant="filled"`
 * for slim inline drop targets (solid, compact).
 */
export const DropZone = forwardRef<HTMLDivElement, DropZoneProps>(function DropZone(
  { variant = 'outlined', active = false, disabled = false, children, ...rest },
  ref,
) {
  return (
    <Root ref={ref} $variant={variant} $active={active} $disabled={disabled} {...rest}>
      {children}
    </Root>
  )
})
