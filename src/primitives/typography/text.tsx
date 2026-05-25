import React from 'react'
import styled, { css } from 'styled-components'

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

const fontFamilyVar = {
  default: undefined,
  mono: 'var(--ig-font-mono)',
} as const

type Tone = keyof typeof toneColor
type FontFamily = keyof typeof fontFamilyVar
type Align = 'left' | 'center' | 'right'

const TextRoot = styled.span<{
  $tone?: Tone
  $size?: string
  $weight?: number
  $align?: Align
  $uppercase?: boolean
  $letterSpacing?: string
  $fontFamily?: FontFamily
  $tabularNums?: boolean
}>`
  margin: 0;
  color: ${(p) => toneColor[p.$tone ?? 'default']};
  font-size: ${(p) => p.$size ?? 'var(--ig-font-size-md)'};
  font-weight: ${(p) => p.$weight ?? 400};
  line-height: 1.45;
  word-break: break-word;
  ${(p) => p.$align && css`text-align: ${p.$align};`}
  ${(p) => p.$uppercase && css`text-transform: uppercase;`}
  ${(p) => p.$letterSpacing && css`letter-spacing: ${p.$letterSpacing};`}
  ${(p) => {
    const family = p.$fontFamily && fontFamilyVar[p.$fontFamily]
    return family ? css`font-family: ${family};` : ''
  }}
  ${(p) => p.$tabularNums && css`font-variant-numeric: tabular-nums;`}
`

export interface TextProps extends Omit<React.AllHTMLAttributes<HTMLElement>, 'as' | 'size'> {
  as?: React.ElementType
  tone?: Tone
  size?: string
  weight?: number
  align?: Align
  uppercase?: boolean
  letterSpacing?: string
  fontFamily?: FontFamily
  tabularNums?: boolean
}

export function Text({
  as,
  tone,
  size,
  weight,
  align,
  uppercase,
  letterSpacing,
  fontFamily,
  tabularNums,
  ...props
}: TextProps) {
  return (
    <TextRoot
      as={as}
      $tone={tone}
      $size={size}
      $weight={weight}
      $align={align}
      $uppercase={uppercase}
      $letterSpacing={letterSpacing}
      $fontFamily={fontFamily}
      $tabularNums={tabularNums}
      {...props}
    />
  )
}
