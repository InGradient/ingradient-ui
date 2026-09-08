import React from 'react'
import { createPortal } from 'react-dom'
import { DropdownMenu, DropdownRoot } from './dropdown-shared'
import { useDropdownLayout } from './dropdown-layout'

export interface PopoverTriggerFieldProps {
  /** Whether the popover is currently open. */
  open: boolean
  /** Called when the popover should open/close (click outside, ESC, programmatic). */
  onOpenChange: (open: boolean) => void
  /** Trigger element (rendered inline). Should wire its own onClick to call onOpenChange. */
  trigger: React.ReactNode
  /** Popover menu content (rendered in a portal under document.body). */
  children: React.ReactNode
  /** ARIA role for the menu container (e.g. 'listbox' / 'menu'). */
  menuRole?: string
  /** Accessible name for the portalled menu container. */
  menuAriaLabel?: string
  className?: string
  style?: React.CSSProperties
}

/**
 * Trigger + portal popover with viewport-bounded positioning.
 *
 * Uses `DropdownMenu` styled (width matches trigger). For free-width popovers
 * (e.g. date picker with library-defined width) use a different primitive.
 */
export function PopoverTriggerField({
  open,
  onOpenChange,
  trigger,
  children,
  menuRole,
  menuAriaLabel,
  className,
  style,
}: PopoverTriggerFieldProps) {
  const rootRef = React.useRef<HTMLDivElement | null>(null)
  const menuRef = React.useRef<HTMLDivElement | null>(null)
  const handleClose = React.useCallback(() => onOpenChange(false), [onOpenChange])
  const layout = useDropdownLayout(rootRef, menuRef, open, handleClose)

  return (
    <DropdownRoot ref={rootRef} className={className} style={style}>
      {trigger}
      {open && layout && createPortal(
        <DropdownMenu ref={menuRef} role={menuRole} aria-label={menuAriaLabel} $layout={layout}>
          {children}
        </DropdownMenu>,
        document.body,
      )}
    </DropdownRoot>
  )
}
