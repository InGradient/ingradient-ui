import styled from 'styled-components'

/** App root: the sidebar and the page sit side by side and own the viewport together. */
export const ShellRoot = styled.div`
  display: flex;
  height: 100vh;
  @supports (height: 1dvh) { height: 100dvh; }
  min-height: 0;
  overflow: hidden;
  background: var(--ig-color-bg-canvas);
  color: var(--ig-color-text-primary);
`

/**
 * Page area. Page views fill it (height: 100%) instead of assuming the whole viewport. It is a
 * plain div: page views own their landmarks (ClassManage already renders <main>).
 */
export const ShellMain = styled.div`
  flex: 1;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-left: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  /* Page views size themselves with var(--ig-page-height, 100vh). */
  --ig-page-height: 100%;
`

export const BrandRow = styled.span`
  display: inline-flex;
  align-items: center;
  gap: var(--ig-spacing-8);
  min-width: 0;
  font-size: var(--ig-text-body);
  font-weight: var(--ig-font-weight-bold);
  color: var(--ig-color-text-primary);
`

/** Project switcher row: same geometry as the sidebar menu rows so icons and labels line up. */
export const ProjectButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--ig-spacing-12);
  width: 100%;
  min-width: 0;
  height: var(--ig-control-height-lg);
  padding: 0 var(--ig-spacing-16);
  border: 0;
  background: transparent;
  color: var(--ig-color-text-primary);
  font-size: var(--ig-text-body-sm);
  font-weight: var(--ig-font-weight-semibold);
  cursor: pointer;
  & > span {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
  }
  &:hover {
    background: var(--ig-color-surface-interactive-hover);
  }
  &:focus-visible {
    outline: var(--ig-border-2px) solid var(--ig-color-accent-ring);
    outline-offset: var(--ig-space-neg-2px);
  }
  /* Collapsed rail: centre the icon like the menu rows (SidebarShell's container query). */
  @container sidebar-shell (max-width: 100px) {
    justify-content: center;
    padding: 0;
  }
`
