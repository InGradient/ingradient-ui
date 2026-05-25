import React from 'react'
import styled from 'styled-components'
import { IconButton } from '../../components/inputs'
import { ColorSwatch } from '../../components/data-display/color-swatch'

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-2);
`

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

const Label = styled.span`
  flex: 1;
  font-size: var(--ig-font-size-sm);
  color: var(--ig-color-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const Count = styled.span`
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-text-muted);
  font-variant-numeric: tabular-nums;
`

const RemoveBtn = styled.button`
  background: none;
  border: none;
  padding: var(--ig-space-1);
  color: var(--ig-color-text-muted);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--ig-radius-xs);
  &:hover {
    color: var(--ig-color-danger);
    background: var(--ig-color-alert-danger-bg);
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
    <List className={className}>
      {classes.map((cls) => (
        <Row
          key={cls.id}
          onMouseEnter={() => onHover?.(cls.id)}
          onMouseLeave={() => onHover?.(null)}
        >
          <ColorSwatch $color={cls.color} $size="xs" />
          <Label title={cls.name}>{cls.name}</Label>
          {typeof cls.count === 'number' ? <Count>{cls.count}</Count> : null}
          {onRemove ? (
            <RemoveBtn type="button" aria-label={`Remove class ${cls.name}`} onClick={() => onRemove(cls.id)}>
              {removeIcon ?? '×'}
            </RemoveBtn>
          ) : null}
        </Row>
      ))}
    </List>
  )
}
