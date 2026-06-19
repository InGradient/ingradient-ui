import type { AutoSaveState } from '@ingradient/ui/patterns'
import type { DeleteAccountPreview, LicenseInfo } from '@ingradient/platform-pages'
import { mockUser, orgLicense, personalLicense, expiredLicense, type SettingsUser } from './settings-account'
import { mockProject, mockDeflectometryProject, type SettingsProject } from './settings-project'

export type SettingsTab = 'general' | 'account' | 'project' | 'edge' | 'admin'
export type AdminSubTab = 'organization' | 'members-invitations' | 'devices' | 'storage'

export interface SettingsScene {
  /** 초기 활성 탭 */
  initialTab?: SettingsTab
  initialAdminSubTab?: AdminSubTab
  isAdmin?: boolean

  /** General */
  locale?: string
  enableHoverPreview?: boolean
  singleClickToEdit?: boolean
  showLabelsOnThumbnails?: boolean

  /** Account */
  user?: SettingsUser | null
  license?: LicenseInfo | null
  accountMessage?: string | null
  passwordDialogOpen?: boolean
  passwordMessage?: string | null
  passwordCurrent?: string
  passwordNew?: string
  passwordConfirm?: string
  deleteAccountDialogOpen?: boolean
  deleteAccountPreview?: DeleteAccountPreview | null
  deleteAccountMessage?: string | null

  /** Project */
  currentProject?: SettingsProject | null
  noProject?: boolean
  canEditProject?: boolean
  isProjectOwner?: boolean
  saveState?: AutoSaveState
  saveErrorMessage?: string | null
  nameInvalid?: boolean
  canInviteMembers?: boolean
  canManagePermissions?: boolean
  canDeleteProject?: boolean
  projectsCount?: number
  memberSearchQuery?: string
  showPermissionsExpandAll?: boolean

  /** Admin: Org */
  orgSavingMessage?: string | null
  orgErrorMessage?: string | null

  /** Admin: Devices */
  deviceLoading?: boolean
  deviceError?: string | null
  showRegisterForm?: boolean
  showIssueForm?: boolean
  hasIssuedToken?: boolean
  filteredDevicesEmpty?: boolean

  /** Admin: Storage */
  storageError?: string | null
  storageLoading?: boolean

  /** Edge tab */
  edgeSubTab?: 'work' | 'export' | 'import'
  edgeImportMode?: 'idle' | 'uploading' | 'completed'
  edgeExportPending?: boolean
}

const defaultPreview: DeleteAccountPreview = {
  solo_projects: [
    { project_id: 'sp-1', project_name: 'Solo defect study', role: 'owner', member_count: 1 },
  ],
  requires_resolution: [
    {
      project_id: 'p-1', project_name: 'Wafer line A', role: 'owner', member_count: 4, owner_count: 1,
      transfer_candidates: [
        { user_id: 'u-a', name: 'Soyeon Park', email: 'soyeon@ingradient.ai' },
        { user_id: 'u-b', name: 'Junho Kim', email: 'junho@ingradient.ai' },
      ],
    },
  ],
}

const base: SettingsScene = {
  initialTab: 'general',
  initialAdminSubTab: 'organization',
  isAdmin: true,
  locale: 'en',
  enableHoverPreview: true,
  singleClickToEdit: false,
  showLabelsOnThumbnails: true,
  user: mockUser,
  license: orgLicense,
  currentProject: mockProject,
  canEditProject: true,
  isProjectOwner: true,
  saveState: 'idle',
  canInviteMembers: true,
  canManagePermissions: true,
  canDeleteProject: true,
  projectsCount: 3,
}

export type SettingsScenarioKey =
  | 'default'
  | 'account-default'
  | 'account-license-personal'
  | 'account-license-expired'
  | 'account-license-loading'
  | 'account-saved'
  | 'account-password-dialog'
  | 'account-password-mismatch'
  | 'account-delete-dialog'
  | 'account-delete-with-solo'
  | 'project-default'
  | 'project-deflectometry'
  | 'project-readonly'
  | 'project-grouping-enabled'
  | 'project-saving'
  | 'project-name-invalid'
  | 'project-no-project'
  | 'project-permissions-expand-all'
  | 'edge-no-project'
  | 'edge-work-default'
  | 'edge-work-deflectometry'
  | 'edge-export-with-packages'
  | 'edge-import-idle'
  | 'edge-import-uploading'
  | 'edge-import-completed'
  | 'admin-organization'
  | 'admin-org-saved'
  | 'admin-members'
  | 'admin-invitations-search'
  | 'admin-devices'
  | 'admin-devices-loading'
  | 'admin-devices-token-issued'
  | 'admin-storage'
  | 'admin-storage-loading'
  | 'admin-storage-error'
  | 'non-admin'

