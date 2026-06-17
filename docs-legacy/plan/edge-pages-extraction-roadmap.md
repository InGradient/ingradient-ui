---
title: Edge Pages Extraction Roadmap
purpose: ingradient-edge 의 frontend 화면을 ingradient-ui 안 신규 워크스페이스 `packages/edge-pages` 로 점진적·안전하게 추출하기 위한 실행 계획
audience: ingradient-ui contributor / ingradient-edge frontend developer
date: 2026-05-18
status: draft
related:
  - ./edge-pages-package-plan.md
  - ./platform-pages-extraction-roadmap.md
  - ./platform-pages-package-plan.md
  - ./platform-edge-migration-roadmap.md
---

# Edge Pages Extraction Roadmap

> 본 문서는 [edge-pages-package-plan.md](./edge-pages-package-plan.md) 의 실행 가이드. plan 문서는 "왜 / 무엇을 / 어디에" 를 정의하고, 본 문서는 "어떤 순서로 / 어디까지 한 번에" 를 정의한다.

> 사전 참고 — `@ingradient/platform-pages` 가 같은 패턴으로 이미 추출 완료 ([platform-pages-extraction-roadmap.md](./platform-pages-extraction-roadmap.md)). 본 로드맵은 동일 구조를 edge 에 적용.

---

## 1. 목표 한 줄 요약

`ingradient-edge/src/frontend/` 의 page-level + 큰 component-level JSX 를 **import 가능한 view 레이어** (`@ingradient/edge-pages`) 로 끌어올려, storybook 과 ingradient-edge 가 **동일 JSX 에 서로 다른 props 만 주입**하는 구조로 만든다.

---

## 2. 현재 상태 (2026-05-18)

### 2.1 ingradient-edge 측

| 위치 | 파일 | 줄 수 | 비고 |
|---|---|---|---|
| `src/frontend/pages/Workspace.tsx` | 1 파일 | **933** | 최대. labeling 분기 + 4 탭 + side effect 다수 |
| `src/frontend/pages/DatasetSelectScreen.tsx` | 1 파일 | 298 | dataset grid + dot menu |
| `src/frontend/pages/LicenseScreen.tsx` | 1 파일 | 157 | license key 입력 + status |
| `src/frontend/pages/LoginScreen.tsx` | 1 파일 | 143 | online/offline + 세션/저장계정 |
| `src/frontend/components/capture/ImagesView.tsx` | 1 파일 | **1223** | 최대. dataset image grid + 모달 |
| `src/frontend/components/capture/BBoxCanvas.tsx` | 1 파일 | **701** | labeling canvas + SAM ROI |
| `src/frontend/components/capture/SetupPanel.tsx` | 1 파일 | 438 | deflectometry config form |
| `src/frontend/components/capture/CaptureView.tsx` | 1 파일 | 349 | live camera + capture button |
| `src/frontend/components/settings/FieldTestTab.tsx` | 1 파일 | 541 | field test orchestrator |
| `src/frontend/components/settings/CameraParamsTab.tsx` | 1 파일 | 322 | camera tuning |
| `src/frontend/components/settings/CameraSettingsDialog.tsx` | 1 파일 | 233 | settings modal shell |
| `src/frontend/components/settings/AboutTab.tsx` | 1 파일 | 211 | release / license / update |
| `src/frontend/components/settings/connection/` | 14 파일 | ~1500 추정 | scan/connect/diag/nic 등 |
| `src/frontend/components/stats/StaticsView.tsx` + 4 charts | 5 파일 | ~574 | stats 탭 |
| `src/frontend/components/labeling/RightPanel.tsx` + comment | 2 파일 | ~304 | 라벨링 sidebar |
| `src/frontend/components/log/LogPanel.tsx` | 1 파일 | 154 | 하단 log panel |
| `src/frontend/components/system/SystemMonitorModal.tsx` 외 | 6 파일 | ~478 | 시스템 모니터 |
| `src/frontend/components/dataset/AddDatasetModal.tsx`, `ExportModal.tsx`, `CreateProjectForm.tsx` | 3 파일 | ~332 | dataset 모달 |
| `src/frontend/components/TitleBar/TopBar/BottomBar/AccountMenu` | 4 파일 | ~532 | 앱 chrome |

