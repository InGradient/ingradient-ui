import React from 'react'
import styled from 'styled-components'

export interface AnnotationOverlayBbox {
  /** Optional — undefined classId falls back to `defaultColor` and is excluded from
   *  `selectedClassId` filtering. */
  classId?: string
  /** Normalized [0, 1] coordinates in the original image space. */
  x: number
  y: number
  w: number
  h: number
}

export interface AnnotationOverlayPoint {
  classId?: string
  /** Normalized [0, 1] coordinates in the original image space. */
  x: number
  y: number
}

export interface AnnotationOverlayProps {
  bboxes?: AnnotationOverlayBbox[] | null
  points?: AnnotationOverlayPoint[] | null
  /** Resolves classId → color hex. Returns undefined to fall back to `defaultColor`.
   *  Called with undefined when an annotation has no classId. */
  getColor: (classId: string | undefined) => string | undefined
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
 * Compute the `object-fit: cover` square crop region in normalized image coords.
 * Returns the (vx, vy, vw, vh) slice of the [0, 1] image that is visible after the
 * thumbnail crops to a square.
 *
 * - landscape (ar > 1): horizontal slice (width 1/ar centered)
 * - portrait (ar < 1): vertical slice (height ar centered)
 * - square or unknown: full [0, 1] view
 */
function coverCropRegion(imageWidth: number, imageHeight: number) {
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
  const { vx, vy, vw, vh } = coverCropRegion(w, h)

  const matchesFilter = (classId: string | undefined) =>
    selectedClassId == null || selectedClassId === '' || classId === selectedClassId

  const visibleBboxes = (bboxes ?? []).filter((b) => matchesFilter(b.classId))
  const visiblePoints = (points ?? []).filter((p) => matchesFilter(p.classId))

  if (visibleBboxes.length === 0 && visiblePoints.length === 0) return null

  // Render in a normalized [0, 1] x [0, 1] container space. Each annotation's
  // image-normalized coords are pre-transformed into container-normalized coords
  // using the cover-crop region — this keeps strokes uniform (no anamorphic stretch
  // from a non-square viewBox) so rects don't have thicker vertical lines and
  // points stay circular.
  const toCx = (x: number) => (x - vx) / vw
  const toCy = (y: number) => (y - vy) / vh
  const toCw = (rectW: number) => rectW / vw
  const toCh = (rectH: number) => rectH / vh

  const strokeBase = 0.008
  const strokeEmphasis = 0.012
  const pointRadius = 0.015

  return (
    <Layer viewBox="0 0 1 1" preserveAspectRatio="none" className={className}>
      {visibleBboxes.map((bbox, i) => {
        const color = getColor(bbox.classId) ?? defaultColor
        const x = toCx(bbox.x)
        const y = toCy(bbox.y)
        const rw = toCw(bbox.w)
        const rh = toCh(bbox.h)
        return (
          <g key={`bbox-${i}`}>
            {emphasize ? (
              <>
                <rect x={x} y={y} width={rw} height={rh}
                  fill="none" stroke="rgba(0, 0, 0, 0.6)" strokeWidth={strokeEmphasis} />
                <rect x={x} y={y} width={rw} height={rh}
                  fill="none" stroke="rgba(255, 255, 255, 0.9)" strokeWidth={strokeBase * 0.6} />
              </>
            ) : null}
            <rect
              x={x}
              y={y}
              width={rw}
              height={rh}
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
        const cx = toCx(point.x)
        const cy = toCy(point.y)
        return (
          <g key={`point-${i}`}>
            {emphasize ? (
              <circle cx={cx} cy={cy} r={pointRadius * 1.4} fill="rgba(0, 0, 0, 0.55)" />
            ) : null}
            <circle
              cx={cx}
              cy={cy}
              r={pointRadius}
              fill={color}
              stroke={emphasize ? 'var(--ig-color-text-primary)' : 'none'}
              strokeWidth={emphasize ? 0.004 : 0}
            />
          </g>
        )
      })}
    </Layer>
  )
}
