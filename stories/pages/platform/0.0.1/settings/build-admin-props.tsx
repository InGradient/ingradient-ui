import type { AdminTabProps } from '@ingradient/platform-pages'
import type { SettingsScene } from '../../../../fixtures/platform/0.0.1/settings-scenarios'
import {
  invitationsRoleOptions,
  mockInvitations,
  mockJoinCodes,
  mockOrgMembers,
  mockOrganization,
  orgSearchCandidates,
} from '../../../../fixtures/platform/0.0.1/settings-org'
import {
  mockActiveDeviceOptions,
  mockDeviceLicense,
  mockDeviceLicenseExpiry,
  mockDevices,
  mockIssuedToken,
} from '../../../../fixtures/platform/0.0.1/settings-devices'
import type { useSettingsModalScene } from './use-settings-modal-scene'
import { buildStorageProps } from './build-storage-slots'

const noop = () => undefined

export function buildAdminProps(
  scenario: SettingsScene,
  s: ReturnType<typeof useSettingsModalScene>,
): AdminTabProps {
  const filteredSearchResults = orgSearchCandidates.filter(
    (c) =>
      !s.inviteSearchQuery.trim() ||
      c.email.toLowerCase().includes(s.inviteSearchQuery.toLowerCase()) ||
      (c.name ?? '').toLowerCase().includes(s.inviteSearchQuery.toLowerCase()),
  )

  return {
    subTab: s.adminSubTab,
    onSubTabChange: s.setAdminSubTab,
    organization: {
      organization: mockOrganization,
      isAdmin: !!scenario.isAdmin,
      nameDraft: s.orgNameDraft,
      onChangeNameDraft: s.setOrgNameDraft,
      message: scenario.orgSavingMessage,
      error: scenario.orgErrorMessage,
      onSave: noop,
    },
    orgMembers: { members: mockOrgMembers, myUserId: 'u-1', isAdmin: !!scenario.isAdmin },
    invitations: {
      invitations: {
        isAdmin: !!scenario.isAdmin,
        invitations: mockInvitations,
        roleOptions: invitationsRoleOptions,
        inviteRoleId: s.inviteRoleId,
        onChangeInviteRoleId: s.setInviteRoleId,
        searchQuery: s.inviteSearchQuery,
        onChangeSearchQuery: s.setInviteSearchQuery,
        searchResults: filteredSearchResults,
        onInviteUser: noop,
        onRevoke: noop,
      },
      joinCodes: {
        isAdmin: !!scenario.isAdmin,
        joinCodes: mockJoinCodes,
        roleOptions: invitationsRoleOptions,
        codeRoleId: s.codeRoleId,
        onChangeCodeRoleId: s.setCodeRoleId,
        codeMaxUses: s.codeMaxUses,
        onChangeCodeMaxUses: s.setCodeMaxUses,
        onCreate: noop,
        onDelete: noop,
        createDisabled: true,
        createDisabledTitle: 'Coming soon',
      },
    },
    devicesLicense: {
      isAdmin: !!scenario.isAdmin,
      loading: scenario.deviceLoading,
      error: scenario.deviceError,
      license: mockDeviceLicense,
      expiry: mockDeviceLicenseExpiry,
      showRenew: s.showRenew,
      onToggleRenew: () => s.setShowRenew(!s.showRenew),
      onCancelRenew: () => {
        s.setShowRenew(false)
        s.setRenewDate('')
      },
      renewDate: s.renewDate,
      onChangeRenewDate: s.setRenewDate,
      onRenew: noop,
    },
    devicesForms: {
      isAdmin: !!scenario.isAdmin,
      offlineEnabled: true,
      showRegister: s.showRegisterForm,
      onCancelRegister: () => s.setShowRegisterForm(false),
      registerUid: s.registerUid,
      onChangeRegisterUid: s.setRegisterUid,
      registerName: s.registerName,
      onChangeRegisterName: s.setRegisterName,
      onRegister: noop,
      showIssue: s.showIssueForm,
      onCancelIssue: () => s.setShowIssueForm(false),
      activeDevices: mockActiveDeviceOptions,
      issueDeviceId: s.issueDeviceId,
      onChangeIssueDeviceId: s.setIssueDeviceId,
      issueValidDays: s.issueValidDays,
      onChangeIssueValidDays: s.setIssueValidDays,
      onIssue: noop,
      issuedToken: scenario.hasIssuedToken ? mockIssuedToken : null,
    },
    devicesTable: {
      isAdmin: !!scenario.isAdmin,
      offlineEnabled: true,
      loading: scenario.deviceLoading,
      devices: mockDevices,
      filteredDevices: scenario.filteredDevicesEmpty ? [] : mockDevices,
      filterSearch: s.deviceFilterSearch,
      onChangeFilterSearch: s.setDeviceFilterSearch,
      filterStatus: s.deviceFilterStatus,
      onChangeFilterStatus: s.setDeviceFilterStatus,
      onToggleRegister: () => {
        s.setShowRegisterForm(!s.showRegisterForm)
        s.setShowIssueForm(false)
      },
      onToggleIssue: () => {
        s.setShowIssueForm(!s.showIssueForm)
        s.setShowRegisterForm(false)
      },
    },
    storage: buildStorageProps(scenario),
  }
}
