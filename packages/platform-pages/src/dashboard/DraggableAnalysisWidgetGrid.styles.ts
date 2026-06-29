import { media } from '@ingradient/ui/tokens'
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
  ${media.lg} {
    grid-template-columns: 1fr;
  }
`

export const RowDropIndicator = styled.div<{ $active: boolean }>`
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(var(--ig-space-4) * -1);
  height: var(--ig-space-1);
  border-radius: var(--ig-radius-pill);
  background: var(--ig-color-blue-tint-92);
  opacity: ${(p) => (p.$active ? 1 : 0)};
  transition: opacity var(--ig-motion-fast-ease);
  pointer-events: none;
`

export const RowDropZone = styled.div<{ $active: boolean }>`
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(var(--ig-space-9) * -1);
  height: var(--ig-control-height-xs);
  z-index: var(--ig-z-capture-super);
  opacity: ${(p) => (p.$active ? 1 : 0.0001)};
`

export const WidgetShell = styled.div<{ $dragging: boolean; $dropTarget: false | 'before' | 'after' }>`
  position: relative;
  min-width: 0;
  cursor: default;
  opacity: ${(p) => (p.$dragging ? 0.5 : 1)};
  transform: ${(p) => (p.$dragging ? 'scale(var(--ig-scale-drag))' : 'none')};
  transition:
    opacity 0.16s ease,
    transform 0.16s ease,
    filter 0.16s ease;
  filter: ${(p) =>
    p.$dropTarget ? 'drop-shadow(0 0 0.85rem var(--ig-color-accent-soft-surface-hover))' : 'none'};
  &::after {
    content: '';
    position: absolute;
    pointer-events: none;
    border-radius: var(--ig-radius-pill);
    background: var(--ig-color-blue-tint-92);
    opacity: ${(p) => (p.$dropTarget ? 1 : 0)};
    transition: opacity var(--ig-motion-fast-ease);
  }
  ${(p) =>
    p.$dropTarget === 'before'
      ? `
        &::after {
          top: var(--ig-space-8);
          bottom: var(--ig-space-8);
          left: calc(var(--ig-space-5) * -1);
          width: var(--ig-space-1);
        }
      `
      : ''}
  ${(p) =>
    p.$dropTarget === 'after'
      ? `
        &::after {
          top: var(--ig-space-8);
          bottom: var(--ig-space-8);
          right: calc(var(--ig-space-5) * -1);
          width: var(--ig-space-1);
        }
      `
      : ''}
`

export const WidgetDropZone = styled.div<{ $position: 'before' | 'after'; $active: boolean }>`
  position: absolute;
  z-index: var(--ig-z-capture-top);
  ${(p) =>
    p.$position === 'before'
      ? `
        top: var(--ig-space-7);
        bottom: var(--ig-space-7);
        left: calc(var(--ig-space-6) * -1);
        width: var(--ig-control-height-xs);
      `
      : ''}
  ${(p) =>
    p.$position === 'after'
      ? `
        top: var(--ig-space-7);
        bottom: var(--ig-space-7);
        right: calc(var(--ig-space-6) * -1);
        width: var(--ig-control-height-xs);
      `
      : ''}
  opacity: ${(p) => (p.$active ? 1 : 0.0001)};
`

export const DragOverlayCard = styled.div`
  min-width: var(--ig-popup-xs);
  max-width: var(--ig-popup-md);
  padding: var(--ig-space-6) var(--ig-space-7);
  border-radius: var(--ig-radius-xl);
  border: var(--ig-border-1px) solid var(--ig-color-active-bg);
  background: linear-gradient(180deg, var(--ig-color-surface-dropdown-grid-top) 0%, var(--ig-color-surface-dropdown-grid-bottom) 100%);
  box-shadow: 0 24px 56px var(--ig-color-blue-tint-34);
`

export const DragOverlayTitle = styled.div`
  font-size: var(--ig-font-size-sm);
  font-weight: var(--ig-font-weight-bold);
  color: var(--ig-color-text-primary);
`
