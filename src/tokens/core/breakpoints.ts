export const breakpoints = {
  sm: 640,
  smPlus: 720,
  md: 768,
  mdWide: 860,
  lg: 1024,
  xl: 1280,
} as const

export const media = {
  sm: `@media (max-width: ${breakpoints.sm}px)`,
  smPlus: `@media (max-width: ${breakpoints.smPlus}px)`,
  md: `@media (max-width: ${breakpoints.md}px)`,
  mdWide: `@media (max-width: ${breakpoints.mdWide}px)`,
  lg: `@media (max-width: ${breakpoints.lg}px)`,
  xl: `@media (max-width: ${breakpoints.xl}px)`,
} as const
