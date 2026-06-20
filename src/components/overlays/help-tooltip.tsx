import { iconSizeNumbers } from '../../tokens/core'
import { Tooltip } from './tooltip'

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

export interface HelpTooltipProps {
  text: string
  className?: string
}

/**
 * 작은 "?" 아이콘 + hover 시 표시되는 텍스트 tooltip.
 * tooltip 은 `Tooltip`(createPortal + position: fixed)을 통해 렌더되어
 * 부모의 `overflow` / `transform` 에 잘리지 않는다.
 */
export function HelpTooltip({ text, className }: HelpTooltipProps) {
  return (
    <Tooltip content={text}>
      <span className={className} aria-label={text} role="img" style={ICON_STYLE}>?</span>
    </Tooltip>
  )
}
