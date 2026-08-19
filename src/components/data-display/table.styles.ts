import styled, { css } from 'styled-components'

export const TableWrap = styled.div.attrs({ tabIndex: 0, role: 'region' })`
  overflow-x: auto;
  &:focus-visible {
    outline: var(--ig-border-2px) solid var(--ig-color-accent-ring);
    outline-offset: var(--ig-space-neg-2px);
  }
`

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
`

export const Th = styled.th<{ $numeric?: boolean }>`
  text-align: ${(p) => (p.$numeric ? 'right' : 'left')};
  padding: var(--ig-space-4) var(--ig-space-5);
  color: var(--ig-color-text-muted);
  font-size: var(--ig-font-size-xs);
  font-weight: var(--ig-font-weight-medium);
  border-bottom: var(--ig-border-1px) solid var(--ig-color-border-subtle);
`

export const Td = styled.td<{ $numeric?: boolean; $muted?: boolean; $mono?: boolean }>`
  padding: var(--ig-space-5);
  color: ${(p) => (p.$muted ? 'var(--ig-color-text-muted)' : 'var(--ig-color-text-secondary)')};
  border-bottom: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  ${(p) => p.$numeric && 'text-align: right; font-variant-numeric: tabular-nums;'}
  ${(p) => p.$mono && 'font-family: var(--ig-font-mono); font-size: var(--ig-font-size-xs);'}
`

export const Tfoot = styled.tfoot`
  & td {
    font-weight: var(--ig-font-weight-semibold);
    color: var(--ig-color-text-primary);
    border-top: var(--ig-border-1px) solid var(--ig-color-border-subtle);
    border-bottom: none;
  }
`

export const DragTh = styled(Th)`width: var(--ig-control-height-md); padding: var(--ig-space-4) var(--ig-space-2);`
export const DragTd = styled(Td)`width: var(--ig-control-height-md); padding: var(--ig-space-3) var(--ig-space-2);`

export const VisuallyHidden = styled.span`
  position: absolute;
  width: var(--ig-space-1px);
  height: var(--ig-space-1px);
  padding: 0;
  margin: var(--ig-space-neg-1px);
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`

export const HandleBtn = styled.button.attrs({ type: 'button', 'aria-label': 'Reorder row' })`
  cursor: grab;
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--ig-control-height-xs);
  height: var(--ig-control-height-xs);
  border: none;
  border-radius: var(--ig-radius-sm);
  background: transparent;
  color: var(--ig-color-text-muted);
  flex-shrink: 0;
  user-select: none;
  &:hover {
    background: var(--ig-color-white-08);
    color: var(--ig-color-text-primary);
  }
`

const draggingRow = css`
  position: relative;
  z-index: var(--ig-z-sticky);
  box-shadow: var(--ig-shadow-menu);
  background: var(--ig-color-surface-raised);
`

const animatingRow = css`
  transition: transform var(--ig-motion-normal);
`

const clickableRowFocus = css`
  &:focus-visible {
    position: relative;
    z-index: var(--ig-z-base);
    outline: var(--ig-border-2px) solid var(--ig-color-accent-ring);
    outline-offset: var(--ig-space-neg-2px);
  }
`

export const StyledTr = styled.tr<{
  $clickable?: boolean
  $yOffset: number
  $isDragging: boolean
  $isAnimating: boolean
}>`
  cursor: ${(p) => (p.$clickable ? 'pointer' : 'default')};
  transform: translateY(${(p) => p.$yOffset}px);
  ${(p) => p.$isDragging && draggingRow}
  ${(p) => p.$isAnimating && animatingRow}
  ${(p) => p.$clickable && clickableRowFocus}
  &:hover {
    background: var(--ig-color-white-04);
  }
`

export const PlainTr = styled.tr<{ $clickable?: boolean }>`
  cursor: ${(p) => (p.$clickable ? 'pointer' : 'default')};
  ${(p) => p.$clickable && clickableRowFocus}
  &:hover {
    background: var(--ig-color-white-04);
  }
`
