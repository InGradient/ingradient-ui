import styled from 'styled-components'
import { Button } from '../../components/inputs/button'
import { SelectField } from '../../components/inputs/select-field'
import { TextField } from '../../components/inputs/text-fields'
import { Table, type TableColumn } from '../../components/data-display/table'
import { stateTitleText } from '../../primitives'

const Wrap = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const SectionTitle = styled.h3`
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--ig-color-text-primary);
`

const SectionDesc = styled.p`
  margin: 0;
  font-size: 12px;
  color: var(--ig-color-text-muted);
  line-height: 1.5;
`

const FormRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
`

const Empty = styled.p`
  ${stateTitleText}
  margin: 16px 0 0;
  text-align: center;
`

const Muted = styled.span`
  color: var(--ig-color-text-muted);
`

const CodeText = styled.span`
  font-family: var(--ig-font-mono, monospace);
  font-size: 12px;
  letter-spacing: 1px;
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
    { key: 'code', header: 'Code', render: (r) => <CodeText>{r.code}</CodeText> },
    { key: 'role', header: 'Role', render: (r) => <Muted>{r.roleId}</Muted> },
    { key: 'uses', header: 'Uses', render: (r) => <Muted>{r.usedCount}{r.maxUses != null ? ` / ${r.maxUses}` : ''}</Muted> },
    { key: 'expires', header: 'Expires', render: (r) => <Muted>{r.expiresAt ? new Date(r.expiresAt).toLocaleDateString() : '—'}</Muted> },
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
    <Wrap>
      {title ? <SectionTitle>{title}</SectionTitle> : null}
      <SectionDesc>{description}</SectionDesc>

      {isAdmin && (
        <FormRow>
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
            style={{ width: 160 }}
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
        </FormRow>
      )}

      {joinCodes.length === 0 ? (
        <Empty>No join codes</Empty>
      ) : (
        <Table<JoinCodeRow> columns={columns} rows={joinCodes} ariaLabel="Join codes table" />
      )}
    </Wrap>
  )
}
