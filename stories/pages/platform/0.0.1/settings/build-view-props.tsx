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

const noop = () => undefined

export function buildSettingsViewProps(
  scenario: SettingsScene,
  s: ReturnType<typeof useSettingsModalScene>,
  edge: ReturnType<typeof useEdgeTabState>,
): SettingsModalViewProps {
  return {
    open: true,
    onClose: noop,
    tab: s.tab,
    onTabChange: s.setTab,
    isAdmin: !!scenario.isAdmin,
    general: {
      locale: s.locale,
      enableHoverPreview: s.enableHoverPreview,
      singleClickToEdit: s.singleClickToEdit,
      showLabelsOnThumbnails: s.showLabelsOnThumbnails,
      onChangeLocale: s.setLocale,
      onChangeEnableHoverPreview: s.setEnableHoverPreview,
      onChangeSingleClickToEdit: s.setSingleClickToEdit,
      onChangeShowLabelsOnThumbnails: s.setShowLabelsOnThumbnails,
    },
    account: {
      user: scenario.user ?? null,
      license: scenario.license ?? null,
      name: s.accountName,
      onChangeName: s.setAccountName,
      accountMessage: scenario.accountMessage,
      onSaveName: noop,
      onLogout: noop,
      passwordDialogOpen: s.passwordDialogOpen,
      passwordMessage: scenario.passwordMessage,
      currentPassword: s.currentPassword,
      newPassword: s.newPassword,
      newPasswordConfirm: s.newPasswordConfirm,
      onChangeCurrentPassword: s.setCurrentPassword,
      onChangeNewPassword: s.setNewPassword,
      onChangeNewPasswordConfirm: s.setNewPasswordConfirm,
      onOpenPasswordDialog: () => s.setPasswordDialogOpen(true),
      onClosePasswordDialog: () => s.setPasswordDialogOpen(false),
      onSubmitPassword: () => s.setPasswordDialogOpen(false),
      deleteAccountDialogOpen: s.deleteAccountDialogOpen,
      deleteAccountConfirmInput: s.deleteAccountConfirmInput,
      onChangeDeleteAccountConfirmInput: s.setDeleteAccountConfirmInput,
      deleteAccountPreview: scenario.deleteAccountPreview ?? null,
      deleteAccountResolutions: s.deleteAccountResolutions,
      onChangeDeleteAccountResolutions: s.setDeleteAccountResolutions,
      deleteAccountPassword: s.deleteAccountPassword,
      onChangeDeleteAccountPassword: s.setDeleteAccountPassword,
      deleteAccountFinalConfirm: s.deleteAccountFinalConfirm,
      onChangeDeleteAccountFinalConfirm: s.setDeleteAccountFinalConfirm,
      deleteAccountMessage: scenario.deleteAccountMessage,
      onOpenDeleteAccountDialog: () => s.setDeleteAccountDialogOpen(true),
      onCloseDeleteAccountDialog: () => s.setDeleteAccountDialogOpen(false),
      onSubmitDeleteAccount: () => s.setDeleteAccountDialogOpen(false),
    },
    project: {
      noProject: scenario.noProject,
      canEdit: !!scenario.canEditProject,
      isOwner: !!scenario.isProjectOwner,
      canManagePermissions: !!scenario.canManagePermissions,
      canDeleteProject: !!scenario.canDeleteProject,
      projectsCount: scenario.projectsCount ?? 0,
      draft: s.projectDraft,
      onChangeDraft: s.updateProject,
      saveState: scenario.saveState ?? 'idle',
      saveErrorMessage: scenario.saveErrorMessage,
      nameInvalid: scenario.nameInvalid,
      memberSearchQuery: s.memberSearchQuery,
      onChangeMemberSearchQuery: s.setMemberSearchQuery,
      candidates: candidateUsers,
      onAddMember: noop,
      members: mockProjectMembers,
      roleOptions: projectRoleOptions,
      permissionRoleOptions: projectRoleOptions,
      onChangeRole: noop,
      onRemoveMember: noop,
      permissionsExpandAll: s.permissionsExpandAll,
      onTogglePermissionsExpand: () => s.setPermissionsExpandAll(!s.permissionsExpandAll),
      expandedPermissionGroups,
      summaryPermissionGroups,
      draftRoles: s.draftRoles,
      onChangeRolePermission: (role, key, checked) =>
        s.setDraftRoles({ ...s.draftRoles, [role]: { ...s.draftRoles[role], [key]: checked } }),
      onChangeRolePermissions: (role, keys, checked) => {
        const next = { ...s.draftRoles[role] }
        for (const k of keys) next[k] = checked
        s.setDraftRoles({ ...s.draftRoles, [role]: next })
      },
      deleteConfirmInput: s.deleteProjectConfirm,
      onChangeDeleteConfirmInput: s.setDeleteProjectConfirm,
      onDelete: noop,
    },
    admin: scenario.isAdmin ? buildAdminProps(scenario, s) : undefined,
    edge: scenario.noProject
      ? undefined
      : buildEdgeSlots(
          scenario,
          edge,
          scenario.currentProject?.id ?? null,
          scenario.currentProject?.projectType === 'deflectometry',
        ),
  }
}
