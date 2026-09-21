import styled from 'styled-components'
import { ModalCard, ModalHeader, ModalTitle, VerticalTabs } from '@ingradient/ui/components'
import { SettingsShell } from '@ingradient/ui/patterns'
import { media } from '@ingradient/ui/tokens'

export const Modal = styled(ModalCard)`
  width: min(var(--ig-popup-4xl-mid), calc(100vw - var(--ig-space-7) * 2));
  height: min(var(--ig-popup-3xl-wide), calc(100vh - var(--ig-space-7) * 2));
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: var(--ig-radius-xl);
`

export const Header = styled(ModalHeader)`
  padding: var(--ig-space-5) var(--ig-space-6);
  flex-shrink: 0;
  border-bottom: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  background: var(--ig-color-surface-interactive);
`

export const Title = styled(ModalTitle)`
  font-size: var(--ig-font-size-2xl);
  font-weight: var(--ig-font-weight-bold);
`

export const Main = styled(SettingsShell)`
  flex: 1;
  min-height: 0;
  gap: 0;
  grid-template-columns: var(--ig-popup-xs) minmax(0, 1fr);
  background: var(--ig-color-bg-canvas);
  --ig-catalog-divider-color: var(--ig-color-border-strong);

  ${media.lg} {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto minmax(0, 1fr);
    overflow: hidden;
  }
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

// Product shell owns the divider; item appearance is shared with Edge Settings.
export const TabsList = styled(VerticalTabs).attrs({ appearance: 'settings' as const })`
  min-height: 0;
  border-right: var(--ig-border-1px) solid var(--ig-catalog-divider-color);

  ${media.lg} {
    border-right: 0;
    border-bottom: var(--ig-border-1px) solid var(--ig-catalog-divider-color);
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
  line-height: var(--ig-line-height-relaxed);
`

export const AdminContent = styled.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-4);

  & > * {
    flex-shrink: 0;
  }
`

export const SubsectionTitle = styled.h4`
  margin: var(--ig-space-5) 0 var(--ig-space-3);
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
  margin: var(--ig-space-5) 0 var(--ig-space-3);
`

export const PermissionsScopeNote = styled.p`
  margin: 0 0 var(--ig-space-4);
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-text-soft);
  line-height: var(--ig-line-height-relaxed);
`
