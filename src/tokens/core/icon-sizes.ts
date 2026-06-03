// Icon dimensions for inline SVG inside styled-components.
export const iconSizes = {
  '2xs': '11px',
  xs: '12px',
  xsPlus: '13px',
  sm: '14px',
  smPlus: '15px',
  md: '16px',
  lg: '18px',
  xl: '20px',
  '2xl': '22px',
  '3xl': '24px',
} as const

// Numeric variant — lucide-react `<Icon size={N} />` / SVG width|height attribute / JSX size prop.
export const iconSizeNumbers = {
  '2xs': 11,
  xs: 12,
  xsPlus: 13,
  sm: 14,
  smPlus: 15,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 22,
  '3xl': 24,
} as const

// SVG `stroke-width` is a presentation attribute and does not accept CSS var().
// Use this TS constant when authoring inline SVG components.
export const svgStrokeWidths = {
  thin: 1.3,
  regular: 2,
  bold: 2.5,
} as const
