import type { TokenDef } from './shared'

export const MOTION_DEFS: readonly TokenDef[] = [
  { argKey: 'motionFast', label: 'Motion fast', subcategory: 'Motion', cssVar: '--ig-motion-fast', appliesTo: ['--ig-motion-fast'] },
  { argKey: 'motionNormal', label: 'Motion normal', subcategory: 'Motion', cssVar: '--ig-motion-normal', appliesTo: ['--ig-motion-normal'] },
]

export const motionCategory = { defs: MOTION_DEFS, controlType: 'text' as const, category: 'Motion override' }
