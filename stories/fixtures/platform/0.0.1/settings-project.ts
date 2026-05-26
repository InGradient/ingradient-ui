import type {
  ProjectMemberRowMember,
  ProjectMemberRowRoleOption,
} from '@ingradient/ui/patterns'
import type {
  ExpandedPermissionGroup,
  RoleMatrix,
  SummaryPermissionGroup,
} from '@ingradient/platform-pages'
import type { GroupVisible, ProjectTypeTone } from '@ingradient/ui/patterns'

export interface SettingsProject {
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

export const mockProject: SettingsProject = {
  id: 'p-1',
  name: 'Wafer line A',
  description: 'Production line A defect labeling project.',
  projectType: 'general',
  groupEnabled: false,
  groupRegex: '',
  groupRepRegex: '',
  allowDup: false,
  groupVisible: 'all',
  showFilenameInGallery: true,
  showBboxClassNamesInDetail: true,
}

export const mockDeflectometryProject: SettingsProject = {
  ...mockProject,
  id: 'p-2',
  name: 'Surface deflectometry',
  projectType: 'deflectometry',
  groupEnabled: true,
  groupRegex: '^([^_]+_[^_]+)_',
  groupRepRegex: '_x_orig\\.png$',
}

export const projectRoleOptions: ProjectMemberRowRoleOption[] = [
  { value: 'owner', label: 'Owner' },
  { value: 'manager', label: 'Manager' },
  { value: 'labeler', label: 'Labeler' },
  { value: 'reviewer', label: 'Reviewer' },
  { value: 'client', label: 'Client' },
  { value: 'viewer', label: 'Viewer' },
]

export const mockProjectMembers: ProjectMemberRowMember[] = [
  { id: 'm-1', name: 'June Lee', organization: 'Ingradient', email: 'june@ingradient.ai', role: 'owner' },
  { id: 'm-2', name: 'Soyeon Park', organization: 'Ingradient', email: 'soyeon@ingradient.ai', role: 'manager' },
  { id: 'm-3', name: 'Junho Kim', organization: 'Ingradient', email: 'junho@ingradient.ai', role: 'labeler' },
  { id: 'm-4', name: 'Minji Yu', organization: 'Ingradient', email: 'minji@ingradient.ai', role: 'reviewer' },
  { id: 'm-5', name: 'Hyunjin Cha', organization: 'External', email: 'hyunjin@external.com', role: 'client' },
]

export const candidateUsers = [
  { id: 'u-a', name: 'Sangha Lee', email: 'sangha@external.com' },
  { id: 'u-b', name: 'Yujin Park', email: 'yujin@external.com' },
  { id: 'u-c', email: 'admin@external.com' },
]

export const summaryPermissionGroups: SummaryPermissionGroup[] = [
  {
    key: 'label', label: 'Labeling',
    permissions: [
      { key: 'label_access', label: 'Label Access', description: 'View the label list and read labels.', permissionKeys: ['label.view'] },
      { key: 'label_edit', label: 'Label Edit', description: 'Create, edit, and delete labels.', permissionKeys: ['label.create', 'label.edit', 'label.delete'] },
      { key: 'review', label: 'Review', description: 'Approve labels.', permissionKeys: ['label.approve'] },
    ],
  },
  {
    key: 'share', label: 'Share / Analysis',
    permissions: [
      { key: 'share_export', label: 'Share / Export', permissionKeys: ['share.share', 'share.export'] },
      { key: 'analysis_ai', label: 'Analysis / AI', permissionKeys: ['share.report'] },
    ],
  },
  {
    key: 'edge', label: 'Edge',
    permissions: [{ key: 'edge_camera_setup', label: 'Camera Setup', permissionKeys: ['edge.camera_setup'] }],
  },
]

export const expandedPermissionGroups: ExpandedPermissionGroup[] = [
  {
    key: 'label', label: 'Labeling',
    permissions: [
      { key: 'label.view', label: 'View' },
      { key: 'label.create', label: 'Create' },
      { key: 'label.edit', label: 'Edit' },
      { key: 'label.delete', label: 'Delete' },
      { key: 'label.approve', label: 'Approve' },
    ],
  },
  {
    key: 'share', label: 'Share / Analysis',
    permissions: [
      { key: 'share.share', label: 'Share' },
      { key: 'share.export', label: 'Export' },
      { key: 'share.report', label: 'Report' },
    ],
  },
  {
    key: 'edge', label: 'Edge',
    permissions: [{ key: 'edge.camera_setup', label: 'Camera Setup' }],
  },
]

const allPerms = ['label.view', 'label.create', 'label.edit', 'label.delete', 'label.approve', 'share.share', 'share.export', 'share.report', 'edge.camera_setup']
const fullRole = Object.fromEntries(allPerms.map((k) => [k, true]))
const noneRole = Object.fromEntries(allPerms.map((k) => [k, false]))

export const defaultRoleMatrix: RoleMatrix = {
  owner: fullRole,
  manager: fullRole,
  labeler: { ...noneRole, 'label.view': true, 'label.create': true, 'label.edit': true },
  reviewer: { ...noneRole, 'label.view': true, 'label.edit': true, 'label.approve': true },
  client: { ...noneRole, 'label.view': true, 'share.share': true, 'share.export': true, 'share.report': true },
  viewer: { ...noneRole, 'label.view': true },
}
