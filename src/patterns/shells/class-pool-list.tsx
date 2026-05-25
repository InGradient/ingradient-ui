import React from 'react'
import styled from 'styled-components'
import { Stack, Text } from '../../primitives'
import { IconButton } from '../../components/inputs/icon-button'
import { ColorSwatch } from '../../components/data-display/color-swatch'

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

export interface ClassPoolItem {
  id: string
  name: string
  color: string
  count?: number
}

export interface ClassPoolListProps {
  classes: ClassPoolItem[]
  onRemove?: (id: string) => void
  onHover?: (id: string | null) => void
  removeIcon?: React.ReactNode
  className?: string
}

export function ClassPoolList({ classes, onRemove, onHover, removeIcon, className }: ClassPoolListProps) {
  return (
    <Stack as="ul" gap={2} className={className} style={LIST_STYLE}>
      {classes.map((cls) => (
        <Row
          key={cls.id}
          onMouseEnter={() => onHover?.(cls.id)}
          onMouseLeave={() => onHover?.(null)}
        >
          <ColorSwatch $color={cls.color} $size="xs" />
          <Text size="var(--ig-font-size-sm)" title={cls.name} style={LABEL_STYLE}>{cls.name}</Text>
          {typeof cls.count === 'number' ? <Text size="var(--ig-font-size-xs)" tone="muted" tabularNums>{cls.count}</Text> : null}
          {onRemove ? (
            <IconButton variant="secondary" size="sm" tone="danger" type="button" aria-label={`Remove class ${cls.name}`} onClick={() => onRemove(cls.id)}>
              {removeIcon ?? '×'}
            </IconButton>
          ) : null}
        </Row>
      ))}
    </Stack>
  )
}
