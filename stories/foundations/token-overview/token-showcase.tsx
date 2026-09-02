import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { SearchField } from '../../../src/components/inputs/search-field'
import { useClipboard } from '../../../src/hooks/useClipboard'

export type TokenEntry = {
  name: string
  value: string | number
  cssVar?: string
  usage?: string
  kind?: 'css' | 'ts'
}

export type TokenSearchEntry = TokenEntry & {
  category: string
}

const Code = styled.code`
  overflow-wrap: anywhere;
  color: var(--ig-color-text-soft);
  font-family: var(--ig-font-mono);
  font-size: var(--ig-font-size-2xs);
  line-height: var(--ig-line-height-snug);
`

const Row = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.3fr) auto;
  gap: var(--ig-space-4);
  align-items: center;
  padding: var(--ig-space-3) 0;
  border-bottom: var(--ig-border-1px) solid var(--ig-color-border-subtle);

  &:last-child {
    border-bottom: 0;
  }

  @media (max-width: 640px) {
    grid-template-columns: minmax(0, 1fr) auto;

    > :nth-child(2) {
      grid-column: 1 / -1;
    }
  }
`

const Name = styled.strong`
  min-width: 0;
  color: var(--ig-color-text-primary);
  font-size: var(--ig-font-size-xs);
`

const Badge = styled.span<{ $kind: 'css' | 'ts' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: var(--ig-control-height-xl);
  min-height: var(--ig-control-height-sm);
  padding: 0 var(--ig-space-2);
  border: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  border-radius: var(--ig-radius-pill);
  background: ${(p) => p.$kind === 'css' ? 'var(--ig-color-accent-soft-surface)' : 'var(--ig-color-white-06)'};
  color: ${(p) => p.$kind === 'css' ? 'var(--ig-color-accent-soft)' : 'var(--ig-color-text-muted)'};
  font-family: var(--ig-font-mono);
  font-size: var(--ig-font-size-3xs);
  font-weight: var(--ig-font-weight-bold);
  letter-spacing: var(--ig-letter-spacing-wide);
  text-transform: uppercase;
`

const Swatch = styled.div<{ $color: string }>`
  min-height: var(--ig-control-height-xl);
  border: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  border-radius: var(--ig-radius-sm);
  background: ${(p) => p.$color};
`

const Explorer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-5);
`

const CategoryNav = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: var(--ig-space-2);
`

const CategoryButton = styled.button<{ $selected: boolean }>`
  min-height: var(--ig-control-height-sm);
  padding: 0 var(--ig-space-3);
  border: var(--ig-border-1px) solid ${(p) => p.$selected ? 'var(--ig-color-accent-border-strong)' : 'var(--ig-color-border-subtle)'};
  border-radius: var(--ig-radius-pill);
  background: ${(p) => p.$selected ? 'var(--ig-color-accent-soft-surface)' : 'var(--ig-color-surface-raised)'};
  color: ${(p) => p.$selected ? 'var(--ig-color-accent-soft)' : 'var(--ig-color-text-secondary)'};
  cursor: pointer;
  font-size: var(--ig-font-size-xs);
  font-weight: var(--ig-font-weight-semibold);

  &:hover {
    background: var(--ig-color-surface-interactive-hover);
    color: var(--ig-color-text-primary);
  }

  &:focus-visible {
    position: relative;
    z-index: var(--ig-z-base);
    outline: var(--ig-border-2px) solid var(--ig-color-accent-ring);
    outline-offset: var(--ig-space-neg-2px);
  }
`

const Results = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-3);
`

const Result = styled.div`
  padding: 0 var(--ig-space-4);
  border: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  border-radius: var(--ig-radius-md);
  background: var(--ig-color-surface-raised);
`

const CategoryLabel = styled.div`
  padding-top: var(--ig-space-3);
  color: var(--ig-color-text-muted);
  font-family: var(--ig-font-mono);
  font-size: var(--ig-font-size-3xs);
  font-weight: var(--ig-font-weight-bold);
  letter-spacing: var(--ig-letter-spacing-wide);
  text-transform: uppercase;
`

const CopyButton = styled.button`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  min-height: var(--ig-control-height-sm);
  padding: 0 var(--ig-space-2);
  border: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  border-radius: var(--ig-radius-xs);
  background: var(--ig-color-surface-raised);
  color: var(--ig-color-text-soft);
  cursor: pointer;
  font-family: var(--ig-font-mono);
  font-size: var(--ig-font-size-3xs);
  font-weight: var(--ig-font-weight-bold);

  &:hover {
    border-color: var(--ig-color-accent-border-strong);
    color: var(--ig-color-text-primary);
  }

  &:focus-visible {
    position: relative;
    z-index: var(--ig-z-base);
    outline: var(--ig-border-2px) solid var(--ig-color-accent-ring);
    outline-offset: var(--ig-space-neg-2px);
  }
