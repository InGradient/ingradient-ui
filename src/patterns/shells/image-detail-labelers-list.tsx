import { useState, type CSSProperties } from 'react'
import { User } from 'lucide-react'
import { Inline, Stack, Text } from '../../primitives'
import { Badge } from '../../components/feedback/badge'
import { CollapsibleSectionHeader } from '../../components/data-display/collapsible-section-header'
import { SelectableListItem } from '../../components/data-display/selectable-list-item'

const LIST_STYLE = {
  listStyle: 'none' as const,
  margin: 'var(--ig-space-2) 0 0',
  padding: 0,
  maxHeight: 180,
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

const ROW_INACTIVE_STYLE: CSSProperties = { opacity: 0.55 }

export interface ImageDetailLabelersListUser {
  email: string
  name?: string | null
}

export interface ImageDetailLabelersListProps {
  users: ImageDetailLabelersListUser[]
  selectedUsers: Set<string>
  onToggleUser: (email: string) => void
  onHoverUser?: (email: string | null) => void
  title?: string
  defaultOpen?: boolean
  className?: string
}

/**
 * Image detail sidebar 의 labelers section — collapsible 헤더 + count badge +
 * 사용자 row 리스트. platform 의 `ImageDetailLabelers` 와 시각 동일.
 */
export function ImageDetailLabelersList({
  users,
  selectedUsers,
  onToggleUser,
  onHoverUser,
  title = 'Users',
  defaultOpen = false,
  className,
}: ImageDetailLabelersListProps) {
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
            const active = selectedUsers.has(user.email)
            return (
              <SelectableListItem
                key={user.email}
                as="li"
                variant="flat"
                selected={active}
                onClick={() => onToggleUser(user.email)}
                onMouseEnter={() => onHoverUser?.(user.email)}
                onMouseLeave={() => onHoverUser?.(null)}
                style={active ? undefined : ROW_INACTIVE_STYLE}
              >
                <Inline as="span" gap={3} style={ROW_CONTENT_STYLE}>
                  <User size={14} />
                  <Text as="span" size="var(--ig-font-size-sm)" title={user.email} style={ROW_TEXT_STYLE}>{user.name || user.email}</Text>
                </Inline>
              </SelectableListItem>
            )
          })}
        </Stack>
      ) : null}
    </Stack>
  )
}
