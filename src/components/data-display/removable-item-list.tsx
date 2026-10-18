import React from 'react'
import styled from 'styled-components'
import { Stack } from '../../primitives'
import { iconSizeNumbers } from '../../tokens/core'
import { IconButton } from '../inputs/icon-button'
import { ClosePanelIcon } from '../icons/catalog-icons'

const LIST_STYLE = { listStyle: 'none' as const, margin: 0, padding: 0 }

const Row = styled.li`
  display: flex;
  align-items: center;
  gap: var(--ig-space-3);
  padding: var(--ig-space-2) var(--ig-space-4);
  border-radius: var(--ig-radius-2xs);
  background: var(--ig-color-surface-interactive);
  border: var(--ig-border-1px) solid var(--ig-color-border-subtle);

  &:hover {
    background: var(--ig-color-surface-interactive-hover);
  }
`

export interface RemovableItem {
  id: string
  /** Accessible name of the item; used for the remove button's aria-label. */
  label: string
  /** Leading visual (color swatch, avatar, ...). */
  leading?: React.ReactNode
  /** Row content between the leading visual and the remove button. */
  content: React.ReactNode
}

export interface RemovableItemListProps {
  items: RemovableItem[]
  onRemove?: (id: string) => void
  onHover?: (id: string | null) => void
  removeIcon?: React.ReactNode
  className?: string
}

/**
 * Shared row list: leading visual + content + optional remove action.
 * Owns the row spacing, padding, surface and remove-icon size so every list built on it
 * (SwatchItemList, IdentityItemList) stays visually identical. Callers supply only the leading visual and content.
 */
export function RemovableItemList({ items, onRemove, onHover, removeIcon, className }: RemovableItemListProps) {
  return (
    <Stack as="ul" gap="var(--ig-space-2)" className={className} style={LIST_STYLE}>
      {items.map((item) => (
        <Row
          key={item.id}
          onMouseEnter={() => onHover?.(item.id)}
          onMouseLeave={() => onHover?.(null)}
        >
          {item.leading}
          {item.content}
          {onRemove ? (
            <IconButton
              variant="ghost"
              size="sm"
              tone="danger"
              type="button"
              aria-label={`Remove ${item.label}`}
              onClick={() => onRemove(item.id)}
            >
              {removeIcon ?? <ClosePanelIcon size={iconSizeNumbers.md} />}
            </IconButton>
          ) : null}
        </Row>
      ))}
    </Stack>
  )
}
