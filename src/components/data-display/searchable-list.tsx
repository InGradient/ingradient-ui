import { useState, useMemo, useRef, useEffect } from 'react'
import styled from 'styled-components'

const Wrap = styled.div`
  position: relative;
  width: 100%;
`

const SearchInput = styled.input`
  width: 100%;
  padding: var(--ig-space-3) var(--ig-space-4);
  border: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  border-radius: var(--ig-radius-sm);
  background: var(--ig-color-surface-muted);
  color: var(--ig-color-text-primary);
  font-size: var(--ig-font-size-sm);
  &::placeholder { color: var(--ig-color-text-soft); }
  &:focus-visible { border-color: var(--ig-color-accent-ring); box-shadow: var(--ig-shadow-focus-ring); }
`

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: var(--ig-z-dropdown);
  max-height: 200px;
  overflow-y: auto;
  background: var(--ig-color-surface-raised);
  border: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  border-radius: var(--ig-radius-sm);
  box-shadow: var(--ig-shadow-md);
  margin-top: var(--ig-space-1);
`

const EmptyMsg = styled.div`
  padding: var(--ig-space-4);
  text-align: center;
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-text-soft);
`

const ActionLink = styled.button`
  display: block;
  margin: var(--ig-space-2) auto var(--ig-space-3);
  border: var(--ig-border-1px) solid var(--ig-color-border-strong);
  border-radius: var(--ig-radius-sm);
  background: transparent;
  color: var(--ig-color-accent-soft);
  font-size: var(--ig-font-size-xs);
  padding: var(--ig-space-2) var(--ig-space-4);
  cursor: pointer;
  &:hover { background: var(--ig-color-surface-interactive); }
`

export interface SearchableListProps<T> {
  candidates: T[]
  onSelect: (item: T) => void
  getKey: (item: T) => string
  renderItem: (item: T, onClick: () => void) => React.ReactNode
  filter?: (item: T, query: string) => boolean
  placeholder?: string
  emptyMessage?: string
  emptyAction?: { label: string; onClick: () => void }
  className?: string
}

export function SearchableList<T>({
  candidates,
  onSelect,
  getKey,
  renderItem,
  filter,
  placeholder = 'Search...',
  emptyMessage = 'No results.',
  emptyAction,
  className,
}: SearchableListProps<T>) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return candidates
    if (filter) return candidates.filter((c) => filter(c, q))
    return candidates.filter((c) => String((c as { label?: unknown }).label ?? '').toLowerCase().includes(q))
  }, [candidates, query, filter])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const handleSelect = (item: T) => {
    onSelect(item)
    setQuery('')
    setOpen(false)
  }

  return (
    <Wrap ref={wrapRef} className={className}>
      <SearchInput
        type="search"
        placeholder={placeholder}
        value={query}
        onFocus={() => setOpen(true)}
        onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
      />
      {open && (
        <Dropdown>
          {filtered.length > 0 ? (
            filtered.map((c) => (
              <div key={getKey(c)}>
                {renderItem(c, () => handleSelect(c))}
              </div>
            ))
          ) : (
            <>
              <EmptyMsg>{emptyMessage}</EmptyMsg>
              {emptyAction && <ActionLink type="button" onClick={emptyAction.onClick}>{emptyAction.label}</ActionLink>}
            </>
          )}
        </Dropdown>
      )}
    </Wrap>
  )
}
