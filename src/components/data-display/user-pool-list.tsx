import { useState, type CSSProperties } from 'react'
import { User } from 'lucide-react'
import { Inline, Stack, Text } from '../../primitives'
import { iconSizeNumbers } from '../../tokens/core'
import { Badge } from '../feedback/badge'
import { CollapsibleSectionHeader } from './collapsible-section-header'
import { SelectableListItem } from './selectable-list-item'

const LIST_STYLE = {
  listStyle: 'none' as const,
  margin: 'var(--ig-space-2) 0 0',
  padding: 0,
  maxHeight: 'var(--ig-popup-xs)',
  overflowY: 'auto' as const,
}

const ROW_CONTENT_STYLE = { width: '100%' }

const ROW_TEXT_STYLE = {
  flex: 1,
  minWidth: 0,
  overflow: 'hidden' as const,
  textOverflow: 'ellipsis' as const,
  whiteSpace: 'nowrap' as const,
  textAlign: 'left' as const,
}

const ROW_INACTIVE_STYLE: CSSProperties = { opacity: 'var(--ig-opacity-overlay)' }

export interface UserPoolItem {
  id: string
  label: string
  tooltip?: string
}

export interface UserPoolListProps {
  users: UserPoolItem[]
  selectedIds: Set<string>
  onToggle: (id: string) => void
  onHover?: (id: string | null) => void
  title?: string
  defaultOpen?: boolean
  className?: string
}

export function UserPoolList({
  users,
  selectedIds,
  onToggle,
  onHover,
  title = 'Users',
  defaultOpen = false,
  className,
}: UserPoolListProps) {
  const [open, setOpen] = useState(defaultOpen)
  if (users.length === 0) return null
  return (
    <Stack gap={0} className={className}>
      <CollapsibleSectionHeader
        title={title}
        open={open}
        onClick={() => setOpen((v) => !v)}
        badge={<Badge $tone="accent">{users.length}</Badge>}
      />
      {open ? (
        <Stack as="ul" gap={1} style={LIST_STYLE}>
          {users.map((user) => {
            const active = selectedIds.has(user.id)
            return (
              <SelectableListItem
                key={user.id}
                as="li"
                variant="flat"
                selected={active}
                onClick={() => onToggle(user.id)}
                onMouseEnter={() => onHover?.(user.id)}
                onMouseLeave={() => onHover?.(null)}
                style={active ? undefined : ROW_INACTIVE_STYLE}
              >
                <Inline as="span" gap={3} style={ROW_CONTENT_STYLE}>
                  <User size={iconSizeNumbers.sm} />
                  <Text as="span" size="var(--ig-font-size-sm)" title={user.tooltip ?? user.label} style={ROW_TEXT_STYLE}>{user.label}</Text>
                </Inline>
              </SelectableListItem>
            )
          })}
        </Stack>
      ) : null}
    </Stack>
  )
}
