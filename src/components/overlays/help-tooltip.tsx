import styled from 'styled-components'
import { iconSizeNumbers } from '../../tokens/core'
import { TooltipBubble } from './popovers'

const Wrap = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
`

const ICON_STYLE = {
  display: 'inline-flex' as const,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  width: iconSizeNumbers.md,
  height: iconSizeNumbers.md,
  borderRadius: 'var(--ig-radius-pill)',
  border: 'var(--ig-border-1px) solid var(--ig-color-border-strong)',
  color: 'var(--ig-color-text-muted)',
  fontSize: 'var(--ig-font-size-3xs)',
  fontWeight: 'var(--ig-font-weight-bold)',
  lineHeight: 'var(--ig-line-height-none)',
  cursor: 'help' as const,
  background: 'var(--ig-color-surface-raised)',
}

const Bubble = styled(TooltipBubble)`
  position: absolute;
  left: 50%;
  bottom: calc(100% + var(--ig-space-3));
  transform: translateX(-50%);
  min-width: var(--ig-popup-xs);
  max-width: var(--ig-popup-md);
  color: var(--ig-color-text-secondary);
  font-size: var(--ig-font-size-xs);
  font-weight: var(--ig-font-weight-regular);
  line-height: var(--ig-line-height-base);
  white-space: pre-line;
  text-align: left;
  box-shadow: var(--ig-shadow-popover);
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--ig-motion-fast);
  z-index: var(--ig-z-header);

  ${Wrap}:hover & {
    opacity: 1;
  }
`

export interface HelpTooltipProps {
  text: string
  className?: string
}

/**
 * 작은 "?" 아이콘 + hover 시 표시되는 텍스트 tooltip.
 * 필드 / 매트릭스 셀 등에 도움말이 필요한 곳에 사용.
 */
export function HelpTooltip({ text, className }: HelpTooltipProps) {
  return (
    <Wrap className={className}>
      <span aria-hidden="true" style={ICON_STYLE}>?</span>
      <Bubble role="tooltip">{text}</Bubble>
    </Wrap>
  )
}
