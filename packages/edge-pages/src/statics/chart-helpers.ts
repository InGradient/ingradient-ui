// Chart color constants — recharts takes color as JS props (CSS var() unsupported in SVG attribute).
// Hex 값은 src/tokens/core/chart-colors.ts 의 chartColors 를 single source of truth 로 한다.

import { chartColors } from '@ingradient/ui'

// Hex 색 — chartColors 참조 (DRY)
export const CHART_BLUE = chartColors.blue
export const CHART_PURPLE = chartColors.purple
export const CHART_GREEN = chartColors.green
export const CHART_CYAN = chartColors.cyan
export const CHART_NEUTRAL = chartColors.neutral
export const CHART_GOLD = chartColors.gold
export const CHART_VIOLET = chartColors.violet
export const CHART_TEAL = chartColors.teal
export const CHART_AMBER = chartColors.amber
export const CHART_TAG_CLASSIFICATION = chartColors.tagClassification
export const CHART_TAG_SEGMENTATION = chartColors.tagSegmentation
export const CHART_TICK_COLOR = chartColors.tickColor
export const CHART_LEGEND_FALLBACK = chartColors.tickColor // 동일 #9ca3af
export const CHART_SUCCESS = chartColors.green // 동일 #34d399

// CSS var() — 동적 theme-aware (theme provider 가 dark/light 변경)
export const CHART_LIME = 'var(--ig-color-success)'
export const CHART_WARNING = 'var(--ig-color-warning)'
export const CHART_DANGER = 'var(--ig-color-danger)'

// 비-color (font size — recharts tick rendering, numeric SVG attribute)
import { typographyScale } from '@ingradient/ui'
const SIZE_3XS_NUM = parseInt(typographyScale.size3xs, 10) // 10px
const SIZE_2XS_NUM = parseInt(typographyScale.size2xs, 10) // 11px
export const CHART_TICK_FONT_SIZE_SM = SIZE_3XS_NUM
export const CHART_TICK_FONT_SIZE_MD = SIZE_2XS_NUM
