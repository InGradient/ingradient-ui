import type { DrawingObject } from '../../hooks/useDrawingCanvas'
import type { ZoomInvariantRendererCtx } from '../../hooks/useZoomInvariantRenderer'
import {
  SvgBboxRect,
  SvgPointDot,
  SvgShapeHandle,
  SvgShapeLabel,
} from '../../primitives/svg'
import {
  HANDLE_PX, POINT_PX, POINT_SELECTED_PX,
  STROKE_PX, STROKE_SELECTED_PX,
  LABEL_FONT_PX, LABEL_PAD_X, LABEL_PAD_Y, LABEL_HEIGHT, LABEL_RADIUS,
  estimateLabelWidth,
} from './drawing-layer.constants'

/** Alias for back-compat with existing import sites. */
type RendererCtx = ZoomInvariantRendererCtx

function BboxLabel({ obj, color, ctx }: { obj: DrawingObject & { w: number; h: number }; color: string; ctx: RendererCtx }) {
  const { cw, ch, uniform, z } = ctx
  if (!obj.label) return null
  return uniform ? (
    <SvgShapeLabel
      transform={`translate(${obj.x}, ${obj.y}) scale(${1 / (cw * z)}, ${1 / (ch * z)})`}
      width={estimateLabelWidth(obj.label)}
      height={LABEL_HEIGHT}
      radius={LABEL_RADIUS}
      color={color}
      text={obj.label}
      padX={LABEL_PAD_X}
      padY={LABEL_PAD_Y}
      fontSize={LABEL_FONT_PX}
    />
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
          <SvgShapeHandle
            key={i}
            cx={cx}
            cy={cy}
            rx={HANDLE_PX / (cw * z)}
            ry={HANDLE_PX / (ch * z)}
            color={color}
            strokeWidth={s(1.5)}
            vectorEffect="non-scaling-stroke"
          />
        ) : (
          <SvgShapeHandle
            key={i}
            cx={cx}
            cy={cy}
            rx={HANDLE_PX / 1000}
            color={color}
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
      <SvgBboxRect
        x={obj.x}
        y={obj.y}
        w={obj.w}
        h={obj.h}
        color={color}
        fillOpacity={isSelected ? 0.13 : 0.07}
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
  const strokeStyle: React.CSSProperties | undefined = isSelected
    ? { ...gStyle, stroke: 'var(--ig-color-svg-stroke-on-overlay)' }
    : gStyle
  return uniform ? (
    <SvgPointDot
      style={strokeStyle}
      cx={obj.x}
      cy={obj.y}
      rx={size / (cw * z)}
      ry={size / (ch * z)}
      color={color}
      stroke={isSelected ? undefined : 'none'}
      strokeWidth={s(1.5)}
      vectorEffect="non-scaling-stroke"
    />
  ) : (
    <SvgPointDot
      style={strokeStyle}
      cx={obj.x}
      cy={obj.y}
      rx={isSelected ? 0.008 : 0.006}
      color={color}
      stroke={isSelected ? undefined : 'none'}
      strokeWidth={0.002}
    />
  )
}

export type { RendererCtx }
