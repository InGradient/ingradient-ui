import { useState, useMemo, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { ColorSwatch } from './color-swatch'

// ── Styled ─────────────────────────────────────────────────────────

const Wrap = styled.div`
  position: relative;
  width: 100%;
`

const SearchInput = styled.input`
  width: 100%;
  padding: var(--ig-space-3) var(--ig-space-4);
  border: 1px solid var(--ig-color-border-subtle);
  border-radius: var(--ig-radius-sm);
  background: var(--ig-color-surface-muted);
  color: var(--ig-color-text-primary);
  font-size: var(--ig-font-size-sm);
  &::placeholder { color: var(--ig-color-text-soft); }
  &:focus { outline: none; border-color: var(--ig-color-accent-ring); }
`

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 10;
  max-height: 200px;
  overflow-y: auto;
  background: var(--ig-color-surface-elevated, #1e1e2e);
  border: 1px solid var(--ig-color-border-subtle);
  border-radius: var(--ig-radius-sm);
  box-shadow: var(--ig-shadow-md);
  margin-top: var(--ig-space-1);
`

const ResultBtn = styled.button`
  display: flex;
  align-items: center;
  gap: var(--ig-space-3);
  width: 100%;
  padding: var(--ig-space-3) var(--ig-space-4);
  border: none;
  background: transparent;
  color: var(--ig-color-text-primary);
  font-size: var(--ig-font-size-sm);
  text-align: left;
  cursor: pointer;
  &:hover { background: var(--ig-color-surface-interactive); }
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
  border: 1px solid var(--ig-color-border-strong);
  border-radius: var(--ig-radius-sm);
  background: transparent;
  color: var(--ig-color-accent-soft);
  font-size: var(--ig-font-size-xs);
  padding: var(--ig-space-2) var(--ig-space-4);
  cursor: pointer;
  &:hover { background: var(--ig-color-surface-interactive); }
`

// ── Types ──────────────────────────────────────────────────────────

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

// ── Component ──────────────────────────────────────────────────────

export function TagListSearch({
  placeholder = 'Search...', candidates, onSelect,
  emptyMessage = 'No results.', emptyAction, className,
}: TagListSearchProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return candidates
    return candidates.filter((c) => c.label.toLowerCase().includes(q))
  }, [candidates, query])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

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
              <ResultBtn key={c.id} type="button" onClick={() => { onSelect(c.id); setQuery(''); setOpen(false) }}>
                <ColorSwatch $color={c.color} $size="sm" />
                {c.label}
              </ResultBtn>
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
