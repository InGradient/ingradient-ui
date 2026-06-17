import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import styled, { css } from 'styled-components'
import { surfaceRaised } from '../../primitives'

export type FloatingOverlayVariant = 'tooltip' | 'menu'

const variantStyles = {
  tooltip: css`
    z-index: var(--ig-z-tooltip);
    pointer-events: none;
  `,
  menu: css`
    z-index: var(--ig-z-context-menu);
    pointer-events: auto;
  `,
}

const Surface = styled.div<{ $variant: FloatingOverlayVariant }>`
  ${surfaceRaised}
  position: fixed;
  border-radius: var(--ig-radius-md);
  ${(p) => variantStyles[p.$variant]}
`

export interface FloatingOverlayProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  top: number
  left: number
  variant?: FloatingOverlayVariant
  children: ReactNode
}

/**
 * Fixed-position floating surface used by tooltips, hover cards, and menus.
 * Caller controls top/left positioning; variant toggles z-index + pointer-events.
 * Width/padding/min-width/etc. are passed via `style` to keep this primitive small.
 */
export const FloatingOverlay = forwardRef<HTMLDivElement, FloatingOverlayProps>(
  function FloatingOverlay({ top, left, variant = 'menu', children, style, ...rest }, ref) {
    return (
      <Surface ref={ref} $variant={variant} style={{ top, left, ...style }} {...rest}>
        {children}
      </Surface>
    )
  },
)
