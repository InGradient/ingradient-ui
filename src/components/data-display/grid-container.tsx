import React from 'react'
import styled from 'styled-components'

const Root = styled.div<{ $minWidth: number; $columns?: number; $gap: number; $fixedWidth: boolean }>`
  display: grid;
  grid-template-columns: ${(p) =>
    p.$columns
      ? `repeat(${p.$columns}, minmax(0, 1fr))`
      : p.$fixedWidth
      ? `repeat(auto-fill, ${p.$minWidth}px)`
      : `repeat(auto-fit, minmax(min(${p.$minWidth}px, 100%), 1fr))`};
  gap: ${(p) => `var(--ig-space-${p.$gap})`};
  min-width: 0;
`

export interface GridContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  minWidth?: number
  columns?: number
  gap?: number
  fixedWidth?: boolean
  children: React.ReactNode
}

export const GridContainer = React.forwardRef<HTMLDivElement, GridContainerProps>(
  function GridContainer({ minWidth = 180, columns, gap = 6, fixedWidth = false, children, ...rest }, ref) {
    return (
      <Root ref={ref} $minWidth={minWidth} $columns={columns} $gap={gap} $fixedWidth={fixedWidth} {...rest}>
        {children}
      </Root>
    )
  },
)
