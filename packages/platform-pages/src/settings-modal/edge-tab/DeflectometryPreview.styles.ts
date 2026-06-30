import styled from 'styled-components'

export const PreviewWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-3);
  margin-top: var(--ig-space-5);
`

export const BadgeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--ig-space-2);
`

export const Badge = styled.button<{ $active: boolean }>`
  padding: var(--ig-space-1) var(--ig-space-4);
  border-radius: var(--ig-radius-pill);
  border: var(--ig-border-1px) solid
    ${({ $active }) => ($active ? 'var(--ig-color-accent)' : 'var(--ig-color-border-strong)')};
  background: ${({ $active }) => ($active ? 'var(--ig-color-accent)' : 'var(--ig-color-text-primary)')};
  color: ${({ $active }) => ($active ? 'var(--ig-color-text-primary)' : 'var(--ig-color-text-secondary)')};
  font-size: var(--ig-font-size-xs);
  font-weight: var(--ig-font-weight-medium);
  cursor: pointer;
  transition:
    background var(--ig-motion-swift),
    border-color var(--ig-motion-swift),
    color var(--ig-motion-swift);
  &:hover {
    border-color: var(--ig-color-accent);
    color: var(--ig-color-text-primary);
  }
`

export const CanvasFrame = styled.div`
  display: inline-flex;
  padding: var(--ig-space-1);
  background: var(--ig-color-bg-canvas);
  border-radius: var(--ig-radius-md);
  align-self: flex-start;
  canvas {
    display: block;
    border-radius: var(--ig-radius-2xs);
    image-rendering: pixelated;
  }
`

export const PreviewHint = styled.div`
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-text-muted);
`
