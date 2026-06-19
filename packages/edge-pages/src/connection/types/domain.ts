// Edge connection 도메인 모델 (camera / NIC / classification)

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
