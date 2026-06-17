---
title: Phase 4 — App chrome (TitleBar / TopBar / BottomBar / AccountMenu) 추출
purpose: ingradient-edge 의 4 chrome 컴포넌트를 @ingradient/edge-pages/chrome 으로 승격
audience: ingradient-ui contributor
date: 2026-05-19
status: draft
related:
  - ./edge-pages-extraction-roadmap.md
  - ./edge-pages-package-plan.md
  - ./edge-pages-phase-3-spec.md
---

# Phase 4 — App chrome 추출

> Roadmap: [edge-pages-extraction-roadmap.md](./edge-pages-extraction-roadmap.md) § Phase 4
> Phase 1~3 패턴 (props-driven view + i18n labels + slot) + **chrome 전용 고려사항** (electron drag region, portal-based dropdown, click-outside hook).

---

## 1. 목적

ingradient-edge 의 4 chrome 컴포넌트 (TitleBar 123줄 + TopBar 119줄 + BottomBar 163줄 + AccountMenu 131줄, 총 ~536줄) 를 pure view 로 추출. Phase 3 의 DatasetSelectView 가 slot 으로 받기로 한 `accountMenu` 의존성을 본 phase 에서 충족.

extraction 후 Workspace (Phase 5) / DatasetSelect (Phase 3) 양쪽에서 같은 chrome view 를 재사용.

---

## 2. 4 컴포넌트의 IPC / store / i18n 의존

각 view 의 container 잔류 의존을 먼저 매핑.

### 2.1 TitleBar

| 의존 | 종류 | container 잔류 |
|---|---|---|
| `window.electron.windowIsMaximized` | IPC (query) | ✅ |
| `window.electron.onWindowMaximizedChanged` | IPC (subscribe) | ✅ |
| `window.electron.windowMinimize/Maximize/Close` | IPC (action) | ✅ |
| `faviconUrl` (`/favicon.png`) | static asset | view 안 (storybook 도 가능) |

view 가 받는 것: `isMaximized: boolean`, `onMinimize` / `onMaximize` / `onClose` callback.

### 2.2 TopBar

| 의존 | 종류 | container 잔류 |
|---|---|---|
| `useDeviceStore` | zustand (isConnected, isConnecting) | ✅ |
| `useCameraStore.refreshStream` | zustand | ✅ |
| `useDatasetStore` | zustand (selectedDatasetName, selectedProjectName) | ✅ |
| `useAppStore` | zustand (setCameraSettingsOpen, canSetupCamera) | ✅ |
| `useCaptureStore.resetCapture` | zustand | ✅ |
| `useWorkspaceUIStore.setWorkspaceTab` | zustand | ✅ |
| `useTranslation` | i18n | ✅ |
| `CameraSettingsDialog` | child | slot prop |
| `LangSelector` | child | slot prop |
| `AccountMenu` | child | **본 phase 의 AccountMenuView** |
| `window.location.reload` | global side effect | ✅ |

### 2.3 BottomBar

| 의존 | 종류 | container 잔류 |
|---|---|---|
| `useSystemStatsStore` | zustand (latest, openModal) | ✅ |
| `useSyncStore` | zustand (status, pending, failed, reset) | ✅ |
| `useDeviceStore` | zustand (isConnected) | ✅ |
| `useWorkspaceUIStore` | zustand (deleteProgress) | ✅ |
| `useTranslation` | i18n | ✅ |
| `setTimeout` for auto-clear | side effect | container (auto-clear 책임) |

view 는 stats / sync status / connection 을 props 로만 받음.

### 2.4 AccountMenu

