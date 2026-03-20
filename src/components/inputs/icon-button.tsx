import { ButtonRoot } from '../shared/button-root'
import { normalizeVariant, type ButtonProps } from '../shared/button-types'

export function IconButton({
  variant,
  $variant,
  size = 'md',
  tone = 'default',
  children,
  ...props
}: ButtonProps) {
  return (
    <ButtonRoot
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
}
