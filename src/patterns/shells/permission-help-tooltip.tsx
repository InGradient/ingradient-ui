import styled from 'styled-components'
import { TooltipBubble } from '../../components/overlays/popovers'

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
  font-size: 12px;
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

export interface PermissionHelpTooltipProps {
  text: string
  className?: string
}

export function PermissionHelpTooltip({ text, className }: PermissionHelpTooltipProps) {
  return (
    <Wrap className={className}>
      <span aria-hidden="true" style={ICON_STYLE}>?</span>
      <Bubble role="tooltip">{text}</Bubble>
    </Wrap>
  )
}
