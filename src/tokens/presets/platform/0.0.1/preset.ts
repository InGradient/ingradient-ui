import type { Preset } from '../../types'

/**
 * platform 0.0.1 — MVP UI snapshot.
 *
 * 상위 문서 § 4.2 의 platform/0.0.1 정의:
 *   - 초기 MVP UI
 *   - compact density
 *   - industrial-dark 기반
 *   - 기본 sidebar 구조
 */
export const platformV001: Preset = {
  id: 'platform-0.0.1',
  service: 'platform',
  version: '0.0.1',
  theme: 'industrial-dark',
  brand: 'default',
  density: 'compact',
  mode: 'dark',
}
