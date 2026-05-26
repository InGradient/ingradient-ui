import { Inline, Text } from '../../primitives'
import { IconButton } from '../inputs/icon-button'

export interface IndexedNavigationProps {
  index: number
  total: number
  onChange: (next: number) => void
  prevLabel?: string
  nextLabel?: string
  className?: string
}

/**
 * Prev/next 화살표 + "현재/전체" 카운터. 단일 항목일 때는 숨김 (total <= 1).
 * Bbox / image / step / page 등 인덱스 기반 순차 탐색에 generic.
 */
export function IndexedNavigation({
  index, total, onChange,
  prevLabel = 'Previous',
  nextLabel = 'Next',
  className,
}: IndexedNavigationProps) {
  if (total <= 1) return null
  const atStart = index <= 0
  const atEnd = index >= total - 1
  return (
    <Inline className={className} role="group" aria-label="Navigation" justify="center" gap={3} style={{ marginTop: 'var(--ig-space-2)' }}>
      <IconButton variant="secondary" size="sm" type="button" disabled={atStart} onClick={() => onChange(index - 1)} aria-label={prevLabel}>‹</IconButton>
      <Text size="12px" tone="muted" tabularNums>{index + 1} / {total}</Text>
      <IconButton variant="secondary" size="sm" type="button" disabled={atEnd} onClick={() => onChange(index + 1)} aria-label={nextLabel}>›</IconButton>
    </Inline>
  )
}
