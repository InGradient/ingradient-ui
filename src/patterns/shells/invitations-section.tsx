import styled from 'styled-components'
import { Button } from '../../components/inputs/button'
import { SelectField } from '../../components/inputs/select-field'
import { TextField } from '../../components/inputs/text-fields'
import { SearchResultRow } from '../../components/data-display/search-result-row'
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

const SearchRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`

const Results = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const Hint = styled.p`
  margin: 0;
  font-size: 12px;
  color: var(--ig-color-text-muted);
`

const Feedback = styled.span`
  font-size: 12px;
  color: var(--ig-color-text-muted);
`

const SearchWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const Empty = styled.p`
  ${stateTitleText}
  margin: 16px 0 0;
  text-align: center;
`

const Muted = styled.span`
  color: var(--ig-color-text-muted);
`

const StatusText = styled.span<{ $status: string }>`
  color: ${(p) =>
    p.$status === 'accepted' ? 'var(--ig-color-success)'
    : (p.$status === 'revoked' || p.$status === 'expired') ? 'var(--ig-color-danger)'
    : 'var(--ig-color-text-muted)'
  };
`

export interface InvitationsRoleOption {
  value: string
  label: string
}

export interface InvitationsCandidate {
  id: string
  name?: string | null
  email: string
}

export interface InvitationRow {
  id: string
  email: string
  roleId: string
  status: 'pending' | 'accepted' | 'revoked' | 'expired'
  expiresAt?: string | null
}

export interface InvitationsSectionProps {
  isAdmin?: boolean
  invitations: InvitationRow[]
  roleOptions: InvitationsRoleOption[]
  inviteRoleId: string
  onChangeInviteRoleId: (value: string) => void
  searchQuery: string
  onChangeSearchQuery: (value: string) => void
  isSearching?: boolean
  searchResults: InvitationsCandidate[]
  invitingUserId?: string | null
  inviteMessage?: string | null
  onInviteUser: (user: InvitationsCandidate) => void
  onRevoke: (invitationId: string) => void
  minSearchLength?: number
  title?: string
  description?: string
}

const DEFAULT_DESC = 'Search for a registered user and send them an invitation to join the organization with the selected role.'

export function InvitationsSection({
  isAdmin, invitations, roleOptions,
  inviteRoleId, onChangeInviteRoleId,
  searchQuery, onChangeSearchQuery, isSearching, searchResults,
  invitingUserId, inviteMessage, onInviteUser, onRevoke,
  minSearchLength = 3,
  title = 'Invitations',
  description = DEFAULT_DESC,
}: InvitationsSectionProps) {
  const trimmed = searchQuery.trim()
  const readyToSearch = trimmed.length >= minSearchLength

  const columns: TableColumn<InvitationRow>[] = [
    { key: 'email', header: 'Email', render: (r) => r.email },
    { key: 'role', header: 'Role', render: (r) => <Muted>{r.roleId}</Muted> },
    { key: 'status', header: 'Status', render: (r) => <StatusText $status={r.status}>{r.status}</StatusText> },
    { key: 'expires', header: 'Expires', render: (r) => <Muted>{r.expiresAt ? new Date(r.expiresAt).toLocaleDateString() : '—'}</Muted> },
    ...(isAdmin
      ? [{
          key: 'actions',
          header: '',
          render: (r: InvitationRow) => r.status === 'pending' ? (
            <Button type="button" size="sm" tone="danger" variant="secondary" onClick={() => onRevoke(r.id)}>Revoke</Button>
          ) : null,
        }]
      : []),
  ]

  return (
    <Wrap>
      {title ? <SectionTitle>{title}</SectionTitle> : null}
      <SectionDesc>{description}</SectionDesc>

      {isAdmin && (
        <SearchWrap>
          <SearchRow>
            <TextField
              placeholder="Search users by name or email"
              value={searchQuery}
              onChange={(e) => onChangeSearchQuery(e.target.value)}
              style={{ flex: 1 }}
              title="Search users"
            />
            <SelectField
              value={inviteRoleId}
              onChange={(e) => onChangeInviteRoleId((e.target as HTMLSelectElement).value)}
              title="Role"
              aria-label="Role"
            >
              {roleOptions.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
            </SelectField>
          </SearchRow>

          {readyToSearch ? (
            <Results>
              {isSearching && <Hint>Searching…</Hint>}
              {!isSearching && searchResults.map((u) => (
                <SearchResultRow
                  key={u.id}
                  primary={u.name || u.email}
                  secondary={u.name ? u.email : undefined}
                  actionLabel={invitingUserId === u.id ? 'Inviting…' : 'Invite'}
                  disabled={invitingUserId === u.id}
                  onClick={() => onInviteUser(u)}
                />
              ))}
              {!isSearching && searchResults.length === 0 && <Hint>No registered users found.</Hint>}
            </Results>
          ) : (
            <Hint>Type at least {minSearchLength} characters to search registered users.</Hint>
          )}

          {inviteMessage && <Feedback>{inviteMessage}</Feedback>}
        </SearchWrap>
      )}

      {invitations.length === 0 ? (
        <Empty>No invitations</Empty>
      ) : (
        <Table<InvitationRow> columns={columns} rows={invitations} ariaLabel="Invitations table" />
      )}
    </Wrap>
  )
}
