// Rotation keyframe values (spinner animation full cycle).
export const rotations = {
  zero: '0deg',
  half: '180deg',
  full: '360deg',
} as const

// Linear-gradient angle (CSS gradient direction).
export const gradientAngles = {
  horizontal: '90deg',
  diagonal: '135deg',
} as const

export const motionScale = {
  fastest: '0.12s',
  swift: '0.15s',
  fast: '0.16s ease',
  fastEase: '0.16s ease',
  normal: '0.24s ease',
  normalEase: '0.2s ease',
  mobileNav: '0.28s cubic-bezier(0.4, 0, 0.2, 1)',
  spinner: '0.7s',
  spinnerFast: '0.75s',
  spinnerSlow: '0.8s',
  shimmer: '1s',
  progressBar: '1.2s',
  skeleton: '1.3s',
  syncSpin: '1.5s',
} as const
