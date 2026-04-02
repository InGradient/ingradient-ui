import React from 'react'

export type ButtonVariant = 'solid' | 'secondary' | 'accent'
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
}

export const buttonPadding = {
  sm: '8px 12px',
  md: '10px 14px',
  lg: '12px 18px',
} as const

export function normalizeVariant(variant?: ButtonVariant, legacyVariant?: LegacyButtonVariant): ButtonVariant {
  if (variant) return variant
  if (legacyVariant === 'ghost') return 'secondary'
  if (legacyVariant === 'accent') return 'accent'
  return 'solid'
}
