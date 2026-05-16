import type { TokenDef } from './shared'

export const SHADOW_DEFS: readonly TokenDef[] = [
  { argKey: 'shadowPanel', label: 'Panel shadow', subcategory: 'Shadow', cssVar: '--ig-shadow-panel', appliesTo: ['--ig-shadow-panel'] },
  { argKey: 'shadowFloating', label: 'Floating shadow', subcategory: 'Shadow', cssVar: '--ig-shadow-floating', appliesTo: ['--ig-shadow-floating'] },
  { argKey: 'shadowPopover', label: 'Popover shadow', subcategory: 'Shadow', cssVar: '--ig-shadow-popover', appliesTo: ['--ig-shadow-popover'] },
  { argKey: 'shadowHoverLift', label: 'Hover lift shadow', subcategory: 'Shadow', cssVar: '--ig-shadow-hover-lift', appliesTo: ['--ig-shadow-hover-lift'] },
  { argKey: 'shadowFocusRing', label: 'Focus ring shadow', subcategory: 'Shadow', cssVar: '--ig-shadow-focus-ring', appliesTo: ['--ig-shadow-focus-ring'] },
]

export const shadowCategory = { defs: SHADOW_DEFS, controlType: 'text' as const, category: 'Shadow override' }
