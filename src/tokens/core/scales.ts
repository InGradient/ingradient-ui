// Micro transform scale values for hover/press/drag states.
export const transformScale = {
  press: 0.95,
  drag: 0.985,
  hoverLift: 1.04,
} as const

// Common image / video aspect ratios.
export const aspectRatios = {
  square: '1 / 1',
  landscape: '4 / 3',
  wide: '16 / 9',
  ultraWide: '21 / 9',
  portrait: '3 / 4',
} as const
