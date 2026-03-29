import React from 'react'
import type { DropdownMenuLayout } from './dropdown-shared'

export function useDropdownLayout(
  rootRef: React.RefObject<HTMLDivElement | null>,
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
    const spaceBelow = Math.max(140, window.innerHeight - rect.bottom - gap - viewportPadding)
    const spaceAbove = Math.max(140, rect.top - gap - viewportPadding)
    const shouldOpenUpward = window.innerHeight - rect.bottom < 240 && spaceAbove > spaceBelow

    setMenuLayout(
      shouldOpenUpward
        ? {
            left: clampedLeft,
            width: clampedWidth,
            maxHeight: Math.min(360, spaceAbove),
            bottom: window.innerHeight - rect.top + gap,
          }
        : {
            left: clampedLeft,
            width: clampedWidth,
            maxHeight: Math.min(360, spaceBelow),
            top: rect.bottom + gap,
          }
    )
  }, [rootRef])

  React.useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) onClose()
    }
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    updateMenuLayout()
    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)
    window.addEventListener('resize', updateMenuLayout)
    window.addEventListener('scroll', updateMenuLayout, true)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
      window.removeEventListener('resize', updateMenuLayout)
      window.removeEventListener('scroll', updateMenuLayout, true)
    }
  }, [onClose, open, rootRef, updateMenuLayout])

  return menuLayout
}
