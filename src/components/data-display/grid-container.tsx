import React from 'react'
import styled from 'styled-components'

const Root = styled.div<{ $minWidth: number; $columns?: number; $gap: number }>`
  display: grid;
  grid-template-columns: ${(p) =>
    p.$columns
      ? `repeat(${p.$columns}, minmax(0, 1fr))`
      : `repeat(auto-fit, minmax(${p.$minWidth}px, 1fr))`};
  gap: ${(p) => `var(--ig-space-${p.$gap})`};
  min-width: 0;
`

export interface GridContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  minWidth?: number
  columns?: number
  gap?: number
  children: React.ReactNode
}

export const GridContainer = React.forwardRef<HTMLDivElement, GridContainerProps>(
  function GridContainer({ minWidth = 180, columns, gap = 6, children, ...rest }, ref) {
    return (
      <Root ref={ref} $minWidth={minWidth} $columns={columns} $gap={gap} {...rest}>
        {children}
      </Root>
    )
  },
)