| 의존 | 종류 | container 잔류 |
|---|---|---|
| `useAuthStore` | zustand (currentUser, logout) | ✅ |
| `useAppStore.setAuthenticated` | zustand | ✅ |
| `useDatasetStore.resetDataset` | zustand | ✅ |
| `useCaptureStore.resetCapture` | zustand | ✅ |
| `useWorkspaceUIStore.resetWorkspaceUI` | zustand | ✅ |
| `useTranslation` | i18n | ✅ |
| `window.electron.clearSession/loadCredentials` | IPC | ✅ |
| `loadAccountHistory()` (localStorage) | storage | ✅ |
| `sessionStorage.setItem` | storage | ✅ |
| `useClickOutside` | UI hook | view 안 OK (UI-only) |
| `ReactDOM.createPortal` | UI | view 안 — DialogShell 자체 portal |

view 는 `currentUser`, `accountHistory` 를 props 로 받음. `clickOutside` 는 view 내부에서 처리 (visual-only).

---

## 3. 모듈 구조

```
packages/edge-pages/src/chrome/
├─ TitleBarView.tsx              — ≤ 120 줄
├─ TitleBarView.styles.ts        — Bar/LogoArea/LogoImg/LogoText/DragRegion/Controls/Btn (7 export)
├─ TopBarView.tsx                — ≤ 130 줄
├─ TopBarView.styles.ts          — 기존 components/TopBar.styles.ts 그대로 이전 (122 줄)
├─ BottomBarView.tsx             — ≤ 180 줄
├─ BottomBarView.styles.ts       — 신규 — BottomBar.tsx 의 inline styled (Row/LeftSection/RightSection/SyncChip/StatChip/NetIcon) 분리
├─ bottom-bar-helpers.ts         — `statColor` / `fmtPct` util
├─ AccountMenuView.tsx           — ≤ 140 줄
├─ AccountMenuView.styles.ts     — 기존 components/AccountMenu.styles.ts 그대로 이전 (128 줄)
├─ types.ts                      — 4 view props + sub-types
└─ index.ts                      — barrel
```

총 11 파일. 모두 ≤ 200.

설계 노트:
- TitleBar / BottomBar 는 styles 가 inline `styled-components` 로 컴포넌트 파일 안에 정의되어 있음 → 본 phase 에서 `*.styles.ts` 분리.
- TopBar / AccountMenu 는 이미 별도 styles 파일 존재 → 그대로 이전.
- `faviconUrl` (`/favicon.png`) 은 storybook 의 `public/` 에 동일 path 또는 prop 으로 받기. **결정**: prop `logoSrc: string` (caller 가 결정 — ingradient-edge 는 `/favicon.png`, storybook 도 동일 mount 가능).

---

## 4. Props Interface

### 4.1 TitleBarView

```ts
export interface TitleBarLabels {
  appName: string                                 // "Ingradient Edge"
  minimize: string                                // "최소화"
  maximize: string                                // "최대화"
  restore: string                                 // "복원"
  close: string                                   // "닫기"
}

export interface TitleBarViewProps {
  isMaximized: boolean
  logoSrc: string                                 // public asset URL
  logoAlt?: string                                // default "Ingradient"
  labels: TitleBarLabels
  onMinimize: () => void
  onMaximize: () => void
  onClose: () => void
}
```

설계 노트:
- 현재 edge TitleBar 는 한국어 hard-coded (`"최소화"` 등). 본 phase 에서 labels prop 으로 평문 받기.
- `appName` 도 labels — edge container 는 `'Ingradient Edge'` literal, storybook 도 동일.
- IPC 4개 (windowIsMaximized / onWindowMaximizedChanged / windowMinimize / windowMaximize / windowClose) 는 container.

### 4.2 TopBarView

```ts
export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected'

export interface TopBarLabels {
  refresh: string                                 // 'dataset.refresh'
  settingsTitle: string                           // 'topbar.settings'
  settingsDisabledTitle: string                   // 'Camera setup — permission required' literal
}

export interface TopBarViewProps {
  // breadcrumb
  selectedProjectName: string | null
  selectedDatasetName: string | null

  // status
  connectionStatus: ConnectionStatus
  connectionTitle: string                         // tooltip — already translated
  isRefreshing: boolean
  canSetupCamera: boolean

  // i18n
  labels: TopBarLabels

  // slots
  langSelector?: React.ReactNode
  accountMenu?: React.ReactNode                   // Phase 4 내부의 AccountMenuView 또는 placeholder
  settingsDialog?: React.ReactNode                // open 시 mount (caller 가 portal)

  // callbacks
  onBackToDatasets: () => void
  onRefresh: () => void
  onOpenSettings: () => void
}
```

