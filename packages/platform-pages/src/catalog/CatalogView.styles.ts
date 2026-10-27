import styled from 'styled-components'
import { stateTitleText } from '@ingradient/ui/primitives'

export const Page = styled.div`
  /* Fills the app shell's page area; standalone it takes the viewport. */
  height: var(--ig-page-height, 100vh);
  display: flex;
  flex-direction: column;
  --ig-catalog-divider-color: var(--ig-color-border-strong);
`

export const ContentArea = styled.div`
  flex: 1;
  min-height: 0;
  position: relative;
`

export const DragOverFull = styled.div`
  position: absolute;
  inset: 0;
  z-index: var(--ig-z-overlay-low);
  pointer-events: none;
  background: var(--ig-color-image-option-bg);
  border: var(--ig-border-2px) dashed var(--ig-color-white-40);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ig-color-text-primary);
  font-size: var(--ig-text-title);
  font-weight: var(--ig-font-weight-semibold);
`

export const GridWrap = styled.div`
  box-sizing: border-box;
  min-height: 100%;
  padding: var(--ig-spacing-16);
  position: relative;
`

export const DragOverGrid = styled.div`
  position: absolute;
  inset: var(--ig-spacing-16);
  background: var(--ig-color-image-option-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  border: var(--ig-border-2px) dashed var(--ig-color-white-40);
  // Wraps the image cards (radius-md), so it must be rounder than they are.
  border-radius: var(--ig-radius-lg);
  z-index: var(--ig-z-sticky);
  pointer-events: none;
  color: var(--ig-color-text-primary);
  font-size: var(--ig-text-title-sm);
  font-weight: var(--ig-font-weight-semibold);
`

export const MobileBottomSheet = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  /* Sits above the mobile bottom navigation. */
  bottom: var(--ig-layout-size-mobile-bottom-sheet-offset);
  z-index: var(--ig-z-sticky-top);
  background: var(--ig-color-surface-raised);
  border-top: var(--ig-border-1px) solid var(--ig-catalog-divider-color, var(--ig-color-border-subtle));
  max-height: 60vh;
  overflow: auto;
  padding: var(--ig-spacing-12);
`

export const RightSideLoadingText = styled.span`
  ${stateTitleText}
`

export const TableWrap = styled.div`
  padding: var(--ig-spacing-12);
`
