import type { CSSProperties } from 'react'
import { popupSizeNumbers } from '../../tokens/core'

export const BACKDROP_STYLE: CSSProperties = {
  position: 'fixed', inset: 0,
  zIndex: 'calc(var(--ig-z-context-menu) - 1)' as unknown as number,
}
export const MENU_STYLE: CSSProperties = {
  minWidth: popupSizeNumbers.xs,
  padding: 'var(--ig-space-2)', display: 'flex', flexDirection: 'column', gap: 'var(--ig-space-2px)',
}
export const SEPARATOR_STYLE: CSSProperties = {
  margin: 'var(--ig-space-1) 0', border: 'none', borderTop: 'var(--ig-border-1px) solid var(--ig-color-border-subtle)',
}
export const ITEM_LABEL_STYLE: CSSProperties = { flex: 1, textAlign: 'left' }
export const CHEVRON_STYLE: CSSProperties = {
  marginLeft: 'var(--ig-space-3)', color: 'var(--ig-color-text-muted)', fontSize: 'var(--ig-font-size-xs)',
}
