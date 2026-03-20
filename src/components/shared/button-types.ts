import React from 'react'

export type ButtonVariant = 'solid' | 'secondary' | 'accent'
export type LegacyButtonVariant = 'primary' | 'ghost' | 'accent'
export type ButtonSize = 'sm' | 'md' | 'lg'

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  $variant?: LegacyButtonVariant
  size?: ButtonSize
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
