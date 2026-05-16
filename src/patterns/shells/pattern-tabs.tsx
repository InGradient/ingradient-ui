import styled from 'styled-components'
import { formatPatternTab, type FormatPatternTabItem } from '../../utils/format-pattern-tab'

const Row = styled.div`
  display: flex;
  gap: 4px;
  padding: 8px 12px;
  flex-wrap: wrap;
  justify-content: center;
`

const Tab = styled.button<{ $active: boolean }>`
  padding: 4px 10px;
  border-radius: 6px;
  border: none;
  font-size: 12px;
  cursor: pointer;
  background: ${(p) => (p.$active ? 'rgba(77, 136, 255, 0.3)' : 'var(--ig-color-white-08)')};
  color: ${(p) => (p.$active ? 'var(--ig-color-text-primary)' : 'var(--ig-color-text-muted)')};
  transition: background var(--ig-motion-fast);
  &:hover {
    color: var(--ig-color-text-primary);
  }
`

export interface PatternTabsItem extends FormatPatternTabItem {
  id: string
}

export interface PatternTabsProps {
  items: PatternTabsItem[]
  currentId: string
  onSelect: (item: PatternTabsItem) => void
  className?: string
}

export function PatternTabs({ items, currentId, onSelect, className }: PatternTabsProps) {
  if (items.length <= 1) return null
  return (
    <Row className={className} role="tablist">
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
    </Row>
  )
}
