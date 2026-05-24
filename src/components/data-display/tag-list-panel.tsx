import { SearchableList } from './searchable-list'
import { TagListItem } from './tag-list-item'

export interface TagSearchCandidate {
  id: string
  color: string
  label: string
}

export interface TagListSearchProps {
  placeholder?: string
  candidates: TagSearchCandidate[]
  onSelect: (id: string) => void
  emptyMessage?: string
  emptyAction?: { label: string; onClick: () => void }
  className?: string
}

export function TagListSearch({
  placeholder = 'Search...', candidates, onSelect,
  emptyMessage = 'No results.', emptyAction, className,
}: TagListSearchProps) {
  return (
    <SearchableList
      candidates={candidates}
      onSelect={(c) => onSelect(c.id)}
      getKey={(c) => c.id}
      renderItem={(c, onClick) => (
        <TagListItem color={c.color} label={c.label} onClick={onClick} />
      )}
      placeholder={placeholder}
      emptyMessage={emptyMessage}
      emptyAction={emptyAction}
      className={className}
    />
  )
}
