import React from 'react'
import styled from 'styled-components'
import { Stack, Text } from '../../primitives'
import { controlSizeNumbers, iconSizeNumbers } from '../../tokens/core'
import { Avatar } from '../feedback/avatar'
import { IconButton } from '../inputs/icon-button'
import { ClosePanelIcon } from '../icons/catalog-icons'

const LIST_STYLE = { listStyle: 'none' as const, margin: 0, padding: 0 }
const TEXT_BLOCK_STYLE = { flex: 1, minWidth: 0, gap: 'var(--ig-space-2px)' }
const LABEL_STYLE = {
  overflow: 'hidden' as const,
  textOverflow: 'ellipsis' as const,
  whiteSpace: 'nowrap' as const,
}

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
 */
export function IdentityItemList({
  items,
  onRemove,
  onHover,
  removeIcon,
  className,
}: IdentityItemListProps) {
  return (
    <Stack as="ul" gap="var(--ig-space-2)" className={className} style={LIST_STYLE}>
      {items.map((item) => (
        <Row
          key={item.id}
          onMouseEnter={() => onHover?.(item.id)}
          onMouseLeave={() => onHover?.(null)}
        >
          <Avatar
            src={item.avatarUrl}
            initials={initialsFor(item)}
            alt={item.label}
            size={controlSizeNumbers.xs}
          />
          <Stack gap={0} style={TEXT_BLOCK_STYLE}>
            <Text size="var(--ig-font-size-sm)" title={item.label} style={LABEL_STYLE}>
              {item.label}
            </Text>
            {item.meta ? (
              <Text
                size="var(--ig-font-size-2xs)"
                tone="muted"
                uppercase
                letterSpacing="wide"
              >
                {item.meta}
              </Text>
            ) : null}
          </Stack>
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
