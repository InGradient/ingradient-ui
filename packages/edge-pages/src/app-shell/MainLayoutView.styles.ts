import styled from 'styled-components'
import { surfacePanel } from '@ingradient/ui'

export const AppShell = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background:
    radial-gradient(circle at top left, var(--ig-color-bg-radial-a), transparent 32%),
    radial-gradient(circle at top right, var(--ig-color-bg-radial-b), transparent 28%),
    var(--ig-color-bg-canvas);
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
  gap: var(--ig-space-4);
  padding: var(--ig-space-4) 14px 10px;
  overflow: hidden;
`

const Panel = styled.div`
  ${surfacePanel}
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
`

export const LeftPanel = styled(Panel)`
  width: var(--ig-popup-sm);
  flex-shrink: 0;
`

export const CenterPanel = styled(Panel)`
  flex: 1;
  min-width: 0;
`

export const RightPanelContainer = styled(Panel)`
  width: var(--ig-popup-sm);
  flex-shrink: 0;
  overflow-y: auto;
`

export const CapturingBlocker = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9998;
  background: rgba(0, 0, 0, 0.32);
  cursor: wait;
  backdrop-filter: var(--ig-blur-2xs);
`
