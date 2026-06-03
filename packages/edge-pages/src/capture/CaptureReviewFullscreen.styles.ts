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
  top: 10px;
  right: 10px;
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
  z-index: 6;
  transition: background 0.15s;
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

export const CaptureReviewSkipBtn = styled.button`
  height: 40px;
  padding: 0 var(--ig-space-8);
  border: var(--ig-border-1px) solid var(--ig-color-white-18);
  border-radius: var(--ig-radius-xs);
  background: transparent;
  color: var(--ig-color-white-70);
  font-size: var(--ig-font-size-sm);
  font-weight: var(--ig-font-weight-semibold);
  cursor: pointer;
  &:hover { background: var(--ig-color-white-07); }
`

export const CaptureReviewSaveBtn = styled.button`
  height: 40px;
  padding: 0 var(--ig-space-10);
  border: none;
  border-radius: var(--ig-radius-xs);
  background: var(--ig-color-blue-tint-85);
  color: var(--ig-color-text-primary);
  font-size: var(--ig-font-size-sm);
  font-weight: var(--ig-font-weight-semibold);
  cursor: pointer;
  &:hover { background: var(--ig-color-blue-accent-solid); }
`
