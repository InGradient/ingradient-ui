import React from 'react'
import { Text } from '../../primitives'
import { ColorSwatch } from './color-swatch'
import { RemovableItemList } from './removable-item-list'

const LABEL_STYLE = { flex: 1, overflow: 'hidden' as const, textOverflow: 'ellipsis' as const, whiteSpace: 'nowrap' as const }

export interface SwatchItem {
  id: string
  label: string
  color: string
  count?: number
}

export interface SwatchItemListProps {
  items: SwatchItem[]
  onRemove?: (id: string) => void
  onHover?: (id: string | null) => void
  removeIcon?: React.ReactNode
  className?: string
}

/**
 * Color swatch + label + optional count + (옵셔널) remove 버튼 의 inline list.
 * Row layout, spacing and remove icon come from RemovableItemList. 도메인 class / tag / category pool 등에 generic.
 */
export function SwatchItemList({ items, onRemove, onHover, removeIcon, className }: SwatchItemListProps) {
  return (
    <RemovableItemList
      className={className}
      onRemove={onRemove}
      onHover={onHover}
      removeIcon={removeIcon}
      items={items.map((it) => ({
        id: it.id,
        label: it.label,
        leading: <ColorSwatch $color={it.color} $size="xs" />,
        content: (
          <>
            <Text size="var(--ig-font-size-sm)" title={it.label} style={LABEL_STYLE}>{it.label}</Text>
            {typeof it.count === 'number' ? <Text size="var(--ig-font-size-xs)" tone="muted" tabularNums>{it.count}</Text> : null}
          </>
        ),
      }))}
    />
  )
}
