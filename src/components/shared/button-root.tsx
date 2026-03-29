import styled from 'styled-components'
import { buttonAccent, buttonDanger, buttonDangerSecondary, buttonPrimary, buttonSecondary } from '../../primitives'
import type { ButtonSize, ButtonTone, ButtonVariant } from './button-types'
import { buttonPadding } from './button-types'

export const ButtonRoot = styled.button<{
  $variant: ButtonVariant
  $size: ButtonSize
  $tone?: ButtonTone
  $iconOnly?: boolean
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--ig-space-3);
  min-width: 0;
  white-space: nowrap;
  height: ${(p) => p.$size === 'sm' ? 'var(--ig-control-height-sm)' : p.$size === 'lg' ? 'var(--ig-control-height-lg)' : 'var(--ig-control-height-md)'};
  padding: ${(p) => (p.$iconOnly ? `0 var(--ig-space-4)` : `0 ${buttonPadding[p.$size].split(' ')[1]}`)};
  font-size: ${(p) => (p.$size === 'sm' ? 'var(--ig-font-size-sm)' : p.$size === 'lg' ? 'var(--ig-font-size-lg)' : 'var(--ig-font-size-md)')};
  font-weight: 600;
  line-height: 1;
  ${(p) => {
    if (p.$tone === 'danger') {
      return p.$variant === 'secondary' ? buttonDangerSecondary : buttonDanger
    }
    return p.$variant === 'secondary' ? buttonSecondary : p.$variant === 'accent' ? buttonAccent : buttonPrimary
  }}
`
