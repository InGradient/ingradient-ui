// Settings 다이얼로그 shell (sidebar + 7 tabs) 라벨 + view props.

import type { ReactNode } from 'react'

export type SettingsTab =
  | 'connection' | 'camera' | 'logs' | 'about' | 'server' | 'data' | 'fieldtest'

export interface CameraSettingsDialogLabels {
  title: string
  close: string
  tabConnection: string
  tabCamera: string
  tabServer: string
  tabData: string
  tabLogs: string
  tabFieldTest: string
  tabAbout: string
}

export interface CameraSettingsDialogViewProps {
  activeTab: SettingsTab
  currentUserRole: string | null

  labels: CameraSettingsDialogLabels

  connectionContent?: ReactNode
  cameraContent?: ReactNode
  serverContent?: ReactNode
  dataContent?: ReactNode
  fieldTestContent?: ReactNode
  logsContent?: ReactNode
  aboutContent?: ReactNode

  onClose: () => void
  onSetActiveTab: (tab: SettingsTab) => void
}
