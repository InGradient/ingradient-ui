import { controlSizes } from '../core/control-sizes'
import type { TokenCategory } from './types'

/**
 * comfortable — 현재 default control sizes 유지. medical (의료 라벨링) 의 기본 밀도.
 */
export const comfortableDensity: TokenCategory = {
  // Explicit defaults also reset a compact preset when the toolbar selects comfortable.
  cssVars: {
    '--ig-control-height-sm': controlSizes.sm,
    '--ig-control-height-md': controlSizes.md,
    '--ig-control-height-lg': controlSizes.lg,
  },
}
