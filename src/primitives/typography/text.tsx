import React from 'react'
import styled from 'styled-components'

const toneColor = {
  default: 'var(--ig-color-text-primary)',
  secondary: 'var(--ig-color-text-secondary)',
  muted: 'var(--ig-color-text-muted)',
  soft: 'var(--ig-color-text-soft)',
  accent: 'var(--ig-color-accent-soft)',
  success: 'var(--ig-color-status-running-text)',
  warning: 'var(--ig-color-status-draft-text)',
  danger: 'var(--ig-color-status-failed-text)',
} as const

const TextRoot = styled.span<{
  $tone?: keyof typeof toneColor
  $size?: string
  $weight?: number
}>`
  color: ${(p) => toneColor[p.$tone ?? 'default']};
  font-size: ${(p) => p.$size ?? 'var(--ig-font-size-md)'};
  font-weight: ${(p) => p.$weight ?? 400};
  line-height: 1.45;
  word-break: break-word;
`

export function Text({
  tone,
  size,
  weight,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: keyof typeof toneColor; size?: string; weight?: number }) {
  return <TextRoot $tone={tone} $size={size} $weight={weight} {...props} />
}
