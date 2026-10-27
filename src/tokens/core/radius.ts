export const radiusScale = {
  '2xs': '6px',
  xxs: '8px',
  xs: '10px',
  sm: '12px',
  md: '14px',
  lg: '16px',
  xl: '18px',
  '2xl': '20px',
  '4xl': '24px',
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
