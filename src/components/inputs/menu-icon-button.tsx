import styled from 'styled-components'
import { IconButton } from './icon-button'

/**
 * 행/카드의 케밥(⋮) 메뉴 트리거용 IconButton.
 * 메뉴가 열린 상태($active)면 accent 하이라이트, 평상시엔 muted 투명.
 * gallery-images-table / dataset-list-item / class-list-row 가 각자 재구현하던 것을 승격.
 */
export const MenuIconButton = styled(IconButton).attrs({
  variant: 'secondary' as const,
  size: 'sm' as const,
})<{ $active: boolean }>`
  && {
    border-color: ${(p) => (p.$active ? 'var(--ig-color-accent-border-strong)' : 'transparent')};
    background: ${(p) => (p.$active ? 'var(--ig-color-blue-tint-18)' : 'transparent')};
    color: ${(p) => (p.$active ? 'var(--ig-color-accent)' : 'var(--ig-color-text-muted)')};
  }

  &&:hover:not(:disabled) {
    border-color: ${(p) => (p.$active ? 'var(--ig-color-accent-border-strong)' : 'var(--ig-color-border-subtle)')};
    background: ${(p) =>
      p.$active ? 'var(--ig-color-accent-soft-surface-hover)' : 'var(--ig-color-surface-interactive-hover)'};
    color: var(--ig-color-text-primary);
  }
`