설계 노트:
- TopBar 가 자체적으로 `CameraSettingsDialog` 를 ReactDOM.createPortal 로 mount — view 는 `settingsDialog` slot 으로 받음. container 가 portal 책임.
- breadcrumb 는 `selectedProjectName` / `selectedDatasetName` null 분기로 결정 (둘 다 null 이면 left section 비움).
- `connectionTitle` 은 caller 가 i18n 처리 후 평문 (Phase 3 와 동일 패턴).

### 4.3 BottomBarView

```ts
export type SyncStatus = 'idle' | 'syncing' | 'done' | 'error'

export interface SystemStats {
  cpu?: number       // 0-100
  memory?: number
  disk?: number
}

export interface BottomBarLabels {
  deletingSimple: string                          // 'bottombar.deletingSimple'
  syncing: (count: number) => string              // 'bottombar.syncing' w/ count
  syncDone: string                                // 'bottombar.syncDone'
  syncFailed: (count: number) => string           // 'bottombar.syncFailed' w/ count
  openMonitor: string                             // 'bottombar.openMonitor'
  connected: string                               // 'bottombar.connected'
  disconnected: string                            // 'bottombar.disconnected'
  diskUsage: (pct: string) => string              // 'bottombar.diskUsage' w/ pct
  cpuUsage: (pct: string) => string
  memoryUsage: (pct: string) => string
}

export interface BottomBarViewProps {
  isConnected: boolean
  syncStatus: SyncStatus
  syncPending: number
  syncFailed: number
  stats: SystemStats | null
  deleteProgress: boolean
  labels: BottomBarLabels
  onOpenMonitor: () => void
}
```

설계 노트:
- `statColor` / `fmtPct` helper 는 view 내부 (`bottom-bar-helpers.ts`). 색상 token 은 `var(--ig-color-*)` 로 cascade.
- `setTimeout` auto-clear (3초 후 syncStatus 'done' → idle) 는 container 잔류 — `syncStatus` 가 변경되어 props 로 들어옴.

### 4.4 AccountMenuView

```ts
export interface AccountUser {
  name: string
  email: string
}

export interface AccountHistoryEntry {
  email: string
  name: string
}

export interface AccountMenuLabels {
  account: string                                 // 'topbar.account'
  changeAccount: string                           // 'topbar.changeAccount'
  logout: string                                  // 'topbar.logout'
  accountHistory: string                          // 'topbar.accountHistory'
  noAccountHistory: string                        // 'topbar.noAccountHistory'
  cancel: string                                  // 'dataset.cancel'
}

export interface AccountMenuViewProps {
  currentUser: AccountUser | null
  accountHistory: AccountHistoryEntry[]

  // visual-only state lifted (storybook 에서 dropdown 열림 검증 위해)
  dropdownOpen: boolean
  changeAccountModalOpen: boolean

  labels: AccountMenuLabels

  onToggleDropdown: () => void
  onCloseDropdown: () => void                     // click-outside trigger
  onOpenChangeAccount: () => void
  onCloseChangeAccount: () => void
  onLogout: () => void
  onSelectAccount: (entry: AccountHistoryEntry) => void
}
```

설계 노트:
- `useClickOutside` 는 view 안에서 처리 — `accountMenuRef` ref + `onCloseDropdown` callback. 단 enabled 조건은 `dropdownOpen` prop.
- `currentUser === null` 이면 view 가 자체적으로 `return null` (edge 와 동일).
- `loadAccountHistory()` (localStorage) 는 container — view 는 array 만 받음.
- `prefillCredentials` 옵션 (TopBar 만 true) 은 container 의 `onSelectAccount` 구현에서 결정 — view 는 모름.

