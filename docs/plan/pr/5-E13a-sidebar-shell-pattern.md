---
title: PR-E13a — ui SidebarShell Pattern 신규
date: 2026-05-11
parent: docs/plan/pr/5-E13-sidebar-pattern-migration.md
scope: ingradient-ui
status: planning — 사용자 review 대기
---

# PR-E13a — SidebarShell Pattern 신규

## 1. 목적

PR-E13 의 첫 sub-PR. platform Sidebar 의 layout / 동작을 ui Pattern (slot 인터페이스) 으로 추출. **platform 변경 0**.

## 2. API 설계

### 2.1 컴포넌트 구조

```tsx
<SidebarShell
  expanded={expanded}
  onToggleExpanded={() => setExpanded(p => !p)}
  width={{ expanded: 180, collapsed: 72 }}     // optional, default 180/72
  brand={...}                                  // logo / brand 영역 ReactNode
  topAction={...}                              // 보통 project picker 버튼
  items={navItems}                             // 메인 nav 영역 (NavLink 등)
  actions={actionItems}                        // 하단 action 버튼
  className={...}
>
```

### 2.2 item / action shape

```ts
export interface SidebarItem {
  key: string
  title: string                                // tooltip
  label: string                                // expanded 일 때 표시 텍스트
  icon: ReactNode
  /** caller 가 NavLink/Link 등 router-aware element 직접 제공.
   *  isActive 는 NavLink 가 자체 처리하므로 별도 prop 불필요 */
  to?: string                                  // optional — 단순 a 태그 fallback
  /** caller-provided node — NavLink, anchor, button 등 모두 가능.
   *  children/onClick 등은 caller 가 제어. provided 시 to/icon/label 보다 우선 */
  node?: ReactNode
  badge?: ReactNode                            // NotificationBadge 등
}

export interface SidebarAction extends Omit<SidebarItem, 'to' | 'node'> {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}
```

### 2.3 slot-only — caller responsibility 정리

| 책임 | caller (platform) | SidebarShell (ui) |
|---|---|---|
| route/url config | ✅ | ❌ |
| icon 아이콘 자체 | ✅ | ❌ |
| 현재 project 표시 | ✅ (topAction 안) | ❌ |
| localStorage persistence | ✅ (expanded state) | ❌ |
| 브랜드 자체 | ✅ (brand slot 안) | ❌ |
| width transition / container query | ❌ | ✅ |
| NavItem hover / active 스타일 | ❌ | ✅ |
| collapse 시 가운데 정렬 | ❌ | ✅ (container query) |
| close button (expanded 시 우측) | ❌ | ✅ — 단 onToggleExpanded callback 으로 동작 |
| bottom 영역 + separator | ❌ | ✅ |
| NotificationBadge integration | ❌ | ✅ (badge prop slot — caller 가 Badge 컴포넌트 직접 전달) |

→ ui 는 *시각 + 동작 + 토글 callback* 만. 도메인 (route / project / notice count 등) caller.

## 3. 파일 구조 — patterns/shells/sidebar-shell.tsx (신규)

```
src/patterns/shells/
├── navigation.tsx              # 기존 — AppSidebar/SidebarNav/TopBar/MobileNavDrawer 유지
├── sidebar-shell.tsx           # 신규 — 본 PR
└── sidebar-shell.stories.tsx   # 신규 (stories/)
```

기존 navigation.tsx 의 AppSidebar 는 *얇은 wrapper* 로 잘 분리되어 있어 *유지*. SidebarShell 은 한 단계 higher-level Pattern.

## 4. 구현 핵심

### 4.1 컨테이너 + 너비 transition

```tsx
const Wrap = styled.aside<{ $expanded: boolean; $widthExpanded: number; $widthCollapsed: number }>`
  width: ${(p) => (p.$expanded ? p.$widthExpanded : p.$widthCollapsed)}px;
  flex: 0 0 ${(p) => (p.$expanded ? p.$widthExpanded : p.$widthCollapsed)}px;
  height: 100%;
  background:
    linear-gradient(180deg, rgba(12, 15, 20, 0.96) 0%, rgba(10, 14, 20, 0.94) 100%),
    var(--ig-color-bg-canvas);
  border-right: 1px solid var(--ig-color-border-subtle);
  transition: width 0.2s ease;
  ${media.md} { display: none; }
  overflow: hidden;
  container-type: inline-size;
  container-name: sidebar-shell;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`
```

