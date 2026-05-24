import React from 'react'

export interface SvgBboxRectProps extends Omit<React.SVGProps<SVGRectElement>, 'x' | 'y' | 'width' | 'height' | 'fill' | 'stroke'> {
  x: number
  y: number
  w: number
  h: number
  color: string
  fillOpacity?: number
  strokeWidth?: number
}

/**
 * Bbox rectangle for annotation / measurement overlays.
 * Fill + stroke in `color`, with optional `fillOpacity`.
 * Use `vectorEffect="non-scaling-stroke"` for zoom-invariant stroke.
 */
export function SvgBboxRect({
  x, y, w, h, color, fillOpacity = 0, strokeWidth, ...rest
}: SvgBboxRectProps) {
  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      fill={fillOpacity > 0 ? color : 'none'}
      fillOpacity={fillOpacity > 0 ? fillOpacity : undefined}
      stroke={color}
      strokeWidth={strokeWidth}
      {...rest}
    />
  )
}
