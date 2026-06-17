import { useEffect, useState, type RefObject } from 'react'

export interface ElementSize {
  width: number
  height: number
}

export interface UseElementSizeOptions {
  /** Minimum width to enforce when reporting. Useful for narrow grid cells. */
  minWidth?: number
  /** Minimum height to enforce when reporting. */
  minHeight?: number
  /** Also re-measure on `window.resize`. Default: true. */
  watchWindowResize?: boolean
}

/**
 * Tracks an element's CSS-pixel size via `ResizeObserver` (+ optional window
 * resize listener fallback). Used by responsive chart wrappers / canvas hosts.
 *
 * Returns `{ 0, 0 }` until first measurement — caller should guard rendering
 * (`size.width > 0 && size.height > 0`).
 */
export function useElementSize(
  ref: RefObject<HTMLElement | null>,
  options: UseElementSizeOptions = {},
): ElementSize {
  const { minWidth = 0, minHeight = 0, watchWindowResize = true } = options
  const [size, setSize] = useState<ElementSize>({ width: 0, height: 0 })

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const update = () => {
      const nextWidth = Math.max(element.clientWidth, minWidth)
      const nextHeight = Math.max(element.clientHeight, minHeight)
      setSize((prev) =>
        prev.width === nextWidth && prev.height === nextHeight
          ? prev
          : { width: nextWidth, height: nextHeight },
      )
    }

    update()

    let observer: ResizeObserver | undefined
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(update)
      observer.observe(element)
    }

    if (watchWindowResize) {
      window.addEventListener('resize', update)
    }

    return () => {
      observer?.disconnect()
      if (watchWindowResize) {
        window.removeEventListener('resize', update)
      }
    }
  }, [ref, minWidth, minHeight, watchWindowResize])

  return size
}