총 약 **70+ 파일**, 합 ~9000줄 추정 (200줄 룰 위반 14 파일 이상).

### 2.2 ingradient-ui 측

이미 존재:

- `packages/platform-pages/` — `@ingradient/platform-pages` (catalog/class-manage/create-project/dashboard/settings-modal). 본 로드맵의 참조 패턴.
- `stories/pages/edge/0.0.1/Login.stories.tsx` (120줄), `License.stories.tsx` (145줄), `DatasetSelect.stories.tsx` (135줄) — inline mockup. 재사용 layer 아님.
- `stories/fixtures/edge/0.0.1/` — fixture, preset, devices.

`@ingradient/edge-pages` 는 아직 없음 → 본 로드맵의 Phase 0 에서 신설.

---

## 3. 접근 방식

[platform-pages-package-plan.md](./platform-pages-package-plan.md) 의 Stage A (sub-export) → Stage B (workspace 분리) 두 단계를 거쳤던 platform-pages 와 달리, **edge-pages 는 처음부터 `packages/edge-pages/` 워크스페이스로 직접 신설**한다. platform-pages 가 이미 workspace 구조를 검증했고 동일 tsup/tsconfig 패턴을 그대로 복제하면 되기 때문이다.

### 3.1 의존 방향

```
@ingradient/ui
  ↑
@ingradient/edge-pages
  ↑
ingradient-edge
```

`@ingradient/edge-pages` 는 `@ingradient/ui` 의 sub-export 만 사용한다. 반대 방향 import 금지.

---

## 4. 책임 경계

| 위치 | 역할 | 금지 |
|---|---|---|
| `@ingradient/ui` (`packages/ui` 가 아닌 `src/`, 기존 유지) | primitives / components / patterns / tokens | edge 도메인 page |
| `packages/edge-pages/src/*` | edge 화면 JSX, props-driven, pure view | electron IPC, zustand store, fetch, sql.js, i18next react hook, file system |
| `stories/pages/edge/*` | scenario + fixture + scene hook + storybook meta | 도메인 JSX 직접 조립 (가능하면 view import) |
| `ingradient-edge/src/frontend/pages/*` | container — store, IPC, i18n, view 에 props 주입 | page JSX 재구현 |

### 4.1 허용되는 local state (`edge-pages` 내부)

- accordion open/close
- hovered item / tab switch (visual only)
- uncontrolled input focus
- canvas 의 viewport pan/zoom (UI-only)

금지:

- `window.electron.*` 호출 (모든 IPC 는 container 에서 props 로)
- zustand store 직접 구독 (`useDeviceStore`, `useAuthStore` 등)
- `useTranslation()` (i18n string 은 props 로 — `labels: { signIn: '...', ... }` 패턴)
- side effect 가 있는 useEffect (network/IPC/storage)

### 4.2 i18n 처리 원칙

container 가 `t('...')` 호출 결과를 `labels` prop 으로 묶어 view 에 전달. view 는 `labels.signIn` 같이 평문 string 으로만 받음. 이유: edge-pages 가 storybook 에서도 i18n provider 없이 렌더 가능해야 함.

---

## 5. Phase 구성

각 Phase 는 platform-pages 와 동일한 4 step:

1. **Spec 작성** — `docs/plan/edge-pages-phase-<N>-spec.md` 신규 문서. props 인터페이스, view 분해, 변경 파일 목록, 검증 기준, i18n key → label prop 매핑.
2. **사용자 ok 대기** — spec 검토 후 진행 신호.
3. **실행** — code 변경.
4. **검증** — typecheck + build:package + (해당 시) build:storybook + 영향받는 story 렌더 + ingradient-edge 측 `npx tsc --noEmit` (consumer 영향 확인).

Phase 진입 사이에 사용자 ok. 한 번에 여러 Phase 진행 금지.

---

