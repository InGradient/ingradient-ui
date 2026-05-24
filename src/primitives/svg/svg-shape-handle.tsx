import React from 'react'

export interface SvgShapeHandleProps {
  cx: number
  cy: number
  rx: number
  /** Optional. When omitted (or equal to `rx`), renders as `<circle r={rx}>`. */
  ry?: number
  color: string
  fill?: string
  strokeWidth?: number
  vectorEffect?: 'non-scaling-stroke' | 'none'
  style?: React.CSSProperties
  className?: string
}

/**
 * Resize handle dot for editable SVG shapes (bbox corners, polygon vertices).
 * Default fill is white with `color` stroke — standard "draggable handle" look.
 * Renders `<circle>` when `rx === ry` (or `ry` omitted), else `<ellipse>`.
 */
export function SvgShapeHandle({
  cx, cy, rx, ry, color, fill = '#fff', strokeWidth, vectorEffect, style, className,
}: SvgShapeHandleProps) {
  if (ry === undefined || ry === rx) {
    return (
      <circle
        cx={cx}
        cy={cy}
        r={rx}
        fill={fill}
        stroke={color}
        strokeWidth={strokeWidth}
        vectorEffect={vectorEffect}
        style={style}
        className={className}
      />
    )
  }
  return (
    <ellipse
      cx={cx}
      cy={cy}
      rx={rx}
      ry={ry}
      fill={fill}
      stroke={color}
      strokeWidth={strokeWidth}
      vectorEffect={vectorEffect}
      style={style}
      className={className}
    />
  )
}
