import styled, { keyframes } from 'styled-components'

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
  padding: var(--ig-space-3) 18px;
  border-radius: var(--ig-radius-md, 8px);
  pointer-events: none;
  box-shadow: 0 6px 20px var(--ig-color-overlay-dim);
  border: var(--ig-border-1px) solid var(--ig-color-white-12);
`

export const ConfirmButton = styled.button<{ $danger?: boolean }>`
  height: var(--ig-control-height-md);
  padding: 0 var(--ig-space-6);
  border-radius: var(--ig-radius-xs);
  border: var(--ig-border-1px) solid ${({ $danger }) => ($danger ? 'rgba(239, 68, 68, 0.35)' : 'var(--ig-color-border-subtle)')};
  background: ${({ $danger }) => ($danger ? 'var(--ig-color-danger-bg)' : 'transparent')};
  color: ${({ $danger }) => ($danger ? 'var(--ig-color-danger)' : 'var(--ig-color-text-secondary)')};
  font-size: var(--ig-font-size-sm);
  font-weight: var(--ig-font-weight-semibold);
  cursor: pointer;
  transition: all var(--ig-motion-fast-ease);
  &:hover {
    background: ${({ $danger }) => ($danger ? 'var(--ig-color-danger-bg-hover)' : 'var(--ig-color-surface-interactive)')};
    color: ${({ $danger }) => ($danger ? 'var(--ig-color-danger)' : 'var(--ig-color-text-primary)')};
  }
`

export const FailureCode = styled.div`
  margin-top: var(--ig-space-3);
  color: var(--ig-color-danger);
  font-size: var(--ig-font-size-xs);
  font-weight: var(--ig-font-weight-bold);
  letter-spacing: var(--ig-letter-spacing-tight);
`

const spin = keyframes`from { transform: rotate(0deg); } to { transform: rotate(360deg); }`

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

export const SavingSpinner = styled.div`
  width: var(--ig-control-height-sm);
  height: var(--ig-control-height-sm);
  border: var(--ig-border-3px) solid var(--ig-color-white-20);
  border-top-color: var(--ig-color-white-80);
  border-radius: 50%;
  animation: ${spin} var(--ig-motion-spinner-slow) linear infinite;
`
