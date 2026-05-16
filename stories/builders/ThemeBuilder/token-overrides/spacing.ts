import type { TokenDef } from './shared'

export const SPACING_DEFS: readonly TokenDef[] = Array.from({ length: 14 }, (_, i) => ({
  argKey: `space${i}`,
  label: `Space ${i}`,
  subcategory: 'Spacing',
  cssVar: `--ig-space-${i}`,
  appliesTo: [`--ig-space-${i}`],
}))

export const spacingCategory = { defs: SPACING_DEFS, controlType: 'text' as const, category: 'Spacing override' }
