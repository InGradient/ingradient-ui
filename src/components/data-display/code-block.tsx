import styled from 'styled-components'

/**
 * Monospace 코드/식별자 표시 박스. fingerprint, 파일 경로, 토큰 등 사용자가
 * 선택-복사하는 읽기 전용 텍스트를 담는다. `user-select: all` 로 클릭 시 전체 선택.
 *
 * pages 가 각자 mono 박스를 재구현하지 않도록 components 계층에 제공 (ui-refactoring-rule §0).
 */
export const CodeBlock = styled.div`
  font-family: var(--ig-font-mono);
  font-size: var(--ig-font-size-xs);
  padding: var(--ig-space-4);
  background: var(--ig-color-surface-raised);
  border: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  border-radius: var(--ig-radius-xs);
  color: var(--ig-color-text-primary);
  user-select: all;
  word-break: break-all;
`
