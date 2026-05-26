---
title: PR-E13 — platform Sidebar ui pattern 마이그 (gap 분석 + 접근 옵션)
date: 2026-05-11
parent: docs/plan/phase-5-components-audit.md
scope: ingradient-ui (foundation) + ingradient-platform (consumer)
status: planning — 사용자 review 대기 (접근 결정 필요)
---

# PR-E13 — Sidebar Pattern 마이그

## 1. 의도 (audit plan 발췌)

audit plan 가정: "ui patterns 의 SidebarNav/AppSidebar/MobileNavDrawer 가 *이미 있는데* 사용 안 함. platform Sidebar 를 ui patterns 사용으로 마이그. -200+줄 platform."

조사 결과: 가정이 부정확. ui patterns 는 *얇은 styled wrapper 만* — 동작 / nav 아이템 / collapse logic 0. 단순 "use existing" 으로는 -200 달성 불가.

## 2. 현황 inventory

### 2.1 platform Sidebar (477줄)

| 파일 | 줄수 | 역할 |
|---|---|---|
| [Sidebar.tsx](frontend/components/Sidebar.tsx) | 119 | 본체. expand/collapse + localStorage + logo hover + currentProject + nav 렌더 |
| [Sidebar.styles.tsx](frontend/components/Sidebar.styles.tsx) | 90 | SidebarWrap + Logo + LogoMainButton + CloseSidebarButton |
| [Sidebar.styles.nav.ts](frontend/components/Sidebar.styles.nav.ts) | 150 | ProjectListBtn + Nav + NavItem (NavLink) + Bottom + IconButton + NoticeBadge wrap |
| [Sidebar.styles.shared.ts](frontend/components/Sidebar.styles.shared.ts) | 3 | 상수 (LOGO_ROW_HEIGHT, SIDEBAR_WIDTH_EXPANDED=240, COLLAPSED=72) |
| [Sidebar.config.tsx](frontend/components/Sidebar.config.tsx) | 41 | nav items (route + label + icon) + action items |
| [Sidebar.icons.tsx](frontend/components/Sidebar.icons.tsx) | 74 | SVG 아이콘 8개 |

**behavior 정리** (Sidebar.tsx 의 핵심):
1. localStorage 키 `ingradient-sidebar-expanded` 로 토글 영속화
2. expand 상태에 따라 width 240 ↔ 72px
3. Logo 가 collapsed 일 때 hover 시 BrandMark ↔ menu icon swap
4. expand 시 우측 close button 표시
5. 현재 project 표시 (Zustand store)
6. NavLink 의 `.active` 자동 highlight
7. Notice 아이콘에 NotificationBadge (count 0 hidden)
8. Container query `@container sidebar` 로 collapsed 일 때 nav item 가운데 정렬

### 2.2 ui patterns 의 SidebarNav / AppSidebar / MobileNavDrawer

[navigation.tsx](src/patterns/shells/navigation.tsx) (61줄):
```tsx
SidebarNav        // surfacePanel + radius + padding + gap. 그냥 wrapper
AppSidebar        // surfacePanel + 너비/패딩 prop. 그냥 wrapper
SidebarSection    // 자식 nav 그룹 wrapper
SidebarFooter     // margin-top: auto + flex
TopBar            // headerSurface + 양옆 정렬
MobileNavDrawer   // surfaceRaised + position fixed + transform
```

→ **순수 styled wrapper만**. nav 아이템 스타일 / 활성 상태 / collapse / container query / hover 동작 **하나도 없음**.

### 2.3 platform 의 ui pattern 사용 현황

- **MobileNavigation.styles.tsx**: `CoreMobileNavDrawer` 사용 중 — 단 transform/position 모두 override (top-drop 패턴)
- **Sidebar (desktop)**: **사용 0**

## 3. Gap 정리

| platform 가 가진 것 | ui 가 cover 하는가? |
|---|---|
| SidebarWrap (width transition, gradient bg, container-type) | 부분 (AppSidebar 가 width prop). gradient/container-type 없음 |
| Logo + LogoMainButton + brand swap + close button | ❌ |
| ProjectListBtn | ❌ |
| Nav + NavItem (NavLink + active 스타일 + 컨테이너 쿼리) | ❌ |
| Bottom + IconButton + NotificationBadge integration | ❌ |
| collapse/expand toggle + localStorage | ❌ |
| nav item / action item config 적용 | ❌ (consumer 도메인 — 유지 의도) |

