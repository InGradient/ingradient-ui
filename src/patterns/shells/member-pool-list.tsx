import React from 'react'
import styled from 'styled-components'
import { Avatar } from '../../components/feedback/avatar'
import { IconButton } from '../../components/inputs/icon-button'

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-2);
`

const Row = styled.li`
  display: flex;
  align-items: center;
  gap: var(--ig-space-3);
  padding: var(--ig-space-2) var(--ig-space-4);
  border-radius: var(--ig-radius-2xs);
  background: var(--ig-color-surface-interactive);
  border: 1px solid var(--ig-color-border-subtle);
`

const TextBlock = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`

const Name = styled.span`
  font-size: var(--ig-font-size-sm);
  color: var(--ig-color-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const Role = styled.span`
  font-size: var(--ig-font-size-2xs);
  color: var(--ig-color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`


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
    <List className={className}>
      {members.map((m) => (
        <Row key={m.id}>
          <Avatar src={m.avatarUrl} initials={m.initials ?? m.name.charAt(0).toUpperCase()} size={28} />
          <TextBlock>
            <Name title={m.name}>{m.name}</Name>
            {m.role ? <Role>{m.role}</Role> : null}
          </TextBlock>
          {onRemove ? (
            <IconButton variant="secondary" size="sm" tone="danger" type="button" aria-label={`Remove member ${m.name}`} onClick={() => onRemove(m.id)}>
              {removeIcon ?? '×'}
            </IconButton>
          ) : null}
        </Row>
      ))}
    </List>
  )
}
