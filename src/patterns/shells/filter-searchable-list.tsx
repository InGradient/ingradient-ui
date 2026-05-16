import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { SearchField } from '../../components/inputs/search-field'
import { FilterClassChip } from './filter-class-chip'

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-2);
`

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-height: 180px;
  overflow-y: auto;
  padding-right: var(--ig-space-1);
`

const Empty = styled.span`
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-text-muted);
  padding: var(--ig-space-2);
`

export interface FilterSearchableItem {
  id: string
  label: string
  color?: string
}

export interface FilterSearchableListProps {
  placeholder?: string
  items: FilterSearchableItem[]
  selectedIds: Set<string>
  onToggle: (id: string, checked: boolean) => void
  emptyMessage?: string
  className?: string
}

export function FilterSearchableList({
  placeholder = 'Search', items, selectedIds, onToggle,
  emptyMessage = 'No items.', className,
}: FilterSearchableListProps) {
  const [query, setQuery] = useState('')
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((i) => i.label.toLowerCase().includes(q))
  }, [items, query])

  return (
    <Wrap className={className}>
      <SearchField
        size="sm"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {filtered.length === 0 ? (
        <Empty>{emptyMessage}</Empty>
      ) : (
        <List>
          {filtered.map((item) => (
            <FilterClassChip
              key={item.id}
              checked={selectedIds.has(item.id)}
              color={item.color}
              label={item.label}
              onChange={(checked) => onToggle(item.id, checked)}
            />
          ))}
        </List>
      )}
    </Wrap>
  )
}
