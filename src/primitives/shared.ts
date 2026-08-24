export type Space = number | string

/**
 * Token-based spacing scale index (0–13).
 * Use with `tokenSpace()` to produce `var(--ig-space-N)` references.
 * Keep raw px values for `space()` — the two are intentionally distinct.
 */
export type TokenSpace = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13

/**
 * Converts a numeric or string spacing value to CSS length.
 * Numbers are treated as raw pixels: `space(3)` → `"3px"`.
 * This preserves the existing raw-px contract used by Storybook fixtures.
 */
export function space(value?: Space): string | undefined {
  if (value == null) return undefined
  return typeof value === 'number' ? `${value}px` : value
}

/**
 * Maps a spacing scale index to its CSS custom property token.
 * `tokenSpace(3)` → `"var(--ig-space-3)"`.
 * Use this in production layout primitives instead of raw numeric `space()`.
 */
export function tokenSpace(value?: TokenSpace): string | undefined {
  if (value == null) return undefined
  return `var(--ig-space-${value})`
}

export function numberOrString(value?: number | string): string | undefined {
  if (value == null) return undefined
  return typeof value === 'number' ? `${value}px` : value
}
