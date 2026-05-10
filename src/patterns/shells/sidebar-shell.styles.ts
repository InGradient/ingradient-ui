import styled from 'styled-components'
import { media } from '../../tokens/foundations/breakpoints'

const SIDEBAR_INSET = 18

export const SidebarShellWrap = styled.aside<{ $expanded: boolean; $widthExpanded: number; $widthCollapsed: number }>`
  width: ${(p) => (p.$expanded ? p.$widthExpanded : p.$widthCollapsed)}px;
  min-width: ${(p) => (p.$expanded ? p.$widthExpanded : p.$widthCollapsed)}px;
  max-width: ${(p) => (p.$expanded ? p.$widthExpanded : p.$widthCollapsed)}px;
  flex: 0 0 ${(p) => (p.$expanded ? p.$widthExpanded : p.$widthCollapsed)}px;
  height: 100%;
  background:
    linear-gradient(180deg, rgba(12, 15, 20, 0.96) 0%, rgba(10, 14, 20, 0.94) 100%),
    var(--ig-color-bg-canvas);
  border-right: 1px solid var(--ig-color-border-subtle);
  flex-shrink: 0;
  transition: width 0.2s ease;
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
  min-height: 72px;
  padding: 16px ${SIDEBAR_INSET}px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  background: var(--ig-color-surface-header);
  border-bottom: 1px solid var(--ig-color-border-subtle);
  box-sizing: border-box;
  &:hover { background: var(--ig-color-surface-interactive); }
`

export const SidebarCloseButton = styled.button`
  background: none;
  border: none;
  color: var(--ig-color-text-muted);
  cursor: pointer;
  padding: 4px;
  margin-left: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover { color: var(--ig-color-text-primary); }
  svg { width: 18px; height: 18px; }
`

export const SidebarTopActionWrap = styled.div`
  border-bottom: 1px solid var(--ig-color-border-subtle);
`

export const SidebarNavList = styled.nav`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 12px 0;
  gap: 4px;
  min-height: 0;
`

const rowMixin = `
  display: grid;
  grid-template-columns: 20px minmax(0, 1fr);
  align-items: center;
  height: 44px;
  padding: 0 ${SIDEBAR_INSET}px;
  gap: 12px;
  color: var(--ig-color-text-muted);
  font-size: 13px;
  text-decoration: none;
  transition: color 0.15s, background 0.15s;
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
  & svg { width: 20px; height: 20px; flex-shrink: 0; }
  & span { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  @container sidebar-shell (max-width: 100px) {
    grid-template-columns: 20px;
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
    background: var(--ig-color-blue-tint-16);
  }
`

export const SidebarActionButton = styled.button`
  ${rowMixin}
`

export const SidebarBottom = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px 0;
  border-top: 1px solid var(--ig-color-border-subtle);
  gap: 4px;
  flex-shrink: 0;
`

export const SidebarIconHolder = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
`
