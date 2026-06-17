import type { ReactNode, FormEvent } from 'react'

export type LicenseMode = 'bind' | 'key'

export interface LicenseLabels {
  title: string
  subtitle: string
  bindHint: string
  hint: string
  fingerprintLabel: string
  copy: string
  copied: string
  keyLabel: string
  activate: string
  activating: string
  bindButton: string
  binding: string
  settingsTitle: string
}

export interface LicenseViewProps {
  mode: LicenseMode

  fingerprint: string
  licenseKey: string

  submitting: boolean
  copied: boolean
  error: string | null

  labels: LicenseLabels

  langSelector?: ReactNode
  settingsDialog?: ReactNode

  onLicenseKeyChange: (value: string) => void
  onSubmit: (e: FormEvent) => void
  onBind: () => void
  onCopyFingerprint: () => void
  onOpenSettings: () => void
}
