import styled from 'styled-components'

export const Page = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`

export const ContentArea = styled.div`
  flex: 1;
  min-height: 0;
  position: relative;
`

export const DragOverFull = styled.div`
  position: absolute;
  inset: 0;
  z-index: 50;
  pointer-events: none;
  background: rgba(0, 0, 0, 0.6);
  border: 3px dashed rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ig-color-text-primary);
  font-size: var(--ig-font-size-2xl);
  font-weight: 600;
`

export const GridWrap = styled.div`
  padding: 0 var(--ig-space-7) var(--ig-space-7);
  position: relative;
`

export const DragOverGrid = styled.div`
  position: absolute;
  inset: var(--ig-space-7);
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px dashed rgba(255, 255, 255, 0.4);
  border-radius: var(--ig-radius-md);
  z-index: 10;
  pointer-events: none;
  color: var(--ig-color-text-primary);
  font-size: var(--ig-font-size-lg);
  font-weight: 600;
`

export const DangerDimButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: var(--ig-space-2);
  height: 32px;
  padding: 0 var(--ig-space-4);
  border-radius: var(--ig-radius-md);
  background: var(--ig-color-danger-dim-bg);
  border: 1px solid var(--ig-color-danger-dim-border);
  color: var(--ig-color-danger);
  font-size: var(--ig-font-size-sm);
  font-weight: 500;
  cursor: pointer;
  &:hover:not(:disabled) {
    background: var(--ig-color-alert-danger-bg);
  }
`

export const MobileBottomSheet = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 60px;
  z-index: 30;
  background: var(--ig-color-surface-raised);
  border-top: 1px solid var(--ig-color-border-subtle);
  max-height: 60vh;
  overflow: auto;
  padding: var(--ig-space-5);
`

export const RightSideLoadingText = styled.span`
  color: var(--ig-color-text-muted);
  font-size: var(--ig-font-size-sm);
`

export const TableWrap = styled.div`
  padding: var(--ig-space-5);
`

