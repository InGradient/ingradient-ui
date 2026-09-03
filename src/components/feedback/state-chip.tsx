import styled, { css } from 'styled-components'

export interface StateChipStyle {
  bg: string
  color: string
}

export interface StateChipProps<S extends string> {
  state: S
  label: React.ReactNode
  stateStyles: Record<S, StateChipStyle>
  showDot?: boolean
  collapseUntilHover?: boolean
  className?: string
  'aria-label'?: string
}

const Chip = styled.span<{ $bg: string; $color: string; $collapseUntilHover: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--ig-space-1);
  height: var(--ig-icon-xl);
  padding: 0 var(--ig-space-3);
  border-radius: var(--ig-radius-pill);
  font-size: var(--ig-font-size-3xs);
  font-weight: var(--ig-font-weight-bold);
  letter-spacing: var(--ig-letter-spacing-normal);
  white-space: nowrap;
  overflow: hidden;
  background: ${(p) => p.$bg};
  color: ${(p) => p.$color};
  transition:
    max-width var(--ig-motion-fast),
    padding var(--ig-motion-fast),
    border-radius var(--ig-motion-fast);

  ${({ $collapseUntilHover }) =>
    $collapseUntilHover
      ? css`
          max-width: var(--ig-icon-xl);
          min-width: var(--ig-icon-xl);
          padding: 0;

          &:hover,
          :where([data-state-chip-hover-scope='true']:hover) &,
          :where([data-state-chip-hover-scope='true']:focus-within) & {
            max-width: var(--ig-popup-2xs-narrow);
            padding: 0 var(--ig-space-3);
          }
        `
      : css`
          max-width: var(--ig-popup-2xs-narrow);
        `}
`

const Dot = styled.span`
  width: var(--ig-space-2);
  height: var(--ig-space-2);
  border-radius: 50%;
  background: currentColor;
`

const Label = styled.span<{ $collapseUntilHover: boolean }>`
  display: inline-block;
  overflow: hidden;
  transition:
    opacity var(--ig-motion-fast),
    max-width var(--ig-motion-fast);

  ${({ $collapseUntilHover }) =>
    $collapseUntilHover
      ? css`
          max-width: 0;
          opacity: 0;

          ${Chip}:hover &,
          :where([data-state-chip-hover-scope='true']:hover) ${Chip} &,
          :where([data-state-chip-hover-scope='true']:focus-within) ${Chip} & {
            max-width: var(--ig-popup-3xs-plus);
            opacity: 1;
          }
        `
      : css`
          max-width: var(--ig-popup-3xs-plus);
        `}
`

export function StateChip<S extends string>({
  state,
  label,
  stateStyles,
  showDot = true,
  collapseUntilHover = false,
  className,
  'aria-label': ariaLabel,
}: StateChipProps<S>) {
  const s = stateStyles[state]
  return (
    <Chip
      $bg={s.bg}
      $color={s.color}
      $collapseUntilHover={collapseUntilHover}
      className={className}
      aria-label={ariaLabel}
    >
      {showDot ? <Dot /> : null}
      <Label $collapseUntilHover={collapseUntilHover}>{label}</Label>
    </Chip>
  )
}
