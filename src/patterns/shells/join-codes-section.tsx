import { Inline, Stack, Text } from '../../primitives'
import { Button } from '../../components/inputs/button'
import { SelectField } from '../../components/inputs/select-field'
import { TextField } from '../../components/inputs/text-fields'
import { Table, type TableColumn } from '../../components/data-display/table'

const EMPTY_STYLE = { margin: 'var(--ig-space-7) 0 0' }
const MAX_USES_STYLE = { width: 160 }

export interface JoinCodesRoleOption {
  value: string
  label: string
}

export interface JoinCodeRow {
  id: string
  code: string
  roleId: string
  usedCount: number
  maxUses?: number | null
  expiresAt?: string | null
}

export interface JoinCodesSectionProps {
  isAdmin?: boolean
  joinCodes: JoinCodeRow[]
  roleOptions: JoinCodesRoleOption[]
  codeRoleId: string
  onChangeCodeRoleId: (value: string) => void
  codeMaxUses: string
  onChangeCodeMaxUses: (value: string) => void
  onCreate?: () => void
  createDisabled?: boolean
  createDisabledTitle?: string
  createLabel?: string
  onDelete: (id: string) => void
  title?: string
  description?: string
}

const DEFAULT_DESC = 'Generate a shareable code. Anyone with the code can join the organization with the selected role.'

export function JoinCodesSection({
  isAdmin, joinCodes, roleOptions,
  codeRoleId, onChangeCodeRoleId,
  codeMaxUses, onChangeCodeMaxUses,
  onCreate, createDisabled, createDisabledTitle, createLabel = 'Create Code',
  onDelete,
  title = 'Join Codes',
  description = DEFAULT_DESC,
}: JoinCodesSectionProps) {
  const columns: TableColumn<JoinCodeRow>[] = [
    { key: 'code', header: 'Code', render: (r) => <Text fontFamily="mono" size="12px" letterSpacing="1px">{r.code}</Text> },
    { key: 'role', header: 'Role', render: (r) => <Text tone="muted">{r.roleId}</Text> },
    { key: 'uses', header: 'Uses', render: (r) => <Text tone="muted">{r.usedCount}{r.maxUses != null ? ` / ${r.maxUses}` : ''}</Text> },
    { key: 'expires', header: 'Expires', render: (r) => <Text tone="muted">{r.expiresAt ? new Date(r.expiresAt).toLocaleDateString() : '—'}</Text> },
    ...(isAdmin
      ? [{
          key: 'actions',
          header: '',
          render: (r: JoinCodeRow) => (
            <Button type="button" size="sm" tone="danger" variant="secondary" onClick={() => onDelete(r.id)}>Delete</Button>
          ),
        }]
      : []),
  ]

  return (
    <Stack as="section" gap={5}>
      <Text as="h3" size="15px" weight={600}>{title}</Text>
      <Text as="p" tone="muted" size="12px">{description}</Text>

      {isAdmin && (
        <Inline gap={3} wrap="wrap">
          <SelectField
            value={codeRoleId}
            onChange={(e) => onChangeCodeRoleId((e.target as HTMLSelectElement).value)}
            title="Role"
            aria-label="Role"
          >
            {roleOptions.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
          </SelectField>
          <TextField
            placeholder="Max uses (optional)"
            value={codeMaxUses}
            onChange={(e) => onChangeCodeMaxUses(e.target.value.replace(/\D/g, ''))}
            style={MAX_USES_STYLE}
            title="Max uses"
          />
          <Button
            type="button"
            onClick={onCreate}
            disabled={!!createDisabled}
            title={createDisabledTitle}
          >
            {createLabel}
          </Button>
        </Inline>
      )}

      {joinCodes.length === 0 ? (
        <Text as="p" tone="muted" align="center" size="13px" style={EMPTY_STYLE}>No join codes</Text>
      ) : (
        <Table<JoinCodeRow> columns={columns} rows={joinCodes} ariaLabel="Join codes table" />
      )}
    </Stack>
  )
}
