import { useContext, useEffect, useRef, useState } from 'react'
import type { DrawingObject, DrawingPreview } from '../../hooks/useDrawingCanvas'
import { ImageViewerContext } from '../../components/data-display/image-viewer'
import { PointObject, RectObject, type RendererCtx } from './drawing-layer.renderers'

export type { DrawingObject, DrawingPreview } from '../../hooks/useDrawingCanvas'

export interface DrawingLayerProps {
  objects: DrawingObject[]
  selectedId?: string | null
  drawingPreview?: DrawingPreview | null
  showHandles?: boolean
  showLabels?: boolean
  showCrosshair?: boolean
  cursorX?: number
  cursorY?: number
  /** Container pixel width — enables uniform stroke/handle rendering */
  containerWidth?: number
  /** Container pixel height — enables uniform stroke/handle rendering */
  containerHeight?: number
  /** Color for the drawing preview (defaults to `var(--ig-color-accent)`). */
  previewColor?: string
  /** Color for the crosshair lines (defaults to `rgba(255, 255, 255, 0.3)`). */
  crosshairColor?: string
  /** Current zoom level — used to keep stroke width and label size constant regardless of zoom */
  zoom?: number
}

export function DrawingLayer({
  objects, selectedId, drawingPreview,
  showHandles = true, showLabels = false,
  showCrosshair = false, cursorX, cursorY,
  containerWidth, containerHeight,
  previewColor = 'var(--ig-color-accent)',
  crosshairColor,
  zoom: zoomProp,
}: DrawingLayerProps) {
  // Container size resolution priority: explicit prop > ImageViewerContext >
  // self-measured. Self-measure ensures correct rendering even when DrawingLayer
  // is rendered standalone (no caller prop, no ImageViewer ancestor).
  const ctx = useContext(ImageViewerContext)
  const svgRef = useRef<SVGSVGElement | null>(null)
  const [measured, setMeasured] = useState({ w: 0, h: 0 })

  useEffect(() => {
    const el = svgRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      if (!entry) return
      const { width, height } = entry.contentRect
      setMeasured((prev) => (prev.w === width && prev.h === height ? prev : { w: width, h: height }))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const cw = (containerWidth ?? ctx?.containerWidth ?? measured.w) || 0
  const ch = (containerHeight ?? ctx?.containerHeight ?? measured.h) || 0
  const uniform = cw > 0 && ch > 0
  const z = zoomProp ?? ctx?.zoom ?? 1
  const s = (px: number) => px / z
  const rendererCtx: RendererCtx = { cw, ch, uniform, z, s }

  return (
    <svg
      ref={svgRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'visible',
      }}
      viewBox="0 0 1 1"
      preserveAspectRatio="none"
    >
      {showCrosshair && cursorX != null && cursorY != null && (() => {
        const chColor = crosshairColor ?? 'rgba(255,255,255,0.3)'
        return (
          <>
            <line
              x1={cursorX} y1={0} x2={cursorX} y2={1}
              stroke={chColor}
              strokeWidth={uniform ? s(1) : 0.001}
              strokeDasharray={uniform ? `${s(4)} ${s(4)}` : '0.004 0.004'}
              vectorEffect={uniform ? 'non-scaling-stroke' : undefined}
            />
            <line
              x1={0} y1={cursorY} x2={1} y2={cursorY}
              stroke={chColor}
              strokeWidth={uniform ? s(1) : 0.001}
              strokeDasharray={uniform ? `${s(4)} ${s(4)}` : '0.004 0.004'}
              vectorEffect={uniform ? 'non-scaling-stroke' : undefined}
            />
          </>
        )
      })()}

      {drawingPreview && (
        <rect
          x={drawingPreview.x}
          y={drawingPreview.y}
          width={drawingPreview.w}
          height={drawingPreview.h}
          fill={previewColor}
          fillOpacity={0.15}
          stroke={previewColor}
          strokeWidth={uniform ? s(1.5) : 0.002}
          strokeDasharray={uniform ? `${s(6)} ${s(4)}` : '0.006 0.004'}
          vectorEffect={uniform ? 'non-scaling-stroke' : undefined}
        />
      )}

      {objects.map((obj) => {
        const isSelected = obj.id === selectedId
        const color = obj.color ?? 'var(--ig-color-accent)'
        const gStyle = obj.opacity != null && obj.opacity < 1
          ? { opacity: obj.opacity, transition: 'opacity 0.15s' } as const
          : undefined

        if (obj.type === 'rect' && obj.w != null && obj.h != null) {
          return (
            <RectObject
              key={obj.id}
              obj={obj as DrawingObject & { w: number; h: number }}
              isSelected={isSelected}
              color={color}
              showLabels={showLabels}
              showHandles={showHandles}
              ctx={rendererCtx}
              gStyle={gStyle}
            />
          )
        }

        if (obj.type === 'point') {
          return (
            <PointObject
              key={obj.id}
              obj={obj}
              isSelected={isSelected}
              color={color}
              ctx={rendererCtx}
              gStyle={gStyle}
            />
          )
        }

        return null
      })}
    </svg>
  )
}
