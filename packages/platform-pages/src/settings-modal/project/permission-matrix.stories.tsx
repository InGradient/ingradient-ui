import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { PermissionMatrix } from './permission-matrix'
import { Checkbox } from '@ingradient/ui/components'

const meta: Meta<typeof PermissionMatrix> = {
  title: 'Platform Pages/Settings Modal/Project/PermissionMatrix',
  component: PermissionMatrix,
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof meta>

const columnGroups = [
  {
    key: 'access',
    label: 'Access',
    columns: [
      { key: 'view', label: 'View', description: 'View list of items.' },
      { key: 'edit', label: 'Edit', description: 'Edit existing items.' },
    ],
  },
  {
    key: 'admin',
    label: 'Admin',
    columns: [
      { key: 'delete', label: 'Delete', description: 'Delete items permanently.' },
      { key: 'manage', label: 'Manage', description: 'Manage members and settings.' },
    ],
  },
]

const rows = [
  { key: 'owner', label: 'Owner' },
  { key: 'admin', label: 'Admin' },
  { key: 'editor', label: 'Editor' },
  { key: 'viewer', label: 'Viewer' },
  { key: 'guest', label: 'Guest' },
]

type State = Record<string, Record<string, boolean>>

export const Default: Story = {
  render: () => {
    const [state, setState] = useState<State>({
      owner: { view: true, edit: true, delete: true, manage: true },
      admin: { view: true, edit: true, delete: true, manage: false },
      editor: { view: true, edit: true, delete: false, manage: false },
      viewer: { view: true, edit: false, delete: false, manage: false },
      guest: { view: false, edit: false, delete: false, manage: false },
    })
    return (
      <div style={{ padding: 24 }}>
        <PermissionMatrix
          rows={rows}
          columnGroups={columnGroups}
          rowHeaderLabel="Role"
          searchPlaceholder="Search role…"
          renderCell={(row, column) => (
            <Checkbox
              checked={!!state[row.key]?.[column.key]}
              disabled={row.key === 'owner'}
              onChange={(e) =>
                setState((s) => ({ ...s, [row.key]: { ...s[row.key], [column.key]: e.target.checked } }))
              }
              aria-label={`${row.label} ${column.label}`}
            />
          )}
        />
      </div>
    )
  },
}

export const NoSearch: Story = {
  render: () => {
    const [state, setState] = useState<State>({})
    return (
      <div style={{ padding: 24 }}>
        <PermissionMatrix
          rows={rows.slice(0, 3)}
          columnGroups={columnGroups}
          rowHeaderLabel="Role"
          renderCell={(row, column) => (
            <Checkbox
              checked={!!state[row.key]?.[column.key]}
              onChange={(e) =>
                setState((s) => ({ ...s, [row.key]: { ...s[row.key], [column.key]: e.target.checked } }))
              }
              aria-label={`${row.label} ${column.label}`}
            />
          )}
        />
      </div>
    )
  },
}
