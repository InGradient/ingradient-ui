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

const fontWeightVar = {
  regular: 'var(--ig-font-weight-regular)',
  medium: 'var(--ig-font-weight-medium)',
  semibold: 'var(--ig-font-weight-semibold)',
  bold: 'var(--ig-font-weight-bold)',
  black: 'var(--ig-font-weight-black)',
} as const

const letterSpacingVar = {
  tight: 'var(--ig-letter-spacing-tight)',
  normal: 'var(--ig-letter-spacing-normal)',
  wide: 'var(--ig-letter-spacing-wide)',
  wider: 'var(--ig-letter-spacing-wider)',
  widest: 'var(--ig-letter-spacing-widest)',
} as const

type Tone = keyof typeof toneColor
type FontFamily = keyof typeof fontFamilyVar
type FontWeightAlias = keyof typeof fontWeightVar
type LetterSpacingAlias = keyof typeof letterSpacingVar
type Align = 'left' | 'center' | 'right'

function resolveWeight(w?: number | FontWeightAlias): string | number {
  if (typeof w === 'string') return fontWeightVar[w]
  return w ?? 'var(--ig-font-weight-regular)'
}

function resolveLetterSpacing(ls?: string | LetterSpacingAlias): string | undefined {
  if (!ls) return undefined
  if (ls in letterSpacingVar) return letterSpacingVar[ls as LetterSpacingAlias]
  return ls
}

const TextRoot = styled.span<{
  $tone?: Tone
  $size?: string
  $weight?: string | number
  $align?: Align
  $uppercase?: boolean
  $letterSpacing?: string
  $fontFamily?: FontFamily
  $tabularNums?: boolean
}>`
  margin: 0;
  color: ${(p) => toneColor[p.$tone ?? 'default']};
  font-size: ${(p) => p.$size ?? 'var(--ig-font-size-md)'};
  font-weight: ${(p) => p.$weight ?? 'var(--ig-font-weight-regular)'};
  line-height: var(--ig-line-height-base);
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
  weight?: number | FontWeightAlias
  align?: Align
  uppercase?: boolean
  letterSpacing?: string | LetterSpacingAlias
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
      $weight={resolveWeight(weight)}
      $align={align}
      $uppercase={uppercase}
      $letterSpacing={resolveLetterSpacing(letterSpacing)}
      $fontFamily={fontFamily}
      $tabularNums={tabularNums}
      {...props}
    />
  )
}
