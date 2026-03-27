import styled from 'styled-components'
import { ColorSwatch } from './color-swatch'

const Wrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--ig-space-2);
  align-items: center;
`

const Chip = styled.button`
  display: inline-flex;
  align-items: center;
  gap: var(--ig-space-2);
  padding: var(--ig-space-1) var(--ig-space-3);
  border: 1px solid var(--ig-color-border-subtle);
  border-radius: var(--ig-radius-pill);
  background: var(--ig-color-surface-muted);
  color: var(--ig-color-text-primary);
  font-size: var(--ig-font-size-2xs);
  cursor: pointer;
  white-space: nowrap;
  transition: background var(--ig-motion-fast);
  &:hover { background: var(--ig-color-surface-interactive); }
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
        <Chip key={item.id} type="button" onClick={() => onItemClick?.(item.id)}>
          {item.color && <ColorSwatch $color={item.color} $size="xs" />}
          {item.label}
        </Chip>
      ))}
      {overflow > 0 && <MoreChip>+{overflow} more</MoreChip>}
    </Wrap>
  )
}