### Phase 0 — packages/edge-pages 스캐폴드

목적: 워크스페이스 + tsup/exports/tsconfig 배선. 실제 view 이동 없음.

작업 단위:
- `packages/edge-pages/package.json` — `@ingradient/edge-pages`. peerDependencies: react, react-dom, styled-components, `@ingradient/ui`. (platform-pages 의 `@dnd-kit/core` 는 edge 가 안 쓰면 제외)
- `packages/edge-pages/src/index.ts` (빈 export)
- `packages/edge-pages/tsup.config.ts` (platform-pages 와 동일 패턴)
- `packages/edge-pages/tsconfig.json` (platform-pages tsconfig 복제)
- root `package.json` `workspaces` 는 이미 `packages/*` 패턴 — 추가 변경 없음. 확인만.
- 검증: `npm run build` (edge-pages) 성공 → `packages/edge-pages/lib/index.{js,d.ts}` 존재.

성공 기준: 빈 entry 가 빌드되고 `import {} from '@ingradient/edge-pages'` 가능.

### Phase 1 — LoginView 추출

가장 단순한 form page. 패턴 검증용.

작업 단위:
- spec: `LoginViewProps` 정의 — mode, email, password, savePassword, keepSignedIn, error, loggingIn, packageInfo, savedSession, otherAccounts, externalUrl + handler (onEmailChange, onPasswordChange, onSavePasswordChange, onKeepSignedInChange, onSubmit, onContinueSession, onSelectAccount, onChangeAccount, onLoadPackage, onOpenSettings, onOpenSignup) + labels (signInTitle, emailLabel, passwordLabel, ...).
- `packages/edge-pages/src/login/LoginView.tsx`, `LoginView.styles.ts` (`LoginScreen.styles.ts` 이전), `types.ts`, `index.ts`.
- LangSelector / CameraSettingsDialog 같이 edge 전용 dialog 는 **slot prop** 으로 받는다 (`langSelector?: React.ReactNode`, `settingsDialog?: React.ReactNode`).
- `packages/edge-pages/src/index.ts` 에 `export * from './login'`.
- story rewrite: `stories/pages/edge/0.0.1/Login.stories.tsx` 의 inline `LoginScene` 을 `<LoginView ... />` import 기반으로 교체. scenario (Online / Offline / InvalidCredentials / Submitting) 유지.
- 검증: edge-pages build + storybook build + 기존 4 scenario probe.

성공 기준: story file 의 inline mockup 삭제. story file ≤ 120 줄.

### Phase 2 — LicenseView 추출

License key 입력 + status display.

작업 단위:
- spec: `LicenseViewProps` — status ('loading'|'valid'|'invalid'|'missing'), licenseKey, error, submitting + handler (onKeyChange, onSubmit, onClear) + labels.
- `packages/edge-pages/src/license/LicenseView.tsx` + styles + types + index.
- story rewrite.
- 검증: 동일.

### Phase 3 — DatasetSelectView 추출

dataset grid + add/export/delete 모달 + dot menu.

작업 단위:
- spec: `DatasetSelectViewProps` — datasets[], onSelect, onCreateProject, onAdd, onExport, onDelete, onOpenSettings, addModal/exportModal/deleteConfirm 같은 모달 상태는 slot 으로 받거나 view 안 visual-only state 로.
- subview: `DatasetGrid`, `DatasetCard`, `DotMenu` (`DatasetSelectScreen.styles.ts` 의 sub-styles 분해)
- 모달 분리: `AddDatasetModalView`, `ExportModalView`, `CreateProjectFormView` 동시 추출 (edge-pages 내 `dataset-modals/` sub-folder).
- story: 신규 `DatasetSelect.stories.tsx` 가 이미 있음 → rewrite.
- 검증: 동일.

### Phase 4 — App chrome (TitleBar, TopBar, BottomBar, AccountMenu) 추출

Workspace 외부 chrome. 비교적 단순한 4 컴포넌트.

