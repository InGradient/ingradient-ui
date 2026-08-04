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
import type { SettingsModalStoryActions } from './settings-modal-story-actions'

export function buildAdminProps(
  scenario: SettingsScene,
  s: ReturnType<typeof useSettingsModalScene>,
  actions: SettingsModalStoryActions,
): AdminTabProps {
  const filteredSearchResults = orgSearchCandidates.filter(
    (c) =>
      !s.inviteSearchQuery.trim() ||
      c.email.toLowerCase().includes(s.inviteSearchQuery.toLowerCase()) ||
      (c.name ?? '').toLowerCase().includes(s.inviteSearchQuery.toLowerCase()),
  )
  const deviceQuery = s.deviceFilterSearch.trim().toLowerCase()
  const filteredDevices = scenario.filteredDevicesEmpty
    ? []
    : mockDevices.filter((device) => {
        const matchesQuery =
          !deviceQuery ||
          device.deviceUid.toLowerCase().includes(deviceQuery) ||
          (device.name ?? '').toLowerCase().includes(deviceQuery)
        const matchesStatus =
          s.deviceFilterStatus === 'all' ||
          device.status.toLowerCase() === s.deviceFilterStatus
        return matchesQuery && matchesStatus
      })

  return {
    subTab: s.adminSubTab,
    onSubTabChange: (tab) => {
      actions.onAdminSubTabChange(tab)
      s.setAdminSubTab(tab)
    },
    organization: {
      organization: mockOrganization,
      isAdmin: !!scenario.isAdmin,
      nameDraft: s.orgNameDraft,
      onChangeNameDraft: (value) => {
        actions.onOrganizationAction('change-name', value)
        s.setOrgNameDraft(value)
      },
      message: scenario.orgSavingMessage,
      error: scenario.orgErrorMessage,
      onSave: () => actions.onOrganizationAction('save', s.orgNameDraft),
    },
    orgMembers: { members: mockOrgMembers, myUserId: 'u-1', isAdmin: !!scenario.isAdmin },
    invitations: {
      invitations: {
        isAdmin: !!scenario.isAdmin,
        invitations: mockInvitations,
        roleOptions: invitationsRoleOptions,
        inviteRoleId: s.inviteRoleId,
        onChangeInviteRoleId: (value) => {
          actions.onOrganizationAction('change-invite-role', value)
          s.setInviteRoleId(value)
        },
        searchQuery: s.inviteSearchQuery,
        onChangeSearchQuery: (value) => {
          actions.onOrganizationAction('search-invitations', value)
          s.setInviteSearchQuery(value)
        },
        searchResults: filteredSearchResults,
        onInviteUser: (user) => actions.onOrganizationAction('invite-user', user.id),
        onRevoke: (id) => actions.onOrganizationAction('revoke-invitation', id),
      },
      joinCodes: {
        isAdmin: !!scenario.isAdmin,
        joinCodes: mockJoinCodes,
        roleOptions: invitationsRoleOptions,
        codeRoleId: s.codeRoleId,
        onChangeCodeRoleId: (value) => {
          actions.onOrganizationAction('change-code-role', value)
          s.setCodeRoleId(value)
        },
        codeMaxUses: s.codeMaxUses,
        onChangeCodeMaxUses: (value) => {
          actions.onOrganizationAction('change-code-max-uses', value)
          s.setCodeMaxUses(value)
        },
        onCreate: () => actions.onOrganizationAction('create-join-code'),
        onDelete: (id) => actions.onOrganizationAction('delete-join-code', id),
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
      onToggleRenew: () => {
        actions.onDeviceAction('toggle-renewal', !s.showRenew)
        s.setShowRenew(!s.showRenew)
      },
      onCancelRenew: () => {
        actions.onDeviceAction('cancel-renewal')
        s.setShowRenew(false)
        s.setRenewDate('')
      },
      renewDate: s.renewDate,
      onChangeRenewDate: (value) => {
        actions.onDeviceAction('change-renewal-date', value)
        s.setRenewDate(value)
      },
      onRenew: () => actions.onDeviceAction('renew-license', s.renewDate),
    },
    devicesForms: {
      isAdmin: !!scenario.isAdmin,
      offlineEnabled: true,
      showRegister: s.showRegisterForm,
      onCancelRegister: () => {
        actions.onDeviceAction('cancel-register')
        s.setShowRegisterForm(false)
      },
      registerUid: s.registerUid,
      onChangeRegisterUid: (value) => {
        actions.onDeviceAction('change-register-uid', value)
        s.setRegisterUid(value)
      },
      registerName: s.registerName,
      onChangeRegisterName: (value) => {
        actions.onDeviceAction('change-register-name', value)
        s.setRegisterName(value)
      },
      onRegister: () => actions.onDeviceAction('register', s.registerUid),
      showIssue: s.showIssueForm,
      onCancelIssue: () => {
        actions.onDeviceAction('cancel-issue')
        s.setShowIssueForm(false)
      },
      activeDevices: mockActiveDeviceOptions,
      issueDeviceId: s.issueDeviceId,
      onChangeIssueDeviceId: (value) => {
        actions.onDeviceAction('change-issue-device', value)
        s.setIssueDeviceId(value)
      },
      issueValidDays: s.issueValidDays,
      onChangeIssueValidDays: (value) => {
        actions.onDeviceAction('change-issue-valid-days', value)
        s.setIssueValidDays(value)
      },
      onIssue: () => actions.onDeviceAction('issue-token', s.issueDeviceId),
      issuedToken: scenario.hasIssuedToken ? mockIssuedToken : null,
    },
    devicesTable: {
      isAdmin: !!scenario.isAdmin,
      offlineEnabled: true,
      loading: scenario.deviceLoading,
      devices: mockDevices,
      filteredDevices,
      filterSearch: s.deviceFilterSearch,
      onChangeFilterSearch: (value) => {
        actions.onDeviceAction('search', value)
        s.setDeviceFilterSearch(value)
      },
      filterStatus: s.deviceFilterStatus,
      onChangeFilterStatus: (value) => {
        actions.onDeviceAction('filter-status', value)
        s.setDeviceFilterStatus(value)
      },
      onToggleRegister: () => {
        actions.onDeviceAction('toggle-register', !s.showRegisterForm)
        s.setShowRegisterForm(!s.showRegisterForm)
        s.setShowIssueForm(false)
      },
      onToggleIssue: () => {
        actions.onDeviceAction('toggle-issue', !s.showIssueForm)
        s.setShowIssueForm(!s.showIssueForm)
        s.setShowRegisterForm(false)
      },
      onRevoke: (id) => actions.onDeviceAction('revoke', id),
      onDelete: (id) => actions.onDeviceAction('delete', id),
      onViewDetails: (device) => actions.onDeviceAction('view-details', device.id),
    },
    storage: buildStorageProps(scenario, actions),
  }
}
