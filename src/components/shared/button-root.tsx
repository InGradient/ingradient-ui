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
  gap: 8px;
  min-width: 0;
  white-space: nowrap;
  padding: ${(p) => (p.$iconOnly ? '10px' : buttonPadding[p.$size])};
  font-size: ${(p) => (p.$size === 'sm' ? '13px' : p.$size === 'lg' ? '15px' : '14px')};
  font-weight: 600;
  line-height: 1;
  ${(p) => {
    if (p.$tone === 'danger') {
      return p.$variant === 'secondary' ? buttonDangerSecondary : buttonDanger
    }
    return p.$variant === 'secondary' ? buttonSecondary : p.$variant === 'accent' ? buttonAccent : buttonPrimary
  }}
`
