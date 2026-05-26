---
title: Phase 14 — Edge App Shell + MainLayout 통합 view 추출
purpose: ingradient-edge 의 electron 전체 화면 (TitleBar + content + BottomBar + MainLayout 의 3-panel) 을 @ingradient/edge-pages/app-shell 로 추출. storybook 에서 실제 electron 앱과 동일한 통합 화면 검증 가능하게
audience: ingradient-ui contributor
date: 2026-05-19
status: draft
related:
  - ./edge-pages-extraction-roadmap.md
  - ./edge-pages-package-plan.md
  - ./edge-pages-phase-12-spec.md
  - ./edge-pages-usage.md
---

# Phase 14 — Edge App Shell + MainLayout 통합 view 추출

> Roadmap 확장: Phase 11 까지 page-level + chrome view 가 모두 추출됐고 Phase 12 에서 정리됐으나, **electron 앱 전체 화면 layout** (TitleBar + content + BottomBar + MainLayout 3-panel) 통합 view 가 미추출. 본 phase 가 이를 보강.

---

## 1. 목적

지금까지 추출한 60 view 는 모두 page-level 또는 sub-component 단위. **electron 실행 시 보이는 전체 화면 모양** (chrome + content + footer + side panels) 으로 통합된 view 가 없음. 사용자가 storybook 에서 "edge 앱을 실제로 켰을 때" 의 화면을 확인하려면 통합 layout view 가 필요.

대상 ingradient-edge 코드:

- `src/frontend/app/App.tsx` (456 줄) 의 render JSX (line 385-444, ~60 줄) — 전체 shell layout
- `src/frontend/app/MainLayout.tsx` (118 줄) — Workspace 모드의 3-panel layout

본 phase 후 storybook 에서 다음 시나리오 검증 가능:

- "Offline mode, Login screen 표시" 전체 화면
- "Offline mode, DatasetSelect 표시" 전체 화면
- "Online mode, Workspace + LogPanel + RightPanel" 전체 화면
- "Workspace labeling 모드 (SequencePatternPanel 좌측)" 전체 화면
- "SystemMonitorModal 띄운 상태"

---

## 2. JSX 출처

### 2.1 App.tsx 의 render JSX (line 385-444)

```tsx
return (
  <>
    <SystemMonitorModal />
    {isShuttingDown && <ShutdownOverlay><Spinner /></ShutdownOverlay>}
    {isResolving && <ShutdownOverlay><Spinner /></ShutdownOverlay>}

    <AppRoot>
      <TitleBar />
      <AppContent>
        {/* Offline mode 4-way 분기 */}
        {!isResolving && mode === 'offline' && (
          <>
            {ENABLE_OFFLINE_LICENSE_GATE && !licenseValid && <LicenseScreen ... />}
            {licenseValid && (!packageLoaded || !currentUser) && <LoginScreen mode="offline" />}
            {licenseValid && packageLoaded && currentUser && !selectedDatasetId && <DatasetSelectScreen />}
          </>
        )}
        {/* Online mode 2-way 분기 */}
        {!isResolving && mode === 'online' && (
          <>
            {!currentUser && <LoginScreen mode="online" config={...} />}
            {currentUser && !selectedDatasetId && <DatasetSelectScreen config={...} />}
          </>
        )}
        {/* Workspace */}
        {!isResolving && /* unified gate */ && (
          <MainLayout><Workspace platformBaseUrl={...} /></MainLayout>
        )}
      </AppContent>
      {showFooter && <AppFooterBar><BottomBar /></AppFooterBar>}
    </AppRoot>
  </>
)
```

핵심:
- `AppRoot` flex column (height: 100vh)
- `TitleBar` 고정 36px
- `AppContent` flex: 1 (page 가 표시되는 영역)
- `AppFooterBar` 고정 28px (footer)
- mode + 인증 state 기반 4 페이지 분기
- `SystemMonitorModal` portal
- shutdown / resolving overlay

### 2.2 MainLayout.tsx (118줄)

