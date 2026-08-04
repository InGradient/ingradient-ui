import { useEffect, useState } from 'react'
import type { RoleMatrix } from '@ingradient/platform-pages'
import type {
  SettingsScene, SettingsTab, AdminSubTab,
} from '../../../../fixtures/platform/0.0.1/settings-scenarios'
import { defaultRoleMatrix } from '../../../../fixtures/platform/0.0.1/settings-project'
import type { SettingsProject } from '../../../../fixtures/platform/0.0.1/settings-project'

const EMPTY_PROJECT: SettingsProject = {
  id: '', name: '', description: '', projectType: 'general',
  groupEnabled: false, groupRegex: '', groupRepRegex: '', allowDup: false,
  groupVisible: 'all', showFilenameInGallery: true, showBboxClassNamesInDetail: true,
}

export interface SettingsModalSceneState {
  // Tab
  tab: SettingsTab
  setTab: (t: SettingsTab) => void
  adminSubTab: AdminSubTab
  setAdminSubTab: (t: AdminSubTab) => void

  // General
  locale: string
  setLocale: (v: string) => void
  enableHoverPreview: boolean
  setEnableHoverPreview: (v: boolean) => void
  singleClickToEdit: boolean
  setSingleClickToEdit: (v: boolean) => void
  showLabelsOnThumbnails: boolean
  setShowLabelsOnThumbnails: (v: boolean) => void

  // Account
  accountName: string
  setAccountName: (v: string) => void
  deleteAccountConfirmInput: string
  setDeleteAccountConfirmInput: (v: string) => void
  passwordDialogOpen: boolean
  setPasswordDialogOpen: (v: boolean) => void
  currentPassword: string
  setCurrentPassword: (v: string) => void
  newPassword: string
  setNewPassword: (v: string) => void
  newPasswordConfirm: string
  setNewPasswordConfirm: (v: string) => void
  deleteAccountDialogOpen: boolean
  setDeleteAccountDialogOpen: (v: boolean) => void
  deleteAccountResolutions: Record<string, { action: 'transfer' | 'delete_project'; transfer_user_id?: string }>
  setDeleteAccountResolutions: (v: Record<string, { action: 'transfer' | 'delete_project'; transfer_user_id?: string }>) => void
  deleteAccountPassword: string
  setDeleteAccountPassword: (v: string) => void
  deleteAccountFinalConfirm: string
  setDeleteAccountFinalConfirm: (v: string) => void

  // Project
  projectDraft: SettingsProject
  updateProject: (patch: Partial<SettingsProject>) => void
  memberSearchQuery: string
  setMemberSearchQuery: (v: string) => void
  deleteProjectConfirm: string
  setDeleteProjectConfirm: (v: string) => void
  permissionsExpandAll: boolean
  setPermissionsExpandAll: (v: boolean) => void
  draftRoles: RoleMatrix
  setDraftRoles: (next: RoleMatrix) => void

  // Admin: Org
  orgNameDraft: string
  setOrgNameDraft: (v: string) => void
  inviteRoleId: string
  setInviteRoleId: (v: string) => void
  inviteSearchQuery: string
  setInviteSearchQuery: (v: string) => void
  codeRoleId: string
  setCodeRoleId: (v: string) => void
  codeMaxUses: string
  setCodeMaxUses: (v: string) => void

  // Admin: Devices
  showRegisterForm: boolean
  setShowRegisterForm: (v: boolean) => void
  showIssueForm: boolean
  setShowIssueForm: (v: boolean) => void
  registerUid: string
  setRegisterUid: (v: string) => void
  registerName: string
  setRegisterName: (v: string) => void
  issueDeviceId: string
  setIssueDeviceId: (v: string) => void
  issueValidDays: string
  setIssueValidDays: (v: string) => void
  deviceFilterSearch: string
  setDeviceFilterSearch: (v: string) => void
  deviceFilterStatus: 'all' | 'active' | 'revoked'
  setDeviceFilterStatus: (v: 'all' | 'active' | 'revoked') => void
  showRenew: boolean
  setShowRenew: (v: boolean) => void
  renewDate: string
  setRenewDate: (v: string) => void
}

