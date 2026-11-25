import styled from 'styled-components'
import { media } from '@ingradient/ui/tokens'

export const ZoomCloseGroup = styled.div`
  position: absolute;
  top: var(--ig-spacing-8);
  right: var(--ig-spacing-16);
  z-index: var(--ig-z-sticky-plus);
  display: flex;
  align-items: center;
  gap: var(--ig-spacing-8);
`

export const CoordReadout = styled.span`
  display: block;
  padding: var(--ig-spacing-8) var(--ig-spacing-12);
  font-size: var(--ig-font-size-xs);
  font-family: var(--ig-font-mono);
  color: var(--ig-color-text-muted);
  user-select: all;
  white-space: normal;
  word-break: break-all;
`

export const LoadingOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: var(--ig-z-raised-plus);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ig-color-overlay-archived);
  pointer-events: none;
`

export const HiResNotice = styled.div`
  position: absolute;
  top: var(--ig-spacing-12);
  right: var(--ig-spacing-12);
  z-index: var(--ig-z-capture-high);
  display: flex;
  align-items: center;
  gap: var(--ig-spacing-8);
  padding: var(--ig-spacing-8) var(--ig-spacing-12);
  border-radius: var(--ig-radius-pill);
  background: var(--ig-color-overlay-darker);
  color: var(--ig-color-text-primary);
  font-size: var(--ig-font-size-xs);
  line-height: 1;
  pointer-events: none;
`

/** Centers the group tabs over the canvas, below the zoom and close buttons. */
export const GroupTabsFloat = styled.div`
  position: absolute;
  top: var(--ig-control-height-xl);
  left: 50%;
  transform: translateX(-50%);
  z-index: var(--ig-z-capture);
  max-width: calc(100% - var(--ig-spacing-32));
  border-radius: var(--ig-radius-pill);
  background: var(--ig-color-overlay-darker);
`

/** The side panel is always visible on desktop, so its toggle only appears at the mobile breakpoint. */
export const MobileOnly = styled.span`
  display: none;
  ${media.md} {
    display: inline-flex;
  }
`