```tsx
<AppShell>                            {/* radial gradient bg */}
  <AppHeader>                         {/* 48px, glass blur */}
    <TopBar />
  </AppHeader>
  <PanelsRow>                         {/* flex row, gap 10px */}
    <LeftPanel>                       {/* 240px */}
      {hasSequence ? <SequencePatternPanel /> : <LogPanel />}
    </LeftPanel>
    <CenterPanel>                     {/* flex: 1 */}
      {children}                      {/* Workspace */}
    </CenterPanel>
    <RightPanelContainer>              {/* 280px */}
      <RightPanel />
    </RightPanelContainer>
  </PanelsRow>
  {isCapturing && <CapturingBlocker />}
</AppShell>
```

핵심:
- 3-panel layout: 240 / flex / 280
- LeftPanel content 토글 (LogPanel ↔ SequencePatternPanel) — `hasSequence` 결정
- Capturing blocker (모달 백드롭, isCapturing 시 활성)
- AppShell 의 radial gradient 배경

---

## 3. 책임 경계

view 안 OK:
- styled layout (AppRoot / AppContent / AppFooterBar / AppShell / AppHeader / PanelsRow / LeftPanel / CenterPanel / RightPanelContainer / Panel surface / CapturingBlocker / ShutdownOverlay)
- shell 분기 (mode + 인증 state) — props 로 받음
- 3-panel layout

container 잔류 (ingradient-edge 측):
- `useDeviceStore`, `useSequencePanelStore` 의 hook
- mode / isResolving / packageLoaded / currentUser / selectedDatasetId state
- IPC (getEdgeConfig / loadSession / etc)
- shutdown / connectivity / package load 등 모든 effect

---

## 4. 모듈 구조

```
packages/edge-pages/src/app-shell/
├─ EdgeAppShellView.tsx               — outer shell (TitleBar + content + BottomBar)  ≤ 130 줄
├─ EdgeAppShellView.styles.ts         — AppRoot / AppContent / AppFooterBar / ShutdownOverlay
├─ MainLayoutView.tsx                 — 3-panel layout (TopBar + Left/Center/Right)  ≤ 100 줄
├─ MainLayoutView.styles.ts           — AppShell / AppHeader / PanelsRow / Panel surface / CapturingBlocker
├─ types.ts                           — props + view enum types
└─ index.ts                           — barrel
```

총 6 파일 + 통합 storybook story.

---

## 5. Props Interface

### 5.1 EdgeAppShellView

```ts
import type { ReactNode } from 'react'

export type AppShellMode = 'offline' | 'online' | 'resolving'

export interface EdgeAppShellViewProps {
  // status
  isResolving: boolean
  isShuttingDown: boolean
  showFooter: boolean

  // slots
  titleBar: ReactNode                 // <TitleBarView ...> from chrome/
  content: ReactNode                  // 현재 모드/state 에 맞는 page (caller 결정)
  bottomBar?: ReactNode               // <BottomBarView ...> (showFooter 시)
  systemMonitorModal?: ReactNode      // <SystemMonitorModalView ...> open 시
}
```

설계 노트:
- AppRoot / AppContent / AppFooterBar 는 view 안 styled
- ShutdownOverlay / isResolving spinner 도 view 안 처리 (단순 boolean → JSX)
- 분기 (mode + 인증 state) 는 view 가 모름 — caller 가 적절한 `content` 결정
- portal 처리는 systemMonitorModal slot 자체가 책임 (caller 가 mount 시점 결정)

### 5.2 MainLayoutView

```ts
export interface MainLayoutViewProps {
  topBar: ReactNode                   // <TopBarView ...>
  leftPanel: ReactNode                // <LogPanelView ...> 또는 <SequencePatternPanelView ...>
  centerContent: ReactNode            // <WorkspaceView ...>
  rightPanel: ReactNode               // <RightPanelView ...>
  isCapturing: boolean                // CapturingBlocker 표시 여부
}
```

설계 노트:
- 3-panel layout 자체만 책임. children 결정은 caller.
- leftPanel toggle (LogPanel ↔ SequencePatternPanel) 도 caller 가 결정 — view 는 ReactNode 만 받음.
- isCapturing blocker 만 view 가 직접 처리 (단순 boolean → fixed overlay).

