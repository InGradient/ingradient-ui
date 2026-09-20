// Settings 다이얼로그 shell (sidebar + tabs) 라벨 + view props.
//
// 탭 순서는 edge 앱과 같다 — 화면을 그대로 옮기는 것이 목적이라 여기서 재배열하지 않는다.

import type { ReactNode } from 'react'

export type SettingsTab =
  | 'general' | 'connection' | 'camera' | 'lighting' | 'server'
  | 'data' | 'logs' | 'experiments' | 'fieldtest' | 'about'

export interface CameraSettingsDialogLabels {
  title: string
  close: string
  tabGeneral: string
  tabConnection: string
  tabCamera: string
  tabLighting: string
  tabServer: string
  tabData: string
  tabLogs: string
  tabExperiments: string
  tabFieldTest: string
  tabAbout: string
}

export interface CameraSettingsDialogViewProps {
  activeTab: SettingsTab
  currentUserRole: string | null

  labels: CameraSettingsDialogLabels

  generalContent?: ReactNode
  connectionContent?: ReactNode
  cameraContent?: ReactNode
  lightingContent?: ReactNode
  serverContent?: ReactNode
  dataContent?: ReactNode
  experimentsContent?: ReactNode
  fieldTestContent?: ReactNode
  logsContent?: ReactNode
  aboutContent?: ReactNode

  onClose: () => void
  onSetActiveTab: (tab: SettingsTab) => void
}
