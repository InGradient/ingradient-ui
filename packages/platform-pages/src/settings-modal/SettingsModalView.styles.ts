import styled from 'styled-components'
import { stateCenteredLayout, stateTitleText } from '@ingradient/ui/primitives'
import { ModalCard, ModalHeader, ModalTitle, VerticalTabs } from '@ingradient/ui/components'
import { SettingsShell } from '@ingradient/ui/patterns'

export const Modal = styled(ModalCard)`
  width: 1200px;
  height: 820px;
  max-width: calc(100vw - 32px);
  max-height: calc(100vh - 32px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 12px;
`

export const Header = styled(ModalHeader)`
  padding: 16px 20px;
  flex-shrink: 0;
`

export const Title = styled(ModalTitle)`
  font-size: 18px;
`

export const Main = styled(SettingsShell)`
  flex: 1;
  min-height: 0;
  gap: 0;
  grid-template-columns: 140px minmax(0, 1fr);
`

export const Body = styled.div`
  padding: 20px;
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
  margin-bottom: 8px;
`

export const AdminDesc = styled.p`
  margin: 8px 0 16px;
  font-size: 13px;
  color: var(--ig-color-text-muted);
  line-height: 1.5;
`

export const AdminContent = styled.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
`

export const SubsectionTitle = styled.h4`
  margin: 16px 0 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--ig-color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
`

export const PermissionsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin: 16px 0 8px;
`

export const PermissionsScopeNote = styled.p`
  margin: 0 0 12px;
  font-size: 12px;
  color: var(--ig-color-text-soft);
  line-height: 1.5;
`

export const ExpandToggle = styled.button`
  background: none;
  border: none;
  color: var(--ig-color-accent);
  font-size: 13px;
  cursor: pointer;
  padding: 4px 8px;
  &:hover {
    text-decoration: underline;
  }
`

export const Placeholder = styled.p`
  ${stateTitleText}
  ${stateCenteredLayout}
  margin: 0;
`
