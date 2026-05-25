import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useClickOutside } from '../../hooks/useClickOutside'
import { FloatingOverlay } from '../../components/overlays/floating-overlay'
import { MenuItem } from '../../components/overlays/menu-item'

const MENU_STYLE = {
  minWidth: 200,
  borderRadius: 'var(--ig-radius-sm)',
  overflow: 'hidden' as const,
}

export interface ImageContextMenuItem {
  key: string
  label: string
  onClick?: () => void
  disabled?: boolean
}

export interface ImageContextMenuProps {
  position: { top: number; left: number } | null
  items: ImageContextMenuItem[]
  onClose: () => void
}

export function ImageContextMenu({ position, items, onClose }: ImageContextMenuProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  useClickOutside({ refs: [ref], onClickOutside: onClose, enabled: !!position })

  useEffect(() => {
    if (!position) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [position, onClose])

  if (!position || typeof document === 'undefined') return null

  return createPortal(
    <div ref={ref}>
      <FloatingOverlay variant="menu" role="menu" top={position.top} left={position.left} style={MENU_STYLE}>
        {items.map((item) => (
          <MenuItem
            key={item.key}
            role="menuitem"
            size="md"
            disabled={item.disabled}
            onClick={() => {
              if (item.disabled) return
              item.onClick?.()
              onClose()
            }}
          >
            {item.label}
          </MenuItem>
        ))}
      </FloatingOverlay>
    </div>,
    document.body,
  )
}
