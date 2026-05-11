import React from 'react'
import { ButtonRoot } from '../shared/button-root'
import { normalizeVariant, type ButtonProps } from '../shared/button-types'

export type { ButtonProps } from '../shared/button-types'

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button({
  variant,
  $variant,
  size = 'md',
  tone = 'default',
  leadingIcon,
  trailingIcon,
  children,
  ...props
}, ref) {
  return (
    <ButtonRoot ref={ref} $variant={normalizeVariant(variant, $variant)} $size={size} $tone={tone} {...props}>
      {leadingIcon}
      {children}
      {trailingIcon}
    </ButtonRoot>
  )
})
