import styled, { css } from 'styled-components'

type Placement = 'bottom' | 'top' | 'left' | 'right'
type Size = 'sm' | 'md'

const orientationCss = {
  bottom: css`
    flex-direction: row;
    border-radius: 0 0 var(--ig-radius-md) var(--ig-radius-md);
  `,
  top: css`
    flex-direction: row;
    border-radius: var(--ig-radius-md) var(--ig-radius-md) 0 0;
  `,
  left: css`
    flex-direction: column;
    border-radius: var(--ig-radius-md) 0 0 var(--ig-radius-md);
  `,
  right: css`
    flex-direction: column;
    border-radius: 0 var(--ig-radius-md) var(--ig-radius-md) 0;
  `,
}

/** Toolbar root — sibling 요소로 canvas 와 동일 flex 안에 배치되어 overlap 없음. */
export const ToolbarRoot = styled.div<{ $placement: Placement }>`
  display: flex;
  align-items: center;
  gap: var(--ig-space-3);
  padding: var(--ig-space-3) var(--ig-space-4);
  background: var(--ig-color-overlay-strong);
  flex-shrink: 0;
  ${(p) => orientationCss[p.$placement]}
`

export const TrailingArea = styled.div<{ $placement: Placement }>`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: var(--ig-space-1);
  ${(p) =>
    p.$placement === 'bottom' || p.$placement === 'top'
      ? css`
          margin-left: auto;
          flex-direction: row;
        `
      : css`
          margin-top: auto;
          flex-direction: column;
        `}
`

const sizeCss = {
  sm: css`
    width: 36px;
    height: 36px;
  `,
  md: css`
    width: 40px;
    height: 40px;
  `,
}

export const ToolbarButton = styled.button<{ $active: boolean; $danger: boolean; $size: Size }>`
  flex-shrink: 0;
  ${(p) => sizeCss[p.$size]}
  border: none;
  border-radius: var(--ig-radius-xxs);
  background: ${(p) => (p.$active ? 'var(--ig-color-white-12)' : 'transparent')};
  color: ${(p) => (p.$danger ? 'var(--ig-color-text-danger)' : 'var(--ig-color-text-primary)')};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.14s ease, color 0.14s ease;
  &:hover:not(:disabled) {
    background: ${(p) => (p.$danger ? 'var(--ig-color-danger-soft-surface)' : 'var(--ig-color-white-08)')};
    color: ${(p) => (p.$danger ? 'var(--ig-color-text-danger-soft)' : 'var(--ig-color-text-primary)')};
  }
  &:focus-visible {
    outline: var(--ig-border-2px) solid var(--ig-color-accent-ring);
    outline-offset: -2px;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  svg {
    width: 18px;
    height: 18px;
  }
`

export const Separator = styled.span<{ $placement: Placement }>`
  flex-shrink: 0;
  background: var(--ig-color-white-12);
  ${(p) =>
    p.$placement === 'bottom' || p.$placement === 'top'
      ? css`
          width: 1px;
          height: 22px;
          margin: 0 2px;
        `
      : css`
          width: 22px;
          height: 1px;
          margin: var(--ig-space-2px) 0;
        `}
`
