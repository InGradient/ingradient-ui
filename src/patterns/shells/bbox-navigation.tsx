import styled from 'styled-components'

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 6px;
`

const ArrowBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: var(--ig-color-text-secondary);
  font-size: 16px;
  padding: 2px 6px;
  line-height: 1;
  &:disabled {
    color: #444;
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
