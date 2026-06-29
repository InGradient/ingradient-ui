import styled from 'styled-components'

export const Container = styled.div<{ $row?: boolean }>`
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: ${(p) => (p.$row ? 'row' : 'column')};
  background-color: var(--ig-color-bg-canvas);
  overflow: hidden;
`

export const CapturingStatusPill = styled.div`
  position: fixed;
  top: var(--ig-control-height-3xl-plus);
  left: 50%;
  transform: translateX(-50%);
  z-index: var(--ig-z-tooltip);
  display: flex;
  align-items: center;
  gap: var(--ig-space-3);
  background: var(--ig-color-overlay-darkest);
  color: var(--ig-color-text-primary);
  font-size: var(--ig-font-size-md);
  font-weight: var(--ig-font-weight-semibold);
  letter-spacing: var(--ig-letter-spacing-normal);
  padding: var(--ig-space-3) var(--ig-space-8);
  border-radius: var(--ig-radius-md, 8px);
  pointer-events: none;
  box-shadow: 0 6px 20px var(--ig-color-overlay-dim);
  border: var(--ig-border-1px) solid var(--ig-color-white-12);
`

export const FailureCode = styled.div`
  margin-top: var(--ig-space-3);
  color: var(--ig-color-danger);
  font-size: var(--ig-font-size-xs);
  font-weight: var(--ig-font-weight-bold);
  letter-spacing: var(--ig-letter-spacing-tight);
`

export const SavingOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: var(--ig-z-tooltip);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--ig-space-5);
  background: var(--ig-color-image-option-bg);
  color: var(--ig-color-text-primary);
  font-size: var(--ig-font-size-sm);
  font-weight: var(--ig-font-weight-medium);
`

