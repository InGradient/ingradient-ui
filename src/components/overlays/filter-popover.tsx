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

const SectionWrap = styled.div`
  margin-bottom: var(--ig-space-5);
  &:last-child { margin-bottom: 0; }
`

const SectionTitle = styled.div`
  font-size: var(--ig-font-size-2xs);
  font-weight: 600;
  color: var(--ig-color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ig-space-3);
  margin-bottom: var(--ig-space-3);
`

export interface FilterPopoverSectionProps {
  title: string
  /** Optional right-aligned actions (Select all, Reset, etc.) */
  actions?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function FilterPopoverSection({ title, actions, children, className }: FilterPopoverSectionProps) {
  return (
    <SectionWrap className={className}>
      <SectionHeader>
        <SectionTitle>{title}</SectionTitle>
        {actions}
      </SectionHeader>
      {children}
    </SectionWrap>
  )
}
