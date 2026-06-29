import React from 'react'
import styled from 'styled-components'
import { Inline } from '../../primitives'
import { formatPatternTab, type FormatPatternTabItem } from '../../utils/format-pattern-tab'

const ROW_STYLE = { padding: 'var(--ig-space-3) var(--ig-space-5)' }

const Tab = styled.button<{ $active: boolean }>`
  padding: var(--ig-space-1) var(--ig-space-4);
  border-radius: var(--ig-radius-xs);
  border: none;
  font-size: var(--ig-font-size-xs);
  cursor: pointer;
  background: ${(p) => (p.$active ? 'var(--ig-color-active-bg)' : 'var(--ig-color-white-08)')};
  color: ${(p) => (p.$active ? 'var(--ig-color-text-primary)' : 'var(--ig-color-text-muted)')};
  transition: background var(--ig-motion-fast);
  &:hover {
    color: var(--ig-color-text-primary);
  }
  &:focus-visible {
    outline: var(--ig-border-2px) solid var(--ig-color-accent-ring);
    outline-offset: var(--ig-space-neg-2px);
  }
`

export interface ChipTabsItem extends FormatPatternTabItem {
  id: string
}

export interface ChipTabsProps {
  items: ChipTabsItem[]
  currentId: string
  onSelect: (item: ChipTabsItem) => void
  className?: string
}

export function ChipTabs({ items, currentId, onSelect, className }: ChipTabsProps) {
  const buttonRefs = React.useRef<Record<string, HTMLButtonElement | null>>({})
  if (items.length <= 1) return null
  const move = (index: number) => {
    const next = items[(index + items.length) % items.length]
    onSelect(next)
    requestAnimationFrame(() => buttonRefs.current[next.id]?.focus())
  }
  return (
    <Inline gap={1} justify="center" wrap="wrap" className={className} role="tablist" style={ROW_STYLE}>
      {items.map((item, i) => (
        <Tab
          key={item.id}
          ref={(node) => { buttonRefs.current[item.id] = node }}
          type="button"
          role="tab"
          aria-selected={item.id === currentId}
          $active={item.id === currentId}
          onClick={() => onSelect(item)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') { e.preventDefault(); move(i + 1) }
            else if (e.key === 'ArrowLeft') { e.preventDefault(); move(i - 1) }
            else if (e.key === 'Home') { e.preventDefault(); move(0) }
            else if (e.key === 'End') { e.preventDefault(); move(items.length - 1) }
          }}
        >
          {formatPatternTab(item, i)}
        </Tab>
      ))}
    </Inline>
  )
}
