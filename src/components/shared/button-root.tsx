import styled, { css } from 'styled-components'
import { buttonAccent, buttonDanger, buttonDangerSecondary, buttonGhost, buttonGhostDanger, buttonPrimary, buttonSecondary } from '../../primitives'
import type { ButtonSize, ButtonTone, ButtonVariant } from './button-types'

/** 크기 하나당 높이·글자 크기를 한 곳에서 정한다 — 세 군데에 흩어져 있으면 xs 를 더할 때 빠뜨린다. */
const CONTROL_HEIGHT: Record<ButtonSize, string> = {
  xs: 'var(--ig-control-height-xs)',
  sm: 'var(--ig-control-height-sm)',
  md: 'var(--ig-control-height-md)',
  lg: 'var(--ig-control-height-lg)',
}

/** 글자 크기는 값이 아니라 블록으로 둔다 — 토큰을 글자 그대로 써야 stylelint 가 읽는다. */
const FONT_SIZE: Record<ButtonSize, ReturnType<typeof css>> = {
  xs: css`font-size: var(--ig-font-size-xs);`,
  sm: css`font-size: var(--ig-font-size-sm);`,
  md: css`font-size: var(--ig-font-size-md);`,
  lg: css`font-size: var(--ig-font-size-lg);`,
}

const controlHeight = (size: ButtonSize): string => CONTROL_HEIGHT[size]
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
  height: ${(p) => controlHeight(p.$size)};
  ${(p) => p.$iconOnly ? `width: ${controlHeight(p.$size)}; padding: 0;` : `padding: 0 ${buttonPadding[p.$size].split(' ')[1]};`}
  ${(p) => FONT_SIZE[p.$size]}
  font-weight: var(--ig-font-weight-semibold);
  line-height: var(--ig-line-height-none);
  ${(p) => {
    if (p.$tone === 'danger') {
      if (p.$variant === 'ghost') return buttonGhostDanger
      return p.$variant === 'secondary' ? buttonDangerSecondary : buttonDanger
    }
    return p.$variant === 'ghost'
      ? buttonGhost
      : p.$variant === 'secondary'
        ? buttonSecondary
        : p.$variant === 'accent'
          ? buttonAccent
          : buttonPrimary
  }}
`
