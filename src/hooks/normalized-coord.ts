import type { RefObject } from 'react'

export interface NormalizedCoord {
  nx: number
  ny: number
}

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v
}

/**
 * Convert a pointer event's client coordinates to normalized [0..1] coords
 * within the given element's bounding rect. Returns `null` when the element
 * isn't mounted.
 *
 * Used by canvas / image hooks (`useCanvasMouse`, `useDrawingCanvas`) so the
 * conversion stays consistent.
 */
export function getNormalizedCoord(
  ref: RefObject<HTMLElement | null>,
  event: { clientX: number; clientY: number },
  options?: { clamp?: boolean },
): NormalizedCoord | null {
  const rect = ref.current?.getBoundingClientRect()
  if (!rect || rect.width === 0 || rect.height === 0) return null
  const nx = (event.clientX - rect.left) / rect.width
  const ny = (event.clientY - rect.top) / rect.height
  if (options?.clamp) {
    return { nx: clamp(nx, 0, 1), ny: clamp(ny, 0, 1) }
  }
  return { nx, ny }
}
