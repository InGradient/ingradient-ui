import type { TokenDef } from './shared'

const ALPHA_BG_SOFT = 0.12
const ALPHA_BG_STRONG = 0.18
const ALPHA_BORDER = 0.28
const ALPHA_RING = 0.55

export const COLOR_DEFS: readonly TokenDef[] = [
  {
    argKey: 'accentColor', label: 'Accent', subcategory: 'Brand & Semantic',
    cssVar: '--ig-color-accent',
    appliesTo: [
      '--ig-color-accent', '--ig-color-accent-strong', '--ig-color-accent-soft',
      { var: '--ig-color-accent-ring', alpha: ALPHA_RING },
    ],
  },
  {
    argKey: 'dangerColor', label: 'Danger', subcategory: 'Brand & Semantic',
    cssVar: '--ig-color-danger',
    appliesTo: [
      '--ig-color-danger', '--ig-color-alert-danger-text',
      { var: '--ig-color-alert-danger-bg', alpha: ALPHA_BG_SOFT },
      { var: '--ig-color-alert-danger-border', alpha: ALPHA_BORDER },
      { var: '--ig-color-badge-danger', alpha: ALPHA_BG_STRONG },
    ],
  },
  {
    argKey: 'successColor', label: 'Success', subcategory: 'Brand & Semantic',
    cssVar: '--ig-color-success',
    appliesTo: [
      '--ig-color-success', '--ig-color-alert-success-text',
      { var: '--ig-color-alert-success-bg', alpha: ALPHA_BG_SOFT },
      { var: '--ig-color-alert-success-border', alpha: ALPHA_BORDER },
      { var: '--ig-color-badge-success', alpha: ALPHA_BG_STRONG },
    ],
  },
  {
    argKey: 'warningColor', label: 'Warning', subcategory: 'Brand & Semantic',
    cssVar: '--ig-color-warning',
    appliesTo: [
      '--ig-color-warning', '--ig-color-alert-warning-text',
      { var: '--ig-color-alert-warning-bg', alpha: ALPHA_BG_SOFT },
      { var: '--ig-color-alert-warning-border', alpha: ALPHA_BORDER },
      { var: '--ig-color-badge-warning', alpha: ALPHA_BG_STRONG },
    ],
  },
  {
    argKey: 'infoColor', label: 'Info', subcategory: 'Brand & Semantic',
    cssVar: '--ig-color-alert-info-text',
    appliesTo: [
      '--ig-color-alert-info-text',
      { var: '--ig-color-alert-info-bg', alpha: ALPHA_BG_SOFT },
      { var: '--ig-color-alert-info-border', alpha: ALPHA_BORDER },
    ],
  },
  { argKey: 'textPrimary', label: 'Text primary', subcategory: 'Text', cssVar: '--ig-color-text-primary', appliesTo: ['--ig-color-text-primary'] },
  { argKey: 'textSecondary', label: 'Text secondary', subcategory: 'Text', cssVar: '--ig-color-text-secondary', appliesTo: ['--ig-color-text-secondary'] },
  { argKey: 'textMuted', label: 'Text muted', subcategory: 'Text', cssVar: '--ig-color-text-muted', appliesTo: ['--ig-color-text-muted'] },
  { argKey: 'bgCanvas', label: 'Canvas bg', subcategory: 'Surface', cssVar: '--ig-color-bg-canvas', appliesTo: ['--ig-color-bg-canvas'] },
  { argKey: 'surfacePanel', label: 'Panel surface', subcategory: 'Surface', cssVar: '--ig-color-surface-panel', appliesTo: ['--ig-color-surface-panel'] },
  { argKey: 'surfaceMuted', label: 'Muted surface', subcategory: 'Surface', cssVar: '--ig-color-surface-muted', appliesTo: ['--ig-color-surface-muted'] },
  { argKey: 'borderStrong', label: 'Border strong', subcategory: 'Border', cssVar: '--ig-color-border-strong', appliesTo: ['--ig-color-border-strong'] },
  { argKey: 'borderSubtle', label: 'Border subtle', subcategory: 'Border', cssVar: '--ig-color-border-subtle', appliesTo: ['--ig-color-border-subtle'] },
]

export const colorCategory = { defs: COLOR_DEFS, controlType: 'color' as const, category: 'Color override' }
