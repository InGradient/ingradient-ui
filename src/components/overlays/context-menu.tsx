import styled from 'styled-components'
import { surfaceRaised } from '../../primitives'

/** click-outside 처리를 위한 투명 backdrop */
export const ContextMenuBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: var(--ig-z-context-menu);
`

/** cursor 위치에 fixed 배치되는 메뉴 컨테이너 */
export const ContextMenuList = styled.div.attrs<{ $x: number; $y: number }>((p) => ({
  style: { left: p.$x, top: p.$y },
}))<{ $x: number; $y: number }>`
  position: fixed;
  z-index: calc(var(--ig-z-context-menu) + 1);
  min-width: 120px;
  padding: var(--ig-space-1) 0;
  ${surfaceRaised}
  border-radius: var(--ig-radius-lg);
  box-shadow: var(--ig-shadow-popover);
`

/** 하위 메뉴(서브메뉴)를 감싸는 wrapper — hover 감지를 위해 position: relative를 제공 */
export const ContextMenuItem = styled.div`
  position: relative;
  display: block;
  width: 100%;
`

/** 메뉴 항목 버튼. $danger=true 이면 destructive 색상 적용 */
export const ContextMenuButton = styled.button<{ $danger?: boolean }>`
  display: block;
  width: 100%;
  padding: var(--ig-space-3) var(--ig-space-6);
  border: none;
  background: none;
  color: ${(p) => (p.$danger ? 'var(--ig-color-danger)' : 'var(--ig-color-text-primary)')};
  font-size: var(--ig-font-size-sm);
  text-align: left;
  cursor: pointer;
  &:hover {
    background: var(--ig-color-surface-interactive-hover);
  }
`

/** cursor 위치에 fixed 배치되는 서브메뉴 컨테이너 */
export const ContextMenuSub = styled.div.attrs<{ $left: number; $top: number }>((p) => ({
  style: { left: p.$left, top: p.$top },
}))<{ $left: number; $top: number }>`
  position: fixed;
  z-index: calc(var(--ig-z-context-menu) + 2);
  min-width: 140px;
  padding: var(--ig-space-1) 0;
  ${surfaceRaised}
  border-radius: var(--ig-radius-lg);
  box-shadow: var(--ig-shadow-popover);
`

/** 서브메뉴 내 항목 버튼. $color로 개별 색상 지정 가능 */
export const ContextMenuSubItem = styled.button<{ $color?: string }>`
  display: flex;
  align-items: center;
  gap: var(--ig-space-3);
  width: 100%;
  padding: var(--ig-space-2) var(--ig-space-6);
  border: none;
  background: none;
  color: ${(p) => p.$color ?? 'var(--ig-color-text-primary)'};
  font-size: var(--ig-font-size-sm);
  text-align: left;
  cursor: pointer;
  &:hover {
    background: var(--ig-color-surface-interactive-hover);
  }
`
