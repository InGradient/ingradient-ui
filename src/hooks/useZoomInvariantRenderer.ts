import { useEffect, useRef, useState, type RefObject } from 'react'

export interface ZoomInvariantRendererCtx {
  /** Container width in CSS pixels (resolved from prop or self-measured). */
  cw: number
  /** Container height in CSS pixels. */
  ch: number
  /** Whether container size is known (cw, ch > 0). */
  uniform: boolean
  /** Current zoom level (default 1). */
  z: number
  /** Convert px → viewBox-unit accounting for zoom. */
  s: (px: number) => number
}

export interface UseZoomInvariantRendererOptions {
  /** Element ref to measure. */
  ref: RefObject<Element | null>
  /** Explicit container width (overrides measurement). */
  containerWidth?: number
  /** Explicit container height (overrides measurement). */
  containerHeight?: number
  /** Current zoom level. Default 1. */
  zoom?: number
}

/**
 * Computes zoom-invariant rendering context for SVG overlays sitting on top of
 * a zoomable image (drawing-layer, measurement tools, annotation editors).
 *
 * Resolution priority for cw/ch: explicit prop > self-measured via
 * `ResizeObserver`. `uniform` is true only when both dimensions are known.
 *
 * `s(px)` converts a pixel value (stroke width, handle size, label font) into
 * a viewBox-unit value scaled inversely by zoom, so the rendered size stays
 * constant on screen regardless of zoom level.
 */
export function useZoomInvariantRenderer({
  ref,
  containerWidth,
  containerHeight,
  zoom = 1,
}: UseZoomInvariantRendererOptions): ZoomInvariantRendererCtx {
  const [measured, setMeasured] = useState({ w: 0, h: 0 })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof ResizeObserver === 'undefined') return

    const ro = new ResizeObserver(([entry]) => {
      if (!entry) return
      const { width, height } = entry.contentRect
      setMeasured((prev) =>
        prev.w === width && prev.h === height ? prev : { w: width, h: height },
      )
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref])

  const cw = (containerWidth ?? measured.w) || 0
  const ch = (containerHeight ?? measured.h) || 0
  const uniform = cw > 0 && ch > 0
  const s = (px: number) => px / zoom

  return { cw, ch, uniform, z: zoom, s }
}
