import type { DrawingObject } from '../../hooks/useDrawingCanvas'
import {
  HANDLE_PX, POINT_PX, POINT_SELECTED_PX,
  STROKE_PX, STROKE_SELECTED_PX,
  LABEL_FONT_PX, LABEL_PAD_X, LABEL_PAD_Y, LABEL_HEIGHT, LABEL_RADIUS,
  estimateLabelWidth,
} from './drawing-layer.constants'

interface RendererCtx {
  /** Container width in CSS pixels (resolved from prop / context / measured). */
  cw: number
  /** Container height in CSS pixels. */
  ch: number
  /** Container 측정 완료 여부. */
  uniform: boolean
  /** Current zoom level (default 1). */
  z: number
  /** Convert pixel value to viewBox unit, divided by zoom for zoom-invariant rendering. */
  s: (px: number) => number
}

function BboxLabel({ obj, color, ctx }: { obj: DrawingObject & { w: number; h: number }; color: string; ctx: RendererCtx }) {
  const { cw, ch, uniform, z } = ctx
  if (!obj.label) return null
  return uniform ? (
    <g transform={`translate(${obj.x}, ${obj.y}) scale(${1 / (cw * z)}, ${1 / (ch * z)})`}>
      <rect
        x={0}
        y={-LABEL_HEIGHT}
        width={estimateLabelWidth(obj.label)}
        height={LABEL_HEIGHT}
        rx={LABEL_RADIUS}
        fill={color}
        opacity={0.85}
      />
      <text
        x={LABEL_PAD_X}
        y={-LABEL_PAD_Y}
        fill="#fff"
        fontSize={LABEL_FONT_PX}
        fontWeight={600}
        fontFamily="sans-serif"
        style={{ pointerEvents: 'none' }}
      >
        {obj.label}
      </text>
    </g>
  ) : (
    <text
      x={obj.x + 0.003}
      y={obj.y - 0.004}
      fill={color}
      fontSize={0.014}
      fontFamily="sans-serif"
      style={{ pointerEvents: 'none' }}
    >
      {obj.label}
    </text>
  )
}

function BboxHandles({ obj, color, ctx }: { obj: DrawingObject & { w: number; h: number }; color: string; ctx: RendererCtx }) {
  const { cw, ch, uniform, z, s } = ctx
  const corners: [number, number][] = [
    [obj.x, obj.y],
    [obj.x + obj.w, obj.y],
    [obj.x, obj.y + obj.h],
    [obj.x + obj.w, obj.y + obj.h],
  ]
  return (
    <>
      {corners.map(([cx, cy], i) => (
        uniform ? (
          <ellipse
            key={i}
            cx={cx}
            cy={cy}
            rx={HANDLE_PX / (cw * z)}
            ry={HANDLE_PX / (ch * z)}
            fill="#fff"
            stroke={color}
            strokeWidth={s(1.5)}
            vectorEffect="non-scaling-stroke"
          />
        ) : (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={HANDLE_PX / 1000}
            fill="#fff"
            stroke={color}
            strokeWidth={0.002}
          />
        )
      ))}
    </>
  )
}

export function RectObject({
  obj, isSelected, color, showLabels, showHandles, ctx, gStyle,
}: {
  obj: DrawingObject & { w: number; h: number }
  isSelected: boolean
  color: string
  showLabels: boolean
  showHandles: boolean
  ctx: RendererCtx
  gStyle?: React.CSSProperties
}) {
  const { uniform, s } = ctx
  return (
    <g style={gStyle}>
      <rect
        x={obj.x}
        y={obj.y}
        width={obj.w}
        height={obj.h}
        fill={isSelected ? `${color}22` : `${color}11`}
        stroke={color}
        strokeWidth={uniform ? s(isSelected ? STROKE_SELECTED_PX : STROKE_PX) : (isSelected ? 0.003 : 0.002)}
        vectorEffect={uniform ? 'non-scaling-stroke' : undefined}
      />
      {showLabels && <BboxLabel obj={obj} color={color} ctx={ctx} />}
      {showHandles && isSelected && <BboxHandles obj={obj} color={color} ctx={ctx} />}
    </g>
  )
}

export function PointObject({
  obj, isSelected, color, ctx, gStyle,
}: {
  obj: DrawingObject
  isSelected: boolean
  color: string
  ctx: RendererCtx
  gStyle?: React.CSSProperties
}) {
  const { cw, ch, uniform, z, s } = ctx
  const size = isSelected ? POINT_SELECTED_PX : POINT_PX
  return uniform ? (
    <ellipse
      style={gStyle}
      cx={obj.x}
      cy={obj.y}
      rx={size / (cw * z)}
      ry={size / (ch * z)}
      fill={color}
      stroke={isSelected ? '#fff' : 'none'}
      strokeWidth={s(1.5)}
      vectorEffect="non-scaling-stroke"
    />
  ) : (
    <circle
      style={gStyle}
      cx={obj.x}
      cy={obj.y}
      r={isSelected ? 0.008 : 0.006}
      fill={color}
      stroke={isSelected ? '#fff' : 'none'}
      strokeWidth={0.002}
    />
  )
}

export type { RendererCtx }
