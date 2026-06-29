import styled from 'styled-components'
import { Inline, Stack, Text, stateTitleText } from '@ingradient/ui/primitives'
import { Button } from '@ingradient/ui/components'
import { SelectField } from '@ingradient/ui/components'
import { TextField } from '@ingradient/ui/components'
import { Table, type TableColumn } from '@ingradient/ui/components'
import { popupSizeNumbers } from '@ingradient/ui/tokens'

const MAX_USES_STYLE = { width: popupSizeNumbers['2xsPlus'] }

const Empty = styled.p`
  ${stateTitleText}
  margin: var(--ig-space-7) 0 0;
  text-align: center;
`

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
    { key: 'code', header: 'Code', render: (r) => <Text fontFamily="mono" size="var(--ig-font-size-xs)" letterSpacing="var(--ig-letter-spacing-wide)">{r.code}</Text> },
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
    <Stack as="section" gap="var(--ig-space-5)">
      {title ? <Text as="h3" size="var(--ig-font-size-lg)" weight={600}>{title}</Text> : null}
      <Text as="p" tone="muted" size="var(--ig-font-size-xs)">{description}</Text>

      {isAdmin && (
        <Inline gap="var(--ig-space-3)" wrap="wrap">
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
        <Empty>No join codes</Empty>
      ) : (
        <Table<JoinCodeRow> columns={columns} rows={joinCodes} ariaLabel="Join codes table" />
      )}
    </Stack>
  )
}