작업 단위:
- spec: 각 4 컴포넌트의 props (current user, mode tag, online indicator, sync queue status, system stats, account dropdown 등).
- `packages/edge-pages/src/chrome/{TitleBarView,TopBarView,BottomBarView,AccountMenuView}.tsx`.
- 검증: 동일.

성공 기준: chrome 4 컴포넌트가 zustand store 의존 0. 모두 props 로 받음.

### Phase 5 — WorkspaceView shell 분리

가장 큰 page (933줄). 본 phase 는 **shell + 탭 라우팅 + labeling 분기만** 분리. CaptureView / ImagesView / StaticsView / SetupPanel 자체는 Phase 6~8 로 미룸.

작업 단위:
- spec: `WorkspaceViewProps` — activeTab, tabItems, isCapturing, capturingStatusText, pendingCapture (labeling 분기 트리거), sequenceFailure (dialog), setupPanel slot, captureContent slot, imagesContent slot, staticsContent slot, labelingContent slot + handler (onTabChange, onSequenceFailureCancel, onSequenceFailureRetry).
- pure view 가 받는 것:
  - `mode: 'main' | 'labeling'` (pendingCapture 유무로 container 가 결정)
  - main 모드: Tab 헤더 + slot 으로 탭 컨텐츠 swap
  - labeling 모드: labeling slot (BBoxCanvas 또는 CaptureReview) + sequenceFailure dialog + capturing pill
- side effect (camera pause/resume, sam-roi event listener, sequence stats upload) 는 container 잔류.
- 검증: ingradient-edge 측 `tsc --noEmit` 통과. 별도 story 는 본 phase 에선 skip (slot 패턴이라 직접 storybook 화 어려움 — Phase 6~8 에서 sub-view 단위 story 작성).

성공 기준: `Workspace.tsx` 가 view import + hook orchestration 만 남음. 200줄 미만 목표.

### Phase 6 — CaptureView + SetupPanel + Deflectometry

capture 탭 + setup 탭. deflectometry sub-tab (SequencePatternPanel, DeflectometryTuningControls) 포함.

작업 단위:
- spec: `CaptureViewProps`, `SetupPanelViewProps`, `SequencePatternPanelViewProps`, `DeflectometryTuningControlsViewProps`.
- 200줄 룰 위반 분해: `SetupPanel` 438줄 → 3~4 sub-view (CameraParams / DeflectometryConfig / Preview / Actions).
- `packages/edge-pages/src/capture/` 멀티 파일.
- 검증: edge-pages build + ingradient-edge tsc.

### Phase 7 — ImagesView + BBoxCanvas + EdgeImagesGrid

가장 큰 두 파일. ImagesView 1223줄 / BBoxCanvas 701줄.

작업 단위:
- spec: `ImagesView` 를 `ImagesGridView` + `ImageDetailModalView` + `ImageContextMenu` 로 분해. `BBoxCanvas` 는 그 자체로 거대 — canvas 렌더링 로직 (drawing, SAM, ROI, modulation overlay) 는 visual-only 라 그대로 옮기되 파일 분해 (`BBoxCanvas.tsx` → `BBoxCanvasView.tsx` + `bbox-canvas-overlay.ts` + `bbox-canvas-sam.ts` 등).
- prop surface 가 매우 큼 — `BBoxCanvasViewProps` 는 25+ props. view model type 도입 허용.
- 모든 IPC 호출 (`getRoiMask`, `updateSequenceBboxes`, …) 는 container 잔류. view 는 `onSamRoiEnter` 같은 callback 만 받음.
- 검증: edge-pages build + 수동 labeling smoke (실제 .ige 로딩 후 bbox 그려보기).

성공 기준: 각 파일 200줄 미만 (BBoxCanvas 는 multi-file 분해로 달성).

### Phase 8 — StaticsView + 4 charts

stats 탭. recharts 기반.

작업 단위:
- spec: `StaticsViewProps` — 4 차트 (Camera/Image/Labeling/Session) 데이터를 props 로. 차트 sub-view 도 함께 추출.
- 검증: 동일.

### Phase 9 — Settings tabs + CameraSettingsDialog shell

