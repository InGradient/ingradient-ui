import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { FloatingOverlay } from './floating-overlay'

type Placement = 'right' | 'left' | 'top' | 'bottom'

const Wrapper = styled.span<{ $open: boolean; $scale: number }>`
  display: inline-block;
  position: relative;
  transition: transform var(--ig-motion-fast);
  transform-origin: center;
  ${(p) => p.$open && p.$scale !== 1 && `transform: scale(${p.$scale}); z-index: var(--ig-z-raised);`}
`

const PREVIEW_STYLE = {
  padding: 'var(--ig-space-3)',
  maxWidth: 'min(80vw, 480px)',
}

export interface HoverPreviewProps {
  preview: React.ReactNode
  delay?: number
  offset?: number
  placement?: Placement
  disabled?: boolean
  /** open 시 wrapped child 에 적용할 transform scale (기본 1 — 적용 안 함) */
  scale?: number
  children: React.ReactNode
  className?: string
}

export function HoverPreview({
  preview, delay = 320, offset = 12, placement = 'right',
  disabled = false, scale = 1, children, className,
}: HoverPreviewProps) {
  const wrapRef = useRef<HTMLSpanElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  const handleEnter = () => {
    if (disabled) return
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      const rect = wrapRef.current?.getBoundingClientRect()
      if (!rect) return
      const next = computePosition(rect, placement, offset)
      setPos(next)
      setOpen(true)
    }, delay)
  }

  const handleLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setOpen(false)
  }

  return (
    <Wrapper ref={wrapRef} $open={open} $scale={scale} onMouseEnter={handleEnter} onMouseLeave={handleLeave} className={className}>
      {children}
      {open && pos ? (
        <FloatingOverlay variant="tooltip" top={pos.top} left={pos.left} role="tooltip" style={PREVIEW_STYLE}>
          {preview}
        </FloatingOverlay>
      ) : null}
    </Wrapper>
  )
}

function computePosition(rect: DOMRect, placement: Placement, offset: number): { top: number; left: number } {
  switch (placement) {
    case 'right':  return { top: rect.top, left: rect.right + offset }
    case 'left':   return { top: rect.top, left: rect.left - offset }
    case 'top':    return { top: rect.top - offset, left: rect.left }
    case 'bottom': return { top: rect.bottom + offset, left: rect.left }
  }
}
