/**
 * Component sizes (DESIGN.draft.md §6, D12). A component's own dimensions must not borrow
 * icon or spacing tokens: otherwise changing the icon or spacing scale resizes unrelated
 * components (the switch thumb took its size from an icon token and its travel from a
 * spacing token). Values match what each component rendered before the split; they move
 * onto the 4px grid separately.
 */
export const componentSizes = {
  checkbox: '18px',
  radio: '18px',
  radioDot: '8px',
  switchTrackHeight: '24px',
  switchThumb: '18px',
  switchThumbTravel: '18px',
  badgeSm: '18px',
  badgeMd: '20px',
  badgeLg: '22px',
  chip: '20px',
  kbdSm: '16px',
  kbd: '20px',
  overlayAction: '18px',
  inlineAction: '20px',
  toolbarButton: '18px',
  toolbarSeparator: '22px',
  dragHandle: '16px',
  skeletonLine: '16px',
  dotXs: '5px',
  dotSm: '6px',
  dot: '8px',
  dotLg: '12px',
  swatchSm: '10px',
  sliderTrack: '6px',
  sliderThumb: '16px',
  valueLabel: '38px',
  titlebarLogo: '18px',
  resizer: '4px',
  dropIndicator: '4px',
} as const

const kebab = (key: string) => key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)

/** `--ig-size-*` CSS variables for every component size. */
export const componentSizeVars: Record<string, string> = Object.fromEntries(
  Object.entries(componentSizes).map(([k, v]) => [`--ig-size-${kebab(k)}`, v]),
)
