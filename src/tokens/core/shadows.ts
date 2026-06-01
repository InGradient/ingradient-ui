// Dark mode shadows — heavy drop shadow over dark surface
export const shadowScale = {
  panel: '0 20px 60px rgba(0, 0, 0, 0.25)',
  floating: '0 30px 80px var(--ig-color-overlay-dim)',
  popover: '0 24px 60px rgba(0, 0, 0, 0.34), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
  menu: '0 20px 40px rgba(0, 0, 0, 0.35)',
  hoverLift: '0 12px 24px rgba(41, 98, 217, 0.24)',
  focusRing: '0 0 0 3px var(--ig-color-blue-tint-16)',
  drawerLift: '0 16px 48px rgba(4, 8, 14, 0.72)',
  dangerHoverLift: '0 10px 28px rgba(127, 29, 29, 0.32)',
  controlElevated: 'inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 10px 24px rgba(0, 0, 0, 0.12)',
} as const

// Light mode shadows — much softer drop shadow (alpha cut by ~50%) so cards
// don't appear sunken on white bg. Inset highlight removed (it was a dark-mode
// artifact).
export const shadowScaleLight = {
  panel: '0 16px 40px rgba(15, 23, 42, 0.08)',
  floating: '0 24px 60px rgba(15, 23, 42, 0.14)',
  popover: '0 20px 48px rgba(15, 23, 42, 0.12)',
  menu: '0 16px 32px rgba(15, 23, 42, 0.10)',
  hoverLift: '0 12px 24px rgba(58, 115, 230, 0.16)',
  focusRing: '0 0 0 3px rgba(58, 115, 230, 0.20)',
  drawerLift: '0 16px 48px rgba(15, 23, 42, 0.32)',
  dangerHoverLift: '0 10px 28px rgba(185, 28, 28, 0.20)',
  controlElevated: '0 10px 24px rgba(15, 23, 42, 0.08)',
} as const

const _shadowShapeCheck: Record<keyof typeof shadowScale, string> = shadowScaleLight
