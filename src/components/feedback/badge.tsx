import styled from 'styled-components'

const badgeTone = {
  neutral: 'var(--ig-color-badge-neutral)',
  accent: 'var(--ig-color-badge-accent)',
  success: 'var(--ig-color-badge-success)',
  warning: 'var(--ig-color-badge-warning)',
  danger: 'var(--ig-color-badge-danger)',
} as const

export const Badge = styled.span<{ $tone?: keyof typeof badgeTone }>`
  /* Fixed size token instead of font-metric height: 24px, on the 4px grid. */
  display: inline-flex;
  align-items: center;
  box-sizing: border-box;
  height: var(--ig-size-badge-lg);
  padding: 0 var(--ig-space-4);
  border-radius: var(--ig-radius-pill);
  font-size: var(--ig-font-size-xs);
  line-height: var(--ig-leading-xs);
  font-weight: var(--ig-font-weight-semibold);
  color: var(--ig-color-text-primary);
  background: ${(p) => badgeTone[p.$tone ?? 'neutral']};
`
