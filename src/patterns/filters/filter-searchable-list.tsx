import { useMemo, useState } from 'react'
import { Stack, Text } from '../../primitives'
import { SearchField } from '../../components/inputs/search-field'
import { ColorChip } from '../../components/inputs/color-chip'

const LIST_STYLE = { maxHeight: 'var(--ig-popup-xs)', overflowY: 'auto' as const, paddingRight: 'var(--ig-space-1)' }
const EMPTY_STYLE = { padding: 'var(--ig-space-2)' }

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
    <Stack gap={2} className={className}>
      <SearchField
        size="sm"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {filtered.length === 0 ? (
        <Text as="span" size="var(--ig-font-size-xs)" tone="muted" style={EMPTY_STYLE}>{emptyMessage}</Text>
      ) : (
        <Stack gap={0} style={LIST_STYLE}>
          {filtered.map((item) => (
            <ColorChip
              key={item.id}
              checked={selectedIds.has(item.id)}
              color={item.color}
              label={item.label}
              onChange={(checked) => onToggle(item.id, checked)}
            />
          ))}
        </Stack>
      )}
    </Stack>
  )
}