`

function CopyTokenValue({ value, label }: { value: string; label: string }) {
  const { copy, copied } = useClipboard()
  const action = copied ? 'Copied' : 'Copy'

  return <CopyButton type="button" onClick={() => void copy(value)} aria-label={`${action} ${label}`} title={`${action} ${label}`}>{action}</CopyButton>
}

function useResolvedValue(cssVar?: string) {
  const [value, setValue] = useState('—')

  useEffect(() => {
    if (!cssVar) {
      setValue('—')
      return
    }
    const read = () => setValue(getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim() || '—')
    read()
    const observer = new MutationObserver(read)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'data-ig-density', 'style'] })
    return () => observer.disconnect()
  }, [cssVar])

  return value
}

export function TokenRow({ entry, separateValueCopy = false }: { entry: TokenEntry; separateValueCopy?: boolean }) {
  const resolved = useResolvedValue(entry.cssVar)
  const kind = entry.kind ?? (entry.cssVar ? 'css' : 'ts')
  const identifier = entry.cssVar ?? entry.name
  const value = entry.cssVar ? resolved : String(entry.value)

  return (
    <Row>
      <Name>{entry.name}</Name>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--ig-space-2)' }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          {entry.cssVar ? <Code>{entry.cssVar}</Code> : <Code>TS const only</Code>}
          {entry.usage ? <div><Code>{entry.usage}</Code></div> : null}
        </div>
        <CopyTokenValue value={separateValueCopy ? identifier : `${identifier}: ${value}`} label={separateValueCopy ? `${entry.name} identifier` : `${entry.name} token`} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ig-space-3)' }}>
        <Code title={entry.cssVar ? `Resolved: ${resolved}` : undefined}>{value}</Code>
        {separateValueCopy ? <CopyTokenValue value={value} label={`${entry.name} value`} /> : null}
        <Badge $kind={kind}>{kind}</Badge>
      </div>
    </Row>
  )
}

export function TokenTable({ entries }: { entries: TokenEntry[] }) {
  return <div>{entries.map((entry) => <TokenRow key={entry.name} entry={entry} />)}</div>
}

export function ColorTokenCard({ entry, includeName = true }: { entry: TokenEntry; includeName?: boolean }) {
  const resolved = useResolvedValue(entry.cssVar)
  const color = entry.cssVar ? `var(${entry.cssVar})` : String(entry.value)
  const identifier = entry.cssVar ?? entry.name
  const value = entry.cssVar ? resolved : String(entry.value)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ig-space-3)' }}>
      <Swatch $color={color} />
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--ig-space-3)' }}>
        {includeName ? <Name>{entry.name}</Name> : <span />}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ig-space-2)' }}>
          <CopyTokenValue value={`${identifier}: ${value}`} label={`${entry.name} token`} />
          <Badge $kind={entry.cssVar ? 'css' : 'ts'}>{entry.cssVar ? 'CSS' : 'TS'}</Badge>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--ig-space-2)' }}><Code>{entry.cssVar ?? 'TS const only'}</Code></div>
      <Code>{value}</Code>
    </div>
  )
}

export function TokenExplorer({ entries }: { entries: TokenSearchEntry[] }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string | null>(null)
  const categories = useMemo(() => Array.from(new Set(entries.map((entry) => entry.category))), [entries])
  const normalizedQuery = query.trim().toLocaleLowerCase()
  const matchingEntries = useMemo(() => entries.filter((entry) => {
    const matchesCategory = !category || entry.category === category
    const searchable = [entry.name, entry.cssVar, entry.usage, String(entry.value), entry.category]
      .filter(Boolean)
      .join(' ')
      .toLocaleLowerCase()
    return matchesCategory && (!normalizedQuery || searchable.includes(normalizedQuery))
  }), [category, entries, normalizedQuery])
  const visibleEntries = matchingEntries.slice(0, 12)
  const isFiltering = Boolean(category || normalizedQuery)

  return (
    <Explorer>
      <SearchField
        aria-label="Search token names, values, or usage"
        placeholder="Search a token name, CSS variable, value, or usage"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onClear={() => setQuery('')}
      />
      <CategoryNav aria-label="Filter tokens by category">
        <CategoryButton type="button" $selected={!category} aria-pressed={!category} onClick={() => setCategory(null)}>All categories</CategoryButton>
        {categories.map((item) => <CategoryButton key={item} type="button" $selected={category === item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</CategoryButton>)}
      </CategoryNav>
      {isFiltering ? (
        <Results aria-live="polite">
          <Code>{matchingEntries.length === 0 ? 'No matching tokens.' : `Showing ${visibleEntries.length}${matchingEntries.length > visibleEntries.length ? ` of ${matchingEntries.length}` : ''} matching tokens.`}</Code>
          {visibleEntries.map((entry) => <Result key={`${entry.category}-${entry.name}`}><CategoryLabel>{entry.category}</CategoryLabel><TokenRow entry={entry} separateValueCopy /></Result>)}
        </Results>
      ) : <Code>Search by name, CSS variable, value, or usage. Or select a category to browse its tokens.</Code>}
    </Explorer>
  )
}
