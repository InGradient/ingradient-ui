import { Inline, Text } from '../../primitives'
import { IconButton } from '../../components/inputs/icon-button'

export interface BboxNavigationProps {
  index: number
  total: number
  onChange: (next: number) => void
  prevLabel?: string
  nextLabel?: string
  className?: string
}

export function BboxNavigation({
  index, total, onChange,
  prevLabel = 'Previous bbox',
  nextLabel = 'Next bbox',
  className,
}: BboxNavigationProps) {
  if (total <= 1) return null
  const atStart = index <= 0
  const atEnd = index >= total - 1
  return (
    <Inline className={className} role="group" aria-label="Bbox navigation" justify="center" gap={3} style={{ marginTop: 'var(--ig-space-2)' }}>
      <IconButton variant="secondary" size="sm" type="button" disabled={atStart} onClick={() => onChange(index - 1)} aria-label={prevLabel}>‹</IconButton>
      <Text size="12px" tone="muted" tabularNums>{index + 1} / {total}</Text>
      <IconButton variant="secondary" size="sm" type="button" disabled={atEnd} onClick={() => onChange(index + 1)} aria-label={nextLabel}>›</IconButton>
    </Inline>
  )
}
