import React from 'react'
import { Stack, Text } from '../../primitives'
import { controlSizeNumbers } from '../../tokens/core'
import { Avatar } from '../feedback/avatar'
import { RemovableItemList } from './removable-item-list'

const TEXT_BLOCK_STYLE = { flex: 1, minWidth: 0, gap: 'var(--ig-space-2px)' }
const LABEL_STYLE = {
  overflow: 'hidden' as const,
  textOverflow: 'ellipsis' as const,
  whiteSpace: 'nowrap' as const,
}

export interface IdentityItem {
  id: string
  label: string
  meta?: string
  avatarUrl?: string
  initials?: string
}

export interface IdentityItemListProps {
  items: IdentityItem[]
  onRemove?: (id: string) => void
  onHover?: (id: string | null) => void
  removeIcon?: React.ReactNode
  className?: string
}

function initialsFor(item: IdentityItem) {
  return item.initials ?? item.label.charAt(0).toUpperCase()
}

/**
 * Avatar + label + optional meta + remove action list.
 * Generic identity rows for member, assignee, reviewer, or owner pools.
 * Row layout, spacing and remove icon come from RemovableItemList.
 */
export function IdentityItemList({ items, onRemove, onHover, removeIcon, className }: IdentityItemListProps) {
  return (
    <RemovableItemList
      className={className}
      onRemove={onRemove}
      onHover={onHover}
      removeIcon={removeIcon}
      items={items.map((item) => ({
        id: item.id,
        label: item.label,
        leading: (
          <Avatar
            src={item.avatarUrl}
            initials={initialsFor(item)}
            alt={item.label}
            size={controlSizeNumbers.xs}
          />
        ),
        content: (
          <Stack gap="var(--ig-space-0)" style={TEXT_BLOCK_STYLE}>
            <Text size="var(--ig-font-size-sm)" title={item.label} style={LABEL_STYLE}>
              {item.label}
            </Text>
            {item.meta ? (
              <Text size="var(--ig-font-size-2xs)" tone="muted" uppercase letterSpacing="wide">
                {item.meta}
              </Text>
            ) : null}
          </Stack>
        ),
      }))}
    />
  )
}
