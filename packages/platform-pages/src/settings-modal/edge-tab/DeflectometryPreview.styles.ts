import styled from 'styled-components'

export const PreviewWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-3);
  margin-top: var(--ig-space-5);
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
  font-size: var(--ig-text-caption);
  color: var(--ig-color-text-muted);
`