---

## 6. 변경 파일

### 6.1 신규 (6 file)

§4 의 app-shell/ 6 파일.

### 6.2 수정 (1 file)

`packages/edge-pages/src/index.ts`:

```diff
  export * from './system'
+ export * from './app-shell'
```

### 6.3 신규 storybook (통합 stories)

```
stories/pages/edge/0.0.1/AppShell.stories.tsx     — 6~8 scenario:
  - OfflineLoading           (isResolving=true)
  - OfflineLogin             (mode=offline, no user)
  - OfflineLicenseGate       (license invalid)
  - OnlineLogin              (mode=online, no user)
  - DatasetSelect            (user but no dataset)
  - WorkspaceCapture         (full workspace + LogPanel + RightPanel)
  - WorkspaceLabeling        (SequencePatternPanel 좌측, labeling 모드)
  - SystemMonitorOpen        (modal 띄움)
```

각 scenario 는 본 phase 의 EdgeAppShellView + (Workspace 시) MainLayoutView 를 마운트하고, slot 들에 기존 추출된 view (Login / License / DatasetSelect / Workspace / chrome 4 / LogPanel / RightPanel / SystemMonitor) 를 채움.

target 줄 수: ~300 (8 scenario × ~30 line × scene helper).

### 6.4 신규 fixture (필요 시)

기존 fixture 재사용:
- `system-stats.ts`, `account-history.ts` (chrome)
- `dataset-groups.ts` (DatasetSelect)
- `workspace-tabs.ts` (Workspace)

신규 부분 없음. 본 phase 의 story 가 위 fixture 들을 조합.

---

## 7. 실행 순서

1. `app-shell/EdgeAppShellView.styles.ts` 작성 (AppRoot / AppContent / AppFooterBar / ShutdownOverlay)
2. `app-shell/MainLayoutView.styles.ts` 작성 (AppShell / AppHeader / PanelsRow / Panel / CapturingBlocker)
3. `app-shell/types.ts`
4. `app-shell/EdgeAppShellView.tsx`
5. `app-shell/MainLayoutView.tsx`
6. `app-shell/index.ts`
7. `packages/edge-pages/src/index.ts` 갱신
8. `stories/pages/edge/0.0.1/AppShell.stories.tsx` — 8 scenario
9. typecheck + build + storybook build

---

## 8. 검증

| # | 명령 | 기대 |
|---|---|---|
| 1 | `ls packages/edge-pages/src/app-shell/` | 6 파일 |
| 2 | `cd packages/edge-pages && npx tsc --noEmit` | 0 error |
| 3 | `cd packages/edge-pages && npm run build` | EdgeAppShellView + MainLayoutView export |
| 4 | 모든 view 파일 `wc -l` | < 200 |
| 5 | `npx tsc --noEmit -p tsconfig.json` (root) | 0 error |
| 6 | `npm run build:storybook` | exit 0 |
| 7 | Storybook 수동 — 8 통합 scenario | 모두 props 만으로 렌더 |
| 8 | grep — 금지 import 0 | `grep -rE 'useTranslation\|window\.electron\|zustand\|i18next\|useDeviceStore\|useSequencePanelStore' packages/edge-pages/src/app-shell/` → 0 match |
| 9 | 통합 시나리오 시각 검증 | Workspace 모드에서 TitleBar+TopBar+LogPanel+Workspace+RightPanel+BottomBar 가 모두 한 화면에 보이는지 |

---

## 9. 성공 기준

- 검증 1~9 통과
- 2 신규 view (EdgeAppShellView / MainLayoutView) 가 ReactNode slot 만 받음 — store/IPC/i18n 의존 0
- 8 storybook scenario 가 props 만으로 electron 앱의 실제 화면을 재현
- 모든 파일 < 200 줄
- Phase 12 의 검증 (모든 view 가 edge-pages import only) 깨지지 않음

---

## 10. 리스크

### 10.1 storybook 안에서 portal / fullscreen / blur backdrop 동작 차이

