import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react'
import { FloatingOverlay, MenuItem } from '@ingradient/ui/components'

const ANCHOR_GAP = 8
const VIEWPORT_MARGIN = 8
const BACKDROP_STYLE = { position: 'fixed' as const, inset: 0, zIndex: 'var(--ig-z-popover)' }
const MENU_STYLE = { minWidth: 'var(--ig-popup-xs)', padding: 'var(--ig-spacing-4)' }

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), Math.max(min, max))

/**
 * Beside the row when there is room on its right (desktop sidebar). A row that reaches the
 * right edge (mobile drawer) gets the menu under it, or above it when the space below is short.
 */
export function placeUserMenu(anchor: DOMRect, width: number, height: number) {
  const maxLeft = window.innerWidth - width - VIEWPORT_MARGIN
  const maxTop = window.innerHeight - height - VIEWPORT_MARGIN
  const besideLeft = anchor.right + ANCHOR_GAP
  if (besideLeft <= maxLeft) return { top: clamp(anchor.top, VIEWPORT_MARGIN, maxTop), left: besideLeft }
  const below = anchor.bottom + ANCHOR_GAP
  const top = below <= maxTop ? below : anchor.top - ANCHOR_GAP - height
  return { top: clamp(top, VIEWPORT_MARGIN, maxTop), left: clamp(anchor.right - width, VIEWPORT_MARGIN, maxLeft) }
}

export interface PlatformUserMenuProps {
  /** The pressed User row from `PlatformAppShell.onOpenUser`. Null keeps the menu closed. */
  anchorEl: HTMLElement | null
  onClose: () => void
  /** Each item renders only when its handler is provided. */
  onChangeAccount?: () => void
  onAddAccount?: () => void
  onSignOut?: () => void
}

/** Account menu shown beside the app shell's User row. The app owns accounts, sign-out, and navigation. */
export function PlatformUserMenu(props: PlatformUserMenuProps) {
  return props.anchorEl ? <PlatformUserMenuBody {...props} anchorEl={props.anchorEl} /> : null
}

function PlatformUserMenuBody({
  anchorEl, onClose, onChangeAccount, onAddAccount, onSignOut,
}: PlatformUserMenuProps & { anchorEl: HTMLElement }) {
  const menuRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState(() => placeUserMenu(anchorEl.getBoundingClientRect(), 0, 0))

  // Measure the rendered menu, then keep it inside the viewport next to the row.
  useLayoutEffect(() => {
    const menu = menuRef.current
    setPosition(placeUserMenu(anchorEl.getBoundingClientRect(), menu?.offsetWidth ?? 0, menu?.offsetHeight ?? 0))
  }, [anchorEl])

  useEffect(() => {
    menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus()
  }, [])

  // Return focus to the row before running the action so a dialog it opens captures the row as its return target.
  const close = (action?: () => void) => {
    if (anchorEl.isConnected) anchorEl.focus({ preventScroll: true })
    onClose()
    action?.()
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      close()
      return
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
    event.preventDefault()
    const items = Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [])
    const index = items.indexOf(document.activeElement as HTMLElement)
    const next = (index + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length
    items[next]?.focus()
  }

  return (
    <>
      <div style={BACKDROP_STYLE} onClick={() => close()} data-ig-slot="user-menu-backdrop" />
      <FloatingOverlay
        ref={menuRef}
        variant="menu"
        top={position.top}
        left={position.left}
        style={MENU_STYLE}
        role="menu"
        aria-label="Account"
        data-ig-component="PlatformUserMenu"
        onKeyDown={onKeyDown}
      >
        {onChangeAccount ? <MenuItem role="menuitem" onClick={() => close(onChangeAccount)}>Change account</MenuItem> : null}
        {onAddAccount ? <MenuItem role="menuitem" onClick={() => close(onAddAccount)}>Add another account</MenuItem> : null}
        {onSignOut ? <MenuItem role="menuitem" tone="danger" onClick={() => close(onSignOut)}>Log out</MenuItem> : null}
      </FloatingOverlay>
    </>
  )
}
