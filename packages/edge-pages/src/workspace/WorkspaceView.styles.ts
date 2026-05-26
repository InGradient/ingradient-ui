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
  top: 64px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(0, 0, 0, 0.82);
  color: var(--ig-color-text-primary);
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.04em;
  padding: 8px 18px;
  border-radius: var(--ig-radius-md, 8px);
  pointer-events: none;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.45);
  border: 1px solid var(--ig-color-white-12);
`

export const ConfirmButton = styled.button<{ $danger?: boolean }>`
  height: 36px;
  padding: 0 14px;
  border-radius: var(--ig-radius-xs);
  border: 1px solid ${({ $danger }) => ($danger ? 'rgba(239, 68, 68, 0.35)' : 'var(--ig-color-border-subtle)')};
  background: ${({ $danger }) => ($danger ? 'rgba(239, 68, 68, 0.12)' : 'transparent')};
  color: ${({ $danger }) => ($danger ? 'var(--ig-color-danger)' : 'var(--ig-color-text-secondary)')};
  font-size: var(--ig-font-size-sm);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.16s ease;
  &:hover {
    background: ${({ $danger }) => ($danger ? 'rgba(239, 68, 68, 0.18)' : 'var(--ig-color-surface-interactive)')};
    color: ${({ $danger }) => ($danger ? 'var(--ig-color-danger)' : 'var(--ig-color-text-primary)')};
  }
`

export const FailureCode = styled.div`
  margin-top: 8px;
  color: var(--ig-color-danger);
  font-size: var(--ig-font-size-xs);
  font-weight: 700;
  letter-spacing: 0.03em;
`

const spin = keyframes`from { transform: rotate(0deg); } to { transform: rotate(360deg); }`

export const SavingOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: rgba(0, 0, 0, 0.6);
  color: var(--ig-color-text-primary);
  font-size: var(--ig-font-size-sm);
  font-weight: 500;
`

export const SavingSpinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid rgba(255,255,255,0.2);
  border-top-color: rgba(255,255,255,0.8);
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`
