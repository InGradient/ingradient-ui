import type { Preset } from '../../types'

/**
 * edge 0.0.1 — Electron 캡처/라벨링 데스크톱 앱.
 *
 * 인벤토리 결과 (docs-legacy/plan/storybook-restructure-phase-6-inventory.md § 1):
 *   - Electron 앱, dark 배경, compact 밀도
 *   - @ingradient/ui 적극 사용 중
 */
export const edgeV001: Preset = {
  id: 'edge-0.0.1',
  service: 'edge',
  version: '0.0.1',
  theme: 'industrial-dark',
  brand: 'default',
  density: 'compact',
  mode: 'dark',
}
