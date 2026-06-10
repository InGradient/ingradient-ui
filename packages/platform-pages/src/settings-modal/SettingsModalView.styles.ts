import styled from 'styled-components'
import { stateCenteredLayout, stateTitleText } from '@ingradient/ui/primitives'
import { ModalCard, ModalHeader, ModalTitle, VerticalTabs } from '@ingradient/ui/components'
import { SettingsShell } from '@ingradient/ui/patterns'

export const Modal = styled(ModalCard)`
  width: min(1120px, calc(100vw - var(--ig-space-7) * 2));
  height: min(820px, calc(100vh - var(--ig-space-7) * 2));
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: var(--ig-radius-xl);
`

export const Header = styled(ModalHeader)`
  padding: var(--ig-space-5) var(--ig-space-6);
  flex-shrink: 0;
  border-bottom: 1px solid var(--ig-color-border-subtle);
  background: var(--ig-color-surface-interactive);
`

export const Title = styled(ModalTitle)`
  font-size: var(--ig-font-size-2xl);
  font-weight: 700;
`

export const Main = styled(SettingsShell)`
  flex: 1;
  min-height: 0;
  gap: 0;
  grid-template-columns: 220px minmax(0, 1fr);
  background: var(--ig-color-bg-canvas);
  --ig-catalog-divider-color: var(--ig-color-border-strong);
`

export const Body = styled.div`
  padding: var(--ig-space-6);
  overflow: auto;
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-6);
`

export const TabsList = styled(VerticalTabs)`
  width: 100%;
  min-height: 0;
  padding: var(--ig-space-2);
  gap: 2px;
  border: 0;
  border-right: 1px solid var(--ig-catalog-divider-color);
  border-radius: 0;
  background: var(--ig-color-surface-panel);

  & > div {
    display: none;
  }

  & > [role='tab'] {
    min-height: 48px;
    padding: var(--ig-space-3) var(--ig-space-4);
    border-radius: var(--ig-radius-sm);
    color: var(--ig-color-text-primary);
    font-size: var(--ig-font-size-sm);
    font-weight: 500;
  }

  & > [role='tab'][aria-selected='true'] {
    background: var(--ig-color-blue-tint-14);
    color: var(--ig-color-accent);
    font-weight: 600;
  }

  & > [role='tab']:hover:not(:disabled) {
    background: var(--ig-color-surface-interactive-hover);
    color: var(--ig-color-text-primary);
  }

  & > [role='tab'][aria-selected='true']:hover:not(:disabled) {
    background: var(--ig-color-blue-tint-18);
  }
`

export const AdminBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  height: 100%;
`

export const AdminSubTabsWrap = styled.div`
  flex-shrink: 0;
  margin-bottom: var(--ig-space-3);
`

export const AdminDesc = styled.p`
  margin: 0;
  font-size: var(--ig-font-size-sm);
  color: var(--ig-color-text-muted);
  line-height: 1.5;
`

export const AdminContent = styled.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-4);
`

export const SubsectionTitle = styled.h4`
  margin: var(--ig-space-5) 0 var(--ig-space-3);
  font-size: var(--ig-font-size-sm);
  font-weight: 600;
  color: var(--ig-color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
`

export const PermissionsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ig-space-3);
  margin: var(--ig-space-5) 0 var(--ig-space-3);
`

export const PermissionsScopeNote = styled.p`
  margin: 0 0 var(--ig-space-4);
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-text-soft);
  line-height: 1.5;
`

export const ExpandToggle = styled.button`
  background: none;
  border: none;
  color: var(--ig-color-accent);
  font-size: var(--ig-font-size-sm);
  cursor: pointer;
  padding: var(--ig-space-2) var(--ig-space-3);
  &:hover {
    text-decoration: underline;
  }
`

export const Placeholder = styled.p`
  ${stateTitleText}
  ${stateCenteredLayout}
  margin: 0;
`
