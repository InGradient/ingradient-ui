import { useState, type CSSProperties } from 'react'
import styled from 'styled-components'
import { User } from 'lucide-react'
import { Badge } from '../../components/feedback/badge'
import { SelectableListItem } from '../../components/data-display/selectable-list-item'

const Root = styled.div`
  display: flex;
  flex-direction: column;
`

const Header = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ig-space-2);
  padding: var(--ig-space-2) 0;
  background: none;
  border: none;
  cursor: pointer;
  user-select: none;
`

const Title = styled.span`
  display: inline-flex;
  align-items: center;
  gap: var(--ig-space-1);
  font-size: var(--ig-font-size-sm);
  font-weight: 600;
  color: var(--ig-color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
`

const List = styled.ul`
  list-style: none;
  margin: var(--ig-space-2) 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-1);
  max-height: 180px;
  overflow-y: auto;
`

const RowContent = styled.span`
  display: flex;
  align-items: center;
  gap: var(--ig-space-3);
  width: 100%;
  min-width: 0;
`

const RowText = styled.span`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: var(--ig-font-size-sm);
  text-align: left;
`

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
    <Root className={className}>
      <Header type="button" onClick={() => setOpen((v) => !v)}>
        <Title>
          <span>{open ? '▾' : '▸'}</span>
          {title}
        </Title>
        <Badge $tone="accent">{users.length}</Badge>
      </Header>
      {open ? (
        <List>
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
                <RowContent>
                  <User size={14} />
                  <RowText title={user.email}>{user.name || user.email}</RowText>
                </RowContent>
              </SelectableListItem>
            )
          })}
        </List>
      ) : null}
    </Root>
  )
}
