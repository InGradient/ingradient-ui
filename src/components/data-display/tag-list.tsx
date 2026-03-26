import React from 'react'
import styled from 'styled-components'
import { ColorSwatch } from './color-swatch'

// ── TagList ────────────────────────────────────────────────────────

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-1);
  overflow-y: auto;
`

const ItemBtn = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: var(--ig-space-3);
  width: 100%;
  padding: var(--ig-space-2) var(--ig-space-3);
  border: none;
  border-radius: var(--ig-radius-xs);
  background: ${(p) => (p.$active ? 'var(--ig-color-surface-interactive)' : 'transparent')};
  color: ${(p) => (p.$active ? 'var(--ig-color-text-primary)' : 'var(--ig-color-text-muted)')};
  font-size: var(--ig-font-size-sm);
  text-align: left;
  cursor: pointer;
  transition: background var(--ig-motion-fast);
  &:hover { background: var(--ig-color-surface-interactive); }
`

const Label = styled.span`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const Count = styled.span`
  font-size: var(--ig-font-size-2xs);
  color: var(--ig-color-text-soft);
`

// ── Types ──────────────────────────────────────────────────────────

export interface TagItemData {
  id: string
  color: string
  label: string
  count?: number
}

export interface TagListProps {
  items: TagItemData[]
  selectedId?: string | null
  activeIds?: Set<string>
  onItemClick?: (id: string) => void
  className?: string
}

// ── Component ──────────────────────────────────────────────────────

export function TagList({ items, selectedId, activeIds, onItemClick, className }: TagListProps) {
  return (
    <List className={className}>
      {items.map((item) => {
        const isActive = selectedId === item.id || (activeIds?.has(item.id) ?? false)
        return (
          <ItemBtn
            key={item.id}
            $active={isActive}
            onClick={() => onItemClick?.(item.id)}
            title={item.label}
          >
            <ColorSwatch $color={item.color} $size="sm" />
            <Label>{item.label}</Label>
            {item.count != null && <Count>{item.count}</Count>}
          </ItemBtn>
        )
      })}
    </List>
  )
}
