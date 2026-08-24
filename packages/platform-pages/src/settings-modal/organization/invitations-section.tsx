import { Inline, Stack, Text } from '@ingradient/ui/primitives'
import { Button } from '@ingradient/ui/components'
import { SelectField } from '@ingradient/ui/components'
import { TextField } from '@ingradient/ui/components'
import { OptionRow } from '@ingradient/ui/components'
import { EmptyText } from '@ingradient/ui/components'
import { Table, type TableColumn } from '@ingradient/ui/components'

const SEARCH_FIELD_STYLE = { flex: 1 }
const EMPTY_STYLE = { marginTop: 'var(--ig-space-7)' }

function statusTone(status: string): 'success' | 'danger' | 'muted' {
  if (status === 'accepted') return 'success'
  if (status === 'revoked' || status === 'expired') return 'danger'
  return 'muted'
}

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
    { key: 'role', header: 'Role', render: (r) => <Text tone="muted">{r.roleId}</Text> },
    { key: 'status', header: 'Status', render: (r) => <Text tone={statusTone(r.status)}>{r.status}</Text> },
    { key: 'expires', header: 'Expires', render: (r) => <Text tone="muted">{r.expiresAt ? new Date(r.expiresAt).toLocaleDateString() : '—'}</Text> },
    ...(isAdmin
      ? [{
          key: 'actions',
          header: '',
          headerAriaLabel: 'Actions',
          render: (r: InvitationRow) => r.status === 'pending' ? (
            <Button type="button" size="sm" tone="danger" variant="secondary" onClick={() => onRevoke(r.id)}>Revoke</Button>
          ) : null,
        }]
      : []),
  ]

  return (
    <Stack as="section" gap="var(--ig-space-5)">
      {title ? <Text as="h3" size="var(--ig-font-size-lg)" weight="semibold">{title}</Text> : null}
      <Text as="p" tone="muted" size="var(--ig-font-size-xs)">{description}</Text>

      {isAdmin && (
        <Stack gap="var(--ig-space-3)">
          <Inline gap="var(--ig-space-3)">
            <TextField
              placeholder="Search users by name or email"
              value={searchQuery}
              onChange={(e) => onChangeSearchQuery(e.target.value)}
              style={SEARCH_FIELD_STYLE}
              aria-label="Search users"
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
          </Inline>

          {readyToSearch ? (
            <Stack gap="var(--ig-space-2)">
              {isSearching && <Text as="p" tone="muted" size="var(--ig-font-size-xs)">Searching…</Text>}
              {!isSearching && searchResults.map((u) => (
                <OptionRow
                  key={u.id}
                  primary={u.name || u.email}
                  secondary={u.name ? u.email : undefined}
                  actionLabel={invitingUserId === u.id ? 'Inviting…' : 'Invite'}
                  disabled={invitingUserId === u.id}
                  onClick={() => onInviteUser(u)}
                />
              ))}
              {!isSearching && searchResults.length === 0 && <Text as="p" tone="muted" size="var(--ig-font-size-xs)">No registered users found.</Text>}
            </Stack>
          ) : (
            <Text as="p" tone="muted" size="var(--ig-font-size-xs)">Type at least {minSearchLength} characters to search registered users.</Text>
          )}

          {inviteMessage && <Text tone="muted" size="var(--ig-font-size-xs)">{inviteMessage}</Text>}
        </Stack>
      )}

      {invitations.length === 0 ? (
        <EmptyText style={EMPTY_STYLE}>No invitations</EmptyText>
      ) : (
        <Table<InvitationRow>
          columns={columns}
          rows={invitations}
          ariaLabel="Invitations table"
          minWidth="var(--ig-popup-3xl-narrow)"
        />
      )}
    </Stack>
  )
}
