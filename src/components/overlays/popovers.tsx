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

export const MenuPopover = styled(Menu)`
  padding: var(--ig-space-4);
  min-width: 220px;
  box-shadow: var(--ig-shadow-popover);
`

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
