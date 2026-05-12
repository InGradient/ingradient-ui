/**
 * Storybook scenario helpers — § 16 (Fixture / Scenario Selector).
 *
 * 모든 page story 는 `scenario` arg 를 받아 fixture 데이터를 선택한다.
 * 공통 scenario + 도메인 scenario 를 union 으로 확장한다.
 */

import type { InputType } from 'storybook/internal/types'

/**
 * § 16.2 공통 scenario. 모든 page 가 지원해야 하는 기본 상태들.
 */
export const commonScenarios = [
  'default',
  'empty',
  'loading',
  'error',
  'permission-denied',
  'long-text',
  'many-items',
] as const

export type CommonScenario = (typeof commonScenarios)[number]

/**
 * scenario control 의 argType 생성. 추가 도메인 scenario 를 받을 수 있다.
 *
 * 사용:
 * ```ts
 * argTypes: {
 *   scenario: scenarioArgType(['huge-dataset', 'syncing', 'multi-selection']),
 * },
 * args: { scenario: 'default' },
 * ```
 */
export function scenarioArgType<Extra extends string>(extra: readonly Extra[] = []): InputType {
  const options = [...commonScenarios, ...extra]
  return {
    name: 'Scenario',
    description: 'fixture/scenario selector — 페이지 상태 시뮬레이션 (§ 16)',
    control: 'select',
    options,
    table: { category: 'Fixture' },
  }
}
