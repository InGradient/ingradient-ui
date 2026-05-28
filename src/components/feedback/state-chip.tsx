import styled from 'styled-components'

export interface StateChipStyle {
  bg: string
  color: string
}

export interface StateChipProps<S extends string> {
  state: S
  label: React.ReactNode
  stateStyles: Record<S, StateChipStyle>
  showDot?: boolean
  className?: string
  'aria-label'?: string
}

const Chip = styled.span<{ $bg: string; $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: var(--ig-space-1);
  height: 20px;
  padding: 0 var(--ig-space-3);
  border-radius: var(--ig-radius-pill);
  font-size: var(--ig-font-size-3xs);
  font-weight: 700;
  letter-spacing: 0.04em;
  white-space: nowrap;
  background: ${(p) => p.$bg};
  color: ${(p) => p.$color};
`

const Dot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
`

export function StateChip<S extends string>({
  state,
  label,
  stateStyles,
  showDot = true,
  className,
  'aria-label': ariaLabel,
}: StateChipProps<S>) {
  const s = stateStyles[state]
  return (
    <Chip $bg={s.bg} $color={s.color} className={className} aria-label={ariaLabel}>
      {showDot ? <Dot /> : null}
      {label}
    </Chip>
  )
}
