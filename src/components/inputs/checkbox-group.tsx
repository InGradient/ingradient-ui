import React from 'react'
import styled from 'styled-components'
import { Checkbox } from './toggles'

const Wrap = styled.div<{ $maxHeight: number }>`
  max-height: ${(p) => `${p.$maxHeight}px`};
  overflow-y: auto;
  border: 1px solid var(--ig-color-border-subtle);
  border-radius: var(--ig-radius-sm);
  padding: var(--ig-space-2) 0;
  min-width: 0;
`

const Header = styled.div`
  display: flex;
  gap: var(--ig-space-3);
  padding: var(--ig-space-2) var(--ig-space-4);
  border-bottom: 1px solid var(--ig-color-border-subtle);
`

const HeaderBtn = styled.button<{ $tone: 'accent' | 'muted' }>`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-size: var(--ig-font-size-xs);
  color: ${(p) => (p.$tone === 'accent' ? 'var(--ig-color-accent)' : 'var(--ig-color-text-muted)')};
  &:hover {
    color: var(--ig-color-text-primary);
  }
`

const ItemRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ig-space-3);
  padding: var(--ig-space-2) var(--ig-space-4);
  font-size: var(--ig-font-size-sm);
  color: var(--ig-color-text-primary);
`

const ColorSwatch = styled.span<{ $color: string }>`
  width: 10px;
  height: 10px;
  border-radius: var(--ig-radius-xs);
  background: ${(p) => p.$color};
  flex-shrink: 0;
`

export interface CheckboxGroupItem {
  id: string
  label: string
  color?: string
}

export interface CheckboxGroupProps {
  items: CheckboxGroupItem[]
  selectedIds: Set<string>
  onChange: (next: Set<string>) => void
  maxHeight?: number
  showSelectAll?: boolean
}

export function CheckboxGroup({
  items,
  selectedIds,
  onChange,
  maxHeight = 160,
  showSelectAll = true,
}: CheckboxGroupProps) {
  const handleToggle = (id: string) => {
    const next = new Set(selectedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    onChange(next)
  }

  return (
    <Wrap $maxHeight={maxHeight}>
      {showSelectAll && (
        <Header>
          <HeaderBtn type="button" $tone="accent" onClick={() => onChange(new Set(items.map((it) => it.id)))}>
            Select All
          </HeaderBtn>
          <HeaderBtn type="button" $tone="muted" onClick={() => onChange(new Set())}>
            Deselect All
          </HeaderBtn>
        </Header>
      )}
      {items.map((item) => (
        <ItemRow key={item.id}>
          <Checkbox
            checked={selectedIds.has(item.id)}
            onChange={() => handleToggle(item.id)}
            label={
              <>
                {item.color ? <ColorSwatch $color={item.color} /> : null}
                {item.label}
              </>
            }
          />
        </ItemRow>
      ))}
    </Wrap>
  )
}
