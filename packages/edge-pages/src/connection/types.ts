import type { ReactNode } from 'react'

// ── Domain types (subset from edge connection model) ──────────────────────────

export interface USBDevice {
  type: 'usb'
  index: number
  name: string
  width?: number
  height?: number
}

export interface GigEDevice {
  type: 'gige'
  ip: string
  mac: string
  manufacturer?: string
  model?: string
  reachable?: boolean | null
}

export type AnyCamera = USBDevice | GigEDevice

export type NicBadge = 'recommended' | 'possible' | 'unsuitable'

export interface NicCandidate {
  name: string
  description: string
  ipv4: string | null
  status: string
  badge: NicBadge
}

export interface NicStatus {
  nicId: string
  speed: string
  duplexMode: string
  isAdminUp: boolean
  isLinkUp: boolean
  configErrors: string[]
}

export type ConnectionClassification =
  | 'success' | 'no_nic' | 'no_camera' | 'subnet_mismatch'
  | 'firewall_block' | 'driver_missing' | 'unknown'

export type GuideStep =
  | 'scan' | 'select_nic' | 'select_camera' | 'connect' | 'diagnose' | 'done'

export type GuideTone = 'success' | 'warning' | 'danger' | 'accent' | 'neutral'

export interface GuideAction {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary'
}

export interface GuideNetworkSummary {
  cameraIp: string | null
  nicIp: string | null
  jumbo: string | null
  receive: string | null
}

export interface GuideState {
  /** Tone for the status badge + leading status icon. */
  tone: GuideTone
  /** Short status label rendered inside the badge (e.g., "Ready to connect"). */
  statusLabel: string
  /** Bold panel title (e.g., "Connect the camera"). */
  title: string
  /** One-line summary explaining what to do next. */
  summary: string
  /** Primary action button (the call-to-action). */
  primaryAction: GuideAction
  /** Secondary action buttons rendered before the primary. */
  secondaryActions?: GuideAction[]
  /** 4-column network summary (Camera IP / NIC IP / Jumbo / Receive). */
  network: GuideNetworkSummary
  /** Warning strings rendered below the panel. */
  warnings?: string[]
}

// ── Labels (simplified per-section) ───────────────────────────────────────────

export interface ConnectionLabels {
  scanTitle: string
  scan: string
  scanning: string
  scanHint: string
  cameras: string
  nicCandidates: string
  noDevices: string
  notReachable: string
  reachable: string
  forceIp: string
  // connect
  connectTitle: string
  connect: string
  disconnect: string
  connecting: string
  connectError: string
  // diagnostics
  diagnosticsTitle: string
  runDiagnose: string
  diagnosing: string
  // nic / profile / guide
  nicControlTitle: string
  nicEnable: string
  nicDisable: string
  nicRestart: string
  profileTitle: string
  loadProfile: string
  saveProfile: string
  // advanced
  advancedTitle: string
  // forceIp
  forceIpDialogTitle: string
  forceIpApply: string
  forceIpCancel: string
  forceIpApplying: string
  forceIpStaticIp: string
  forceIpSubnet: string
  // classification messages
  classificationMessages: Record<ConnectionClassification, string>
  // guide messages
  guideMessages: Record<GuideStep, string>
  // guide panel network summary labels
  guideNetworkCameraIp: string
  guideNetworkNicIp: string
  guideNetworkJumbo: string
  guideNetworkReceive: string
  // badges
  nicBadgeRecommended: string
  nicBadgePossible: string
  nicBadgeUnsuitable: string
}

// ── Section view props ────────────────────────────────────────────────────────

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

// ── Shell view props (9 group object) ─────────────────────────────────────────

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
