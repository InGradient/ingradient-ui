import styled, { css } from 'styled-components'

export const TableWrap = styled.div.attrs({ tabIndex: 0, role: 'region' })`
  overflow-x: auto;
  &:focus-visible {
    outline: 2px solid var(--ig-color-accent-ring);
    outline-offset: -2px;
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
  font-weight: 500;
  border-bottom: 1px solid var(--ig-color-border-subtle);
`

export const Td = styled.td<{ $numeric?: boolean; $muted?: boolean; $mono?: boolean }>`
  padding: var(--ig-space-5);
  color: ${(p) => (p.$muted ? 'var(--ig-color-text-muted)' : 'var(--ig-color-text-secondary)')};
  border-bottom: 1px solid var(--ig-color-border-subtle);
  ${(p) => p.$numeric && 'text-align: right; font-variant-numeric: tabular-nums;'}
  ${(p) => p.$mono && 'font-family: monospace; font-size: 12px;'}
`

export const Tfoot = styled.tfoot`
  & td {
    font-weight: 600;
    color: var(--ig-color-text-primary);
    border-top: 1px solid var(--ig-color-border-subtle);
    border-bottom: none;
  }
`

export const DragTh = styled(Th)`width: 36px; padding: var(--ig-space-4) var(--ig-space-2);`
export const DragTd = styled(Td)`width: 36px; padding: var(--ig-space-3) var(--ig-space-2);`

export const VisuallyHidden = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
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
  width: 28px;
  height: 28px;
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
  z-index: 10;
  box-shadow: var(--ig-shadow-menu);
  background: var(--ig-color-surface-raised);
`

const animatingRow = css`
  transition: transform 0.2s ease;
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
  &:hover {
    background: var(--ig-color-white-04);
  }
`

export const PlainTr = styled.tr<{ $clickable?: boolean }>`
  cursor: ${(p) => (p.$clickable ? 'pointer' : 'default')};
  &:hover {
    background: var(--ig-color-white-04);
  }
`
