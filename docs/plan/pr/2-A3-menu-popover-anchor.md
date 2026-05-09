---
plan: PR-A3 — ui MenuPopover 에 anchor prop 추가 + platform 사용처 wrap 제거
date: 2026-05-09
phase: 2 (잔여 audit 거리)
pr id: PR-A3
parent plan: ../components-audit-findings.md (§ 5)
master plan: ../../MASTER-PLAN.md (§ 9.1)
governance: ../../governance.md
estimated: 1h
---

# PR-A3 — ui MenuPopover anchor prop

## 목표

ui `<MenuPopover>` 에 `anchor?: { top, left }` prop 추가 — fixed 포지셔닝 자동. platform 의 `styled(MenuPopover).attrs<{$top,$left}>` wrap 2개 제거 (DatasetContextMenu, UserMenu).

## audit (2026-05-09)

### platform 사용처 (5개)

| 파일 | 패턴 | 처리 |
|---|---|---|
| `DashboardHeader.styles.tsx` `SettingsPopover` | A. `position: absolute; top: calc(100% + 8px); right: 0; z-index; padding; radius` (relative anchor) | **유지** — 5줄 이하 layout 적응 (governance § 3.1) |
| `CatalogRightPanel.styles.search.ts` `ClassSearchPanel` | A. 동일 | **유지** |
| `DashboardOverviewPanel.styles.tsx` `DatePopover` | A. 동일 | **유지** |
| `DatasetContextMenu.styles.ts` `MenuDropdown` | B. `position: fixed; top/left $top/$left props` | **제거** — anchor prop 사용 |
| `UserMenu.tsx` `Menu` | B. 동일 | **제거** |

→ A 패턴 3개는 caller 의 단순 layout (relative-positioned 부모 안). caller 가 5줄 이하 styled wrap. 그대로 유지 (governance § 3.1 layout 적응 OK).
→ B 패턴 2개는 fixed positioning + 좌표 직접 계산. anchor prop 으로 cover.

### edge 사용처

- (없음)

## 결정

### D1. anchor prop 형태

- **A (권장)** `anchor?: { top: number; left: number }` — 받으면 fixed + top/left 자동
- B. `anchor?: { top, left, position?: 'fixed'|'absolute' }` — props 늘어남
- C. trigger ref + auto calc — ui 책임 폭증

→ **권장 A**. 단순 + B 패턴 cover.

### D2. MenuPopover 변환 방식

styled-component → forwardRef React component:

```tsx
const MenuPopoverRoot = styled.div`
  ${surfaceRaised}
  border-radius: var(--ig-radius-lg);
  padding: var(--ig-space-4);
  min-width: 220px;
  box-shadow: var(--ig-shadow-popover);
`

export interface MenuPopoverProps extends React.HTMLAttributes<HTMLDivElement> {
  anchor?: { top: number; left: number }
}

export const MenuPopover = forwardRef<HTMLDivElement, MenuPopoverProps>(
  ({ anchor, style, ...rest }, ref) => (
    <MenuPopoverRoot
      ref={ref}
      style={anchor ? { ...style, position: 'fixed', top: anchor.top, left: anchor.left } : style}
      {...rest}
    />
  )
)
```

→ A 패턴 (`styled(MenuPopover)\`...\``) 도 forwardRef 컴포넌트 extend 가능 (styled-components 호환).

## 변경 파일

1. **`ui/src/components/overlays/popovers.tsx`** — `MenuPopover` 변환 (styled → forwardRef + anchor prop). `Menu` 와 분리 (Menu 는 styled 그대로).
2. **`platform/components/catalog/DatasetContextMenu.styles.ts`** — `MenuDropdown` styled 제거
3. **`platform/components/catalog/DatasetContextMenu.tsx`** — `<MenuPopover anchor={{top, left}}>` 직접 사용
4. **`platform/components/UserMenu.tsx`** — local `Menu = styled(MenuPopover).attrs(...)` 제거, `<MenuPopover anchor={{top, left}}>` 사용

## 변경 안 함

- A 패턴 3개 (`SettingsPopover`, `ClassSearchPanel`, `DatePopover`) — 5줄 이하 layout 적응, governance OK
- 다른 ui exports (Menu, PopoverCard, HoverCard, TooltipBubble) — 그대로

## 위험

- **forwardRef 변환**: styled-components extend (`styled(MenuPopover)`) 와 ref 동작 검증 필요. typecheck + 시각.
- **inline style 의 position 우선순위**: caller 가 `style={{position: 'absolute'}}` 주면 anchor 의 fixed 와 충돌. 안전: anchor 가 우선 (권장 A 의 spread 순서대로).

## 검증

- ui typecheck + build
- platform typecheck (symlink)
- 시각: 마지막 일괄

## 후속

- PR-A4: ui TextField size variant
