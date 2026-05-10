import React from 'react'
import styled from 'styled-components'

export interface AnnotationOverlayBbox {
  classId: string
  /** Normalized [0, 1] coordinates in the original image space. */
  x: number
  y: number
  w: number
  h: number
}

export interface AnnotationOverlayPoint {
  classId: string
  /** Normalized [0, 1] coordinates in the original image space. */
  x: number
  y: number
}

export interface AnnotationOverlayProps {
  bboxes?: AnnotationOverlayBbox[] | null
  points?: AnnotationOverlayPoint[] | null
  /** Resolves classId → color hex. Returns undefined to fall back to `defaultColor`. */
  getColor: (classId: string) => string | undefined
  /** Fallback color when `getColor` returns undefined. Default `'#4d88ff'`. */
  defaultColor?: string
  /** Filter — only render annotations matching this classId. Omit/null = render all. */
  selectedClassId?: string | null
  /** Original image dimensions — used to compute the `object-fit: cover` viewBox so
   *  bboxes line up with the cropped thumbnail. */
  imageWidth: number | null | undefined
  imageHeight: number | null | undefined
  /** Tint bbox fill at this opacity (0~1). Default 0 = stroke-only (edge style). */
  fillOpacity?: number
  /** Draw a double white/dark outline around bbox/point for thumbnail readability.
   *  Default false. platform 의 catalog 썸네일 패턴은 true. */
  emphasize?: boolean
  className?: string
}

const Layer = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
`

/**
 * Compute the `object-fit: cover` square viewBox so normalized [0,1] coordinates
 * map onto the cropped thumbnail correctly.
 *
 * - landscape (ar > 1): horizontal slice (width 1/ar centered)
 * - portrait (ar < 1): vertical slice (height ar centered)
 * - square or unknown: full [0,1] view
 */
function coverViewBox(imageWidth: number, imageHeight: number) {
  const ar = imageWidth > 0 && imageHeight > 0 ? imageWidth / imageHeight : 1
  let vx = 0
  let vy = 0
  let vw = 1
  let vh = 1
  if (ar > 1) {
    vw = 1 / ar
    vx = (1 - vw) / 2
  } else if (ar < 1) {
    vh = ar
    vy = (1 - vh) / 2
  }
  return { vx, vy, vw, vh }
}

export function AnnotationOverlay({
  bboxes,
  points,
  getColor,
  defaultColor = '#4d88ff',
  selectedClassId,
  imageWidth,
  imageHeight,
  fillOpacity = 0,
  emphasize = false,
  className,
}: AnnotationOverlayProps) {
  const w = imageWidth ?? 0
  const h = imageHeight ?? 0
  const { vx, vy, vw, vh } = coverViewBox(w, h)

  const matchesFilter = (classId: string) =>
    selectedClassId == null || selectedClassId === '' || classId === selectedClassId

  const visibleBboxes = (bboxes ?? []).filter((b) => matchesFilter(b.classId))
  const visiblePoints = (points ?? []).filter((p) => matchesFilter(p.classId))

  if (visibleBboxes.length === 0 && visiblePoints.length === 0) return null

  const strokeBase = vw * 0.008
  const strokeEmphasis = vw * 0.012
  const pointRadius = vw * 0.015

  return (
    <Layer viewBox={`${vx} ${vy} ${vw} ${vh}`} preserveAspectRatio="none" className={className}>
      {visibleBboxes.map((bbox, i) => {
        const color = getColor(bbox.classId) ?? defaultColor
        return (
          <g key={`bbox-${i}`}>
            {emphasize ? (
              <>
                <rect
                  x={bbox.x}
                  y={bbox.y}
                  width={bbox.w}
                  height={bbox.h}
                  fill="none"
                  stroke="rgba(0, 0, 0, 0.6)"
                  strokeWidth={strokeEmphasis}
                />
                <rect
                  x={bbox.x}
                  y={bbox.y}
                  width={bbox.w}
                  height={bbox.h}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.9)"
                  strokeWidth={strokeBase * 0.6}
                />
              </>
            ) : null}
            <rect
              x={bbox.x}
              y={bbox.y}
              width={bbox.w}
              height={bbox.h}
              fill={fillOpacity > 0 ? color : 'none'}
              fillOpacity={fillOpacity > 0 ? fillOpacity : undefined}
              stroke={color}
              strokeWidth={strokeBase}
              opacity={emphasize ? 1 : 0.9}
            />
          </g>
        )
      })}
      {visiblePoints.map((point, i) => {
        const color = getColor(point.classId) ?? defaultColor
        return (
          <g key={`point-${i}`}>
            {emphasize ? (
              <circle cx={point.x} cy={point.y} r={pointRadius * 1.4} fill="rgba(0, 0, 0, 0.55)" />
            ) : null}
            <circle
              cx={point.x}
              cy={point.y}
              r={pointRadius}
              fill={color}
              stroke={emphasize ? 'var(--ig-color-text-primary)' : 'none'}
              strokeWidth={emphasize ? vw * 0.004 : 0}
            />
          </g>
        )
      })}
    </Layer>
  )
}
