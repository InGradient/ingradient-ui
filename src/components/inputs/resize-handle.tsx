import { forwardRef, type HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

export type ResizeHandleOrientation = 'vertical' | 'horizontal'

const orientationStyles = {
  vertical: css`
    flex: 0 0 var(--ig-space-3);
    cursor: col-resize;
    &::after { inset: 0 var(--ig-space-3px); }
  `,
  horizontal: css`
    flex: 0 0 var(--ig-space-3);
    cursor: row-resize;
    &::after { inset: var(--ig-space-3px) 0; }
  `,
}

const Root = styled.div<{ $orientation: ResizeHandleOrientation }>`
  position: relative;
  z-index: var(--ig-z-sticky);
  ${(p) => orientationStyles[p.$orientation]}
  &::after {
    content: '';
    position: absolute;
    background: transparent;
    transition: background var(--ig-motion-fast);
  }
  &:hover::after,
  &:active::after {
    background: var(--ig-color-white-12);
  }
`

export interface ResizeHandleProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'role' | 'aria-orientation'> {
  orientation?: ResizeHandleOrientation
}

/**
 * Drag-to-resize separator handle. The 8px target spans the parent's cross-axis;
 * the narrow visual strip (via ::after) is centered with insets.
 * Caller wires onMouseDown to drive the resize math.
 */
export const ResizeHandle = forwardRef<HTMLDivElement, ResizeHandleProps>(function ResizeHandle(
  { orientation = 'vertical', ...rest },
  ref,
) {
  return (
    <Root
      ref={ref}
      $orientation={orientation}
      role="separator"
      aria-orientation={orientation}
      {...rest}
    />
  )
})
