import { Camera, FileText, Info, Server, Database, FlaskConical, SlidersHorizontal } from 'lucide-react'
import { SettingsDialog, VerticalTabs, iconSizeNumbers } from '@ingradient/ui'
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
    { value: 'connection', label: labels.tabConnection, icon: <Camera size={iconSizeNumbers.sm} />, visible: true },
    { value: 'camera',     label: labels.tabCamera,     icon: <SlidersHorizontal size={iconSizeNumbers.sm} />, visible: isPrivileged },
    { value: 'server',     label: labels.tabServer,     icon: <Server size={iconSizeNumbers.sm} />, visible: isPrivileged },
    { value: 'data',       label: labels.tabData,       icon: <Database size={iconSizeNumbers.sm} />, visible: isPrivileged },
    { value: 'fieldtest',  label: labels.tabFieldTest,  icon: <FlaskConical size={iconSizeNumbers.sm} />, visible: isPrivileged },
    { value: 'logs',       label: labels.tabLogs,       icon: <FileText size={iconSizeNumbers.sm} />, visible: true },
    { value: 'about',      label: labels.tabAbout,      icon: <Info size={iconSizeNumbers.sm} />, visible: true },
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
    <SettingsDialog title={labels.title} onClose={onClose} width="min(var(--ig-popup-4xl-narrow), 92vw)">
      <VerticalTabs
        items={visibleTabs.map((t) => ({ value: t.value, label: t.label, icon: t.icon }))}
        value={activeTab}
        onChange={(v) => onSetActiveTab(v as SettingsTab)}
        style={{ width: 160, flexShrink: 0 }}
      />
      <div style={{ flex: 1, minWidth: 0, padding: 'var(--ig-space-7)', overflow: 'auto' }}>
        {content[activeTab]}
      </div>
    </SettingsDialog>
  )
}
