import styled from 'styled-components'

export const AppRoot = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  @supports (height: 100dvh) { height: 100dvh; }
  overflow: hidden;
`

export const AppContent = styled.div`
  flex: 1;
  min-height: 0;
  overflow: hidden;
`

export const AppFooterBar = styled.footer`
  height: var(--ig-control-height-xs);
  padding: 0 var(--ig-space-5);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  background: var(--ig-color-surface-header);
  border-top: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  backdrop-filter: var(--ig-blur-sm);
`

export const ShutdownOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: var(--ig-color-modal-backdrop);
  display: flex;
  align-items: center;
  justify-content: center;
`
