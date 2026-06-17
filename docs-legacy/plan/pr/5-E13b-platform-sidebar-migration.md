---
title: PR-E13b — platform Sidebar SidebarShell 마이그
date: 2026-05-11
parent: docs/plan/pr/5-E13-sidebar-pattern-migration.md
scope: ingradient-platform
status: planning — 사용자 review 대기
---

# PR-E13b — platform Sidebar 마이그

## 1. 목적

PR-E13a 의 ui SidebarShell Pattern 을 platform Sidebar 에 적용. 477줄 → 약 230~260줄 추정.

## 2. 변경 매핑

### 2.1 [Sidebar.tsx](frontend/components/Sidebar.tsx) — 119 → 약 100~110줄

ProjectListBtn / 자체 styled Nav / NavItem / IconButton 등을 모두 SidebarShell items/actions prop 로 전달. SidebarShell 이 layout 처리.

```tsx
import { SidebarShell, type SidebarShellItem, type SidebarShellAction } from '@ingradient/ui/patterns'
import { NotificationBadge } from '@ingradient/ui/components'
import { NavLink } from 'react-router-dom'
import { ProjectListBtn } from './Sidebar.styles'  // topAction 만 자체 유지

export function Sidebar({ canViewDashboard, onOpenSettings, ...etc }) {
  const [expanded, setExpanded] = useState(...)
  const { projects, currentProjectId } = useProjects()
  const navConfig = getSidebarNavItems(canViewDashboard, currentProjectId)

  const items: SidebarShellItem[] = navConfig.map((it) => ({
    key: it.to, to: it.to, title: it.title, label: it.label, icon: it.icon,
    linkComponent: NavLink as React.ElementType,
  }))

  const actions: SidebarShellAction[] = sidebarActionItems.map((it) => ({
    key: it.key,
    title: it.title,
    label: it.label,
    icon: it.key === 'notice' && noticeCount > 0
      ? <NotificationBadge value={noticeCount} tone="danger">{it.icon}</NotificationBadge>
      : it.icon,
    onClick: (e) => {
      if (it.key === 'notice') onOpenNotice?.()
      if (it.key === 'comment') onOpenComment?.()
      if (it.key === 'settings') onOpenSettings?.()
      if (it.key === 'user') onOpenUser?.(e)
    },
  }))

  return (
    <SidebarShell
      expanded={expanded}
      onToggleExpanded={() => setExpanded((p) => !p)}
      brand={<BrandRow ... />}  /* logo hover swap 처리 자체 유지 */
      topAction={<ProjectListBtn onClick={onOpenProjectModal} $expanded={expanded}>...</ProjectListBtn>}
      items={items}
      actions={actions}
    />
  )
}
```

- localStorage persistence: caller (Sidebar.tsx) 가 그대로 보유
- logo hover swap (BrandMark ↔ menu icon): 그대로 caller — `brand` slot 으로 전달

### 2.2 [Sidebar.styles.tsx](frontend/components/Sidebar.styles.tsx) — 90 → 약 30줄

SidebarShell 이 outer Wrap / Logo / CloseSidebarButton 모두 cover. 제거 가능:
- `SidebarWrap` (사용 0)
- `Logo` + `LogoMainButton` + `CloseSidebarButton` (BrandRow 안 자체 logo button 으로 흡수 — 30줄 약 잔존 if hover swap 필요)

### 2.3 [Sidebar.styles.nav.ts](frontend/components/Sidebar.styles.nav.ts) — 150 → 약 30줄

- `Nav`, `NavItem`, `Bottom`, `IconButton`, `NoticeBadge` 모두 SidebarShell 이 처리 → 제거
- `ProjectListBtn` 만 유지 (topAction slot 안에서 사용) — 약 30줄

### 2.4 [Sidebar.styles.shared.ts](frontend/components/Sidebar.styles.shared.ts) — 3 → 제거

상수 (SIDEBAR_WIDTH_*, LOGO_ROW_HEIGHT) 더 이상 caller-side 에서 안 씀. ui SidebarShell 의 default + width prop 사용. **단** MobileNavigation.tsx 가 이 파일을 import 한다면 유지 필요 — 확인 필요.

### 2.5 [Sidebar.config.tsx](frontend/components/Sidebar.config.tsx) (41줄) — 변경 0

route + icon mapping. 도메인이므로 유지.

### 2.6 [Sidebar.icons.tsx](frontend/components/Sidebar.icons.tsx) (74줄) — 변경 0

icon SVG. caller 도메인 자산이라 유지.

## 3. logo hover swap 처리

[Sidebar.tsx:46-63](frontend/components/Sidebar.tsx#L46-L63) 에 있는 `logoHover` 상태 + BrandMark ↔ menu icon swap 은 expanded=false 일 때만 의미. 본 동작은 brand slot 안에 자체 구현 (CallerBrand 함수 컴포넌트):

```tsx
function CallerBrand({ expanded, onToggle }: { expanded: boolean; onToggle: () => void }) {
  const [hover, setHover] = useState(false)
  return (
    <LogoMainButton
      type="button"
      $expanded={expanded}
      onClick={onToggle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {!expanded && hover ? iconMenu : <BrandMark size={40} />}
    </LogoMainButton>
  )
}
```

→ 새 작은 컴포넌트. brand slot 으로 전달.

## 4. 영향 분석

**줄수 변화** (추정):
- Sidebar.tsx 119 → ~105 (-14)
- Sidebar.styles.tsx 90 → ~30 (-60)
- Sidebar.styles.nav.ts 150 → ~30 (-120)
- Sidebar.styles.shared.ts 3 → 3 (보존, MobileNavigation 의존 확인 필요)
- 합 **약 -200줄 platform**

**시각 변화**:
- background gradient / border-right 동일 (SidebarShell 가 동일 적용)
- container query 동일 동작 (sidebar-shell name 으로 격리)
- NavLink active 스타일 동일 (token 동일)
- close button 모양 약간 변경 (X → caret-left). 보고용 spot-check

**기능 변화**:
- 0. localStorage / NavLink / NotificationBadge 모두 caller 유지

## 5. 검증 절차

1. ui rebuild 보장 (PR-E13a commit 후 빌드 완료)
2. platform `npx tsc --noEmit` (frontend/)
3. platform `npm run dev` → 로그인 → Sidebar 모든 동작 확인:
   - expand/collapse 토글
   - localStorage 영속
   - logo hover (collapsed 일 때 menu icon swap)
   - NavLink active 상태
   - Notice badge (count > 0 일 때)
   - 각 action 클릭 (Settings/Notice/Comment/User)

## 6. 위험

- 중간. logo hover swap 이 새 위치 (CallerBrand) 에 옮겨가는 부분 — 동작 검증 spot-check 필수
- ProjectListBtn 가 topAction slot 안에 들어가면서 border-bottom 의 위치가 SidebarShell 의 TopActionWrap border 와 중복 가능 — 확인 후 ProjectListBtn 의 border-bottom 제거

## 7. 후속

- MobileNavigation 은 본 PR scope 밖. 별도 PR (E13c) 거리 있음 — Mobile drawer 도 SidebarShell-like Pattern 으로 정리 가능
