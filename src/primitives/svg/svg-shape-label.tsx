import React from 'react'

export interface SvgShapeLabelProps {
  /** Background rect width (px in label-local coord). */
  width: number
  /** Background rect height (px in label-local coord). */
  height: number
  /** Background fill color. */
  color: string
  /** Background opacity. */
  opacity?: number
  /** Background corner radius. */
  radius?: number
  /** Label text. */
  text: React.ReactNode
  /** Text horizontal padding. */
  padX?: number
  /** Text vertical padding (baseline offset). */
  padY?: number
  /** Text font size. */
  fontSize: number
  /** Text fill (default white). */
  textColor?: string
  /** Wrapping <g> transform (translate/scale) for placement + zoom-invariant scaling. */
  transform?: string
}

/**
 * Label tag (background rect + text) for SVG annotations.
 * Wrapping <g transform> controls placement + zoom-invariant scaling.
 */
export function SvgShapeLabel({
  width, height, color, opacity = 0.85, radius = 3,
  text, padX = 6, padY = 3, fontSize, textColor = '#fff', transform,
}: SvgShapeLabelProps) {
  return (
    <g transform={transform}>
      <rect
        x={0}
        y={-height}
        width={width}
        height={height}
        rx={radius}
        fill={color}
        opacity={opacity}
      />
      <text
        x={padX}
        y={-padY}
        fill={textColor}
        fontSize={fontSize}
        fontWeight={600}
        fontFamily="sans-serif"
        style={{ pointerEvents: 'none' }}
      >
        {text}
      </text>
    </g>
  )
}
