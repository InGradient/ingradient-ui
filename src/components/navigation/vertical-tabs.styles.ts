import styled from 'styled-components'

export type VerticalTabsRadius = 'xs' | 'sm' | 'md' | 'lg'

export const verticalTabsRadiusStyles: Record<VerticalTabsRadius, { root: string; item: string }> = {
  xs: { root: 'var(--ig-radius-sm)', item: 'var(--ig-radius-xs)' },
  sm: { root: 'var(--ig-radius-md)', item: 'var(--ig-radius-sm)' },
  md: { root: 'var(--ig-radius-lg)', item: 'var(--ig-radius-md)' },
  lg: { root: 'var(--ig-radius-xl)', item: 'var(--ig-radius-lg)' },
}

export const Root = styled.div<{ $radius: VerticalTabsRadius }>`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-1);
  width: 100%;
  padding: var(--ig-space-2);
  border-radius: ${(p) => verticalTabsRadiusStyles[p.$radius].root};
`

export const Highlight = styled.div<{ $top: number; $height: number; $visible: boolean; $radius: VerticalTabsRadius }>`
  position: absolute;
  left: var(--ig-space-2);
  right: var(--ig-space-2);
  top: ${(p) => `${p.$top}px`};
  height: ${(p) => `${p.$height}px`};
  border-left: var(--ig-border-3px) solid var(--ig-color-accent-soft);
  border-radius: var(--ig-radius-2xs);
  background: var(--ig-color-tab-highlight);
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  pointer-events: none;
  transition:
    top var(--ig-motion-normal),
    height var(--ig-motion-normal),
    opacity var(--ig-motion-fast);
`

export const ItemButton = styled.button<{ $active: boolean; $radius: VerticalTabsRadius }>`
  position: relative;
  z-index: var(--ig-z-base);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ig-space-3);
  width: 100%;
  min-height: var(--ig-control-height-lg);
  padding: var(--ig-space-4) var(--ig-space-4) var(--ig-space-4) var(--ig-space-5);
  border: 0;
  border-radius: ${(p) => verticalTabsRadiusStyles[p.$radius].item};
  background: transparent;
  color: ${(p) => (p.$active ? 'var(--ig-color-accent-soft)' : 'var(--ig-color-text-muted)')};
  font-size: var(--ig-font-size-sm);
  font-weight: ${(p) => (p.$active ? 'var(--ig-font-weight-semibold)' : 'var(--ig-font-weight-medium)')};
  text-align: left;
  cursor: pointer;
  transition:
    color var(--ig-motion-fast),
    background-color var(--ig-motion-fast);

  &:hover:not(:disabled) {
    background: var(--ig-color-surface-interactive);
    color: ${(p) => (p.$active ? 'var(--ig-color-accent-soft)' : 'var(--ig-color-text-primary)')};
  }

  &:focus-visible {
    outline: var(--ig-border-2px) solid var(--ig-color-accent-ring);
    outline-offset: var(--ig-space-neg-2px);
    box-shadow: var(--ig-shadow-focus-ring);
  }

  &:disabled {
    opacity: var(--ig-opacity-disabled);
    cursor: not-allowed;
  }
`

export const ItemMain = styled.span`
  display: inline-flex;
  align-items: center;
  gap: var(--ig-space-3);
  min-width: 0;
`

export const ItemLabel = styled.span`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const ItemBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: var(--ig-icon-lg);
  height: var(--ig-icon-lg);
  padding: 0 var(--ig-space-2);
  border-radius: var(--ig-radius-pill);
  background: var(--ig-color-badge-accent);
  color: var(--ig-color-text-primary);
  font-size: var(--ig-font-size-2xs);
  font-weight: var(--ig-font-weight-bold);
  line-height: var(--ig-line-height-none);
`