---

## 5. 변경 파일

### 5.1 신규 (11 file)

§3 의 chrome/ 11 파일 전부 신규.

### 5.2 수정 (1 file)

#### `packages/edge-pages/src/index.ts`

```diff
  export * from './login'
  export * from './license'
  export * from './dataset-select'
  export * from './dataset-modals'
+ export * from './chrome'
```

### 5.3 신규 fixture / story

본 phase 는 storybook story 신규 4개 작성 — 기존 edge story 에 chrome story 없음.

```
stories/pages/edge/0.0.1/chrome/
├─ TitleBar.stories.tsx              — 3 scenario (Normal / Maximized / Hover)
├─ TopBar.stories.tsx                — 4 scenario (NoDataset / WithDataset / Connecting / Refreshing)
├─ BottomBar.stories.tsx             — 5 scenario (Idle / Syncing / SyncDone / SyncError / Deleting)
└─ AccountMenu.stories.tsx           — 4 scenario (Closed / DropdownOpen / ChangeAccountModal / NoHistory)
```

각 story file ≤ 150 줄 목표.

`stories/fixtures/edge/0.0.1/` 신규:
- `system-stats.ts` — `{ cpu, memory, disk }` mock
- `account-history.ts` — `AccountHistoryEntry[]` mock

### 5.4 건드리지 않음

- `ingradient-edge/src/frontend/components/{TitleBar,TopBar,BottomBar,AccountMenu}*` — Phase 13
- ingradient-edge 의 각 store / i18n / IPC 코드 — Phase 13

---

## 6. i18n 키 매핑

### 6.1 TitleBarLabels

| labels.* | i18next key | 비고 |
|---|---|---|
| appName | (literal) `"Ingradient Edge"` | brand string |
| minimize | (literal) `"최소화"` | edge hard-coded — labels 평문 |
| maximize | (literal) `"최대화"` | edge hard-coded |
| restore | (literal) `"복원"` | edge hard-coded |
| close | (literal) `"닫기"` | edge hard-coded |

**hard-coded 정책**: edge 가 한국어 hard-coded → Phase 4 에서도 hard-coded literal 유지 (요청받은 것만 구현). 향후 i18n 처리는 별도 작업.

### 6.2 TopBarLabels

| labels.* | i18next key |
|---|---|
| refresh | `dataset.refresh` |
| settingsTitle | `topbar.settings` |
| settingsDisabledTitle | (literal) `'Camera setup — permission required'` |

`connectionTitle` 은 props 로 전달 (DatasetSelectView 와 동일 패턴).

### 6.3 BottomBarLabels

| labels.* | i18next key |
|---|---|
| deletingSimple | `bottombar.deletingSimple` |
| syncing(count) | `bottombar.syncing` w/ `{count}` |
| syncDone | `bottombar.syncDone` |
| syncFailed(count) | `bottombar.syncFailed` w/ `{count}` |
| openMonitor | `bottombar.openMonitor` |
| connected | `bottombar.connected` |
| disconnected | `bottombar.disconnected` |
| diskUsage(pct) | `bottombar.diskUsage` w/ `{pct}` |
| cpuUsage(pct) | `bottombar.cpuUsage` w/ `{pct}` |
| memoryUsage(pct) | `bottombar.memoryUsage` w/ `{pct}` |

### 6.4 AccountMenuLabels

| labels.* | i18next key |
|---|---|
| account | `topbar.account` |
| changeAccount | `topbar.changeAccount` |
| logout | `topbar.logout` |
| accountHistory | `topbar.accountHistory` |
| noAccountHistory | `topbar.noAccountHistory` |
| cancel | `dataset.cancel` |

---

## 7. 실행 순서

1. styles 이전:
   - `chrome/TitleBarView.styles.ts` — TitleBar.tsx 의 inline styled 분리
   - `chrome/BottomBarView.styles.ts` — BottomBar.tsx 의 inline styled 분리
   - `chrome/TopBarView.styles.ts` — TopBar.styles.ts 그대로 복사
   - `chrome/AccountMenuView.styles.ts` — AccountMenu.styles.ts 그대로 복사
