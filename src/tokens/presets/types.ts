import type { ThemeMode } from '../modes'

/**
 * Service identifier — 어느 제품의 preset 인지.
 */
export type PresetService = 'platform' | 'edge' | 'medical'

/**
 * 분위기 단위 토큰 set 의 id. Phase 4 이후 themes/ 에 실제 값 채워질 때 확장.
 */
export type ThemeId = 'industrial-dark' | 'industrial-light' | 'medical' | 'light' | 'dark'

/**
 * 고객사 / 브랜드 id. Phase 4 이후 brands/ 채워질 때 확장.
 */
export type BrandId = 'default' | 'finemtech' | 'samsung'

/**
 * 정보 밀도 id. Phase 4 이후 density/ 채워질 때 실제 토큰 적용.
 */
export type DensityId = 'comfortable' | 'compact' | 'ultra-dense'

/**
 * 토큰 부분 override — 특정 preset 만의 미세 조정용.
 * 현재는 빈 type, 사용 시 `Partial<IngradientTheme>` 또는 CSS 변수 맵으로 확장.
 */
export type TokenOverrides = Record<string, string>

/**
 * 하나의 완성된 제품 디자인 snapshot. Theme + Brand + Density + Mode 조합 + optional override.
 *
 * 상위 문서: docs/storybook_architecture_restructure.md § 4
 */
export interface Preset {
  /** unique id (e.g. 'platform-0.0.1') */
  id: string
  service: PresetService
  /** semver 또는 임의 버전 문자열 */
  version: string
  theme: ThemeId
  brand: BrandId
  density: DensityId
  mode: ThemeMode
  /** 추가 토큰 override (optional) */
  overrides?: TokenOverrides
}

/**
 * composePreset() 결과 — 런타임에 적용할 값들.
 */
export interface ComposedPreset {
  /** 현재 ThemeProvider 가 받는 mode (Phase 4 에서는 preset.mode 직통) */
  mode: ThemeMode
  /** data-ig-* attr 로 DOM 에 표현 — CSS 선택자로 density/brand 별 override 가능 */
  attributes: Record<string, string>
  /** 적용된 추가 CSS 변수 override (preset.overrides + 카테고리 합성) */
  cssVariables: Record<string, string>
  /** preset 원본 (메타데이터 접근용) */
  source: Preset
}
