import styled from 'styled-components'
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
  width: 16,
  height: 16,
  borderRadius: 'var(--ig-radius-pill)',
  border: '1px solid var(--ig-color-border-strong)',
  color: 'var(--ig-color-text-muted)',
  fontSize: 10,
  fontWeight: 700,
  lineHeight: 1,
  cursor: 'help' as const,
  background: 'var(--ig-color-surface-raised)',
}

const Bubble = styled(TooltipBubble)`
  position: absolute;
  left: 50%;
  bottom: calc(100% + 8px);
  transform: translateX(-50%);
  min-width: 220px;
  max-width: 320px;
  color: var(--ig-color-text-secondary);
  font-size: var(--ig-font-size-xs);
  font-weight: 400;
  line-height: 1.45;
  white-space: pre-line;
  text-align: left;
  box-shadow: var(--ig-shadow-popover);
  opacity: 0;
  pointer-events: none;
  transition: opacity 120ms ease;
  z-index: 20;

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
