import React from 'react'
import styled from 'styled-components'
import { surfacePanel } from '../../primitives'

const Cell = styled.div<{ $selected: boolean }>`
  ${surfacePanel}
  position: relative;
  border-radius: var(--ig-radius-2xl);
  overflow: hidden;
  cursor: pointer;
  border: var(--ig-border-1px) solid
    ${(p) => (p.$selected ? 'var(--ig-color-image-card-selected-border)' : 'var(--ig-color-border-subtle)')};
  box-shadow: ${(p) =>
    p.$selected
      ? '0 0 0 2px var(--ig-color-image-card-selected-ring), var(--ig-shadow-panel)'
      : 'var(--ig-shadow-panel)'};
  transition: transform var(--ig-motion-fast), border-color var(--ig-motion-fast),
    box-shadow var(--ig-motion-fast), background-color var(--ig-motion-fast);

  &:hover {
    transform: translateY(var(--ig-transform-hover-lift-y));
    border-color: var(--ig-color-image-card-hover-border);
  }
`

export interface SelectableGridCellProps extends React.HTMLAttributes<HTMLDivElement> {
  selected: boolean
  draggable?: boolean
  /** Accessible label for the cell action (e.g. "Select image 'foo.jpg'"). Caller 가 항상 지정 권장. */
  ariaLabel?: string
  children: React.ReactNode
}

export const SelectableGridCell = React.forwardRef<HTMLDivElement, SelectableGridCellProps>(
  function SelectableGridCell({ selected, draggable, ariaLabel = 'Grid item', children, onClick, onKeyDown, ...rest }, ref) {
    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if ((event.key === 'Enter' || event.key === ' ') && onClick) {
        event.preventDefault()
        onClick(event as unknown as React.MouseEvent<HTMLDivElement>)
      }
      onKeyDown?.(event)
    }
    return (
      <Cell
        ref={ref}
        $selected={selected}
        role="button"
        tabIndex={0}
        aria-label={ariaLabel}
        aria-pressed={selected}
        draggable={draggable}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {children}
      </Cell>
    )
  },
)
