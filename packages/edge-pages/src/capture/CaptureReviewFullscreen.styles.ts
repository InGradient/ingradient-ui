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

export const CaptureReviewFullscreenBtn = styled.button`
  position: absolute;
  top: var(--ig-space-4);
  right: var(--ig-space-4);
  width: var(--ig-control-height-md);
  height: var(--ig-control-height-md);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ig-color-overlay-dim);
  border: none;
  border-radius: var(--ig-radius-xs);
  color: var(--ig-color-text-primary);
  cursor: pointer;
  z-index: var(--ig-z-capture-super);
  transition: background var(--ig-motion-swift);
  &:hover { background: var(--ig-color-modal-backdrop); }
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

export const CaptureReviewActions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ig-space-4);
  flex-shrink: 0;
`
