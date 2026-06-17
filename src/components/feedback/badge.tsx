import styled from 'styled-components'

const badgeTone = {
  neutral: 'var(--ig-color-badge-neutral)',
  accent: 'var(--ig-color-badge-accent)',
  success: 'var(--ig-color-badge-success)',
  warning: 'var(--ig-color-badge-warning)',
  danger: 'var(--ig-color-badge-danger)',
} as const

export const Badge = styled.span<{ $tone?: keyof typeof badgeTone }>`
  padding: var(--ig-space-1) var(--ig-space-4);
  border-radius: var(--ig-radius-pill);
  font-size: var(--ig-font-size-xs);
  font-weight: var(--ig-font-weight-semibold);
  color: var(--ig-color-text-primary);
  background: ${(p) => badgeTone[p.$tone ?? 'neutral']};
`
