import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'
import { popupSizeNumbers } from '../../tokens/core'
import { FloatingOverlay } from '../overlays/floating-overlay'

const WRAP_STYLE = { position: 'relative' as const, display: 'inline-flex' as const }

const PANEL_GAP = 6

const BACKDROP_STYLE = {
  position: 'fixed' as const,
  inset: 0,
  zIndex: 'calc(var(--ig-z-tooltip) - 1)' as unknown as number,
}

const PANEL_BASE_STYLE = {
  minWidth: popupSizeNumbers.sm,
  maxWidth: 'min(var(--ig-popup-2xl-narrow), calc(100vw - var(--ig-space-11)))',
  padding: 'var(--ig-space-4)',
  overflow: 'visible' as const,
  zIndex: 'var(--ig-z-tooltip)' as unknown as number,
}

const Trigger = styled.button<{ $active: boolean; $iconOnly: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${(p) => (p.$iconOnly ? '0' : 'var(--ig-space-2)')};
  height: var(--ig-control-height-sm);
  width: ${(p) => (p.$iconOnly ? 'var(--ig-control-height-sm)' : 'auto')};
  padding: ${(p) => (p.$iconOnly ? '0' : '0 var(--ig-space-4)')};
  justify-content: center;
  border-radius: var(--ig-radius-xs);
  border: var(--ig-border-1px) solid ${(p) => (p.$active ? 'var(--ig-color-accent-border-strong)' : 'var(--ig-color-border-subtle)')};
  background: ${(p) => (p.$active ? 'var(--ig-color-focus-bg-soft)' : 'var(--ig-color-surface-interactive)')};
  color: ${(p) => (p.$active ? 'var(--ig-color-accent)' : 'var(--ig-color-text-secondary)')};
  font-size: var(--ig-font-size-sm);
  font-weight: var(--ig-font-weight-medium);
  cursor: pointer;
  transition: background var(--ig-motion-fast), border-color var(--ig-motion-fast), color var(--ig-motion-fast);
  &:hover:not(:disabled) {
    background: ${(p) => (p.$active ? 'var(--ig-color-accent-soft-surface-hover)' : 'var(--ig-color-surface-interactive-hover)')};
  }
`

export interface FilterPopoverTriggerProps {
  label: React.ReactNode
  icon?: React.ReactNode
  active?: boolean
  iconOnly?: boolean
  panel: React.ReactNode
  defaultOpen?: boolean
  panelWidth?: number
  panelMinWidth?: number
  className?: string
}

export function FilterPopoverTrigger({
  label, icon, active = false, iconOnly = false, panel, defaultOpen = false,
  panelWidth, panelMinWidth, className,
}: FilterPopoverTriggerProps) {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(defaultOpen)
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)

  useEffect(() => {
    if (!open) return
    const compute = () => {
      const rect = triggerRef.current?.getBoundingClientRect()
      if (!rect) return
      setPos({ top: rect.bottom + PANEL_GAP, left: rect.left })
    }
    compute()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('resize', compute)
    window.addEventListener('scroll', compute, true)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('resize', compute)
      window.removeEventListener('scroll', compute, true)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <span className={className} style={WRAP_STYLE}>
      <Trigger
        ref={triggerRef}
        type="button"
        $active={active || open}
        $iconOnly={iconOnly}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={iconOnly && typeof label === 'string' ? label : undefined}
      >
        {icon}
        {iconOnly ? null : label}
      </Trigger>
      {open && pos && typeof document !== 'undefined'
        ? createPortal(
          <>
            <div onClick={() => setOpen(false)} style={BACKDROP_STYLE} />
            <FloatingOverlay
              variant="menu"
              top={pos.top}
              left={pos.left}
              role="dialog"
              style={{
                ...PANEL_BASE_STYLE,
                ...(panelWidth ? { width: panelWidth } : {}),
                ...(panelMinWidth ? { minWidth: panelMinWidth } : {}),
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {panel}
            </FloatingOverlay>
          </>,
          document.body,
        )
        : null}
    </span>
  )
}
