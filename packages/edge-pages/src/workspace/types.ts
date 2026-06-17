import type { ReactNode } from 'react'

export type WorkspaceMode = 'main' | 'labeling'
export type WorkspaceTab = 'capture' | 'images' | 'statics' | 'setup'

export interface WorkspaceTabItem {
  value: WorkspaceTab
  label: string
}

export interface SequenceFailureInfo {
  message: string
  errorCode: string
}

export interface WorkspaceLabels {
  saving: string
  sequenceFailed: string
  errorCode: string
  cancel: string
  retry: string
}

export interface WorkspaceViewProps {
  mode: WorkspaceMode

  isCapturing: boolean
  capturingStatusText: string
  sequenceFailure: SequenceFailureInfo | null
  labels: WorkspaceLabels
  onSequenceFailureCancel: () => void
  onSequenceFailureRetry: () => void

  selectedDatasetId: string | null
  activeTab: WorkspaceTab
  tabItems: WorkspaceTabItem[]
  onTabChange: (value: WorkspaceTab) => void
  isSetupMode: boolean
  setupPanelTarget: HTMLElement | null
  setupPanelContent?: ReactNode
  captureContent?: ReactNode
  imagesContent?: ReactNode
  staticsContent?: ReactNode

  isSavingLabel: boolean
  labelingContent?: ReactNode
}
