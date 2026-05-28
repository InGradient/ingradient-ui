import styled, { keyframes } from 'styled-components'
import React from 'react'
import { iconSizeNumbers } from '../../tokens/core'

const spin = keyframes`
  to { transform: rotate(360deg); }
`

const sizeMap = {
  sm: iconSizeNumbers.sm,
  md: iconSizeNumbers.lg,
  lg: iconSizeNumbers['3xl'],
} as const

const toneColorMap = {
  accent: 'var(--ig-color-accent)',
  white: 'var(--ig-color-text-primary)',
  muted: 'var(--ig-color-text-soft)',
} as const

export type SpinnerSize = keyof typeof sizeMap | number
export type SpinnerTone = keyof typeof toneColorMap

const SpinnerEl = styled.span<{ $px: number; $color: string }>`
  display: inline-block;
  flex-shrink: 0;
  width: ${(p) => p.$px}px;
  height: ${(p) => p.$px}px;
  border: var(--ig-border-2px) solid var(--ig-color-border-subtle);
  border-top-color: ${(p) => p.$color};
  border-radius: 50%;
  animation: ${spin} var(--ig-motion-spinner) linear infinite;
  vertical-align: middle;
`

export interface SpinnerProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Spinner 크기. sm=14px (icon-sm), md=18px (icon-lg), lg=24px (icon-3xl), 또는 직접 pixel 값 */
  size?: SpinnerSize
  /** 색상 tone. accent=브랜드 색, white=텍스트 primary, muted=텍스트 soft */
  tone?: SpinnerTone
}

export function Spinner({ size = 'md', tone = 'accent', 'aria-label': ariaLabel, ...rest }: SpinnerProps) {
  const px = typeof size === 'number' ? size : sizeMap[size]
  return (
    <SpinnerEl
      {...rest}
      $px={px}
      $color={toneColorMap[tone]}
      role="status"
      aria-label={ariaLabel ?? 'Loading'}
    />
  )
}