container-name 이 platform 의 `sidebar` 와 다름 → ui Pattern 안 container query 가 platform 의 외부 query 와 격리. 호환 보장.

### 4.2 nav item 스타일 + container query

```tsx
const NavItemWrap = styled.div<{ $expanded: boolean }>`
  display: grid;
  grid-template-columns: 20px minmax(0, 1fr);
  height: 44px;
  padding: 0 18px;
  align-items: center;
  gap: 12px;
  color: var(--ig-color-text-muted);
  cursor: pointer;
  &:hover {
    color: var(--ig-color-text-primary);
    background: var(--ig-color-white-06);
  }
  /* NavLink active state 는 caller 의 router 가 :where(.active) 또는 aria-current 로 처리 */
  &:has(:where(.active, [aria-current='page'])) {
    color: var(--ig-color-accent-soft);
    background: var(--ig-color-blue-tint-16);
  }
  @container sidebar-shell (max-width: 100px) {
    grid-template-columns: 20px;
    justify-content: center;
    padding: 0;
  }
  svg { width: 20px; height: 20px; flex-shrink: 0; }
  span { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
`
```

**중요**: caller 가 `<NavLink>` 를 `node` slot 으로 제공하면 NavLink 가 자동으로 `.active` 클래스 추가. ui 는 router 의존 없음. `:has(.active)` 로 부모 측 스타일 적용.

### 4.3 logo / brand row + close button

```tsx
const BrandRow = styled.div`
  min-height: 72px;
  padding: 16px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  background: var(--ig-color-surface-header);
  border-bottom: 1px solid var(--ig-color-border-subtle);
  &:hover { background: var(--ig-color-surface-interactive); }
`
```

close button 은 ui 가 제공 (caret-left 아이콘) — onToggleExpanded 호출. `expanded === true` 일 때만 표시.

### 4.4 bottom (actions) 영역

```tsx
const Bottom = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px 0;
  border-top: 1px solid var(--ig-color-border-subtle);
  gap: 4px;
  flex-shrink: 0;
`
```

각 action 은 `<button>` 으로 렌더. icon + label (expanded). caller 가 badge slot 제공 시 NotificationBadge 등 wrap.

## 5. Storybook variants

`sidebar-shell.stories.tsx` (신규, < 200줄):
- Review (메인) — expanded + collapsed 양쪽 카드
- "With badge" — Notice 에 NotificationBadge
- "No topAction" — minimal
- "Custom width" — width prop override
- "Mock NavLink active" — caller 가 div.active 로 active row 시뮬

## 6. 영향 분석

**ui 추가**:
- `sidebar-shell.tsx` 약 130~150줄
- `sidebar-shell.stories.tsx` 약 150~180줄
- index export 추가 (patterns/index.ts)

**consumer 영향**: 본 PR 0. PR-E13b 에서 platform 마이그 시점에 사용 시작.

**기존 ui patterns**:
- navigation.tsx 의 AppSidebar/SidebarNav/MobileNavDrawer 유지 — 기존 caller (MobileNavigation) 호환

## 7. 검증 절차

1. typecheck `npx tsc --noEmit`
2. ui storybook 시각 (양 mode):
   - Review 카드 — expanded/collapsed 정상
   - close button 동작 (onToggleExpanded 호출)
   - "Mock NavLink active" 카드 — active row 스타일
3. ui storybook tests `npm run test-storybook` — 신규 카드 pass
4. a11y panel — 양 mode "error" 위반 없음

## 8. 위험

- 낮음. ui 만 추가, 기존 patterns 유지
- container query `@container sidebar-shell` 가 모던 브라우저 (Safari 16+, Chrome 105+) 만 — 이미 기존 platform Sidebar 도 동일 사용 중이라 회귀 아님

## 9. 다음 sub-PR

**PR-E13b**: platform Sidebar.tsx + 4 styled 파일 → SidebarShell 사용. 477줄 → 약 230~250줄 (-200 추정). Sidebar.config + Sidebar.icons 유지.
