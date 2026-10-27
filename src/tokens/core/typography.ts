export const typographyScale = {
  fontSans: '"IBM Plex Sans", "IBM Plex Sans KR", "Segoe UI", sans-serif',
  fontMono: '"IBM Plex Mono", "SFMono-Regular", Consolas, monospace',
  size3xs: '11px',
  size2xs: '11px',
  sizeXs: '12px',
  sizeSm: '13px',
  sizeMd: '14px',
  sizeLg: '16px',
  sizeXl: '16px',
  size2xl: '20px',
  size3xl: '20px',
  size3xlPlus: '22px',
  size4xl: '24px',
  size5xl: '24px',
  weightRegular: 400,
  weightMedium: 500,
  weightSemibold: 600,
  weightBold: 700,
  weightBlack: 800,
  letterSpacingHeading: '-0.02em',
  letterSpacingMicro: '0.01em',
  letterSpacingTight: '0.03em',
  letterSpacingNormal: '0.04em',
  letterSpacingWide: '0.05em',
  letterSpacingWider: '0.06em',
  letterSpacingWidest: '0.08em',
  lineHeightNone: 1,
  lineHeightTight: 1.35,
  lineHeightSnug: 1.4,
  lineHeightBase: 1.45,
  lineHeightRelaxed: 1.5,
  lineHeightRelaxedPlus: 1.55,
  lineHeightLoose: 1.6,
  // Text width clamp (em — text-relative, ellipsis chip label 용도)
  textClampNarrow: '5.5em',
  textClampMid: '8em',
  // SVG tspan dy (multi-line label baseline offset)
  svgTspanDyPrimary: '-0.2em',
  svgTspanDySecondary: '1.2em',
} as const

/** Line height paired with each font-size token, in px on the 4px grid (DESIGN.draft.md §3, D11). */
export const fontLeading = {
  '3xs': '16px',
  '2xs': '16px',
  'xs': '16px',
  'sm': '20px',
  'md': '20px',
  'lg': '24px',
  'xl': '24px',
  '2xl': '28px',
  '3xl': '28px',
  '3xl-plus': '28px',
  '4xl': '32px',
  '5xl': '32px'
} as const

/**
 * Text roles (DESIGN.md §3). Components pick a role instead of a size; each role pairs a size
 * with a px line height on the 4px grid. Values equal the current size tiers, so moving from
 * `--ig-font-size-*` to `--ig-text-*` changes no pixels.
 */
export const textRoles = {
  micro: { size: typographyScale.size2xs, leading: fontLeading['2xs'] },
  caption: { size: typographyScale.sizeXs, leading: fontLeading.xs },
  'body-sm': { size: typographyScale.sizeSm, leading: fontLeading.sm },
  body: { size: typographyScale.sizeMd, leading: fontLeading.md },
  'title-sm': { size: typographyScale.sizeLg, leading: fontLeading.lg },
  title: { size: typographyScale.size2xl, leading: fontLeading['2xl'] },
  display: { size: typographyScale.size4xl, leading: fontLeading['4xl'] },
} as const

export type TextRole = keyof typeof textRoles
