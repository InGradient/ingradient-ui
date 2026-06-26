import { CameraIcon, FileTextIcon, InfoIcon, ServerIcon, DatabaseIcon, FlaskIcon, SlidersIcon } from '@ingradient/ui/components'
import { TwoColumnDialog, VerticalTabs, iconSizeNumbers } from '@ingradient/ui'
import type { CameraSettingsDialogViewProps, SettingsTab } from './types'

interface TabDef {
  value: SettingsTab
  label: string
  icon: JSX.Element
  visible: boolean
}

export function CameraSettingsDialogView(props: CameraSettingsDialogViewProps): JSX.Element {
  const {
    activeTab, currentUserRole, labels,
    connectionContent, cameraContent, serverContent, dataContent,
    fieldTestContent, logsContent, aboutContent,
    onClose, onSetActiveTab,
  } = props

  const isPrivileged = currentUserRole === 'owner' || currentUserRole === 'manager'

  const tabs: TabDef[] = [
    { value: 'connection', label: labels.tabConnection, icon: <CameraIcon size={iconSizeNumbers.sm} />, visible: true },
    { value: 'camera',     label: labels.tabCamera,     icon: <SlidersIcon size={iconSizeNumbers.sm} />, visible: isPrivileged },
    { value: 'server',     label: labels.tabServer,     icon: <ServerIcon size={iconSizeNumbers.sm} />, visible: isPrivileged },
    { value: 'data',       label: labels.tabData,       icon: <DatabaseIcon size={iconSizeNumbers.sm} />, visible: isPrivileged },
    { value: 'fieldtest',  label: labels.tabFieldTest,  icon: <FlaskIcon size={iconSizeNumbers.sm} />, visible: isPrivileged },
    { value: 'logs',       label: labels.tabLogs,       icon: <FileTextIcon size={iconSizeNumbers.sm} />, visible: true },
    { value: 'about',      label: labels.tabAbout,      icon: <InfoIcon size={iconSizeNumbers.sm} />, visible: true },
  ]

  const visibleTabs = tabs.filter((t) => t.visible)

  const content: Record<SettingsTab, JSX.Element | null | undefined> = {
    connection: connectionContent as JSX.Element | undefined ?? null,
    camera: cameraContent as JSX.Element | undefined ?? null,
    server: serverContent as JSX.Element | undefined ?? null,
    data: dataContent as JSX.Element | undefined ?? null,
    fieldtest: fieldTestContent as JSX.Element | undefined ?? null,
    logs: logsContent as JSX.Element | undefined ?? null,
    about: aboutContent as JSX.Element | undefined ?? null,
  }

  return (
    <TwoColumnDialog
      title={labels.title}
      onClose={onClose}
      width="min(var(--ig-popup-4xl-narrow), 92vw)"
      height="calc(100dvh - var(--ig-space-13))"
      sidebarWidth="var(--ig-popup-2xs-plus)"
      sidebar={
        <VerticalTabs
          items={visibleTabs.map((t) => ({ value: t.value, label: t.label, icon: t.icon }))}
          value={activeTab}
          onChange={(v) => onSetActiveTab(v as SettingsTab)}
        />
      }
    >
      {content[activeTab]}
    </TwoColumnDialog>
  )
}
