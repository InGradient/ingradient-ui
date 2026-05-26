import type { ReactNode } from 'react'
import type {
  AutoSaveState,
  DeleteAccountPreview,
  DeleteAccountResolutions,
  GroupVisible,
  LicenseInfo,
  ProjectMemberRowMember,
  ProjectMemberRowRoleOption,
  ProjectTypeTone,
  SearchableUserCandidate,
  SettingsAccountTabUser,
} from '@ingradient/ui/patterns'
import type {
  InvitationsTabProps,
  OrgMembersTabProps,
  OrgSettingsTabProps,
} from './organization'
import type {
  DevicesFormsProps,
  DevicesLicenseSectionProps,
  DevicesTableProps,
} from './devices'
import type {
  ExpandedPermissionGroup,
  PermissionMatrixRole,
  RoleMatrix,
  SummaryPermissionGroup,
} from './project'
import type { EdgeTabKey } from './edge-tab'

export interface EdgeTabPaneProps {
  projectId?: string | null
  subTab: EdgeTabKey
  onSubTabChange: (next: EdgeTabKey) => void
  workSlot: ReactNode
  exportSlot: ReactNode
  importSlot: ReactNode
}

export type SettingsTab = 'general' | 'account' | 'project' | 'edge' | 'admin'
export type AdminSubTab = 'organization' | 'members-invitations' | 'devices' | 'storage'

export interface ProjectFormDraft {
  id: string
  name: string
  description: string
  projectType: ProjectTypeTone
  groupEnabled: boolean
  groupRegex: string
  groupRepRegex: string
  allowDup: boolean
  groupVisible: GroupVisible
  showFilenameInGallery: boolean
  showBboxClassNamesInDetail: boolean
}

export interface GeneralTabProps {
  locale: string
  enableHoverPreview: boolean
  singleClickToEdit: boolean
  showLabelsOnThumbnails: boolean
  onChangeLocale: (v: string) => void
  onChangeEnableHoverPreview: (v: boolean) => void
  onChangeSingleClickToEdit: (v: boolean) => void
  onChangeShowLabelsOnThumbnails: (v: boolean) => void
}

export interface AccountTabProps {
  user: SettingsAccountTabUser | null
  license: LicenseInfo | null

  name: string
  onChangeName: (v: string) => void
  accountMessage?: string | null
  onSaveName: () => void
  onLogout: () => void

  passwordDialogOpen: boolean
  passwordMessage?: string | null
  currentPassword: string
  newPassword: string
  newPasswordConfirm: string
  onChangeCurrentPassword: (v: string) => void
  onChangeNewPassword: (v: string) => void
  onChangeNewPasswordConfirm: (v: string) => void
  onOpenPasswordDialog: () => void
  onClosePasswordDialog: () => void
  onSubmitPassword: () => void

  deleteAccountDialogOpen: boolean
  deleteAccountConfirmInput: string
  onChangeDeleteAccountConfirmInput: (v: string) => void
  deleteAccountPreview: DeleteAccountPreview | null
  deleteAccountResolutions: DeleteAccountResolutions
  onChangeDeleteAccountResolutions: (r: DeleteAccountResolutions) => void
  deleteAccountPassword: string
  onChangeDeleteAccountPassword: (v: string) => void
  deleteAccountFinalConfirm: string
  onChangeDeleteAccountFinalConfirm: (v: string) => void
  deleteAccountMessage?: string | null
  onOpenDeleteAccountDialog: () => void
  onCloseDeleteAccountDialog: () => void
  onSubmitDeleteAccount: () => void
}

export interface ProjectTabProps {
  noProject?: boolean
  canEdit: boolean
  isOwner: boolean
  canManagePermissions: boolean
  canDeleteProject: boolean
  projectsCount: number

  draft: ProjectFormDraft
  onChangeDraft: (patch: Partial<ProjectFormDraft>) => void
  saveState: AutoSaveState
  saveErrorMessage?: string | null
  nameInvalid?: boolean

  memberSearchQuery: string
  onChangeMemberSearchQuery: (v: string) => void
  candidates: SearchableUserCandidate[]
  onAddMember: (id: string) => void

  members: ProjectMemberRowMember[]
  roleOptions: ProjectMemberRowRoleOption[]
  permissionRoleOptions: PermissionMatrixRole[]
  onChangeRole: (memberId: string, roleId: string) => void
  onRemoveMember: (memberId: string) => void

  permissionsExpandAll: boolean
  onTogglePermissionsExpand: () => void
  expandedPermissionGroups: ExpandedPermissionGroup[]
  summaryPermissionGroups: SummaryPermissionGroup[]
  draftRoles: RoleMatrix
  onChangeRolePermission: (role: string, key: string, checked: boolean) => void
  onChangeRolePermissions: (role: string, keys: string[], checked: boolean) => void

  deleteConfirmInput: string
  onChangeDeleteConfirmInput: (v: string) => void
  onDelete: () => void
}

export interface AdminStorageProps {
  loading?: boolean
  error?: string | null
  overviewSlot: ReactNode
  tierChartSlot: ReactNode
  projectChartSlot: ReactNode
  resolutionChartSlot: ReactNode
  formatChartSlot: ReactNode
  tierTableSlot: ReactNode
  costTableSlot: ReactNode
  recommendationsSlot: ReactNode
  onCopyReport: () => void
}

export interface AdminTabProps {
  subTab: AdminSubTab
  onSubTabChange: (sub: AdminSubTab) => void
  organization: OrgSettingsTabProps
  orgMembers: OrgMembersTabProps
  invitations: InvitationsTabProps
  devicesLicense: DevicesLicenseSectionProps
  devicesForms: DevicesFormsProps
  devicesTable: DevicesTableProps
  storage: AdminStorageProps
}

export interface SettingsModalViewProps {
  open: boolean
  onClose: () => void
  tab: SettingsTab
  onTabChange: (tab: SettingsTab) => void
  isAdmin: boolean

  general: GeneralTabProps
  account: AccountTabProps
  project: ProjectTabProps
  edge?: EdgeTabPaneProps
  admin?: AdminTabProps
}
