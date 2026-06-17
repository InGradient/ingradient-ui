import type { Preset } from '../../types'

/**
 * medical 0.0.1 — 의료 영상 라벨링 웹 앱 (medilabel).
 *
 * 인벤토리 결과 (docs-legacy/plan/storybook-restructure-phase-6-inventory.md § 2):
 *   - dark mode (DICOM 영상 관찰 — 눈 피로 최소화)
 *   - comfortable density (웹, 읽기성)
 *   - medilabel 은 @ingradient/ui 미사용 → 시각 재현 mockup
 */
export const medicalV001: Preset = {
  id: 'medical-0.0.1',
  service: 'medical',
  version: '0.0.1',
  theme: 'medical-dark',
  brand: 'default',
  density: 'comfortable',
  mode: 'dark',
}
