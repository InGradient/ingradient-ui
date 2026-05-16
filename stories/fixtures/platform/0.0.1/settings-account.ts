import type { LicenseInfo } from '@ingradient/ui/patterns'

export interface SettingsUser {
  id: string
  name: string
  email: string
}

export const mockUser: SettingsUser = {
  id: 'u-1',
  name: 'June Lee',
  email: 'june@ingradient.ai',
}

export const orgLicense: LicenseInfo = {
  type: 'organization',
  organizationName: 'Ingradient',
  expiresAt: '2027-05-15',
  remainingDays: 365,
  expired: false,
}

export const personalLicense: LicenseInfo = {
  type: 'personal',
  expiresAt: '2026-08-30',
  remainingDays: 107,
  expired: false,
}

export const expiredLicense: LicenseInfo = {
  type: 'personal',
  expiresAt: '2026-01-01',
  remainingDays: -134,
  expired: true,
}
