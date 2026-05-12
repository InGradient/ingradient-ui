import type { TokenCategory } from './types'

/**
 * compact — tight controls, reduced control heights.
 * platform / edge 의 기본 밀도.
 */
export const compactDensity: TokenCategory = {
  cssVars: {
    '--ig-control-height-sm': '28px',
    '--ig-control-height-md': '32px',
    '--ig-control-height-lg': '40px',
  },
}
