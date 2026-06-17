import styled from 'styled-components'
import { Inline, Stack as PrimStack, Text, stateTitleText } from '@ingradient/ui/primitives'
import { TextField } from '@ingradient/ui/components'
import { OptionRow } from '@ingradient/ui/components'

const Placeholder = styled.p`
  ${stateTitleText}
  margin: 0;
`

const SECTION_TITLE_STYLE = { marginTop: 'var(--ig-space-7)', marginBottom: 'var(--ig-space-3)' }
const ROW_STYLE = {
  padding: 'var(--ig-space-5) 0',
  borderBottom: 'var(--ig-border-1px) solid var(--ig-color-border-strong)',
  width: '100%',
}
const STACK_STYLE = { width: '100%' }
const INPUT_STYLE = { width: '100%', minWidth: 0 }

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
      <Text as="h4" tone="muted" size="var(--ig-font-size-sm)" weight={600} uppercase letterSpacing="0.04em" style={SECTION_TITLE_STYLE}>{title}</Text>
      <Inline gap="var(--ig-space-3)" wrap="wrap" style={ROW_STYLE}>
        <PrimStack gap="var(--ig-space-4)" style={STACK_STYLE}>
          <TextField
            type="search"
            value={query}
            onChange={(e) => onChangeQuery(e.target.value)}
            placeholder={searchPlaceholder}
            aria-label="Search registered users"
            style={INPUT_STYLE}
          />
          {readyToSearch ? (
            <PrimStack gap="var(--ig-space-3)" style={STACK_STYLE}>
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
              {!isSearching && candidates.length === 0 ? <Placeholder>{noResultsHint}</Placeholder> : null}
            </PrimStack>
          ) : (
            <Placeholder>{hintBelow}</Placeholder>
          )}
        </PrimStack>
      </Inline>
      {inviteMessage ? (
        <Inline gap="var(--ig-space-3)" wrap="wrap" style={ROW_STYLE}>
          <Placeholder>{inviteMessage}</Placeholder>
        </Inline>
      ) : null}
    </>
  )
}
