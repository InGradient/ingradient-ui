// Connection Guide 패널 상태 + action / network summary 모델.

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
