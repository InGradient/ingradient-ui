import type { TokenDef } from './shared'

const RADIUS_KEYS = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', 'pill'] as const

export const RADIUS_DEFS: readonly TokenDef[] = RADIUS_KEYS.map((key) => ({
  argKey: `radius${key.charAt(0).toUpperCase()}${key.slice(1)}`,
  label: `Radius ${key}`,
  subcategory: 'Radius',
  cssVar: `--ig-radius-${key}`,
  appliesTo: [`--ig-radius-${key}`],
}))

export const radiusCategory = { defs: RADIUS_DEFS, controlType: 'text' as const, category: 'Radius override' }
