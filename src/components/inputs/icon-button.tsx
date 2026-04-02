import React from 'react'
import { ButtonRoot } from '../shared/button-root'
import { normalizeVariant, type ButtonProps } from '../shared/button-types'

export const IconButton = React.forwardRef<HTMLButtonElement, ButtonProps>(function IconButton({
  variant,
  $variant,
  size = 'md',
  tone = 'default',
  children,
  ...props
}, ref) {
  return (
    <ButtonRoot
      ref={ref}
      type="button"
      $variant={normalizeVariant(variant, $variant)}
      $size={size}
      $tone={tone}
      $iconOnly
      aria-label={props['aria-label'] ?? 'Action'}
      {...props}
    >
      {children}
    </ButtonRoot>
  )
})
