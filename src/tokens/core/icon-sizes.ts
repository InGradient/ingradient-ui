// Icon dimensions for inline SVG inside styled-components.
export const iconSizes = {
  sub: '8px',
  '2xs': '12px',
  xs: '12px',
  xsPlus: '12px',
  sm: '16px',
  smPlus: '16px',
  md: '16px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '24px',
} as const

// Numeric variant — lucide-react `<Icon size={N} />` / SVG width|height attribute / JSX size prop.
export const iconSizeNumbers = {
  '2xs': 12,
  xs: 12,
  xsPlus: 12,
  sm: 16,
  smPlus: 16,
  md: 16,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 24,
} as const

// SVG `stroke-width` is a presentation attribute and does not accept CSS var().
// Use this TS constant when authoring inline SVG components.
export const svgStrokeWidths = {
  thin: 1.3,
  mid: 1.8,
  regular: 2,
  midBold: 2.4,
  bold: 2.5,
} as const