2. `chrome/bottom-bar-helpers.ts` — `statColor` / `fmtPct` util
3. `chrome/types.ts` — 4 view props + sub-types
4. view 본체:
   - `chrome/TitleBarView.tsx`
   - `chrome/BottomBarView.tsx`
   - `chrome/AccountMenuView.tsx`
   - `chrome/TopBarView.tsx`
5. `chrome/index.ts` — barrel
6. `packages/edge-pages/src/index.ts` 수정
7. fixture 신규:
   - `stories/fixtures/edge/0.0.1/system-stats.ts`
   - `stories/fixtures/edge/0.0.1/account-history.ts`
8. story 4개 작성:
   - `stories/pages/edge/0.0.1/chrome/TitleBar.stories.tsx`
   - `stories/pages/edge/0.0.1/chrome/TopBar.stories.tsx`
   - `stories/pages/edge/0.0.1/chrome/BottomBar.stories.tsx`
   - `stories/pages/edge/0.0.1/chrome/AccountMenu.stories.tsx`
9. typecheck + build + storybook build

---

## 8. 검증

| # | 명령 | 기대 결과 |
|---|---|---|
| 1 | `ls packages/edge-pages/src/chrome/` | 11 파일 |
| 2 | `cd packages/edge-pages && npx tsc --noEmit` | 0 error |
| 3 | `cd packages/edge-pages && npm run build` | 4 view export 포함 |
| 4 | 각 파일 `wc -l` | 모두 < 200 |
| 5 | `npx tsc --noEmit -p tsconfig.json` (root) | 0 error |
| 6 | `npm run build:storybook` | exit 0 |
| 7 | Storybook 수동 확인 — 16 scenario 모두 렌더 | TitleBar 3 + TopBar 4 + BottomBar 5 + AccountMenu 4 |
| 8 | grep — 금지 import 0 | `grep -rE 'useTranslation\|window\.electron\|zustand\|i18next\|localStorage\|sessionStorage' packages/edge-pages/src/chrome/` → 0 match |

---

## 9. 성공 기준

- 검증 1~8 통과
- 4 chrome view 가 store/IPC/i18n hook/storage 의존 0
- 16 storybook scenario 가 props 만으로 렌더
- AccountMenuView 가 Phase 3 의 DatasetSelectView 의 `accountMenu` slot 으로 plug-and-play 가능 (수동 확인 — DatasetSelect story 에 `accountMenu={<AccountMenuView ... />}` 넣어보기)
- diff 가 ~20 file 범위 (신규 ~18 + 수정 2)

---

## 10. 리스크

### 10.1 electron `-webkit-app-region: drag` 의 storybook 거동

위험: 브라우저에서 `drag` CSS 는 무효 — visual 영향 없지만 차이 인지 필요.

대응:
- view 내부 styles 그대로 유지 — electron 에서만 의미 있음, storybook 에선 무시
- TitleBar story 의 docs 에 "draggable region only works inside Electron" 명시
- 별도 처리 불필요

### 10.2 `useClickOutside` 가 view 안에 있는 거 적절한가?

위험: `useClickOutside` 는 visual-only 라 view 가 가져도 OK 지만, ref 가 view 외부에서 필요한 경우 (예: container 가 manual close 트리거) 충돌.

대응:
- `useClickOutside` 는 view 내부 ref + props `dropdownOpen` 기반 — visual concern.
- container 의 manual close 는 `onCloseDropdown` callback 으로 자체 분기 (예: 외부 click 으로 close 시 callback 실행)
- 본 phase 채택: view 안 hook + `enabled: dropdownOpen` + callback `onCloseDropdown`

### 10.3 BottomBar 의 `setTimeout` 3초 auto-clear 위치

