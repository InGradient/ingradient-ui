import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Checkbox } from '../../components/inputs/toggles'
import {
  ProjectPermissionMatrix,
  type RoleMatrix,
  type ExpandedPermissionGroup,
  type SummaryPermissionGroup,
} from './project-permission-matrix'

const roles = [
  { value: 'owner', label: 'Owner' },
  { value: 'manager', label: 'Manager' },
  { value: 'labeler', label: 'Labeler' },
  { value: 'reviewer', label: 'Reviewer' },
  { value: 'client', label: 'Client' },
  { value: 'viewer', label: 'Viewer' },
]

const summaryGroups: SummaryPermissionGroup[] = [
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
    permissions: [
      { key: 'edge_camera_setup', label: 'Camera Setup', permissionKeys: ['edge.camera_setup'] },
    ],
  },
]

const expandedGroups: ExpandedPermissionGroup[] = [
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

const draftRoles: RoleMatrix = {
  owner: { 'label.view': true, 'label.create': true, 'label.edit': true, 'label.delete': true, 'label.approve': true, 'share.share': true, 'share.export': true, 'share.report': true, 'edge.camera_setup': true },
  manager: { 'label.view': true, 'label.create': true, 'label.edit': true, 'label.delete': true, 'label.approve': true, 'share.share': true, 'share.export': true, 'share.report': true, 'edge.camera_setup': true },
  labeler: { 'label.view': true, 'label.create': true, 'label.edit': true, 'label.delete': false, 'label.approve': false, 'share.share': false, 'share.export': false, 'share.report': false, 'edge.camera_setup': false },
  reviewer: { 'label.view': true, 'label.create': false, 'label.edit': true, 'label.delete': false, 'label.approve': true, 'share.share': false, 'share.export': false, 'share.report': false, 'edge.camera_setup': false },
  client: { 'label.view': true, 'label.create': false, 'label.edit': false, 'label.delete': false, 'label.approve': false, 'share.share': true, 'share.export': true, 'share.report': true, 'edge.camera_setup': false },
  viewer: { 'label.view': true, 'label.create': false, 'label.edit': false, 'label.delete': false, 'label.approve': false, 'share.share': false, 'share.export': false, 'share.report': false, 'edge.camera_setup': false },
}

const meta: Meta<typeof ProjectPermissionMatrix> = {
  title: 'Patterns/Shells/ProjectPermissionMatrix',
  component: ProjectPermissionMatrix,
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => <div style={{ width: 900, padding: 20, background: 'var(--ig-color-surface-panel)' }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

export const Summary: Story = {
  args: { roles, groups: expandedGroups, summaryGroups, draftRoles, onChangeRolePermission: () => undefined },
}

export const ExpandAll: Story = {
  args: { roles, expandAll: true, groups: expandedGroups, summaryGroups, draftRoles, onChangeRolePermission: () => undefined },
}

export const Interactive: Story = {
  render: () => {
    const [matrix, setMatrix] = useState<RoleMatrix>(draftRoles)
    const [expandAll, setExpandAll] = useState(false)
    return (
      <>
        <div style={{ marginBottom: 12 }}>
          <Checkbox label="Expand all permissions" checked={expandAll} onChange={(e) => setExpandAll(e.target.checked)} />
        </div>
        <ProjectPermissionMatrix
          roles={roles}
          expandAll={expandAll}
          groups={expandedGroups}
          summaryGroups={summaryGroups}
          draftRoles={matrix}
          onChangeRolePermission={(role, key, checked) =>
            setMatrix((prev) => ({ ...prev, [role]: { ...prev[role], [key]: checked } }))
          }
          onChangeRolePermissions={(role, keys, checked) =>
            setMatrix((prev) => {
              const next = { ...prev[role] }
              for (const k of keys) next[k] = checked
              return { ...prev, [role]: next }
            })
          }
        />
      </>
    )
  },
}
