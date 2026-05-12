import type { ComposedPreset, Preset } from './types'

/**
 * Preset 을 런타임 적용 가능한 형태로 합성.
 *
 * Phase 4 현재: themes/brands/density 가 placeholder 라 실제 토큰 합성은 최소.
 * - mode → 그대로 전달
 * - data-ig-* attribute → preset 의 service/version/theme/brand/density/mode 전체를 DOM 에 노출
 * - cssVariables → preset.overrides 만 우선 (Phase 4+ 에서 카테고리별 합성 추가)
 *
 * Phase 4+ 확장 시:
 *   1. themes/{themeId}.ts 에서 base 토큰 가져오기
 *   2. brands/{brandId}.ts 의 override 적용
 *   3. density/{densityId}.ts 의 control-height/spacing override 적용
 *   4. mode 별 color set 적용
 *   5. preset.overrides 최종 override
 */
export function composePreset(preset: Preset): ComposedPreset {
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
    cssVariables: { ...preset.overrides },
    source: preset,
  }
}
