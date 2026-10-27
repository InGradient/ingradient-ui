import styled from 'styled-components'
import { Inline, Stack as PrimStack, Text } from '@ingradient/ui/primitives'
import { EmptyState, TextField } from '@ingradient/ui/components'
import { OptionRow } from '@ingradient/ui/components'

const SectionTitleBox = styled(Text)`
  margin-top: var(--ig-spacing-16);
  margin-bottom: var(--ig-spacing-8);
`
const RowBox = styled(Inline)`
  padding: var(--ig-spacing-12) 0;
  border-bottom: var(--ig-border-1px) solid var(--ig-color-border-strong);
  width: 100%;
`
const StackBox = styled(PrimStack)`
  width: 100%;
`
const InputBox = styled(TextField)`
  width: 100%;
  min-width: 0;
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
      <SectionTitleBox forwardedAs="h4" tone="muted" size="var(--ig-text-body-sm)" weight="semibold">{title}</SectionTitleBox>
      <RowBox gap="var(--ig-spacing-8)" wrap="wrap">
        <StackBox gap="var(--ig-spacing-8)">
          <InputBox
            type="search"
            value={query}
            onChange={(e) => onChangeQuery(e.target.value)}
            placeholder={searchPlaceholder}
            aria-label="Search registered users"
          />
          {readyToSearch ? (
            <StackBox gap="var(--ig-spacing-8)">
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
              {!isSearching && candidates.length === 0 ? <EmptyState>{noResultsHint}</EmptyState> : null}
            </StackBox>
          ) : (
            <EmptyState>{hintBelow}</EmptyState>
          )}
        </StackBox>
      </RowBox>
      {inviteMessage ? (
        <RowBox gap="var(--ig-spacing-8)" wrap="wrap">
          <EmptyState>{inviteMessage}</EmptyState>
        </RowBox>
      ) : null}
    </>
  )
}
