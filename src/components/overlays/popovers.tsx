import React, { forwardRef } from 'react'
import styled from 'styled-components'
import { surfaceRaised } from '../../primitives'

export const PopoverCard = styled.div`
  ${surfaceRaised}
  border-radius: var(--ig-radius-lg);
  padding: var(--ig-space-7);
`

export const Menu = styled.div`
  ${surfaceRaised}
  border-radius: var(--ig-radius-lg);
  padding: var(--ig-space-3);
  min-width: 180px;
`

const MenuPopoverRoot = styled.div`
  ${surfaceRaised}
  border-radius: var(--ig-radius-lg);
  padding: var(--ig-space-4);
  min-width: 220px;
  box-shadow: var(--ig-shadow-popover);
`

export interface MenuPopoverProps extends React.HTMLAttributes<HTMLDivElement> {
  anchor?: { top: number; left: number }
}

export const MenuPopover = forwardRef<HTMLDivElement, MenuPopoverProps>(
  ({ anchor, style, ...rest }, ref) => (
    <MenuPopoverRoot
      ref={ref}
      style={anchor ? { position: 'fixed', top: anchor.top, left: anchor.left, ...style } : style}
      {...rest}
    />
  ),
)
MenuPopover.displayName = 'MenuPopover'

export const TooltipBubble = styled.div`
  ${surfaceRaised}
  border-radius: var(--ig-radius-sm);
  padding: var(--ig-space-3) var(--ig-space-4);
  font-size: var(--ig-font-size-xs);
  max-width: 240px;
`

export const HoverCard = styled(PopoverCard)`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-4);
  min-width: 220px;
  max-width: 320px;
  box-shadow: var(--ig-shadow-popover);
`
