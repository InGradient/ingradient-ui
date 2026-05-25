import styled from 'styled-components'
import { media } from '../../tokens/core/breakpoints'

export const MediaDialogOverlay = styled.div<{ $positioning: 'fixed' | 'absolute' }>`
  position: ${(p) => p.$positioning};
  inset: 0;
  z-index: var(--ig-z-modal);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  ${media.md} {
    justify-content: flex-start;
  }
`

export const MediaDialogBackdrop = styled.div`
  position: absolute;
  inset: 0;
  background: var(--ig-color-modal-backdrop);
  z-index: 0;
  cursor: default;
`

export const MediaDialogContent = styled.div<{ $width?: string; $height?: string }>`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  width: ${(p) => p.$width ?? '95vw'};
  max-width: ${(p) => p.$width ?? '95vw'};
  height: ${(p) => p.$height ?? 'calc(100vh - 80px)'};
  max-height: ${(p) => p.$height ?? 'calc(100vh - 80px)'};
  background: var(--ig-color-surface-raised);
  border: 1px solid var(--ig-color-border-subtle);
  border-radius: var(--ig-radius-lg);
  box-shadow: var(--ig-shadow-floating);
  color: var(--ig-color-text-primary);
  overflow: hidden;
  isolation: isolate;
  ${media.md} {
    width: 100vw;
    max-width: 100vw;
    height: 100dvh;
    max-height: 100dvh;
    border-radius: 0;
    border: 0;
  }
`

export const MediaDialogMain = styled.div`
  flex: 1;
  min-width: 0;
  position: relative;
  display: flex;
  flex-direction: column;
  background: var(--ig-color-bg-canvas);
`

export const MediaDialogTopRight = styled.div`
  position: absolute;
  top: 8px;
  right: 16px;
  z-index: 20;
  display: inline-flex;
  align-items: center;
  gap: 6px;
`

export const MediaDialogResizer = styled.div`
  width: 4px;
  flex-shrink: 0;
  cursor: col-resize;
  background: transparent;
  &:hover { background: var(--ig-color-white-08); }
`

export const MediaDialogSidebar = styled.aside.attrs<{ $width: number }>((p) => ({
  style: { width: `${p.$width}px` },
}))`
  flex-shrink: 0;
  border-left: 1px solid var(--ig-color-border-subtle);
  background: var(--ig-color-surface-raised);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`
