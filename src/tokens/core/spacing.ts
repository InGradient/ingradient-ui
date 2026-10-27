export const spacingScale = {
  0: '0px',
  '1px': '1px',
  '2px': '2px',
  '3px': '3px',
  '-1px': '-1px',
  '-2px': '-2px',
  'hoverLiftY': '-1px',
  1: '4px',
  '1Plus': '5px',
  2: '6px',
  '2Plus': '7px',
  3: '8px',
  4: '10px',
  5: '12px',
  6: '14px',
  7: '16px',
  8: '18px',
  9: '20px',
  10: '22px',
  11: '24px',
  12: '28px',
  13: '32px',
} as const

/**
 * 4px spacing scale (DESIGN.draft.md §4). The key equals the pixel value, so `spacing4[12]`
 * is 12px and `--ig-spacing-12` is 12px. 2px is an optical step for hairline alignment only.
 * Replaces `spacingScale`, whose index names (space-3 = 8px) hide the value; the legacy
 * scale stays until every use has moved.
 */
export const spacing4 = {
  2: '2px',
  4: '4px',
  8: '8px',
  12: '12px',
  16: '16px',
  20: '20px',
  24: '24px',
  32: '32px',
  40: '40px',
  48: '48px',
} as const

/** Spacing by role (DESIGN.draft.md §4): components pick a role instead of a number. */
export const spacingRoles = {
  gapInline: spacing4[4],
  gapRelated: spacing4[8],
  insetCard: spacing4[16],
  gapSection: spacing4[24],
  insetPage: spacing4[24],
} as const
