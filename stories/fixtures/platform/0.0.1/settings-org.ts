import type { OrgMember, InvitationRow, JoinCodeRow } from '@ingradient/platform-pages'

export interface SettingsOrganization {
  code: string
  name: string
  status: string
}

export const mockOrganization: SettingsOrganization = {
  code: 'ING-2026',
  name: 'Ingradient',
  status: 'active',
}

export const mockOrgMembers: OrgMember[] = [
  { id: 'om-1', userId: 'u-1', user: { loginId: 'june', displayName: 'June Lee' }, role: { code: 'organizer' }, status: 'active' },
  { id: 'om-2', userId: 'u-2', user: { loginId: 'soyeon', displayName: 'Soyeon Park' }, role: { code: 'organizer' }, status: 'active' },
  { id: 'om-3', userId: 'u-3', user: { loginId: 'junho', displayName: 'Junho Kim' }, role: { code: 'member' }, status: 'active' },
  { id: 'om-4', userId: 'u-4', user: { loginId: 'minji', displayName: 'Minji Yu' }, role: { code: 'member' }, status: 'pending' },
  { id: 'om-5', userId: 'u-5', user: { loginId: 'hyunjin', displayName: 'Hyunjin Cha' }, role: { code: 'member' }, status: 'suspended' },
]

export const mockInvitations: InvitationRow[] = [
  { id: 'i-1', email: 'sangha@external.com', roleId: 'member', status: 'pending', expiresAt: '2026-07-30' },
  { id: 'i-2', email: 'yujin@external.com', roleId: 'organizer', status: 'accepted', expiresAt: null },
  { id: 'i-3', email: 'old@external.com', roleId: 'member', status: 'expired', expiresAt: '2025-12-01' },
  { id: 'i-4', email: 'cancel@external.com', roleId: 'member', status: 'revoked', expiresAt: null },
]

export const mockJoinCodes: JoinCodeRow[] = [
  { id: 'jc-1', code: 'WAFER-2026-XK4', roleId: 'member', usedCount: 3, maxUses: 10, expiresAt: '2026-08-01' },
  { id: 'jc-2', code: 'ORG-INVITE-9YZ', roleId: 'organizer', usedCount: 1, maxUses: null, expiresAt: null },
]

export const invitationsRoleOptions = [
  { value: 'organizer', label: 'Organizer' },
  { value: 'member', label: 'Member' },
]

export const orgSearchCandidates = [
  { id: 'u-sangha', name: 'Sangha Lee', email: 'sangha@external.com' },
  { id: 'u-yujin', name: 'Yujin Park', email: 'yujin@external.com' },
  { id: 'u-admin', email: 'admin@external.com' },
]
