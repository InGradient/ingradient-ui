import React from 'react'
import styled from 'styled-components'
import { Stack, Text } from '../../primitives'
import { IconButton } from '../inputs/icon-button'
import { ColorSwatch } from './color-swatch'

const LIST_STYLE = { listStyle: 'none' as const, margin: 0, padding: 0 }
const LABEL_STYLE = { flex: 1, overflow: 'hidden' as const, textOverflow: 'ellipsis' as const, whiteSpace: 'nowrap' as const }

const Row = styled.li`
  display: flex;
  align-items: center;
  gap: var(--ig-space-3);
  padding: var(--ig-space-2) var(--ig-space-4) var(--ig-space-2) var(--ig-space-5);
  border-radius: var(--ig-radius-2xs);
  background: var(--ig-color-surface-interactive);
  border: 1px solid var(--ig-color-border-subtle);
  &:hover {
    background: var(--ig-color-surface-interactive-hover);
  }
`

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
 * 각 row 는 hover background. 도메인 class / tag / category pool 등에 generic.
 */
export function SwatchItemList({ items, onRemove, onHover, removeIcon, className }: SwatchItemListProps) {
  return (
    <Stack as="ul" gap={2} className={className} style={LIST_STYLE}>
      {items.map((it) => (
        <Row
          key={it.id}
          onMouseEnter={() => onHover?.(it.id)}
          onMouseLeave={() => onHover?.(null)}
        >
          <ColorSwatch $color={it.color} $size="xs" />
          <Text size="var(--ig-font-size-sm)" title={it.label} style={LABEL_STYLE}>{it.label}</Text>
          {typeof it.count === 'number' ? <Text size="var(--ig-font-size-xs)" tone="muted" tabularNums>{it.count}</Text> : null}
          {onRemove ? (
            <IconButton variant="secondary" size="sm" tone="danger" type="button" aria-label={`Remove ${it.label}`} onClick={() => onRemove(it.id)}>
              {removeIcon ?? '×'}
            </IconButton>
          ) : null}
        </Row>
      ))}
    </Stack>
  )
}
