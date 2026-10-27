export const radiusScale = {
  '2xs': '4px',
  xxs: '8px',
  xs: '8px',
  sm: '8px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '12px',
  '4xl': '16px',
  pill: '999px',
} as const

/**
 * Surface radius by nesting depth. A rounded surface inside another rounded surface
 * must be less rounded than its parent, so the value is chosen by depth, not by role.
 * Floating surfaces (modal, popover, menu) restart at depth 1. Used only when a
 * `SurfaceDepthProvider` is present; otherwise surfaces keep their legacy tokens.
 */
export const depthRadius = {
  1: '16px',
  2: '12px',
  3: '8px',
} as const
