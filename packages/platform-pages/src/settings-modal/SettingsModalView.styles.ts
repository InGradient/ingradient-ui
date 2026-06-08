import styled from 'styled-components'
import { stateCenteredLayout, stateTitleText } from '@ingradient/ui/primitives'
import { ModalCard, ModalHeader, ModalTitle, VerticalTabs } from '@ingradient/ui/components'
import { SettingsShell } from '@ingradient/ui/patterns'

export const Modal = styled(ModalCard)`
  width: var(--ig-popup-4xl);
  height: var(--ig-popup-3xl-wide);
  max-width: calc(100vw - var(--ig-space-13));
  max-height: calc(100vh - var(--ig-space-13));
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: var(--ig-radius-md);
`

export const Header = styled(ModalHeader)`
  padding: var(--ig-space-7) var(--ig-space-9);
  flex-shrink: 0;
`

export const Title = styled(ModalTitle)`
  font-size: var(--ig-font-size-2xl);
`

export const Main = styled(SettingsShell)`
  flex: 1;
  min-height: 0;
  gap: 0;
  grid-template-columns: var(--ig-popup-2xs) minmax(0, 1fr);
`

export const Body = styled.div`
  padding: var(--ig-space-9);
  overflow: auto;
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
`

export const TabsList = styled(VerticalTabs)`
  width: 100%;
  min-height: 0;
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
  margin: var(--ig-space-3) 0 var(--ig-space-7);
  font-size: var(--ig-font-size-sm);
  color: var(--ig-color-text-muted);
  line-height: var(--ig-line-height-relaxed);
`

export const AdminContent = styled.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
`

export const SubsectionTitle = styled.h4`
  margin: var(--ig-space-7) 0 var(--ig-space-3);
  font-size: var(--ig-font-size-sm);
  font-weight: var(--ig-font-weight-semibold);
  color: var(--ig-color-text-muted);
  text-transform: uppercase;
  letter-spacing: var(--ig-letter-spacing-normal);
`

export const PermissionsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ig-space-3);
  margin: var(--ig-space-7) 0 var(--ig-space-3);
`

export const PermissionsScopeNote = styled.p`
  margin: 0 0 var(--ig-space-5);
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-text-soft);
  line-height: var(--ig-line-height-relaxed);
`

export const ExpandToggle = styled.button`
  background: none;
  border: none;
  color: var(--ig-color-accent);
  font-size: var(--ig-font-size-sm);
  cursor: pointer;
  padding: var(--ig-space-1) var(--ig-space-3);
  &:hover {
    text-decoration: underline;
  }
`

export const Placeholder = styled.p`
  ${stateTitleText}
  ${stateCenteredLayout}
  margin: 0;
`
