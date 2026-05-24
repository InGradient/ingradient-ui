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
  'data-ig-component': componentHint,
  'data-ig-slot': slotHint,
  ...props
}, ref) {
  const componentName = 'Button'
  const slotName = slotHint ?? (componentHint && componentHint !== componentName ? componentHint : undefined)

  return (
    <ButtonRoot
      ref={ref}
      $variant={normalizeVariant(variant, $variant)}
      $size={size}
      $tone={tone}
      {...props}
      data-ig-component={componentName}
      data-ig-layer="components"
      data-ig-slot={slotName}
    >
      {leadingIcon}
      {children}
      {trailingIcon}
    </ButtonRoot>
  )
})
