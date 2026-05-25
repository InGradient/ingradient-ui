import styled from 'styled-components'
import { Text } from '../../primitives'
import { TextField } from '../../components/inputs/text-fields'
import { OptionRow } from '../../components/data-display/option-row'

const SECTION_TITLE_STYLE = { marginTop: 'var(--ig-space-7)', marginBottom: 'var(--ig-space-3)' }

const Row = styled.div`
  padding: var(--ig-space-5) 0;
  border-bottom: 1px solid var(--ig-color-border-strong);
  display: flex;
  align-items: center;
  gap: var(--ig-space-3);
  flex-wrap: wrap;
`

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-4);
  width: 100%;
`

const Input = styled(TextField)`
  width: 100%;
  min-width: 0;
`

const PLACEHOLDER_STYLE = { margin: 0 }

const Results = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-3);
  width: 100%;
`

export interface SearchableUserCandidate {
  id: string
  name?: string | null
  email: string
}

export interface ProjectMemberInviteProps {
  query: string
  onChangeQuery: (value: string) => void
  candidates: SearchableUserCandidate[]
  isSearching?: boolean
  addingMemberUserId?: string | null
  inviteMessage?: string | null
  onAdd: (userId: string) => void
  /** 사용자에게 보일 최소 검색어 길이 (기본 3) */
  minSearchLength?: number
  title?: string
  searchPlaceholder?: string
  emptyHint?: string
  noResultsHint?: string
}

export function ProjectMemberInvite({
  query, onChangeQuery, candidates, isSearching, addingMemberUserId, inviteMessage, onAdd,
  minSearchLength = 3,
  title = 'Add member',
  searchPlaceholder = 'Search registered users by name or email',
  emptyHint,
  noResultsHint = 'No registered users found.',
}: ProjectMemberInviteProps) {
  const trimmed = query.trim()
  const readyToSearch = trimmed.length >= minSearchLength
  const hintBelow = emptyHint ?? `Type at least ${minSearchLength} characters to search registered users.`

  return (
    <>
      <Text as="h4" tone="muted" size="13px" weight={600} uppercase letterSpacing="0.04em" style={SECTION_TITLE_STYLE}>{title}</Text>
      <Row>
        <Stack>
          <Input
            type="search"
            value={query}
            onChange={(e) => onChangeQuery(e.target.value)}
            placeholder={searchPlaceholder}
            aria-label="Search registered users"
          />
          {readyToSearch ? (
            <Results>
              {candidates.map((c) => (
                <OptionRow
                  key={c.id}
                  primary={c.name || c.email}
                  secondary={c.name ? c.email : undefined}
                  actionLabel={addingMemberUserId === c.id ? 'Adding…' : 'Add'}
                  disabled={addingMemberUserId === c.id}
                  onClick={() => onAdd(c.id)}
                />
              ))}
              {!isSearching && candidates.length === 0 ? <Text as="p" tone="soft" size="14px" style={PLACEHOLDER_STYLE}>{noResultsHint}</Text> : null}
            </Results>
          ) : (
            <Text as="p" tone="soft" size="14px" style={PLACEHOLDER_STYLE}>{hintBelow}</Text>
          )}
        </Stack>
      </Row>
      {inviteMessage ? (
        <Row>
          <Text as="p" tone="soft" size="14px" style={PLACEHOLDER_STYLE}>{inviteMessage}</Text>
        </Row>
      ) : null}
    </>
  )
}
