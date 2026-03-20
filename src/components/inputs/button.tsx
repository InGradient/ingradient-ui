import { ButtonRoot } from '../shared/button-root'
import { normalizeVariant, type ButtonProps } from '../shared/button-types'

export type { ButtonProps } from '../shared/button-types'

export function Button({
  variant,
  $variant,
  size = 'md',
  leadingIcon,
  trailingIcon,
  children,
  ...props
}: ButtonProps) {
  return (
    <ButtonRoot $variant={normalizeVariant(variant, $variant)} $size={size} {...props}>
      {leadingIcon}
      {children}
      {trailingIcon}
    </ButtonRoot>
  )
}
