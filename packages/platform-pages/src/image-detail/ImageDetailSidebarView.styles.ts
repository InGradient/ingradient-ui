import styled from 'styled-components'
import { media } from '@ingradient/ui/tokens'

/**
 * Fills the detail modal's sidebar slot. At the mobile breakpoint the slot has no room, so the
 * panel becomes a right-edge drawer that shows only while `$mobileVisible`.
 */
export const SidebarRoot = styled.div<{ $mobileVisible: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  ${media.md} {
    display: ${(p) => (p.$mobileVisible ? 'flex' : 'none')};
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: var(--ig-z-sticky-plus);
    width: min(var(--ig-popup-md), 88vw);
    border-left: var(--ig-border-1px) solid var(--ig-color-border-subtle);
    background: var(--ig-color-surface-panel);
    box-shadow: var(--ig-shadow-drawer-lift);
  }
`

/** Dims the canvas behind the mobile drawer; never shown on desktop. */
export const MobileBackdrop = styled.div`
  display: none;
  ${media.md} {
    display: block;
    position: absolute;
    inset: 0;
    z-index: var(--ig-z-sticky);
    background: var(--ig-color-modal-backdrop);
  }
`
