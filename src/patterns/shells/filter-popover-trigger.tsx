import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

const Wrap = styled.span`
  position: relative;
  display: inline-flex;
`

const Trigger = styled.button<{ $active: boolean; $iconOnly: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${(p) => (p.$iconOnly ? '0' : 'var(--ig-space-2)')};
  height: 32px;
  width: ${(p) => (p.$iconOnly ? '32px' : 'auto')};
  padding: ${(p) => (p.$iconOnly ? '0' : '0 var(--ig-space-4)')};
  justify-content: center;
  border-radius: var(--ig-radius-xs);
  border: 1px solid ${(p) => (p.$active ? 'var(--ig-color-accent-border-strong)' : 'var(--ig-color-border-subtle)')};
  background: ${(p) => (p.$active ? 'var(--ig-color-blue-tint-16)' : 'var(--ig-color-surface-interactive)')};
  color: ${(p) => (p.$active ? 'var(--ig-color-accent)' : 'var(--ig-color-text-secondary)')};
  font-size: var(--ig-font-size-sm);
  font-weight: 500;
  cursor: pointer;
  transition: background var(--ig-motion-fast), border-color var(--ig-motion-fast), color var(--ig-motion-fast);
  &:hover:not(:disabled) {
    background: ${(p) => (p.$active ? 'var(--ig-color-accent-soft-surface-hover)' : 'var(--ig-color-surface-interactive-hover)')};
  }
`

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: calc(var(--ig-z-context-menu) - 1);
`

const Panel = styled.div`
  position: fixed;
  z-index: var(--ig-z-context-menu);
  min-width: 280px;
  background: var(--ig-color-surface-raised);
  border: 1px solid var(--ig-color-border-strong);
  border-radius: var(--ig-radius-md);
  box-shadow: var(--ig-shadow-popover);
  padding: var(--ig-space-4);
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
      setPos({ top: rect.bottom + 6, left: rect.left })
    }
    compute()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', compute)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', compute)
    }
  }, [open])

  return (
    <Wrap className={className}>
      <Trigger
        ref={triggerRef}
        type="button"
        $active={active || open}
        $iconOnly={iconOnly}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={iconOnly && typeof label === 'string' ? label : undefined}
      >
        {icon}
        {iconOnly ? null : label}
      </Trigger>
      {open && pos ? (
        <>
          <Backdrop onClick={() => setOpen(false)} />
          <Panel
            role="dialog"
            style={{ top: pos.top, left: pos.left, ...(panelWidth ? { width: panelWidth } : {}), ...(panelMinWidth ? { minWidth: panelMinWidth } : {}) }}
            onClick={(e) => e.stopPropagation()}
          >
            {panel}
          </Panel>
        </>
      ) : null}
    </Wrap>
  )
}
