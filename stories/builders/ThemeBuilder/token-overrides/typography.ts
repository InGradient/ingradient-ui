import type { TokenDef } from './shared'

const FONT_SIZE_KEYS = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'] as const

export const TYPOGRAPHY_DEFS: readonly TokenDef[] = [
  { argKey: 'fontSans', label: 'Font sans', subcategory: 'Font family', cssVar: '--ig-font-sans', appliesTo: ['--ig-font-sans'] },
  { argKey: 'fontMono', label: 'Font mono', subcategory: 'Font family', cssVar: '--ig-font-mono', appliesTo: ['--ig-font-mono'] },
  ...FONT_SIZE_KEYS.map((key) => ({
    argKey: `fontSize${key.charAt(0).toUpperCase()}${key.slice(1)}`,
    label: `Font ${key}`,
    subcategory: 'Font size',
    cssVar: `--ig-font-size-${key}`,
    appliesTo: [`--ig-font-size-${key}`],
  })),
]

export const typographyCategory = { defs: TYPOGRAPHY_DEFS, controlType: 'text' as const, category: 'Typography override' }