10 파일. About / Camera / Server / Data / FieldTest / Logs (Unified/Backend/Frontend) / Update + dialog shell.

작업 단위:
- spec: 각 tab 의 props. FieldTestTab (541줄) 은 2~3 sub-view 로 분해.
- `packages/edge-pages/src/settings/` 멀티 파일.
- 검증: 동일.

### Phase 10 — Connection sub-tab

`settings/connection/` 14 파일. 가장 도메인 특화. scan / connect / diagnose / NIC / profile / advanced / auto-setup / force-ip / guide.

작업 단위:
- spec: 14 파일 각각의 props 표. ConnectionTab shell 의 sub-section orchestration 패턴 유지.
- `packages/edge-pages/src/settings/connection/` 멀티 파일.
- 검증: 동일.

### Phase 11 — Labeling RightPanel + LogPanel + SystemMonitorModal

남은 큰 component.

작업 단위:
- spec: `RightPanelView` (comment thread + class palette), `LogPanelView`, `SystemMonitorModalView` (Cleanup / Monitor 2 tab).
- 검증: 동일.

### Phase 12 — Story 정리 + 문서 동기화

작업 단위:
- 모든 `stories/pages/edge/0.0.1/*` 가 `@ingradient/edge-pages` import only 인지 grep.
- `packages/edge-pages/src/index.ts` re-export 정합성 점검.
- `docs/plan/edge-pages-package-plan.md` 의 "현 상태" 절 갱신.
- 신규 `docs/plan/edge-pages-usage.md` (ingradient-edge 측 마이그레이션 가이드) 작성.

성공 기준: 모든 story file ≤ 200 줄 + lint 통과 + doc coverage 통과.

### Phase 13 — ingradient-edge 컨테이너 마이그레이션 (별도 repo)

본 로드맵의 마지막. 작업 위치는 `ingradient-edge` repo.

각 page sub-phase:
- `ingradient-edge/package.json` 에 `@ingradient/edge-pages` file: dependency 추가 (`file:../ingradient-ui/packages/edge-pages` 또는 sync 스크립트).
- `scripts/update-ui.mjs` / `sync-ui.mjs` 를 edge-pages 도 함께 동기화하도록 확장.
- `src/frontend/pages/LoginScreen.tsx` → container only (`useLogin` hook + `<LoginView ... />`).
- 동일 패턴: LicenseScreen, DatasetSelectScreen, Workspace (Workspace 는 가장 마지막).
- `src/frontend/components/*` 의 view 가 가져간 부분 제거.
- 검증: edge `npm run build` + `npm run test:e2e` + 수동 capture smoke.

본 로드맵 Phase 12 까지 끝나야 시작 가능.

---

## 6. 일정 / 의존 관계

```
Phase 0 (scaffold)
  └─ Phase 1 (LoginView)
       └─ Phase 2 (LicenseView)
            └─ Phase 3 (DatasetSelectView + dataset modals)
                 └─ Phase 4 (App chrome)
                      └─ Phase 5 (WorkspaceView shell)
                           └─ Phase 6 (CaptureView + SetupPanel)
                                └─ Phase 7 (ImagesView + BBoxCanvas)
                                     └─ Phase 8 (StaticsView + charts)
                                          └─ Phase 9 (Settings tabs)
                                               └─ Phase 10 (Connection sub-tab)
                                                    └─ Phase 11 (RightPanel + LogPanel + SystemMonitor)
                                                         └─ Phase 12 (Story 정리)
                                                              └─ Phase 13 (edge consumer migration)
```

Phase 5~8 는 Workspace 와 그 sub-view 라 직렬 권장 (앞 phase 의 slot 패턴이 뒤 phase 의 view 를 받는 구조). Phase 9~11 은 Workspace 외부라 Phase 5 와 병행 가능하나 직렬 권장.

---

## 7. Verification 기준 (공통)

각 Phase 종료 시:

