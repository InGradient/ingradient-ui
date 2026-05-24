import React from 'react'
import styled from 'styled-components'
import { surfacePanel } from '../../primitives'

const Cell = styled.div<{ $selected: boolean }>`
  ${surfacePanel}
  position: relative;
  border-radius: var(--ig-radius-2xl);
  overflow: hidden;
  cursor: pointer;
  border: 1px solid
    ${(p) => (p.$selected ? 'var(--ig-color-image-card-selected-border)' : 'var(--ig-color-border-subtle)')};
  box-shadow: ${(p) =>
    p.$selected
      ? '0 0 0 2px var(--ig-color-image-card-selected-ring), var(--ig-shadow-panel)'
      : 'var(--ig-shadow-panel)'};
  transition: transform var(--ig-motion-fast), border-color var(--ig-motion-fast),
    box-shadow var(--ig-motion-fast), background-color var(--ig-motion-fast);

  &:hover {
    transform: translateY(-1px);
    border-color: var(--ig-color-image-card-hover-border);
  }
`

export interface SelectableGridCellProps extends React.HTMLAttributes<HTMLDivElement> {
  selected: boolean
  draggable?: boolean
  children: React.ReactNode
}

export const SelectableGridCell = React.forwardRef<HTMLDivElement, SelectableGridCellProps>(
  function SelectableGridCell({ selected, draggable, children, ...rest }, ref) {
    return (
      <Cell
        ref={ref}
        $selected={selected}
        role="button"
        tabIndex={0}
        draggable={draggable}
        {...rest}
      >
        {children}
      </Cell>
    )
  },
)
