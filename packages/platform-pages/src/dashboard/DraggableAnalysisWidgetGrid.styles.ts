import styled from 'styled-components'

export const Rows = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-9);
`

export const Row = styled.div<{ $count: number }>`
  position: relative;
  display: grid;
  grid-template-columns: repeat(${(p) => Math.max(1, Math.min(3, p.$count))}, minmax(0, 1fr));
  gap: var(--ig-space-9);
  align-items: start;
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`

export const RowDropIndicator = styled.div<{ $active: boolean }>`
  position: absolute;
  left: 0;
  right: 0;
  bottom: -10px;
  height: 4px;
  border-radius: var(--ig-radius-pill);
  background: rgba(77, 136, 255, 0.92);
  opacity: ${(p) => (p.$active ? 1 : 0)};
  transition: opacity 0.16s ease;
  pointer-events: none;
`

export const RowDropZone = styled.div<{ $active: boolean }>`
  position: absolute;
  left: 0;
  right: 0;
  bottom: -20px;
  height: var(--ig-control-height-xs);
  z-index: 6;
  opacity: ${(p) => (p.$active ? 1 : 0.0001)};
`

export const WidgetShell = styled.div<{ $dragging: boolean; $dropTarget: false | 'before' | 'after' }>`
  position: relative;
  min-width: 0;
  cursor: default;
  opacity: ${(p) => (p.$dragging ? 0.5 : 1)};
  transform: ${(p) => (p.$dragging ? 'scale(0.985)' : 'none')};
  transition:
    opacity 0.16s ease,
    transform 0.16s ease,
    filter 0.16s ease;
  filter: ${(p) =>
    p.$dropTarget ? 'drop-shadow(0 0 0.85rem var(--ig-color-blue-tint-18))' : 'none'};
  &::after {
    content: '';
    position: absolute;
    pointer-events: none;
    border-radius: var(--ig-radius-pill);
    background: rgba(77, 136, 255, 0.92);
    opacity: ${(p) => (p.$dropTarget ? 1 : 0)};
    transition: opacity 0.16s ease;
  }
  ${(p) =>
    p.$dropTarget === 'before'
      ? `
        &::after {
          top: 18px;
          bottom: 18px;
          left: -12px;
          width: 4px;
        }
      `
      : ''}
  ${(p) =>
    p.$dropTarget === 'after'
      ? `
        &::after {
          top: 18px;
          bottom: 18px;
          right: -12px;
          width: 4px;
        }
      `
      : ''}
`

export const WidgetDropZone = styled.div<{ $position: 'before' | 'after'; $active: boolean }>`
  position: absolute;
  z-index: 7;
  ${(p) =>
    p.$position === 'before'
      ? `
        top: 16px;
        bottom: 16px;
        left: -14px;
        width: var(--ig-control-height-xs);
      `
      : ''}
  ${(p) =>
    p.$position === 'after'
      ? `
        top: 16px;
        bottom: 16px;
        right: -14px;
        width: var(--ig-control-height-xs);
      `
      : ''}
  opacity: ${(p) => (p.$active ? 1 : 0.0001)};
`

export const DragOverlayCard = styled.div`
  min-width: var(--ig-popup-xs);
  max-width: var(--ig-popup-md);
  padding: var(--ig-space-6) 16px;
  border-radius: 18px;
  border: var(--ig-border-1px) solid var(--ig-color-blue-tint-28);
  background: linear-gradient(180deg, rgba(18, 24, 34, 0.98) 0%, rgba(12, 16, 24, 0.98) 100%);
  box-shadow: 0 24px 56px rgba(0, 0, 0, 0.34);
`

export const DragOverlayTitle = styled.div`
  font-size: var(--ig-font-size-sm);
  font-weight: var(--ig-font-weight-bold);
  color: var(--ig-color-text-primary);
`
