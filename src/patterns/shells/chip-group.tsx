import { Inline, Text } from '../../primitives'
import { ActionChip } from '../../components/data-display/action-chip'

const MORE_CHIP_STYLE = {
  display: 'inline-flex' as const,
  alignItems: 'center' as const,
  padding: 'var(--ig-space-1) var(--ig-space-3)',
  borderRadius: 'var(--ig-radius-pill)',
  background: 'var(--ig-color-surface-interactive)',
}

export interface ChipGroupItem {
  id: string
  label: string
  color?: string
}

export interface ChipGroupProps {
  items: ChipGroupItem[]
  maxVisible?: number
  onItemClick?: (id: string) => void
  className?: string
}

export function ChipGroup({ items, maxVisible, onItemClick, className }: ChipGroupProps) {
  const visible = maxVisible != null ? items.slice(0, maxVisible) : items
  const overflow = maxVisible != null ? items.length - maxVisible : 0

  return (
    <Inline gap={2} wrap="wrap" className={className}>
      {visible.map((item) => (
        <ActionChip
          key={item.id}
          color={item.color}
          onClick={() => onItemClick?.(item.id)}
        >
          {item.label}
        </ActionChip>
      ))}
      {overflow > 0 ? (
        <Text as="span" tone="muted" size="var(--ig-font-size-2xs)" weight={600} style={MORE_CHIP_STYLE}>+{overflow} more</Text>
      ) : null}
    </Inline>
  )
}
