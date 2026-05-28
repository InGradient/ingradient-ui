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
  background: ${(p) => (p.$active ? 'rgba(77, 136, 255, 0.3)' : 'var(--ig-color-white-08)')};
  color: ${(p) => (p.$active ? 'var(--ig-color-text-primary)' : 'var(--ig-color-text-muted)')};
  transition: background var(--ig-motion-fast);
  &:hover {
    color: var(--ig-color-text-primary);
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
  if (items.length <= 1) return null
  return (
    <Inline gap={1} justify="center" wrap="wrap" className={className} role="tablist" style={ROW_STYLE}>
      {items.map((item, i) => (
        <Tab
          key={item.id}
          type="button"
          role="tab"
          aria-selected={item.id === currentId}
          $active={item.id === currentId}
          onClick={() => onSelect(item)}
        >
          {formatPatternTab(item, i)}
        </Tab>
      ))}
    </Inline>
  )
}
