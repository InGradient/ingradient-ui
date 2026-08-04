import type { SettingsModalViewProps } from '@ingradient/platform-pages'
import type { SettingsScene } from '../../../../fixtures/platform/0.0.1/settings-scenarios'
import {
  candidateUsers,
  expandedPermissionGroups,
  mockProjectMembers,
  projectRoleOptions,
  summaryPermissionGroups,
} from '../../../../fixtures/platform/0.0.1/settings-project'
import type { useSettingsModalScene } from './use-settings-modal-scene'
import type { useEdgeTabState } from './use-edge-tab-state'
import { buildAdminProps } from './build-admin-props'
import { buildEdgeSlots } from './build-edge-slots'
import type { SettingsModalStoryActions } from './settings-modal-story-actions'

export function buildSettingsViewProps(
  scenario: SettingsScene,
  s: ReturnType<typeof useSettingsModalScene>,
  edge: ReturnType<typeof useEdgeTabState>,
  actions: SettingsModalStoryActions,
): SettingsModalViewProps {
  return {
    open: true,
    onClose: () => actions.onModalAction('close'),
    tab: s.tab,
    onTabChange: (tab) => {
      actions.onTabChange(tab)
      s.setTab(tab)
    },
    isAdmin: !!scenario.isAdmin,
    general: {
      locale: s.locale,
      enableHoverPreview: s.enableHoverPreview,
      singleClickToEdit: s.singleClickToEdit,
      showLabelsOnThumbnails: s.showLabelsOnThumbnails,
      onChangeLocale: (value) => {
        actions.onGeneralPreferenceChange('locale', value)
        s.setLocale(value)
      },
      onChangeEnableHoverPreview: (value) => {
        actions.onGeneralPreferenceChange('enableHoverPreview', value)
        s.setEnableHoverPreview(value)
      },
      onChangeSingleClickToEdit: (value) => {
        actions.onGeneralPreferenceChange('singleClickToEdit', value)
        s.setSingleClickToEdit(value)
      },
      onChangeShowLabelsOnThumbnails: (value) => {
        actions.onGeneralPreferenceChange('showLabelsOnThumbnails', value)
        s.setShowLabelsOnThumbnails(value)
      },
    },
    account: {
      user: scenario.user ?? null,
      license: scenario.license ?? null,
      name: s.accountName,
      onChangeName: (value) => {
        actions.onAccountAction('change-name', value)
        s.setAccountName(value)
      },
      accountMessage: scenario.accountMessage,
      onSaveName: () => actions.onAccountAction('save-name', s.accountName),
      onLogout: () => actions.onAccountAction('logout'),
      passwordDialogOpen: s.passwordDialogOpen,
      passwordMessage: scenario.passwordMessage,
      currentPassword: s.currentPassword,
      newPassword: s.newPassword,
      newPasswordConfirm: s.newPasswordConfirm,
      onChangeCurrentPassword: (value) => {
        actions.onAccountAction('change-current-password')
        s.setCurrentPassword(value)
      },
      onChangeNewPassword: (value) => {
        actions.onAccountAction('change-new-password')
        s.setNewPassword(value)
      },
      onChangeNewPasswordConfirm: (value) => {
        actions.onAccountAction('change-password-confirmation')
        s.setNewPasswordConfirm(value)
      },
      onOpenPasswordDialog: () => {
        actions.onDialogAction('change-password', 'open')
        s.setPasswordDialogOpen(true)
      },
      onClosePasswordDialog: () => {
        actions.onDialogAction('change-password', 'close')
        s.setPasswordDialogOpen(false)
      },
      onSubmitPassword: () => {
        actions.onAccountAction('submit-password')
        actions.onDialogAction('change-password', 'submit')
        s.setPasswordDialogOpen(false)
      },
      deleteAccountDialogOpen: s.deleteAccountDialogOpen,
      deleteAccountConfirmInput: s.deleteAccountConfirmInput,
      onChangeDeleteAccountConfirmInput: (value) => {
        actions.onAccountAction('change-delete-confirmation', value)
        s.setDeleteAccountConfirmInput(value)
      },
      deleteAccountPreview: scenario.deleteAccountPreview ?? null,
      deleteAccountResolutions: s.deleteAccountResolutions,
      onChangeDeleteAccountResolutions: (value) => {
        actions.onAccountAction('change-delete-resolution', JSON.stringify(value))
        s.setDeleteAccountResolutions(value)
      },
      deleteAccountPassword: s.deleteAccountPassword,
      onChangeDeleteAccountPassword: (value) => {
        actions.onAccountAction('change-delete-password')
        s.setDeleteAccountPassword(value)
      },
      deleteAccountFinalConfirm: s.deleteAccountFinalConfirm,
      onChangeDeleteAccountFinalConfirm: (value) => {
        actions.onAccountAction('change-final-confirmation', value)
        s.setDeleteAccountFinalConfirm(value)
      },
      deleteAccountMessage: scenario.deleteAccountMessage,
      onOpenDeleteAccountDialog: () => {
        actions.onDialogAction('delete-account', 'open')
        s.setDeleteAccountDialogOpen(true)
      },
      onCloseDeleteAccountDialog: () => {
        actions.onDialogAction('delete-account', 'close')
        s.setDeleteAccountDialogOpen(false)
      },
      onSubmitDeleteAccount: () => {
        actions.onAccountAction('submit-delete')
        actions.onDialogAction('delete-account', 'submit')
        s.setDeleteAccountDialogOpen(false)
      },
    },
    project: {
      noProject: scenario.noProject,
      canEdit: !!scenario.canEditProject,
      isOwner: !!scenario.isProjectOwner,
      canManagePermissions: !!scenario.canManagePermissions,
      canDeleteProject: !!scenario.canDeleteProject,
      projectsCount: scenario.projectsCount ?? 0,
      draft: s.projectDraft,
      onChangeDraft: (patch) => {
        Object.entries(patch).forEach(([field, value]) => {
          actions.onProjectAction(
            `change-${field}`,
            typeof value === 'boolean' ? value : String(value),
          )
        })
        s.updateProject(patch)
      },
      saveState: scenario.saveState ?? 'idle',
      saveErrorMessage: scenario.saveErrorMessage,
      nameInvalid: scenario.nameInvalid,
      memberSearchQuery: s.memberSearchQuery,
      onChangeMemberSearchQuery: (value) => {
        actions.onProjectAction('search-members', value)
        s.setMemberSearchQuery(value)
      },
      candidates: candidateUsers,
      onAddMember: (id) => actions.onProjectAction('add-member', id),
      members: mockProjectMembers,
      roleOptions: projectRoleOptions,
      permissionRoleOptions: projectRoleOptions,
      onChangeRole: (id, role) => actions.onProjectAction(`change-role:${id}`, role),
      onRemoveMember: (id) => actions.onProjectAction('remove-member', id),
      permissionsExpandAll: s.permissionsExpandAll,
      onTogglePermissionsExpand: () => {
        actions.onProjectAction('toggle-permissions', !s.permissionsExpandAll)
        s.setPermissionsExpandAll(!s.permissionsExpandAll)
      },
      expandedPermissionGroups,
      summaryPermissionGroups,
      draftRoles: s.draftRoles,
      onChangeRolePermission: (role, key, checked) => {
        actions.onProjectAction(`permission:${role}:${key}`, checked)
        s.setDraftRoles({ ...s.draftRoles, [role]: { ...s.draftRoles[role], [key]: checked } })
      },
      onChangeRolePermissions: (role, keys, checked) => {
        actions.onProjectAction(`permissions:${role}:${keys.join(',')}`, checked)
        const next = { ...s.draftRoles[role] }
        for (const k of keys) next[k] = checked
        s.setDraftRoles({ ...s.draftRoles, [role]: next })
      },
      deleteConfirmInput: s.deleteProjectConfirm,
      onChangeDeleteConfirmInput: (value) => {
        actions.onProjectAction('change-delete-confirmation', value)
        s.setDeleteProjectConfirm(value)
      },
      onDelete: () => actions.onProjectAction('delete', s.projectDraft.id),
    },
    admin: scenario.isAdmin ? buildAdminProps(scenario, s, actions) : undefined,
    edge: scenario.noProject
      ? undefined
      : buildEdgeSlots(
          scenario,
          edge,
          scenario.currentProject?.id ?? null,
          scenario.currentProject?.projectType === 'deflectometry',
          actions,
        ),
  }
}
