import React, { forwardRef } from 'react'
import styled from 'styled-components'
import { surfaceRaised } from '../../primitives'
import { popupSizeNumbers } from '../../tokens/core'

const PopoverRoot = styled.div<{ $width: number }>`
  ${surfaceRaised}
  width: ${(p) => `${p.$width}px`};
  padding: var(--ig-space-5);
  border: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  border-radius: var(--ig-radius-sm);
  box-shadow: var(--ig-shadow-popover);
  z-index: var(--ig-z-dropdown);
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-text-secondary);
`

export interface FilterPopoverProps extends React.HTMLAttributes<HTMLDivElement> {
  /** anchor coordinates → fixed positioning + viewport-bounded max-height */
  anchor?: { top: number; left: number }
  /** popover width in px. default popupSizeNumbers.sm (280) */
  width?: number
}

export const FilterPopover = forwardRef<HTMLDivElement, FilterPopoverProps>(
  ({ anchor, width = popupSizeNumbers.sm, style, ...rest }, ref) => {
    const positioning: React.CSSProperties | undefined = anchor
      ? {
          position: 'fixed',
          top: anchor.top,
          left: anchor.left,
          maxHeight: `calc(100vh - ${anchor.top}px - var(--ig-space-7))`,
          overflowY: 'auto',
        }
      : undefined
    return <PopoverRoot ref={ref} $width={width} style={{ ...positioning, ...style }} {...rest} />
  },
)
FilterPopover.displayName = 'FilterPopover'
