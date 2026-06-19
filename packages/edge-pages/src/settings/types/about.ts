// Settings > About 탭 라벨 + view props.

import type { ReactNode } from 'react'

export interface AboutTabLabels {
  hero: string
  versionLabel: string
  licenseTitle: string
  licenseStatus: string
  licenseValid: string
  licenseExpired: string
  licenseMissing: string
  expiresAt: string
  fingerprint: string
  deactivateButton: string
  deactivating: string
  deactivationCodeTitle: string
  deactivationCodeHint: string
  releaseTitle: string
  copyrightLine: string
}

export interface AboutTabViewProps {
  appVersion: string
  licenseStatus: 'valid' | 'expired' | 'missing' | 'unknown'
  licenseExpiresAt: string | null
  fingerprint: string | null
  deactivationCode: string | null
  deactivateError: string | null
  isDeactivating: boolean
  labels: AboutTabLabels
  updateSection?: ReactNode
  onOpenDeactivateConfirm: () => void
  onCloseDeactivationCode: () => void
}
