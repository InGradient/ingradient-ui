import styled from 'styled-components'
import { TooltipBubble } from '../../components/overlays/popovers'

const Wrap = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
`

const Icon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 999px;
  border: 1px solid var(--ig-color-border-strong);
  color: var(--ig-color-text-muted);
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
  cursor: help;
  background: var(--ig-color-surface-raised);
`

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
      <Icon aria-hidden="true">?</Icon>
      <Bubble role="tooltip">{text}</Bubble>
    </Wrap>
  )
}
