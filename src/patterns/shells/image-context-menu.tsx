import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'
import { useClickOutside } from '../../hooks/useClickOutside'

const Menu = styled.div<{ $top: number; $left: number }>`
  position: fixed;
  top: ${(p) => p.$top}px;
  left: ${(p) => p.$left}px;
  min-width: 200px;
  background: var(--ig-color-surface-raised);
  border: 1px solid var(--ig-color-white-08);
  border-radius: var(--ig-radius-sm);
  box-shadow: var(--ig-shadow-menu);
  overflow: hidden;
  z-index: 1200;
`

const Item = styled.button<{ $disabled?: boolean }>`
  width: 100%;
  border: none;
  background: transparent;
  color: var(--ig-color-text-primary);
  padding: var(--ig-space-5) var(--ig-space-6);
  text-align: left;
  font-size: 13px;
  cursor: ${(p) => (p.$disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(p) => (p.$disabled ? 0.5 : 1)};
  &:hover:not(:disabled) {
    background: var(--ig-color-blue-tint-14);
  }
`

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
      <Menu role="menu" $top={position.top} $left={position.left}>
        {items.map((item) => (
          <Item
            key={item.key}
            type="button"
            role="menuitem"
            disabled={item.disabled}
            $disabled={item.disabled}
            onClick={() => {
              if (item.disabled) return
              item.onClick?.()
              onClose()
            }}
          >
            {item.label}
          </Item>
        ))}
      </Menu>
    </div>,
    document.body,
  )
}
