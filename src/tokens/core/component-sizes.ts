/**
 * Component sizes (DESIGN.draft.md §6, D12). A component's own dimensions must not borrow
 * icon or spacing tokens: otherwise changing the icon or spacing scale resizes unrelated
 * components (the switch thumb took its size from an icon token and its travel from a
 * spacing token). Values sit on the 4px grid (DESIGN.draft.md §6).
 */
export const componentSizes = {
  checkbox: '16px',
  radio: '16px',
  radioDot: '8px',
  switchTrackHeight: '24px',
  switchThumb: '16px',
  switchTrackWidth: '40px',
  badgeSm: '16px',
  badgeMd: '20px',
  badgeLg: '24px',
  chip: '20px',
  kbdSm: '16px',
  kbd: '20px',
  overlayAction: '20px',
  inlineAction: '20px',
  toolbarButton: '20px',
  toolbarSeparator: '24px',
  dragHandle: '16px',
  skeletonLine: '16px',
  dotXs: '4px',
  dotSm: '8px',
  dot: '8px',
  dotLg: '12px',
  swatchSm: '12px',
  sliderTrack: '4px',
  sliderThumb: '16px',
  valueLabel: '40px',
  titlebarLogo: '20px',
  resizer: '4px',
  dropIndicator: '4px',
} as const

const kebab = (key: string) => key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)

/** `--ig-size-*` CSS variables for every component size. */
export const componentSizeVars: Record<string, string> = Object.fromEntries(
  Object.entries(componentSizes).map(([k, v]) => [`--ig-size-${kebab(k)}`, v]),
)
