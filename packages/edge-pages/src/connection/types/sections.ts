// Connection 탭 안 각 섹션 view 와 shell ConnectionTabView 의 props.

import type { ReactNode } from 'react'
import type {
  AnyCamera, GigEDevice, NicCandidate, NicStatus, ConnectionClassification,
} from './domain'
import type { GuideState } from './guide'
import type { ConnectionLabels } from './labels'

export interface ScanSectionViewProps {
  isScanning: boolean
  discoveredDevices: AnyCamera[]
  nicCandidates: NicCandidate[] | null
  isLoadingCandidates: boolean
  selectedCamera: AnyCamera | null
  selectedNic: NicCandidate | null
  isBlocked?: boolean
  labels: ConnectionLabels
  onScan: () => void
  onSelectCamera: (device: AnyCamera) => void
  onSelectNic: (nic: NicCandidate) => void
  onRequestForceIp?: (device: GigEDevice) => void
}

export interface ConnectSectionViewProps {
  isConnecting: boolean
  isConnected: boolean
  connectionError: string | null
  canConnect: boolean
  labels: ConnectionLabels
  onConnect: () => void
  onDisconnect: () => void
}

export interface AutoSetupSectionViewProps {
  visible: boolean
  isRunning: boolean
  labels: ConnectionLabels
  onRun: () => void
}

export interface DiagnosticsSectionViewProps {
  isRunning: boolean
  classification: ConnectionClassification | null
  failureCode: string | null
  recoveryFailure: string | null
  labels: ConnectionLabels
  onRunDiagnose: () => void
}

export interface DiagnoseClassificationCardViewProps {
  classification: ConnectionClassification
  labels: ConnectionLabels
}

export interface NicControlSectionViewProps {
  nicStatus: NicStatus | null
  isApplying: boolean
  labels: ConnectionLabels
  onEnable: (nicId: string) => void
  onDisable: (nicId: string) => void
  onRestart: (nicId: string) => void
}

export interface NicStatusCardViewProps {
  status: NicStatus
  labels: ConnectionLabels
}

export interface ProfileStatusSectionViewProps {
  profileName: string | null
  isLoading: boolean
  isSaving: boolean
  labels: ConnectionLabels
  onLoad: () => void
  onSave: () => void
}

export interface AdvancedSectionViewProps {
  expanded: boolean
  children?: ReactNode
  labels: ConnectionLabels
  onToggleExpanded: () => void
}

export interface ConnectionGuidePanelViewProps {
  state: GuideState
  labels: ConnectionLabels
  onDismiss?: () => void
}

export interface ForceIpDialogViewProps {
  cameraId: string
  currentIp: string | null
  newIp: string
  newSubnet: string
  applying: boolean
  error: string | null
  labels: ConnectionLabels
  onIpChange: (ip: string) => void
  onSubnetChange: (subnet: string) => void
  onApply: () => void
  onCancel: () => void
}

export interface ConnectionTabViewProps {
  scan: Omit<ScanSectionViewProps, 'labels'>
  connect: Omit<ConnectSectionViewProps, 'labels'>
  autoSetup: Omit<AutoSetupSectionViewProps, 'labels'>
  diagnostics: Omit<DiagnosticsSectionViewProps, 'labels'>
  nicControl: Omit<NicControlSectionViewProps, 'labels'>
  profile: Omit<ProfileStatusSectionViewProps, 'labels'>
  advanced: Omit<AdvancedSectionViewProps, 'labels'>
  guide: { visible: boolean; state: GuideState; onDismiss: () => void }
  labels: ConnectionLabels
  forceIpDialog?: ReactNode
}
