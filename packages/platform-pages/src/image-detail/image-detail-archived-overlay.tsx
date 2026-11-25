import { useId } from 'react'

const STRIPE_WIDTH = 2
const PATTERN_SIZE = 4
const PATTERN_ROTATION = 45
const OVERLAY_STYLE = {
  position: 'absolute' as const,
  inset: 0,
  width: '100%',
  height: '100%',
  zIndex: 'var(--ig-z-base)',
  pointerEvents: 'none' as const,
}
const DIM_STYLE = { fill: 'var(--ig-color-overlay-archived)' }
const STRIPE_STYLE = { stroke: 'var(--ig-color-overlay-mid)' }

/** Dim plus diagonal hatch drawn over an archived image, under the annotations. */
export function ImageDetailArchivedOverlay() {
  const patternId = `archived-hatch-${useId().replace(/:/g, '')}`
  return (
    <svg style={OVERLAY_STYLE} preserveAspectRatio="none" aria-hidden data-ig-slot="archived-overlay">
      <defs>
        <pattern
          id={patternId}
          width={PATTERN_SIZE}
          height={PATTERN_SIZE}
          patternUnits="userSpaceOnUse"
          patternTransform={`rotate(${PATTERN_ROTATION})`}
        >
          <line x1="0" y1="0" x2="0" y2={PATTERN_SIZE} strokeWidth={STRIPE_WIDTH} style={STRIPE_STYLE} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" style={DIM_STYLE} />
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  )
}
