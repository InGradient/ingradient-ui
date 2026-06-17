import React from 'react'
import { useClickOutside } from '../../hooks/useClickOutside'
import { popupSizeNumbers } from '../../tokens/core'
import type { DropdownMenuLayout } from './dropdown-shared'

export function useDropdownLayout(
  rootRef: React.RefObject<HTMLDivElement | null>,
  menuRef: React.RefObject<HTMLDivElement | null>,
  open: boolean,
  onClose: () => void
) {
  const [menuLayout, setMenuLayout] = React.useState<DropdownMenuLayout | null>(null)

  const updateMenuLayout = React.useCallback(() => {
    const root = rootRef.current
    if (!root) return

    const rect = root.getBoundingClientRect()
    const viewportPadding = 12
    const gap = 10
    const minMenuWidth = 160
    const menuWidth = Math.max(rect.width, minMenuWidth)
    const clampedWidth = Math.min(menuWidth, window.innerWidth - viewportPadding * 2)
    const clampedLeft = Math.min(
      Math.max(rect.left, viewportPadding),
      window.innerWidth - viewportPadding - clampedWidth
    )
    const spaceBelow = Math.max(popupSizeNumbers['2xs'], window.innerHeight - rect.bottom - gap - viewportPadding)
    const spaceAbove = Math.max(popupSizeNumbers['2xs'], rect.top - gap - viewportPadding)
    const shouldOpenUpward = window.innerHeight - rect.bottom < 240 && spaceAbove > spaceBelow

    setMenuLayout(
      shouldOpenUpward
        ? {
            left: clampedLeft,
            width: clampedWidth,
            maxHeight: Math.min(popupSizeNumbers.lg, spaceAbove),
            bottom: window.innerHeight - rect.top + gap,
          }
        : {
            left: clampedLeft,
            width: clampedWidth,
            maxHeight: Math.min(popupSizeNumbers.lg, spaceBelow),
            top: rect.bottom + gap,
          }
    )
  }, [rootRef])

  useClickOutside({
    refs: [rootRef, menuRef],
    onClickOutside: onClose,
    enabled: open,
    event: 'mousedown',
  })

  React.useEffect(() => {
    if (!open) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    updateMenuLayout()
    document.addEventListener('keydown', handleEscape)
    window.addEventListener('resize', updateMenuLayout)
    window.addEventListener('scroll', updateMenuLayout, true)

    return () => {
      document.removeEventListener('keydown', handleEscape)
      window.removeEventListener('resize', updateMenuLayout)
      window.removeEventListener('scroll', updateMenuLayout, true)
    }
  }, [onClose, open, updateMenuLayout])

  return menuLayout
}
