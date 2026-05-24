import styled from 'styled-components'
import { TagListItem } from './tag-list-item'

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-1);
  overflow-y: auto;
`

export interface TagItemData {
  id: string
  color: string
  label: string
  count?: number
}

export interface TagListProps {
  items: TagItemData[]
  selectedId?: string | null
  activeIds?: Set<string>
  onItemClick?: (id: string) => void
  className?: string
}

export function TagList({ items, selectedId, activeIds, onItemClick, className }: TagListProps) {
  return (
    <List className={className}>
      {items.map((item) => {
        const isActive = selectedId === item.id || (activeIds?.has(item.id) ?? false)
        return (
          <TagListItem
            key={item.id}
            color={item.color}
            label={item.label}
            count={item.count}
            active={isActive}
            onClick={() => onItemClick?.(item.id)}
            title={item.label}
          />
        )
      })}
    </List>
  )
}
