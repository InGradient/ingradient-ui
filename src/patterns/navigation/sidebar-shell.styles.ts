import styled from 'styled-components'
import { media } from '../../tokens/core/breakpoints'

// = spacingScale[8] (18px) — used as numeric for template literal interpolation
const SIDEBAR_INSET = 18

export const SidebarShellWrap = styled.aside<{ $expanded: boolean; $widthExpanded: number; $widthCollapsed: number }>`
  width: ${(p) => (p.$expanded ? p.$widthExpanded : p.$widthCollapsed)}px;
  min-width: ${(p) => (p.$expanded ? p.$widthExpanded : p.$widthCollapsed)}px;
  max-width: ${(p) => (p.$expanded ? p.$widthExpanded : p.$widthCollapsed)}px;
  flex: 0 0 ${(p) => (p.$expanded ? p.$widthExpanded : p.$widthCollapsed)}px;
  height: 100%;
  background:
    linear-gradient(180deg, var(--ig-color-sidebar-bg-top) 0%, var(--ig-color-sidebar-bg-bottom) 100%),
    var(--ig-color-bg-canvas);
  border-right: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  flex-shrink: 0;
  transition: width var(--ig-motion-normal);
  ${media.md} {
    display: none;
  }
  overflow: hidden;
  container-type: inline-size;
  container-name: sidebar-shell;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`

export const SidebarBrandRow = styled.div`
  min-height: var(--ig-layout-sidebar-header);
  padding: var(--ig-space-7) ${SIDEBAR_INSET}px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  background: var(--ig-color-surface-header);
  border-bottom: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  box-sizing: border-box;
  &:hover { background: var(--ig-color-surface-interactive); }
`

export const SidebarCloseButton = styled.button`
  background: none;
  border: none;
  color: var(--ig-color-text-muted);
  cursor: pointer;
  padding: var(--ig-space-1);
  margin-left: var(--ig-space-3);
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover { color: var(--ig-color-text-primary); }
  svg { width: var(--ig-icon-lg); height: var(--ig-icon-lg); }
`

export const SidebarTopActionWrap = styled.div`
  border-bottom: var(--ig-border-1px) solid var(--ig-color-border-subtle);
`

export const SidebarNavList = styled.nav`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: var(--ig-space-5) 0;
  gap: var(--ig-space-1);
  min-height: 0;
`

const rowMixin = `
  display: grid;
  grid-template-columns: var(--ig-icon-xl) minmax(0, 1fr);
  align-items: center;
  height: var(--ig-control-height-lg);
  padding: 0 ${SIDEBAR_INSET}px;
  gap: var(--ig-space-5);
  color: var(--ig-color-text-muted);
  font-size: var(--ig-font-size-sm);
  text-decoration: none;
  transition: color var(--ig-motion-fast), background var(--ig-motion-fast);
  cursor: pointer;
  border: none;
  background: none;
  text-align: left;
  width: 100%;
  box-sizing: border-box;
  &:hover {
    color: var(--ig-color-text-primary);
    background: var(--ig-color-white-06);
  }
  & svg { width: var(--ig-icon-xl); height: var(--ig-icon-xl); flex-shrink: 0; }
  & span { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  @container sidebar-shell (max-width: var(--ig-layout-sidebar-collapse)) {
    grid-template-columns: var(--ig-icon-xl);
    justify-content: center;
    padding: 0;
  }
`

export const SidebarItemRow = styled.a`
  ${rowMixin}
  /* react-router NavLink auto-applies "active" class + aria-current="page". */
  &.active,
  &[aria-current='page'] {
    color: var(--ig-color-accent-soft);
    background: var(--ig-color-focus-bg-soft);
  }
`

export const SidebarActionButton = styled.button`
  ${rowMixin}
`

export const SidebarBottom = styled.div`
  display: flex;
  flex-direction: column;
  padding: var(--ig-space-5) 0;
  border-top: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  gap: var(--ig-space-1);
  flex-shrink: 0;
`

export const SidebarIconHolder = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
`