위험: electron 의 backdrop-filter / radial-gradient 배경이 storybook iframe 에서 다르게 렌더.

대응:
- view 안 styles 그대로 유지 — storybook 도 동일하게 동작 (DOM 기반)
- backdrop-filter 미지원 브라우저 fallback 은 edge 와 동일
- 시각 차이 있어도 layout 구조 검증에는 영향 없음

### 10.2 SystemMonitorModal 가 portal (document.body) mount

위험: storybook 의 root 와 충돌 가능.

대응:
- modal view 자체는 이미 Phase 11 에서 DialogShell wrapper — `@ingradient/ui` 의 DialogShell 이 portal 책임
- shell view 는 slot 으로 ReactNode 만 받음 — portal 동작은 child 가 자체 처리
- story 의 한 scenario (SystemMonitorOpen) 에서 modal 마운트 확인

### 10.3 isResolving / isShuttingDown overlay 의 z-index

위험: TitleBar (electron drag region) 위에 overlay 가 덮히면 드래그 못 함.

대응:
- ShutdownOverlay z-index 9999, AppRoot 안에 위치
- electron 에선 윈도우 자체가 unresponsive 라 드래그 불필요
- storybook 에선 visual 만 확인

### 10.4 fixed footer 의 width

위험: AppFooterBar 가 height: 28px fixed 인데 flex-shrink: 0 인지 확인.

대응:
- edge 의 App.tsx (line 42-51) 그대로 복사
- height: 28px + flex-shrink: 0 이미 있음 — 변경 없음

### 10.5 MainLayout 의 3-panel 가로 width 가 240 + flex + 280 합산

위험: 작은 viewport (storybook 좁은 iframe) 에서 깨짐.

대응:
- 기본 동작 그대로 (LeftPanel 240px fixed / RightPanel 280px fixed / CenterPanel flex)
- 매우 좁은 viewport (< 600px) 는 edge 가 지원 안 함 — storybook 의 기본 layout 으로 충분

### 10.6 `surfacePanel` 의 @ingradient/ui import

위험: MainLayout 이 `@ingradient/ui` 의 `surfacePanel` mixin 사용. edge-pages 의 styles 가 같은 import 가능한지 확인.

대응:
- `@ingradient/ui` 의 export 목록에 `surfacePanel` 있는지 grep 확인 (실행 시점)
- 없으면 inline mixin 작성

### 10.7 통합 story 의 props 폭증

위험: storybook scenario 가 8개 × 각각 모든 view 의 props 채우면 story 파일이 비대해짐 (~400+ 줄).

대응:
- scene helper 함수로 묶음 (`buildLoginViewProps()` / `buildWorkspaceViewProps()` 등)
- 또는 fixture 안에 미리 props object 정의
- 200~300 줄 목표

---

## 11. Rollback

git revert. 산출물:
- `packages/edge-pages/src/app-shell/` 디렉토리 삭제
- `packages/edge-pages/src/index.ts` 의 app-shell export 제거
- `stories/pages/edge/0.0.1/AppShell.stories.tsx` 삭제
- `npm run build --workspace packages/edge-pages` 재실행

Phase 1~12 결과 영향 없음.

---

## 12. 종료 후 상태

- `@ingradient/edge-pages` 가 62+ view export (Phase 1-11 의 60 + 본 phase 의 2)
- electron 앱 전체 화면이 storybook 에 통합 view 로 표시
- ingradient-edge 측 마이그레이션 (Phase 13) 시 `EdgeAppShellView` + `MainLayoutView` 로 App.tsx 의 render JSX 도 view 호출로 축소 가능
- Phase 13.1 (sync script) → 13.2 (Login) 등 sub-phase 진행 후 13.X 에서 App.tsx 도 같이 마이그레이션 (또는 별도 sub-phase 추가)

---

## 13. 다음 액션

1. 본 spec ok
2. 실행 (§7 의 9 step)
3. 검증 (§8 의 9 step)
4. (필요 시) Phase 13 spec 의 sub-phase 에 App.tsx 마이그레이션 추가