1. `cd packages/edge-pages && npx tsc --noEmit` — 0 error
2. `cd packages/edge-pages && npm run build` — `lib/index.{js,d.ts}` 산출
3. `cd ingradient-ui && npm run build:storybook` — 통과 (storybook 가 edge-pages alias 를 알게 했다면)
4. (해당 시) Playwright probe — 해당 페이지 scenario 모두 정상 렌더링
5. 변경 파일 200 줄 미만
6. ingradient-edge 측 `npx tsc --noEmit` — 본 phase 영향 0 (Phase 0~12 동안 edge 는 아직 새 package 를 import 하지 않으므로 영향 없어야 함)

---

## 8. 리스크 / 대응

### 8.1 view 가 너무 비대해지는 문제 (특히 Workspace / ImagesView / BBoxCanvas)

대응: subview 적극 분리. Workspace 는 본질적으로 container 성격이라 shell 만 view 화하고 sub-view 는 phase 분리. BBoxCanvas 는 multi-file (canvas core + overlay modules) 로.

### 8.2 props surface 가 너무 큼

대응:
- page 별 view model type 도입 허용
- 큰 sub-feature (SAM ROI, deflectometry tuning, modulation overlay) 는 props group object 로 묶음 (`samRoi: { active, prompts, ..., onPromptBox }`)

### 8.3 i18n 의존 처리

edge 는 platform 과 달리 `useTranslation()` 호출이 거의 모든 view 에 박혀 있음. pure view 는 i18n provider 없이 렌더 가능해야 하므로 `labels` prop 으로 평문 string 받음.

대응:
- 각 phase spec 에 i18n key → label prop 매핑 표 포함
- container 측에서 `const labels = { signIn: t('login.submit'), ... }` 로 한 번에 묶어 전달
- 변환 비용을 줄이려면 lazy `useMemo` 사용

### 8.4 electron IPC 강결합

`window.electron.*` 호출이 view 에 직접 박혀 있는 경우 다수 (예: Workspace, ImagesView, settings tabs).

대응:
- 모든 IPC 결과는 container 의 `useXxxState` hook 으로 끌어올린 뒤 props 로 주입
- IPC 호출 자체는 container 의 handler 가 수행, view 는 `onXxx` callback 만 받음
- 새 hook 신설 허용 (예: `useDatasetSelectState`, `useLicenseState`)

### 8.5 storybook fixture 와 실제 ingradient-edge 의 prop shape 불일치

대응: 각 phase spec 작성 시 양쪽 JSX 를 표로 대조 (platform-pages-extraction-roadmap.md §8.4 와 동일 원칙).

### 8.6 ingradient-edge 와 ingradient-ui 의 패키지 동기화

`ingradient-edge/scripts/update-ui.mjs` 는 현재 `@ingradient/ui` 만 동기화. edge-pages 가 추가되면 sync 스크립트 확장 필요.

대응:
- Phase 13 spec 에 sync 스크립트 변경 포함
- 또는 yarn/npm workspace link (`file:` protocol) 로 직접 참조

### 8.7 BBoxCanvas 의 canvas mutation 패턴

700줄 canvas 컴포넌트는 ref 기반 mutation 이 많음 — props-driven pure view 로 옮기기 까다로움.

대응:
- canvas mutation 은 view 안에 유지 허용 (visual-only)
- 외부 state (selected bbox, classes, edit mode) 는 props
- 모든 IPC 는 container

---

## 9. Non-goals (본 로드맵)

- `ingradient-edge` 의 hook / API / store 변경 (Phase 13 에서만 일부 변경)
- backend / electron main process 변경
- edge-pages 의 추가 storybook scenario 작성 (기존 3 scenario 유지)
- 새 디자인 (현재 JSX 1:1 이전)
- visual regression baseline 재촬영
- `@ingradient/ui` 의 component 변경
- electron-edge ↔ web-edge 모드 통합 (별도 작업)

---

## 10. 다음 액션

1. 본 문서 사용자 ok
2. [edge-pages-package-plan.md](./edge-pages-package-plan.md) 작성 → ok
3. Phase 0 spec 작성 → ok → 실행 → 검증
4. Phase 1 spec 작성 → ... (반복, 한 phase 씩)
