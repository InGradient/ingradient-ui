import styled from 'styled-components'

const Badge = styled.span<{ $size: 'sm' | 'md' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: ${(p) => (p.$size === 'sm' ? '20px' : '22px')};
  height: ${(p) => (p.$size === 'sm' ? '20px' : '22px')};
  padding: 0 var(--ig-space-2);
  border-radius: var(--ig-radius-pill);
  background: var(--ig-color-image-group-circle-bg);
  color: var(--ig-color-text-primary);
  font-size: var(--ig-font-size-2xs);
  font-weight: var(--ig-font-weight-bold);
  line-height: var(--ig-line-height-none);
  font-variant-numeric: tabular-nums;
  border: var(--ig-border-1px) solid var(--ig-color-image-group-circle-border);
`

export interface GroupCountBadgeProps {
  count: number
  size?: 'sm' | 'md'
  formatLarge?: boolean
  className?: string
}

function format(count: number, formatLarge: boolean): string {
  if (!formatLarge) return String(count)
  if (count >= 1000) return `${(count / 1000).toFixed(count >= 10000 ? 0 : 1)}k`
  return String(count)
}

export function GroupCountBadge({ count, size = 'md', formatLarge = true, className }: GroupCountBadgeProps) {
  if (count <= 1) return null
  return (
    <Badge $size={size} className={className} aria-label={`${count} items in group`}>
      {format(count, formatLarge)}
    </Badge>
  )
}
