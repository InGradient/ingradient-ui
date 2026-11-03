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
  padding: 0 var(--ig-spacing-16);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  background: var(--ig-color-surface-header);
  box-shadow: inset 0 var(--ig-space-neg-1px) 0 var(--ig-color-border-subtle);
  backdrop-filter: var(--ig-blur-sm);
  /* backdrop-filter makes a stacking context; without a layer the panels after it paint
     over top-bar menus (language, account) that extend over the center column. */
  position: relative;
  z-index: var(--ig-z-header);
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

// Column widths, resize handles and the collapsed rail width come from the shared
// ResizableColumnsLayout (MainLayoutView). These fill their column.
const Panel = styled.div`
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
`

export const LeftPanel = styled(Panel)`
  background: var(--ig-color-surface-panel);
  border-right: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  &:has([data-ig-collapsed-panel="left"]) {
    overflow-y: auto;
  }
`

export const CenterPanel = styled(Panel)``

export const RightPanelContainer = styled(Panel)`
  /* Same as Platform's right inspector: a persistent strong divider before it. */
  background: var(--ig-color-surface-panel);
  border-left: var(--ig-border-1px) solid var(--ig-color-border-strong);
  overflow-y: auto;
`

export const CapturingBlocker = styled.div`
  position: fixed;
  inset: 0;
  z-index: var(--ig-z-topbar);
  background: var(--ig-color-app-backdrop);
  cursor: wait;
  backdrop-filter: var(--ig-blur-2xs);
`
