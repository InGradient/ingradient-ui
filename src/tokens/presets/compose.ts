import { brandRegistry } from '../brands'
import { densityRegistry } from '../density'
import { themeRegistry } from '../themes'
import type { ComposedPreset, Preset } from './types'

/**
 * Preset 을 런타임 적용 가능한 형태로 합성.
 *
 * 합성 순서 (뒤가 앞을 override):
 *   theme → brand → density → preset.overrides
 *
 * mode (light/dark) 는 ThemeProvider 가 별도로 처리하므로 cssVariables 에 포함 안 함.
 */
export function composePreset(preset: Preset): ComposedPreset {
  const themeVars = themeRegistry[preset.theme]?.cssVars ?? {}
  const brandVars = brandRegistry[preset.brand]?.cssVars ?? {}
  const densityVars = densityRegistry[preset.density]?.cssVars ?? {}
  const overrideVars = preset.overrides ?? {}

  const cssVariables: Record<string, string> = {
    ...themeVars,
    ...brandVars,
    ...densityVars,
    ...overrideVars,
  }

  return {
    mode: preset.mode,
    attributes: {
      'data-ig-preset': preset.id,
      'data-ig-service': preset.service,
      'data-ig-version': preset.version,
      'data-ig-theme': preset.theme,
      'data-ig-brand': preset.brand,
      'data-ig-density': preset.density,
      'data-ig-mode': preset.mode,
    },
    cssVariables,
    source: preset,
  }
}
