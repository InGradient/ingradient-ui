import React from 'react'

export type ButtonVariant = 'solid' | 'secondary' | 'accent' | 'ghost'
export type LegacyButtonVariant = 'primary' | 'ghost' | 'accent'
export type ButtonSize = 'sm' | 'md' | 'lg'
export type ButtonTone = 'default' | 'danger'

export type ButtonProps = React.ComponentPropsWithoutRef<'button'> & {
  variant?: ButtonVariant
  $variant?: LegacyButtonVariant
  size?: ButtonSize
  tone?: ButtonTone
  leadingIcon?: React.ReactNode
  trailingIcon?: React.ReactNode
  'data-ig-component'?: string
  'data-ig-slot'?: string
  'data-ig-layer'?: string
}

export const buttonPadding = {
  sm: 'var(--ig-space-3) var(--ig-space-6)',
  md: 'var(--ig-space-4) var(--ig-space-8)',
  lg: 'var(--ig-space-5) var(--ig-space-10)',
} as const

export function normalizeVariant(variant?: ButtonVariant, legacyVariant?: LegacyButtonVariant): ButtonVariant {
  if (variant) return variant
  if (legacyVariant === 'ghost') return 'secondary'
  if (legacyVariant === 'accent') return 'accent'
  return 'solid'
}
