import styled from 'styled-components'

export const AppShell = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background: var(--ig-color-bg-canvas);
  color: var(--ig-color-text-primary);
`

export const AppHeader = styled.header`
  height: var(--ig-control-height-xl);
  padding: 0 var(--ig-space-7);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  background: var(--ig-color-surface-header);
  border-bottom: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  backdrop-filter: var(--ig-blur-sm);
`

export const PanelsRow = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  /* Platform structure: flush columns divided by 1px lines, no floating cards. */
  gap: 0;
  padding: 0;
  /* Desktop overflow, not a mobile reflow: retain usable workspace geometry and
     keep both side panels reachable by scrollbar, touchpad, and keyboard focus. */
  overflow-x: auto;
  overflow-y: hidden;
  &:focus-visible {
    outline: var(--ig-border-2px) solid var(--ig-color-accent-ring);
    outline-offset: var(--ig-space-neg-2px);
  }
`

const Panel = styled.div`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
`

export const LeftPanel = styled(Panel)`
  background: var(--ig-color-surface-panel);
  border-right: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  width: var(--ig-popup-sm);
  flex-shrink: 0;
  &:has([data-ig-collapsed-panel="left"]) {
    width: calc(var(--ig-control-height-xl) + var(--ig-space-4));
    overflow-y: auto;
  }
`

export const CenterPanel = styled(Panel)`
  flex: 1 0 var(--ig-popup-3xl-narrow);
  min-width: var(--ig-popup-3xl-narrow);
`

export const RightPanelContainer = styled(Panel)`
  /* Same as Platform's right inspector: a persistent strong divider before it. */
  background: var(--ig-color-surface-panel);
  border-left: var(--ig-border-1px) solid var(--ig-color-border-strong);
  width: var(--ig-popup-sm);
  flex-shrink: 0;
  overflow-y: auto;
  &:has([data-ig-collapsed-panel="right"]) {
    width: calc(var(--ig-control-height-xl) + var(--ig-space-4));
  }
`

export const CapturingBlocker = styled.div`
  position: fixed;
  inset: 0;
  z-index: var(--ig-z-topbar);
  background: var(--ig-color-app-backdrop);
  cursor: wait;
  backdrop-filter: var(--ig-blur-2xs);
`
