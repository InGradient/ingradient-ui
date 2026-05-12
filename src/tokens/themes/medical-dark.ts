import type { TokenCategory } from '../density/types'

/**
 * medical-dark — 의료 영상 라벨링 분위기. canvas 를 약간 더 어둡게 (영상 contrast 우선).
 */
export const medicalDarkTheme: TokenCategory = {
  cssVars: {
    '--ig-color-bg-canvas': '#000000',
    '--ig-color-surface-panel': '#141722',
  },
}
