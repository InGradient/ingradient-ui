import React from 'react'
import { Inline, Stack, Text } from '../../primitives'
import { Avatar } from '../../components/feedback/avatar'
import { IconButton } from '../../components/inputs/icon-button'

const LIST_STYLE = { listStyle: 'none' as const, margin: 0, padding: 0 }
const ROW_STYLE = {
  padding: 'var(--ig-space-2) var(--ig-space-4)',
  borderRadius: 'var(--ig-radius-2xs)',
  background: 'var(--ig-color-surface-interactive)',
  border: '1px solid var(--ig-color-border-subtle)',
}
const NAME_STYLE = { overflow: 'hidden' as const, textOverflow: 'ellipsis' as const, whiteSpace: 'nowrap' as const }
const TEXT_BLOCK_STYLE = { flex: 1, minWidth: 0, gap: 2 }

export interface MemberPoolItem {
  id: string
  name: string
  role?: string
  avatarUrl?: string
  initials?: string
}

export interface MemberPoolListProps {
  members: MemberPoolItem[]
  onRemove?: (id: string) => void
  removeIcon?: React.ReactNode
  className?: string
}

export function MemberPoolList({ members, onRemove, removeIcon, className }: MemberPoolListProps) {
  return (
    <Stack as="ul" gap={2} className={className} style={LIST_STYLE}>
      {members.map((m) => (
        <Inline as="li" key={m.id} gap={3} style={ROW_STYLE}>
          <Avatar src={m.avatarUrl} initials={m.initials ?? m.name.charAt(0).toUpperCase()} size={28} />
          <Stack gap={0} style={TEXT_BLOCK_STYLE}>
            <Text size="var(--ig-font-size-sm)" title={m.name} style={NAME_STYLE}>{m.name}</Text>
            {m.role ? <Text size="var(--ig-font-size-2xs)" tone="muted" uppercase letterSpacing="0.05em">{m.role}</Text> : null}
          </Stack>
          {onRemove ? (
            <IconButton variant="secondary" size="sm" tone="danger" type="button" aria-label={`Remove member ${m.name}`} onClick={() => onRemove(m.id)}>
              {removeIcon ?? '×'}
            </IconButton>
          ) : null}
        </Inline>
      ))}
    </Stack>
  )
}
