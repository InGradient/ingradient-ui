import styled from 'styled-components'
import { media } from '../../tokens/core/breakpoints'

export const SidebarShellWrap = styled.aside<{ $expanded: boolean; $widthExpanded: number; $widthCollapsed: number }>`
  width: ${(p) => (p.$expanded ? p.$widthExpanded : p.$widthCollapsed)}px;
  min-width: ${(p) => (p.$expanded ? p.$widthExpanded : p.$widthCollapsed)}px;
  max-width: ${(p) => (p.$expanded ? p.$widthExpanded : p.$widthCollapsed)}px;
  flex: 0 0 ${(p) => (p.$expanded ? p.$widthExpanded : p.$widthCollapsed)}px;
  /* parent grid/flex cell 에 맞춰 stretch — caller 가 Shell height: 100vh + main content overflow:auto
   * 패턴 쓰면 sidebar 는 viewport 와 정확히 일치, sub-pixel sticky slip 발생 자체가 안 함.
   * (caller 가 document scroll 사용하면 sticky 가 필요할 수 있어 max-height 로 cap 만 유지) */
  height: 100%;
  max-height: 100dvh;
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

export const SidebarBrandRow = styled.div<{ $expanded: boolean }>`
  position: relative;
  min-height: var(--ig-layout-sidebar-header);
  padding: var(--ig-space-7) var(--ig-space-8);
  display: flex;
  align-items: center;
  justify-content: ${(p) => (p.$expanded ? 'space-between' : 'center')};
  flex-shrink: 0;
  background: var(--ig-color-surface-header);
  border-bottom: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  box-sizing: border-box;
  /* button reset (when rendered as <button> in collapsed-clickable mode) */
  border-width: 0 0 var(--ig-border-1px) 0;
  border-style: solid;
  border-color: var(--ig-color-border-subtle);
  color: inherit;
  width: 100%;
  text-align: inherit;
  font: inherit;
  cursor: ${(p) => (p.$expanded ? 'default' : 'pointer')};
  &:hover { background: var(--ig-color-surface-interactive); }
`

/** Brand slot — 접힘 시 hover 되면 숨겨지면서 expand 아이콘으로 swap.
 *  transition 도 collapsed 일 때만 적용 — expanded 일 땐 변화 없으므로 transition 선언 자체가
 *  brand element 의 compositing layer 분리 trigger 가 되지 않게 함. */
export const SidebarBrandSlot = styled.span<{ $expanded: boolean }>`
  display: inline-flex;
  align-items: center;
  ${(p) => !p.$expanded && `
    transition: opacity var(--ig-motion-fast);
    ${SidebarBrandRow}:hover & { opacity: 0; }
  `}
`

/** Hover 시 brand 자리에 등장하는 expand chevron. 접힘 상태에서만 노출. */
export const SidebarHoverExpandOverlay = styled.span`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ig-color-text-muted);
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--ig-motion-fast);
  ${SidebarBrandRow}:hover & {
    opacity: 1;
    color: var(--ig-color-text-primary);
  }
  svg { width: var(--ig-icon-md); height: var(--ig-icon-md); }
`

export const SidebarToggleButton = styled.button`
  background: none;
  border: none;
  color: var(--ig-color-text-muted);
  cursor: pointer;
  padding: var(--ig-space-1);
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover { color: var(--ig-color-text-primary); }
  svg { width: var(--ig-icon-md); height: var(--ig-icon-md); }
`

export const SidebarTopActionWrap = styled.div`
  border-bottom: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  & svg { width: var(--ig-icon-lg); height: var(--ig-icon-lg); flex-shrink: 0; }
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
  display: flex;
  align-items: center;
  height: var(--ig-control-height-lg);
  padding: 0 var(--ig-space-8);
  gap: var(--ig-space-5);
  color: var(--ig-color-text-muted);
  font-size: var(--ig-font-size-sm);
  text-decoration: none;
  /* transition 제거 — color/background 변화는 즉시 적용.
   * 이전: transition 이 button 의 paint sequence 를 GPU layer 로 격리 → 빠른 스크롤 시 button 안
   *       icon (raster/SVG) 이 한 프레임 lag 으로 jitter 처럼 보이는 현상의 원인 추정. */
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
  & svg { width: var(--ig-icon-lg); height: var(--ig-icon-lg); flex-shrink: 0; }
  & span { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  @container sidebar-shell (max-width: 100px) {
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

/** Expandable item 의 우측 chevron. 펼침 sidebar 에서만 노출. */
export const SidebarChevronSlot = styled.span`
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  color: var(--ig-color-text-muted);
  svg { width: var(--ig-icon-md); height: var(--ig-icon-md); }
`

/** Expandable item 펼침 시 children 컨테이너 — 좌측 padding 으로 들여쓰기. */
export const SidebarSubList = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: var(--ig-space-7);
  gap: var(--ig-space-1);
  @container sidebar-shell (max-width: 100px) {
    padding-left: 0;
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

/** Icon wrapper — display: contents 로 box model 에서 제거되어 layout/compositing 영향 0.
 *  badge 모드일 땐 NotificationBadge 가 자체 Root 로 inline-flex 처리하므로 wrapper 불필요. */
export const SidebarIconHolder = styled.span`
  display: contents;
`
