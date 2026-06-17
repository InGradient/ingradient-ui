import type { ReactNode, FormEvent } from 'react'

export type LoginMode = 'online' | 'offline'

export interface LoginPackageInfo {
  project_name: string
  package_version: number
  platform_url?: string
}

export interface LoginSavedSession {
  user_id: string
  name: string
  email: string
}

export interface LoginAccountEntry {
  email: string
  name: string
}

export interface LoginLabels {
  title: string
  online: string
  offline: string
  onlineSupport: string
  loadPackage: string
  loading: string
  emailLabel: string
  emailPlaceholder: string
  passwordLabel: string
  passwordPlaceholder: string
  savePassword: string
  keepSignedIn: string
  submit: string
  submitting: string
  register: string
  greeting: (name: string) => string
  continueSession: string
  changeAccount: string
  settingsTitle: string
}

export interface LoginViewProps {
  mode: LoginMode

  email: string
  password: string
  savePassword: boolean
  keepSignedIn: boolean

  loggingIn: boolean
  loadingPackage: boolean
  error: string | null

  packageInfo: LoginPackageInfo | null
  savedSession: LoginSavedSession | null
  otherAccounts: LoginAccountEntry[]
  hasAccountList: boolean
  showLoginForm: boolean
  externalUrl: string | null

  labels: LoginLabels

  langSelector?: ReactNode
  settingsDialog?: ReactNode

  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onSavePasswordChange: (value: boolean) => void
  onKeepSignedInChange: (value: boolean) => void
  onSubmit: (e: FormEvent) => void
  onContinueSession: () => void
  onSelectAccount: (entry: LoginAccountEntry) => void
  onChangeAccount: () => void
  onLoadPackage: () => void
  onOpenSignup: () => void
  onOpenSettings: () => void
}
