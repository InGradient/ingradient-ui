import React from 'react'

export interface SvgPointDotProps {
  cx: number
  cy: number
  rx: number
  /** Optional. When omitted (or equal to `rx`), renders as `<circle r={rx}>`. */
  ry?: number
  color: string
  stroke?: string
  strokeWidth?: number
  vectorEffect?: 'non-scaling-stroke' | 'none'
  style?: React.CSSProperties
  className?: string
}

/**
 * Point dot. Renders `<circle>` when `rx === ry` (or `ry` omitted), else
 * `<ellipse>` — anisotropic `rx` / `ry` lets caller fix size in CSS pixels
 * under a non-square viewBox.
 */
export function SvgPointDot({
  cx, cy, rx, ry, color, stroke, strokeWidth, vectorEffect, style, className,
}: SvgPointDotProps) {
  if (ry === undefined || ry === rx) {
    return (
      <circle
        cx={cx}
        cy={cy}
        r={rx}
        fill={color}
        stroke={stroke}
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
      fill={color}
      stroke={stroke}
      strokeWidth={strokeWidth}
      vectorEffect={vectorEffect}
      style={style}
      className={className}
    />
  )
}
