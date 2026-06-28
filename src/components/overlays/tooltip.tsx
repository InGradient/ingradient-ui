import React, { useCallback, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'
import { surfaceRaised } from '../../primitives'

// ── Styled ────────────────────────────────────────────────────────────────────

const Bubble = styled.div`
  ${surfaceRaised}
  position: fixed;
  z-index: var(--ig-z-tooltip);
  border-radius: var(--ig-radius-sm);
  padding: var(--ig-space-3) var(--ig-space-4);
  font-size: var(--ig-font-size-xs);
  max-width: var(--ig-popup-sm);
  min-width: var(--ig-popup-xs);
  line-height: var(--ig-line-height-snug);
  white-space: normal;
  box-shadow: var(--ig-shadow-popover);
  pointer-events: none;
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

/**
 * Hover-triggered tooltip rendered via `createPortal(document.body)` so its
 * `position: fixed` is anchored to the viewport regardless of any ancestor
 * with `transform` / `filter` / `perspective` / `will-change` (which would
 * otherwise become the containing block per CSS spec).
 *
 * Mount happens only while open — avoids stale hidden bubbles in `document.body`.
 */
export const Tooltip: React.FC<TooltipProps> = ({ content, children, gap = 6 }) => {
  const wrapRef = useRef<HTMLSpanElement>(null)
  const bubbleRef = useRef<HTMLDivElement>(null)
  const tooltipId = useId()
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)

  const show = useCallback(() => setOpen(true), [])
  const hide = useCallback(() => {
    setOpen(false)
    setPos(null)
  }, [])

  useLayoutEffect(() => {
    if (!open) return
    const wrap = wrapRef.current
    const bubble = bubbleRef.current
    if (!wrap || !bubble) return

    const rect = wrap.getBoundingClientRect()
    const top = rect.bottom + gap
    let left = rect.left
    const bw = bubble.offsetWidth
    const overflow = left + bw - window.innerWidth + 12
    if (overflow > 0) left -= overflow
    if (left < 8) left = 8
    setPos({ top, left })
  }, [open, gap])

  // 단일 element child면 aria-describedby 를 주입해 SR 이 트리거-버블 관계를 인식하게 함.
  const describedChild = React.isValidElement(children)
    ? React.cloneElement(children as React.ReactElement<{ 'aria-describedby'?: string }>, {
        'aria-describedby': open ? tooltipId : undefined,
      })
    : children

  return (
    <Wrap ref={wrapRef} onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
      {describedChild}
      {open && createPortal(
        <Bubble ref={bubbleRef} id={tooltipId} role="tooltip" style={pos ? { top: pos.top, left: pos.left } : { opacity: 0 }}>
          {content}
        </Bubble>,
        document.body,
      )}
    </Wrap>
  )
}
