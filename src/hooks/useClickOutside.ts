import { useEffect, type RefObject } from 'react'

export interface UseClickOutsideOptions {
  /** Single ref or list of refs. Click inside any of these is ignored. */
  refs: RefObject<HTMLElement | null> | RefObject<HTMLElement | null>[]
  /** Called when click happens outside all provided refs. */
  onClickOutside: () => void
  /** Disable the listener (e.g. when dropdown is closed). Default: true */
  enabled?: boolean
  /** Event type. 'mousedown' fires before click — closes dropdown before button activates. Default: 'click' */
  event?: 'click' | 'mousedown'
  /** Capture phase. Use when other handlers stopPropagation before bubble reaches document. Default: false */
  capture?: boolean
}

export function useClickOutside({
  refs,
  onClickOutside,
  enabled = true,
  event = 'click',
  capture = false,
}: UseClickOutsideOptions): void {
  useEffect(() => {
    if (!enabled) return
    const refList = Array.isArray(refs) ? refs : [refs]
    const handler = (e: Event) => {
      const target = e.target as Node | null
      if (!target) return
      const inside = refList.some((r) => r.current?.contains(target))
      if (!inside) onClickOutside()
    }
    document.addEventListener(event, handler, capture)
    return () => document.removeEventListener(event, handler, capture)
  }, [refs, onClickOutside, enabled, event, capture])
}
