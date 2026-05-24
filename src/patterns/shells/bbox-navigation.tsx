import styled from 'styled-components'

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--ig-space-3);
  margin-top: var(--ig-space-2);
`

const ArrowBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: var(--ig-color-text-secondary);
  font-size: 16px;
  padding: 2px var(--ig-space-2);
  line-height: 1;
  &:disabled {
    color: var(--ig-color-text-muted);
    cursor: default;
  }
`

const Counter = styled.span`
  font-size: 12px;
  color: var(--ig-color-text-muted);
  font-variant-numeric: tabular-nums;
`

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
    <Row className={className} role="group" aria-label="Bbox navigation">
      <ArrowBtn type="button" disabled={atStart} onClick={() => onChange(index - 1)} aria-label={prevLabel}>‹</ArrowBtn>
      <Counter>{index + 1} / {total}</Counter>
      <ArrowBtn type="button" disabled={atEnd} onClick={() => onChange(index + 1)} aria-label={nextLabel}>›</ArrowBtn>
    </Row>
  )
}