export const settingsScenarios: Record<SettingsScenarioKey, SettingsScene> = {
  'default': base,
  'account-default': { ...base, initialTab: 'account' },
  'account-license-personal': { ...base, initialTab: 'account', license: personalLicense },
  'account-license-expired': { ...base, initialTab: 'account', license: expiredLicense },
  'account-license-loading': { ...base, initialTab: 'account', license: null },
  'account-saved': { ...base, initialTab: 'account', accountMessage: 'Saved.' },
  'account-password-dialog': { ...base, initialTab: 'account', passwordDialogOpen: true },
  'account-password-mismatch': {
    ...base, initialTab: 'account', passwordDialogOpen: true,
    passwordCurrent: 'old', passwordNew: 'newpassword', passwordConfirm: 'different',
  },
  'account-delete-dialog': { ...base, initialTab: 'account', deleteAccountDialogOpen: true, deleteAccountPreview: { solo_projects: [], requires_resolution: defaultPreview.requires_resolution } },
  'account-delete-with-solo': { ...base, initialTab: 'account', deleteAccountDialogOpen: true, deleteAccountPreview: defaultPreview },
  'project-default': { ...base, initialTab: 'project' },
  'project-deflectometry': { ...base, initialTab: 'project', currentProject: mockDeflectometryProject },
  'project-readonly': { ...base, initialTab: 'project', canEditProject: false, isProjectOwner: false },
  'project-grouping-enabled': {
    ...base, initialTab: 'project',
    currentProject: { ...mockProject, groupEnabled: true, groupRegex: '^([^_]+_[^_]+)_', groupRepRegex: '_x_orig\\.png$' },
  },
  'project-saving': { ...base, initialTab: 'project', saveState: 'saving' },
  'project-name-invalid': {
    ...base, initialTab: 'project', nameInvalid: true,
    currentProject: { ...mockProject, name: '' },
  },
  'project-no-project': { ...base, initialTab: 'project', noProject: true, currentProject: null },
  'project-permissions-expand-all': { ...base, initialTab: 'project', showPermissionsExpandAll: true },
  'edge-no-project': { ...base, initialTab: 'edge', noProject: true, currentProject: null },
  'edge-work-default': { ...base, initialTab: 'edge', edgeSubTab: 'work' },
  'edge-work-deflectometry': { ...base, initialTab: 'edge', edgeSubTab: 'work', currentProject: mockDeflectometryProject },
  'edge-export-with-packages': { ...base, initialTab: 'edge', edgeSubTab: 'export' },
  'edge-import-idle': { ...base, initialTab: 'edge', edgeSubTab: 'import', edgeImportMode: 'idle' },
  'edge-import-uploading': { ...base, initialTab: 'edge', edgeSubTab: 'import', edgeImportMode: 'uploading' },
  'edge-import-completed': { ...base, initialTab: 'edge', edgeSubTab: 'import', edgeImportMode: 'completed' },
  'admin-organization': { ...base, initialTab: 'admin', initialAdminSubTab: 'organization' },
  'admin-org-saved': { ...base, initialTab: 'admin', initialAdminSubTab: 'organization', orgSavingMessage: 'Saved' },
  'admin-members': { ...base, initialTab: 'admin', initialAdminSubTab: 'members-invitations' },
  'admin-invitations-search': {
    ...base, initialTab: 'admin', initialAdminSubTab: 'members-invitations',
    memberSearchQuery: 'sangha',
  },
  'admin-devices': { ...base, initialTab: 'admin', initialAdminSubTab: 'devices' },
  'admin-devices-loading': { ...base, initialTab: 'admin', initialAdminSubTab: 'devices', deviceLoading: true },
  'admin-devices-token-issued': { ...base, initialTab: 'admin', initialAdminSubTab: 'devices', hasIssuedToken: true },
  'admin-storage': { ...base, initialTab: 'admin', initialAdminSubTab: 'storage' },
  'admin-storage-loading': { ...base, initialTab: 'admin', initialAdminSubTab: 'storage', storageLoading: true },
  'admin-storage-error': { ...base, initialTab: 'admin', initialAdminSubTab: 'storage', storageError: 'Failed to load storage analytics.' },
  'non-admin': { ...base, isAdmin: false },
}