export function useSettingsModalScene(scenario: SettingsScene): SettingsModalSceneState {
  const [tab, setTab] = useState<SettingsTab>(scenario.initialTab ?? 'general')
  const [adminSubTab, setAdminSubTab] = useState<AdminSubTab>(scenario.initialAdminSubTab ?? 'organization')

  const [locale, setLocale] = useState(scenario.locale ?? 'en')
  const [enableHoverPreview, setEnableHoverPreview] = useState(!!scenario.enableHoverPreview)
  const [singleClickToEdit, setSingleClickToEdit] = useState(!!scenario.singleClickToEdit)
  const [showLabelsOnThumbnails, setShowLabelsOnThumbnails] = useState(!!scenario.showLabelsOnThumbnails)

  const [accountName, setAccountName] = useState(scenario.user?.name ?? '')
  const [deleteAccountConfirmInput, setDeleteAccountConfirmInput] = useState('')
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(!!scenario.passwordDialogOpen)
  const [currentPassword, setCurrentPassword] = useState(scenario.passwordCurrent ?? '')
  const [newPassword, setNewPassword] = useState(scenario.passwordNew ?? '')
  const [newPasswordConfirm, setNewPasswordConfirm] = useState(scenario.passwordConfirm ?? '')
  const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] = useState(!!scenario.deleteAccountDialogOpen)
  const [deleteAccountResolutions, setDeleteAccountResolutions] = useState<SettingsModalSceneState['deleteAccountResolutions']>({})
  const [deleteAccountPassword, setDeleteAccountPassword] = useState('')
  const [deleteAccountFinalConfirm, setDeleteAccountFinalConfirm] = useState('')

  const [projectDraft, setProjectDraft] = useState<SettingsProject>(scenario.currentProject ?? EMPTY_PROJECT)
  const [memberSearchQuery, setMemberSearchQuery] = useState(scenario.memberSearchQuery ?? '')
  const [deleteProjectConfirm, setDeleteProjectConfirm] = useState('')
  const [permissionsExpandAll, setPermissionsExpandAll] = useState(!!scenario.showPermissionsExpandAll)
  const [draftRoles, setDraftRoles] = useState<RoleMatrix>(defaultRoleMatrix)

  const [orgNameDraft, setOrgNameDraft] = useState('Ingradient')
  const [inviteRoleId, setInviteRoleId] = useState('member')
  const [inviteSearchQuery, setInviteSearchQuery] = useState(scenario.inviteSearchQuery ?? '')
  const [codeRoleId, setCodeRoleId] = useState('member')
  const [codeMaxUses, setCodeMaxUses] = useState('')

  const [showRegisterForm, setShowRegisterForm] = useState(!!scenario.showRegisterForm)
  const [showIssueForm, setShowIssueForm] = useState(!!scenario.showIssueForm)
  const [registerUid, setRegisterUid] = useState('')
  const [registerName, setRegisterName] = useState('')
  const [issueDeviceId, setIssueDeviceId] = useState('')
  const [issueValidDays, setIssueValidDays] = useState('')
  const [deviceFilterSearch, setDeviceFilterSearch] = useState('')
  const [deviceFilterStatus, setDeviceFilterStatus] = useState<'all' | 'active' | 'revoked'>('all')
  const [showRenew, setShowRenew] = useState(false)
  const [renewDate, setRenewDate] = useState('')

  useEffect(() => {
    setTab(scenario.initialTab ?? 'general')
    setAdminSubTab(scenario.initialAdminSubTab ?? 'organization')
    setLocale(scenario.locale ?? 'en')
    setEnableHoverPreview(!!scenario.enableHoverPreview)
    setSingleClickToEdit(!!scenario.singleClickToEdit)
    setShowLabelsOnThumbnails(!!scenario.showLabelsOnThumbnails)
    setAccountName(scenario.user?.name ?? '')
    setDeleteAccountConfirmInput('')
    setPasswordDialogOpen(!!scenario.passwordDialogOpen)
    setCurrentPassword(scenario.passwordCurrent ?? '')
    setNewPassword(scenario.passwordNew ?? '')
    setNewPasswordConfirm(scenario.passwordConfirm ?? '')
    setDeleteAccountDialogOpen(!!scenario.deleteAccountDialogOpen)
    setDeleteAccountResolutions({})
    setDeleteAccountPassword('')
    setDeleteAccountFinalConfirm('')
    setProjectDraft(scenario.currentProject ?? EMPTY_PROJECT)
    setMemberSearchQuery(scenario.memberSearchQuery ?? '')
    setOrgNameDraft('Ingradient')
    setInviteRoleId('member')
    setInviteSearchQuery(scenario.inviteSearchQuery ?? '')
    setCodeRoleId('member')
    setCodeMaxUses('')
    setDeleteProjectConfirm('')
    setPermissionsExpandAll(!!scenario.showPermissionsExpandAll)
    setDraftRoles(defaultRoleMatrix)
    setShowRegisterForm(!!scenario.showRegisterForm)
    setShowIssueForm(!!scenario.showIssueForm)
    setRegisterUid(''); setRegisterName('')
    setIssueDeviceId(''); setIssueValidDays('')
    setDeviceFilterSearch(''); setDeviceFilterStatus('all')
    setShowRenew(false); setRenewDate('')
  }, [scenario])

  const updateProject = (patch: Partial<SettingsProject>) =>
    setProjectDraft((prev) => ({ ...prev, ...patch }))

  return {
    tab, setTab, adminSubTab, setAdminSubTab,
    locale, setLocale, enableHoverPreview, setEnableHoverPreview,
    singleClickToEdit, setSingleClickToEdit,
    showLabelsOnThumbnails, setShowLabelsOnThumbnails,
    accountName, setAccountName, deleteAccountConfirmInput, setDeleteAccountConfirmInput,
    passwordDialogOpen, setPasswordDialogOpen,
    currentPassword, setCurrentPassword, newPassword, setNewPassword,
    newPasswordConfirm, setNewPasswordConfirm,
    deleteAccountDialogOpen, setDeleteAccountDialogOpen,
    deleteAccountResolutions, setDeleteAccountResolutions,
    deleteAccountPassword, setDeleteAccountPassword,
    deleteAccountFinalConfirm, setDeleteAccountFinalConfirm,
    projectDraft, updateProject,
    memberSearchQuery, setMemberSearchQuery,
    deleteProjectConfirm, setDeleteProjectConfirm,
    permissionsExpandAll, setPermissionsExpandAll,
    draftRoles, setDraftRoles,
    orgNameDraft, setOrgNameDraft,
    inviteRoleId, setInviteRoleId,
    inviteSearchQuery, setInviteSearchQuery,
    codeRoleId, setCodeRoleId,
    codeMaxUses, setCodeMaxUses,
    showRegisterForm, setShowRegisterForm,
    showIssueForm, setShowIssueForm,
    registerUid, setRegisterUid, registerName, setRegisterName,
    issueDeviceId, setIssueDeviceId, issueValidDays, setIssueValidDays,
    deviceFilterSearch, setDeviceFilterSearch,
    deviceFilterStatus, setDeviceFilterStatus,
    showRenew, setShowRenew, renewDate, setRenewDate,
  }
}
