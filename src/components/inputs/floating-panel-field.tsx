import React, { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { DropdownRoot } from './dropdown-shared'

export interface FloatingPanelFieldProps {
  /** Whether the panel is currently open. */
  open: boolean
  /** Called when the panel should close (click outside, ESC). */
  onOpenChange: (open: boolean) => void
  /** Trigger element (rendered inline). Wire its onClick to call onOpenChange. */
  trigger: React.ReactNode
  /**
   * Render prop. Receives a position style (`position: 'fixed'`, `top`, `left`)
   * and a `ref` callback for the panel root. Caller applies them to its own
   * styled container.
   */
  children: (props: {
    style: React.CSSProperties
    ref: (node: HTMLDivElement | null) => void
  }) => React.ReactNode
  /** Estimated panel height (px). Used for above/below decision before the panel is actually measured. */
  estimatedHeight?: number
  /** Pixel gap between trigger and panel. Default 6. */
  gap?: number
  className?: string
  style?: React.CSSProperties
}

/**
 * Trigger + portal panel with viewport-bounded positioning, **no width
 * enforcement**. For dropdowns whose contents own their own width (date picker,
 * color picker, library widgets). Counterpart of `PopoverTriggerField` which
 * matches trigger width (menu / select pattern).
 */
export function FloatingPanelField({
  open,
  onOpenChange,
  trigger,
  children,
  estimatedHeight = 280,
  gap = 6,
  className,
  style,
}: FloatingPanelFieldProps) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const [pos, setPos] = useState({ top: 0, left: 0 })

  const updatePosition = useCallback(() => {
    const root = rootRef.current
    if (!root) return
    const rect = root.getBoundingClientRect()
    const panelHeight = panelRef.current?.offsetHeight ?? estimatedHeight
    const showAbove = window.innerHeight - rect.bottom < panelHeight && rect.top > panelHeight
    setPos({
      top: showAbove ? rect.top - panelHeight - gap : rect.bottom + gap,
      left: rect.left,
    })
  }, [estimatedHeight, gap])

  useEffect(() => {
    if (!open) return

    updatePosition()

    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node
      if (rootRef.current?.contains(target)) return
      if (panelRef.current?.contains(target)) return
      onOpenChange(false)
    }
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false)
    }

    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleEsc)
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)

    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleEsc)
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [open, onOpenChange, updatePosition])

  // re-measure once panel mounts (when actual height differs from estimate)
  const setPanelRef = useCallback((node: HTMLDivElement | null) => {
    panelRef.current = node
    if (node) {
      requestAnimationFrame(updatePosition)
    }
  }, [updatePosition])

  // Caller's container should set its own z-index (e.g. via styled-components
  // var(--ig-z-popover)). We only emit positioning fields.
  const panelStyle: React.CSSProperties = {
    position: 'fixed',
    top: pos.top,
    left: pos.left,
  }

  return (
    <DropdownRoot ref={rootRef} className={className} style={style}>
      {trigger}
      {open && createPortal(
        children({ style: panelStyle, ref: setPanelRef }),
        document.body,
      )}
    </DropdownRoot>
  )
}
