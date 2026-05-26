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
  height: 28px;
  padding: 0 12px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  background: var(--ig-color-surface-header);
  border-top: 1px solid var(--ig-color-border-subtle);
  backdrop-filter: blur(14px);
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
