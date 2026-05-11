import styled, { css } from 'styled-components'
import { media } from '../../tokens/foundations/breakpoints'

type Placement = 'absolute' | 'inline'
type Size = 'sm' | 'md'

const placementCss = {
  absolute: css`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    min-height: 48px;
    padding: 8px 12px;
    background: rgba(0, 0, 0, 0.6);
    z-index: 10;
    ${media.md} {
      padding-bottom: calc(8px + env(safe-area-inset-bottom, 0px));
    }
  `,
  inline: css`
    min-height: 44px;
    padding: 8px 12px;
    background: rgba(0, 0, 0, 0.55);
    border-radius: 0 0 var(--ig-radius-md) var(--ig-radius-md);
    flex-shrink: 0;
  `,
}

export const ToolbarRoot = styled.div<{ $placement: Placement }>`
  display: flex;
  align-items: center;
  gap: 8px;
  ${(p) => placementCss[p.$placement]}
`

export const LeadingArea = styled.div`
  flex: 1 1 0%;
  min-width: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
`

export const TrailingArea = styled.div`
  margin-left: auto;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 4px;
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
  border-radius: 8px;
  background: ${(p) => (p.$active ? 'var(--ig-color-white-12)' : 'transparent')};
  color: ${(p) => (p.$danger ? 'var(--ig-color-text-danger)' : 'var(--ig-color-text-primary)')};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.14s ease, color 0.14s ease;
  &:hover:not(:disabled) {
    background: ${(p) => (p.$danger ? 'rgba(164, 44, 44, 0.22)' : 'var(--ig-color-white-08)')};
    color: ${(p) => (p.$danger ? 'var(--ig-color-text-danger-soft)' : 'var(--ig-color-text-primary)')};
  }
  &:focus-visible {
    outline: 2px solid var(--ig-color-accent-ring);
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

export const Separator = styled.span`
  flex-shrink: 0;
  width: 1px;
  height: 22px;
  background: var(--ig-color-white-12);
  margin: 0 2px;
`
