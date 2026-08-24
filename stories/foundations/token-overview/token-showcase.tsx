import { useEffect, useState } from 'react'
import styled from 'styled-components'

export type TokenEntry = {
  name: string
  value: string | number
  cssVar?: string
  usage?: string
  kind?: 'css' | 'ts'
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

export function TokenRow({ entry }: { entry: TokenEntry }) {
  const resolved = useResolvedValue(entry.cssVar)
  const kind = entry.kind ?? (entry.cssVar ? 'css' : 'ts')

  return (
    <Row>
      <Name>{entry.name}</Name>
      <div>
        {entry.cssVar ? <Code>{entry.cssVar}</Code> : <Code>TS const only</Code>}
        {entry.usage ? <div><Code>{entry.usage}</Code></div> : null}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ig-space-3)' }}>
        <Code title={entry.cssVar ? `Resolved: ${resolved}` : undefined}>{entry.cssVar ? resolved : String(entry.value)}</Code>
        <Badge $kind={kind}>{kind}</Badge>
      </div>
    </Row>
  )
}

export function TokenTable({ entries }: { entries: TokenEntry[] }) {
  return <div>{entries.map((entry) => <TokenRow key={entry.name} entry={entry} />)}</div>
}

export function ColorTokenCard({ entry }: { entry: TokenEntry }) {
  const resolved = useResolvedValue(entry.cssVar)
  const color = entry.cssVar ? `var(${entry.cssVar})` : String(entry.value)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ig-space-3)' }}>
      <Swatch $color={color} />
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--ig-space-3)' }}>
        <Name>{entry.name}</Name>
        <Badge $kind={entry.cssVar ? 'css' : 'ts'}>{entry.cssVar ? 'CSS' : 'TS'}</Badge>
      </div>
      <Code>{entry.cssVar ?? 'TS const only'}</Code>
      <Code>{entry.cssVar ? resolved : String(entry.value)}</Code>
    </div>
  )
}
