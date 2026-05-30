import { SidePanelLayout, SwatchItemList, TagListSearch } from '@ingradient/ui/components'
import { Avatar, IconButton } from '@ingradient/ui/components'
import { Inline, Stack, Text } from '@ingradient/ui/primitives'
import { RightSideLoadingText } from './CatalogView.styles'
import type { CatalogRightSidebarPaneProps } from './types'

const EMPTY_TEXT_CLASSES = 'No classes available.'
const NO_CLASS_CONNECTED_TEXT = 'No classes connected.'
const EMPTY_TEXT_MEMBERS = 'No members.'
const LOADING_TEXT = 'Loading…'

const MEMBER_LIST_STYLE = { listStyle: 'none' as const, margin: 0, padding: 0 }
const MEMBER_ROW_STYLE = {
  padding: 'var(--ig-space-2) var(--ig-space-4)',
  borderRadius: 'var(--ig-radius-2xs)',
  background: 'var(--ig-color-surface-interactive)',
  border: 'var(--ig-border-1px) solid var(--ig-color-border-subtle)',
}
const MEMBER_NAME_STYLE = { overflow: 'hidden' as const, textOverflow: 'ellipsis' as const, whiteSpace: 'nowrap' as const }
const MEMBER_TEXT_BLOCK_STYLE = { flex: 1, minWidth: 0, gap: 2 }

interface MemberItem {
  id: string
  name: string
  role?: string
  avatarUrl?: string
  initials?: string
}

function MemberPoolList({ members, onRemove }: { members: MemberItem[]; onRemove?: (id: string) => void }) {
  return (
    <Stack as="ul" gap={2} style={MEMBER_LIST_STYLE}>
      {members.map((m) => (
        <Inline as="li" key={m.id} gap={3} style={MEMBER_ROW_STYLE}>
          <Avatar src={m.avatarUrl} initials={m.initials ?? m.name.charAt(0).toUpperCase()} size={28} />
          <Stack gap={0} style={MEMBER_TEXT_BLOCK_STYLE}>
            <Text size="var(--ig-font-size-sm)" title={m.name} style={MEMBER_NAME_STYLE}>{m.name}</Text>
            {m.role ? <Text size="var(--ig-font-size-2xs)" tone="muted" uppercase letterSpacing="0.05em">{m.role}</Text> : null}
          </Stack>
          {onRemove ? (
            <IconButton variant="secondary" size="sm" tone="danger" type="button" aria-label={`Remove member ${m.name}`} onClick={() => onRemove(m.id)}>
              ×
            </IconButton>
          ) : null}
        </Inline>
      ))}
    </Stack>
  )
}

export function CatalogRightSidebar({
  classesLoading,
  membersLoading,
  connectedClasses,
  candidateClasses,
  members,
  onAddClass,
  onRemoveClass,
  onRemoveMember,
}: CatalogRightSidebarPaneProps) {
  const classBody = classesLoading ? (
    <RightSideLoadingText>{LOADING_TEXT}</RightSideLoadingText>
  ) : connectedClasses.length === 0 && candidateClasses.length === 0 ? (
    <RightSideLoadingText>{EMPTY_TEXT_CLASSES}</RightSideLoadingText>
  ) : (
    <>
      <TagListSearch
        placeholder="Search class to add"
        candidates={candidateClasses}
        onSelect={onAddClass}
        emptyMessage="No more classes."
      />
      {connectedClasses.length > 0 ? (
        <SwatchItemList
          items={connectedClasses.map((c) => ({ id: c.id, label: c.name, color: c.color, count: c.count }))}
          onRemove={onRemoveClass}
        />
      ) : (
        <RightSideLoadingText>{NO_CLASS_CONNECTED_TEXT}</RightSideLoadingText>
      )}
    </>
  )

  const memberBody = membersLoading ? (
    <RightSideLoadingText>{LOADING_TEXT}</RightSideLoadingText>
  ) : members.length === 0 ? (
    <RightSideLoadingText>{EMPTY_TEXT_MEMBERS}</RightSideLoadingText>
  ) : (
    <MemberPoolList members={members} onRemove={onRemoveMember} />
  )

  return (
    <SidePanelLayout
      sections={[
        { title: 'Class', body: classBody },
        { title: 'Members', body: memberBody },
      ]}
    />
  )
}
