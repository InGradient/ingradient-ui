// Icon dimensions for inline SVG inside styled-components.
// JSX <Icon size={N} /> calls (lucide-react etc) keep numeric props directly.
export const iconSizes = {
  xs: '12px',
  sm: '14px',
  md: '16px',
  lg: '18px',
  xl: '20px',
  '2xl': '22px',
} as const

// SVG `stroke-width` is a presentation attribute and does not accept CSS var().
// Use this TS constant when authoring inline SVG components.
export const svgStrokeWidths = {
  thin: 1.3,
  regular: 2,
  bold: 2.5,
} as const
