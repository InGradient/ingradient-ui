import type { TokenDef } from './shared'

export const CONTROL_SIZE_DEFS: readonly TokenDef[] = [
  { argKey: 'controlHeightSm', label: 'Control height sm', subcategory: 'Control size', cssVar: '--ig-control-height-sm', appliesTo: ['--ig-control-height-sm'] },
  { argKey: 'controlHeightMd', label: 'Control height md', subcategory: 'Control size', cssVar: '--ig-control-height-md', appliesTo: ['--ig-control-height-md'] },
  { argKey: 'controlHeightLg', label: 'Control height lg', subcategory: 'Control size', cssVar: '--ig-control-height-lg', appliesTo: ['--ig-control-height-lg'] },
]

export const controlSizeCategory = { defs: CONTROL_SIZE_DEFS, controlType: 'text' as const, category: 'Control size override' }