→ 단순 "AppSidebar 사용으로 교체" 만 가능. 그 외는 ui 에 부재.

## 4. 세 가지 접근

### 4.1 접근 A — 얇은 wrapper 마이그만

- `SidebarWrap` → `AppSidebar` 로 교체 (또는 wrapper 변형)
- 그 외 styled 모두 유지 — Logo/Nav/NavItem/IconButton 등 그대로

**효과**: -10~30줄 platform. ui 변경 0. *audit 의도 (-200+) 달성 못 함*

**위험**: 거의 0. width transition / container query 가 AppSidebar 에 없어 styled `(AppSidebar)` extend 로 처리

### 4.2 접근 B — ui 에 `SidebarShell` Pattern 신규

새 Pattern 의 책임:
- expand/collapse 상태 prop + onChange callback
- slot 인터페이스: `brand`, `topAction`, `items[]`, `actions[]`, `footer?`
- `items[]` 항목: `{ to: string, label: string, icon: ReactNode, badge?: ReactNode, isActive?: () => boolean }`
- `actions[]` 항목: `{ key: string, label: string, icon: ReactNode, onClick: () => void, badge?: ReactNode }`
- 내부 동작: container query, NavLink-aware active state, NavLink router-agnostic (react-router 의존 분리 — caller 가 isActive 제공 or NavLink 노드 직접 전달)

```tsx
<SidebarShell
  expanded={expanded}
  onExpandedChange={setExpanded}
  brand={<BrandMark />}
  topAction={<ProjectButton project={...} onOpen={...} />}
  items={navItems.map((it) => ({
    label: it.label, icon: it.icon, title: it.title,
    node: <NavLink to={it.to}>...</NavLink>,    // caller-provided node
  }))}
  actions={actionItems.map((it) => ({ ...it, onClick: ... }))}
/>
```

**효과**:
- platform Sidebar 477 → 약 250줄 (config + 아이콘 + 작은 wrapper) **약 -200줄**
- ui 신규 SidebarShell 약 +180줄 (Pattern + variants 스토리)
- *cross-app 효과*: edge 가 향후 desktop sidebar 가질 때 동일 Pattern 재사용 (단 현재 edge 는 desktop sidebar 없음)

**위험**:
- 중간. NavLink (react-router) 의존성 caller-side 로 push → API 가 추상화 부담 있음
- localStorage persistence 가 caller 책임 vs Pattern 내장 — 둘 다 trade-off
- 새 Pattern Storybook + a11y test 필수

### 4.3 접근 C — 본 PR 보류

다른 거리 (E1 ImageDetailShell / E11 AddDatasetModal 등) 우선. audit 의 -200 추정이 ui 확장 동반 한다는 인식만 기록.

## 5. governance 검토

D-007 ("props ≤ 5"):
- SidebarShell 의 props 수: expanded / onExpandedChange / brand / topAction / items / actions / footer = **7개** — chart 도메인처럼 *config-rich* 영역. 일부 슬롯은 optional
- 모든 props *slot* 기반 → 도메인 logic 차단됨 ✓

D-016 (storybook 의무): SidebarShell + variants (expanded/collapsed/no-topAction/with-badge) 6~8 카드

## 6. 추정 일정

| 옵션 | 작업 | 기간 |
|---|---|---|
| A | platform SidebarWrap 만 AppSidebar 로 교체 | 0.5 일 |
| B | ui SidebarShell Pattern + Stories + platform 마이그 | 1.5~2 일 |
| C | 보류, 다른 PR 진행 | 0 일 |

## 7. 추천

audit plan 의 의도 (-200+ 줄 platform) 달성하려면 **접근 B**. 단 작업량 큼.

작업량 절감 위해 옵션 D 도 가능:
- **D**: ui SidebarShell *최소 표면적* 으로 시작 — slot + NavLink children 그대로 forward. localStorage / container query 는 caller 유지. 추후 PR 에서 강화.

## 8. 다음 단계

사용자가 A / B / C / D 중 선택 후 → 해당 sub-plan 작성 → 구현
