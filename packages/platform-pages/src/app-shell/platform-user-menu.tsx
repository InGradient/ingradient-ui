import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react'
import { FloatingOverlay, MenuItem } from '@ingradient/ui/components'

const ANCHOR_GAP = 8
const VIEWPORT_MARGIN = 8
const BACKDROP_STYLE = { position: 'fixed' as const, inset: 0, zIndex: 'var(--ig-z-popover)' }
const MENU_STYLE = { minWidth: 'var(--ig-popup-xs)', padding: 'var(--ig-spacing-4)' }

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
  const [position, setPosition] = useState(() => {
    const rect = anchorEl.getBoundingClientRect()
    return { top: rect.top, left: rect.right + ANCHOR_GAP }
  })

  // Measure the rendered menu, then keep it inside the viewport next to the row.
  useLayoutEffect(() => {
    const rect = anchorEl.getBoundingClientRect()
    const height = menuRef.current?.offsetHeight ?? 0
    const maxTop = Math.max(VIEWPORT_MARGIN, window.innerHeight - height - VIEWPORT_MARGIN)
    setPosition({ top: Math.min(Math.max(rect.top, VIEWPORT_MARGIN), maxTop), left: rect.right + ANCHOR_GAP })
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
