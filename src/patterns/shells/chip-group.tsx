import styled from 'styled-components'
import { ActionChip } from '../../components/data-display/action-chip'

const Wrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--ig-space-2);
  align-items: center;
`

const MoreChip = styled.span`
  display: inline-flex;
  align-items: center;
  padding: var(--ig-space-1) var(--ig-space-3);
  border-radius: var(--ig-radius-pill);
  background: var(--ig-color-surface-interactive);
  color: var(--ig-color-text-muted);
  font-size: var(--ig-font-size-2xs);
  font-weight: 600;
`

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
    <Wrap className={className}>
      {visible.map((item) => (
        <ActionChip
          key={item.id}
          color={item.color}
          onClick={() => onItemClick?.(item.id)}
        >
          {item.label}
        </ActionChip>
      ))}
      {overflow > 0 && <MoreChip>+{overflow} more</MoreChip>}
    </Wrap>
  )
}
