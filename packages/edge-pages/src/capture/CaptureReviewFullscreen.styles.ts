import styled from 'styled-components'

export const CaptureReview = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--ig-space-7);
  padding: var(--ig-space-11);
  &:fullscreen { background: var(--ig-color-bg-canvas); }
`

export const CapturePreviewImg = styled.img`
  flex: 1;
  min-height: 0;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: var(--ig-radius-xs);
  user-select: none;
  -webkit-user-drag: none;
`
