import styled from 'styled-components'

export type StatusDotTone = 'success' | 'warning' | 'danger' | 'neutral'

const TONE_COLOR: Record<StatusDotTone, string> = {
  success: 'var(--ig-color-success)',
  warning: 'var(--ig-color-warning)',
  danger: 'var(--ig-color-danger)',
  neutral: 'var(--ig-color-text-muted)',
}

/**
 * 색 상태 점(dot). 연결/동기화 등 상태를 색으로만 표시하는 작은 인디케이터.
 * 도메인 무관 — caller 가 자기 상태를 `$tone` 으로 매핑한다 (ui-refactoring-rule §3).
 */
export const StatusDot = styled.button<{ $tone: StatusDotTone }>`
  width: var(--ig-space-5);
  height: var(--ig-space-5);
  border-radius: var(--ig-radius-pill);
  border: none;
  padding: 0;
  background: ${(p) => TONE_COLOR[p.$tone]};
  box-shadow: 0 0 0 2px var(--ig-color-border-subtle);
  cursor: default;
`
