import styled from 'styled-components'

export const PreviewWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
`

export const BadgeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`

export const Badge = styled.button<{ $active: boolean }>`
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid
    ${({ $active }) => ($active ? 'var(--ig-color-accent)' : 'var(--ig-color-border-strong)')};
  background: ${({ $active }) => ($active ? 'var(--ig-color-accent)' : 'var(--ig-color-text-primary)')};
  color: ${({ $active }) => ($active ? 'var(--ig-color-text-primary)' : 'var(--ig-color-text-secondary)')};
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition:
    background 0.15s,
    border-color 0.15s,
    color 0.15s;
  &:hover {
    border-color: var(--ig-color-accent);
    color: var(--ig-color-text-primary);
  }
`

export const CanvasFrame = styled.div`
  display: inline-flex;
  padding: 4px;
  background: var(--ig-color-bg-canvas);
  border-radius: 8px;
  align-self: flex-start;
  canvas {
    display: block;
    border-radius: 4px;
    image-rendering: pixelated;
  }
`

export const PreviewHint = styled.div`
  font-size: 12px;
  color: var(--ig-color-text-muted);
`
