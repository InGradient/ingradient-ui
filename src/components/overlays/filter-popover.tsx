import React, { forwardRef } from 'react'
import styled from 'styled-components'
import { surfaceRaised } from '../../primitives'

const PopoverRoot = styled.div<{ $width: number }>`
  ${surfaceRaised}
  width: ${(p) => `${p.$width}px`};
  padding: var(--ig-space-5);
  border: 1px solid var(--ig-color-border-subtle);
  border-radius: var(--ig-radius-sm);
  box-shadow: var(--ig-shadow-popover);
  z-index: 100;
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-text-secondary);
`

export interface FilterPopoverProps extends React.HTMLAttributes<HTMLDivElement> {
  /** anchor coordinates → fixed positioning + viewport-bounded max-height */
  anchor?: { top: number; left: number }
  /** popover width in px. default 280 */
  width?: number
}

export const FilterPopover = forwardRef<HTMLDivElement, FilterPopoverProps>(
  ({ anchor, width = 280, style, ...rest }, ref) => {
    const positioning: React.CSSProperties | undefined = anchor
      ? {
          position: 'fixed',
          top: anchor.top,
          left: anchor.left,
          maxHeight: `calc(100vh - ${anchor.top}px - 16px)`,
          overflowY: 'auto',
        }
      : undefined
    return <PopoverRoot ref={ref} $width={width} style={{ ...positioning, ...style }} {...rest} />
  },
)
FilterPopover.displayName = 'FilterPopover'