위험: edge 는 view 안 `useEffect` 로 `setTimeout(resetSync, 3000)`. view 가 side effect (zustand store mutation) 하므로 pure view 원칙 위반.

대응:
- side effect 는 container 잔류
- view 는 `syncStatus` prop 변경 시 그대로 render
- container 가 syncStatus 'done' watch + setTimeout + zustand reset 호출
- view 는 모름 — 단순 render

### 10.4 TopBar 의 `window.location.reload`

위험: edge `handleRefresh` 가 disconnect 상태에서 `window.location.reload()` 호출. view 안에선 금지 (side effect).

대응:
- container 가 `handleRefresh` 책임 — `isConnected` 분기 + reload 호출
- view 는 `onRefresh` callback 만 — 동작 모름
- `isRefreshing: boolean` prop 으로 spinner 표시만

### 10.5 `loadAccountHistory()` 의 호출 시점

위험: edge AccountMenu 는 매 render 마다 `loadAccountHistory()` 호출 (localStorage 동기 read). view 에 옮기면 storybook 에서 localStorage 부재.

대응:
- container 가 mount 시 한 번 `loadAccountHistory()` 호출 + state 보관
- view 는 `accountHistory: []` prop 만 받음
- storybook 은 fixture array 전달

### 10.6 portal 책임

위험: AccountMenu 의 `ReactDOM.createPortal` (DialogShell mount 시), TopBar 의 `CameraSettingsDialog` portal — view 안에 portal 두면 storybook root 와 충돌.

대응:
- AccountMenuView 의 ChangeAccount modal 은 view 안에서 DialogShell 직접 render (portal 책임은 `@ingradient/ui` 의 DialogShell 자체)
- TopBarView 의 `settingsDialog` 는 slot prop (caller 가 portal 책임)
- 두 패턴 혼재되어도 OK — Phase 3 의 dataset 모달도 비슷

### 10.7 `prefillCredentials` 분기

위험: edge 의 AccountMenu 는 `prefillCredentials: boolean` prop 으로 동작 차이 — TopBar (true) vs DatasetSelect (false). 본 phase view 는 이 분기를 어떻게 받을지.

대응:
- view 는 모름 — `onSelectAccount(entry)` callback 만
- container 의 callback 구현이 prefill 여부 분기 (TopBar container 는 true, DatasetSelect container 는 false)
- view 의 props 에 `prefillCredentials` 없음

### 10.8 `currentUser === null` 가드

위험: AccountMenu 는 `currentUser === null` 시 `return null`. view 에 유지해도 OK 지만, storybook 에선 `null` 시 빈 화면.

대응:
- view 의 `currentUser: AccountUser | null` 받음. null 시 view 자체가 `return null`
- storybook 한 scenario 는 `currentUser: null` 로 빈 render 확인 (선택)

---

## 11. Rollback

git revert. 산출물:
- `packages/edge-pages/src/chrome/` 디렉토리 삭제
- `packages/edge-pages/src/index.ts` 의 chrome export 제거
- `stories/pages/edge/0.0.1/chrome/` 디렉토리 삭제
- 신규 fixture 2개 삭제
- `npm run build --workspace packages/edge-pages` 재실행

---

## 12. 종료 후 상태

- `@ingradient/edge-pages` 가 9 view export 누적 (Login / License / DatasetSelect / AddDatasetModal / ExportModal / CreateProjectForm / TitleBar / TopBar / BottomBar / AccountMenu)
- Phase 3 의 DatasetSelectView 가 AccountMenuView 를 slot 으로 받아 storybook 에서 통합 동작
- chrome 패턴 검증 — electron drag region, click-outside, portal-based dialog
- Phase 5 (WorkspaceView shell) 진입 준비 완료 — chrome 4개가 Workspace 의 outer layout 에 plug-in

---

## 13. 다음 액션

1. 본 spec ok
2. 실행 (§7 의 9 step)
3. 검증 (§8 의 8 step)
4. Phase 5 spec 작성 (`edge-pages-phase-5-spec.md`) — WorkspaceView shell 분리
