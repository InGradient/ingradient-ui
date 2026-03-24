import React, { useRef } from 'react'
import styled from 'styled-components'
import { surfaceRaised } from '../../primitives'

// ── Styled ────────────────────────────────────────────────────────────────────

const Bubble = styled.div`
  ${surfaceRaised}
  position: fixed;
  z-index: 9999;
  border-radius: var(--ig-radius-sm);
  padding: var(--ig-space-3) var(--ig-space-4);
  font-size: var(--ig-font-size-xs);
  max-width: 260px;
  min-width: 160px;
  line-height: 1.4;
  white-space: normal;
  box-shadow: var(--ig-shadow-popover);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease;
`

const Wrap = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
`

// ── Component ─────────────────────────────────────────────────────────────────

export interface TooltipProps {
  /** Tooltip text or node shown on hover */
  content: React.ReactNode
  /** The element that triggers the tooltip */
  children: React.ReactNode
  /** Gap between trigger bottom and tooltip top (px). Default: 6 */
  gap?: number
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children, gap = 6 }) => {
  const wrapRef = useRef<HTMLSpanElement>(null)
  const bubbleRef = useRef<HTMLDivElement>(null)

  const show = () => {
    const wrap = wrapRef.current
    const bubble = bubbleRef.current
    if (!wrap || !bubble) return

    const rect = wrap.getBoundingClientRect()
    const top = rect.bottom + gap
    let left = rect.left

    requestAnimationFrame(() => {
      const bw = bubble.offsetWidth
      const overflow = left + bw - window.innerWidth + 12
      if (overflow > 0) left -= overflow
      if (left < 8) left = 8
      bubble.style.top = `${top}px`
      bubble.style.left = `${left}px`
      bubble.style.opacity = '1'
    })
  }

  const hide = () => {
    const bubble = bubbleRef.current
    if (bubble) bubble.style.opacity = '0'
  }

  return (
    <Wrap ref={wrapRef} onMouseEnter={show} onMouseLeave={hide}>
      {children}
      <Bubble ref={bubbleRef}>{content}</Bubble>
    </Wrap>
  )
}
