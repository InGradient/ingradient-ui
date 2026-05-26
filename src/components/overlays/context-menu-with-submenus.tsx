import { useEffect, useRef, useState } from 'react'
import { FloatingOverlay } from './floating-overlay'
import { MenuItem } from './menu-item'

const BACKDROP_STYLE = {
  position: 'fixed' as const,
  inset: 0,
  zIndex: 'calc(var(--ig-z-context-menu) - 1)' as unknown as number,
}

const MENU_STYLE = {
  minWidth: 180,
  padding: 'var(--ig-space-2)',
  display: 'flex' as const,
  flexDirection: 'column' as const,
  gap: 2,
}

const SEPARATOR_STYLE = {
  margin: 'var(--ig-space-1) 0',
  border: 'none',
  borderTop: '1px solid var(--ig-color-border-subtle)',
}

const ITEM_LABEL_STYLE = { flex: 1, textAlign: 'left' as const }
const CHEVRON_STYLE = {
  marginLeft: 'var(--ig-space-3)',
  color: 'var(--ig-color-text-muted)',
  fontSize: 'var(--ig-font-size-xs)',
}

export interface ContextMenuWithSubmenusAction {
  key: string
  label: string
  tone?: 'default' | 'danger'
  disabled?: boolean
  onClick?: () => void
  subActions?: ContextMenuWithSubmenusAction[]
  separator?: boolean
}

export interface ContextMenuWithSubmenusProps {
  anchorEl: HTMLElement | null
  onClose: () => void
  actions: ContextMenuWithSubmenusAction[]
  offset?: number
  defaultOpenSubmenuKey?: string
  alignRight?: boolean
}

export function ContextMenuWithSubmenus({
  anchorEl, onClose, actions, offset = 4, defaultOpenSubmenuKey, alignRight = true,
}: ContextMenuWithSubmenusProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const [submenuKey, setSubmenuKey] = useState<string | null>(defaultOpenSubmenuKey ?? null)
  const [submenuPos, setSubmenuPos] = useState<{ top: number; left: number } | null>(null)

  useEffect(() => {
    if (!anchorEl) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [anchorEl, onClose])

  useEffect(() => {
    setSubmenuKey(defaultOpenSubmenuKey ?? null)
  }, [defaultOpenSubmenuKey, anchorEl])

  useEffect(() => {
    if (!defaultOpenSubmenuKey || !anchorEl) return
    const id = window.requestAnimationFrame(() => {
      const item = menuRef.current?.querySelector<HTMLElement>(`[data-menu-key="${defaultOpenSubmenuKey}"]`)
      if (!item) return
      const r = item.getBoundingClientRect()
      setSubmenuPos({ top: r.top, left: r.right + 4 })
    })
    return () => window.cancelAnimationFrame(id)
  }, [defaultOpenSubmenuKey, anchorEl])

  if (!anchorEl) return null
  const rect = anchorEl.getBoundingClientRect()
  const top = rect.bottom + offset
  const left = alignRight ? Math.max(8, rect.right - 200) : Math.max(8, rect.left)

  const subActions = actions.find((a) => a.key === submenuKey)?.subActions

  return (
    <>
      <div onClick={onClose} style={BACKDROP_STYLE} />
      <FloatingOverlay ref={menuRef} variant="menu" top={top} left={left} style={MENU_STYLE} role="menu">
        {actions.map((a, i) => {
          if (a.separator) return <hr key={`sep-${i}`} style={SEPARATOR_STYLE} />
          const hasSub = !!a.subActions && a.subActions.length > 0
          return (
            <MenuItem
              key={a.key}
              role="menuitem"
              tone={a.tone}
              disabled={a.disabled}
              data-menu-key={a.key}
              data-active={submenuKey === a.key ? 'true' : 'false'}
              aria-haspopup={hasSub || undefined}
              aria-expanded={hasSub ? submenuKey === a.key : undefined}
              onMouseEnter={(e) => {
                if (!hasSub) { setSubmenuKey(null); return }
                const target = e.currentTarget as HTMLElement
                const r = target.getBoundingClientRect()
                setSubmenuPos({ top: r.top, left: r.right + 4 })
                setSubmenuKey(a.key)
              }}
              onClick={() => {
                if (hasSub) return
                a.onClick?.()
                onClose()
              }}
              iconTrailing={hasSub ? <span style={CHEVRON_STYLE}>›</span> : undefined}
            >
              <span style={ITEM_LABEL_STYLE}>{a.label}</span>
            </MenuItem>
          )
        })}
      </FloatingOverlay>
      {submenuKey && subActions && submenuPos ? (
        <FloatingOverlay variant="menu" top={submenuPos.top} left={submenuPos.left} style={MENU_STYLE} role="menu">
          {subActions.map((sa) => (
            <MenuItem
              key={sa.key}
              role="menuitem"
              tone={sa.tone}
              disabled={sa.disabled}
              onClick={() => { sa.onClick?.(); onClose() }}
            >
              {sa.label}
            </MenuItem>
          ))}
        </FloatingOverlay>
      ) : null}
    </>
  )
}
