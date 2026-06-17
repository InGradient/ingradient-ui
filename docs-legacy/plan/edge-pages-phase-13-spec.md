---
title: Phase 13 — ingradient-edge 컨테이너 마이그레이션 (별도 repo)
purpose: ingradient-edge 측 frontend 가 @ingradient/edge-pages 를 dependency 로 받고, 페이지 컨테이너만 남기는 마이그레이션. 모든 view JSX 는 edge-pages 로 위임
audience: ingradient-edge frontend developer
date: 2026-05-19
status: draft
related:
  - ./edge-pages-extraction-roadmap.md
  - ./edge-pages-package-plan.md
  - ./edge-pages-usage.md
  - ./edge-pages-phase-12-spec.md
---

# Phase 13 — ingradient-edge 컨테이너 마이그레이션

> Roadmap: [edge-pages-extraction-roadmap.md](./edge-pages-extraction-roadmap.md) § Phase 13
> **별도 repo (`ingradient-edge`) 작업**. 본 spec 의 모든 step 은 `ingradient-edge/` 안에서 수행.
> Phase 12 까지 ingradient-ui 측의 view 추출 완료가 전제.

---

## 1. 목적

ingradient-edge 의 frontend page/component 를 다음으로 축소:

```
ingradient-edge/src/frontend/
├─ pages/
│  ├─ LoginScreen.tsx       — container (≤ 80 줄, hook + IPC + <LoginView /> 만)
│  ├─ LicenseScreen.tsx     — container (≤ 80 줄)
│  ├─ DatasetSelectScreen.tsx — container (≤ 150 줄)
│  └─ Workspace.tsx         — container (≤ 600 줄, hook 모두 유지 + <WorkspaceView /> 만)
├─ components/             — Phase 13 마이그레이션 후 대부분 삭제
└─ modules/                — hook + IPC + helper 그대로 유지
```

기존 component file (Workspace.tsx 933 / ImagesView 1223 / BBoxCanvas 701 / SetupPanel 438 / FieldTestTab 541 / 등) 의 view JSX 부분은 모두 `@ingradient/edge-pages` 로 위임 — edge repo 안 component 폴더가 ~70 파일 → ~10 파일로 축소 예상.

---

## 2. sub-phase 분할

본 phase 는 단일 거대 PR 이 아니라 13.1~13.13 sub-phase 로 직렬 진행. 각 sub-phase 끝에 e2e + 수동 smoke + commit.

| sub-phase | 대상 | 우선순위 |
|---|---|---|
| 13.1 | dependency + sync script | 인프라 |
| 13.2 | LoginScreen → LoginView | 가장 단순 |
| 13.3 | LicenseScreen → LicenseView | 단순 |
| 13.4 | DatasetSelectScreen + 3 모달 → DatasetSelectView | 중간 |
| 13.5 | App chrome (TitleBar/TopBar/BottomBar/AccountMenu) | 중간 |
| 13.6 | CameraSettingsDialog + 7 tab | 중간 |
| 13.7 | Connection sub-tab (14 파일) | 도메인 |
| 13.8 | SystemMonitor / LogPanel / RightPanel | 단순 |
| 13.9 | Workspace shell → WorkspaceView | shell only |
| 13.10 | CaptureView + SetupPanel + Deflectometry | sub-view |
| 13.11 | StaticsView + charts | sub-view |
| 13.12 | ImagesView + BBoxCanvas (modal labeling) | 가장 큰 sub-view |
| 13.13 | 정리 — 사용 안 하는 component file 삭제 + e2e 전체 | 마무리 |

순서는 의존성 안 으로 → 밖 으로 (가장 위쪽 컨테이너 (Workspace) 가 sub-view 의존 → sub-view 가 모두 마이그레이션 후 Workspace 진행).

---

## 3. Phase 13.1 — Dependency + Sync Script

### 3.1.1 `package.json` 에 dependency 추가

```diff
  "dependencies": {
    "@ingradient/ui": "file:ingradient-ui-0.0.1.tgz",
+   "@ingradient/edge-pages": "file:ingradient-edge-pages-0.0.1.tgz",
    ...
  }
```

또는 dev 환경에선 file: protocol 직접:

```diff
+   "@ingradient/edge-pages": "file:../ingradient-ui/packages/edge-pages",
```

### 3.1.2 `scripts/update-ui.mjs` 확장

기존 GitHub release 에서 `@ingradient/ui` tgz 만 다운로드 → edge-pages 도 함께. 결정 옵션:

- **A**: edge-pages 도 별도 GitHub release asset 으로 배포 (`ingradient-edge-pages-0.0.1.tgz`) → update-ui 가 둘 다 다운로드
- **B**: ingradient-ui 의 release 안에 edge-pages 도 tgz 동봉 (zip 으로 묶음)
- **C**: edge-pages 는 dev 만 file: 로, 배포는 ingradient-ui 의 tgz 안에 lib 포함

**결정**: **A** — 두 package 별 tgz. update-ui.mjs 가 2번 다운로드:

```js
// update-ui.mjs 추가 부분
const PACKAGES = [
  { name: '@ingradient/ui', repo: 'InGradient/ingradient-ui', asset: 'ingradient-ui' },
  { name: '@ingradient/edge-pages', repo: 'InGradient/ingradient-ui', asset: 'ingradient-edge-pages' },
]
for (const pkg of PACKAGES) {
  await downloadAndInstall(pkg, tag)
}
```

ingradient-ui 의 release CI 도 edge-pages tgz 를 함께 생성하도록 변경 — 본 phase 의 별도 작업.

### 3.1.3 `scripts/sync-ui.mjs` 확장

dev 시 두 path 모두 sync:

```js
// sync-ui.mjs 추가 부분
const PACKAGES = [
  { src: `${UI_ROOT}/lib`, srcPkg: `${UI_ROOT}/package.json`, target: `${EDGE_ROOT}/node_modules/@ingradient/ui` },
  { src: `${UI_ROOT}/packages/edge-pages/lib`, srcPkg: `${UI_ROOT}/packages/edge-pages/package.json`, target: `${EDGE_ROOT}/node_modules/@ingradient/edge-pages` },
]
for (const pkg of PACKAGES) {
  await syncOne(pkg)
}
```

watch mode 도 두 lib 디렉토리 모두 watch.

### 3.1.4 ingradient-ui 측 CI / 빌드 script 변경

`ingradient-ui/scripts/release.mjs` 또는 동등 script 가 edge-pages 의 tgz 도 생성. 본 spec 범위 밖 — 별도 PR.

### 3.1.5 검증

```bash
cd ingradient-edge
npm run sync-ui       # dev 환경
ls node_modules/@ingradient/edge-pages/lib/
node -e "import('@ingradient/edge-pages').then(m => console.log(Object.keys(m).length))"  # > 0
npm run typecheck     # 0 error (edge-pages 아직 안 쓰므로 trivially 통과)
```

---

## 4. Phase 13.2 — LoginScreen

### 4.2.1 변경 파일

#### `src/frontend/pages/LoginScreen.tsx`

기존 143 줄 → ~80 줄 container.

```tsx
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LoginView, type LoginLabels } from '@ingradient/edge-pages'
import { LangSelector } from '../shared/LangSelector'
import { CameraSettingsDialog } from '../components/settings/CameraSettingsDialog'  // Phase 13.6 후엔 CameraSettingsDialogContainer
import { useLogin } from '../modules/auth/state/use-login'
import type { EdgeConfig } from '../modules/auth/model/login.types'

interface LoginScreenProps {
  mode: 'online' | 'offline'
  config?: EdgeConfig
}

function useLoginLabels(): LoginLabels {
  const { t } = useTranslation()
  return useMemo(() => ({
    title: 'INGRADIENT Edge',
    online: t('login.online'),
    offline: t('login.offline'),
    onlineSupport: t('login.onlineSupport'),
    loadPackage: t('login.loadPackage'),
    loading: t('login.loading'),
    emailLabel: t('login.emailLabel'),
    emailPlaceholder: t('login.emailPlaceholder'),
    passwordLabel: t('login.passwordLabel'),
    passwordPlaceholder: t('login.passwordPlaceholder'),
    savePassword: t('login.savePassword'),
    keepSignedIn: t('login.keepSignedIn'),
    submit: t('login.submit'),
    submitting: t('login.submitting'),
    register: t('login.register'),
    greeting: (name) => t('login.greeting', { name }),
    continueSession: t('login.continue'),
    changeAccount: t('login.changeAccount'),
    settingsTitle: t('topbar.settings'),
  }), [t])
}

export function LoginScreen({ mode, config }: LoginScreenProps): JSX.Element {
  const login = useLogin({ mode, config })
  const [showSettings, setShowSettings] = useState(false)
  const labels = useLoginLabels()

  return (
    <LoginView
      mode={mode}
      email={login.email}
      password={login.password}
      savePassword={login.savePassword}
      keepSignedIn={login.keepSignedIn}
      error={login.error}
      loggingIn={login.loggingIn}
      loadingPackage={login.loadingPackage}
      packageInfo={login.packageInfo}
      savedSession={login.savedSession}
      otherAccounts={login.otherAccounts}
      hasAccountList={login.hasAccountList}
      showLoginForm={login.showLoginForm}
      externalUrl={login.externalUrl ?? null}
      labels={labels}
      langSelector={<LangSelector />}
      settingsDialog={showSettings ? <CameraSettingsDialog initialTab="server" onClose={() => setShowSettings(false)} /> : null}
      onEmailChange={login.setEmail}
      onPasswordChange={login.setPassword}
      onSavePasswordChange={login.setSavePassword}
      onKeepSignedInChange={login.setKeepSignedIn}
      onSubmit={login.handleLogin}
      onContinueSession={login.handleContinueSession}
      onSelectAccount={login.handleSelectAccount}
      onChangeAccount={login.handleChangeAccount}
      onLoadPackage={login.handleLoadPackage}
      onOpenSettings={() => setShowSettings(true)}
      onOpenSignup={() => login.win.electron?.openExternal?.('https://app.ingradient.ai/signup')}
    />
  )
}
```

#### 삭제

- `src/frontend/pages/LoginScreen.styles.ts` — edge-pages 안 이미 같은 styles. import 0 확인 후 삭제.

#### useLogin 확장

기존 `useLogin` 의 return 에 `loadingPackage` 추가 (Phase 1 spec 의 신설 prop):

```diff
   return {
-    packageInfo, loadingPackage, email, setEmail, password, setPassword,
+    packageInfo, loadingPackage, email, setEmail, password, setPassword,
     savePassword, setSavePassword, keepSignedIn, setKeepSignedIn,
     ...
```

(기존 코드에 이미 loadingPackage state 가 있다면 그대로)

### 4.2.2 검증

```bash
npm run typecheck                                     # 0 error
npm run build
npm run dev                                           # 수동 — login UI 정상 동작 (online + offline 양쪽)
```

수동 검증 항목:
- online 모드 로그인 ✅
- offline 모드 package 로드 ✅
- saved session continue ✅
- account picker ✅
- error 표시 ✅
- 설정 톱니바퀴 → CameraSettingsDialog open ✅
- LangSelector 동작 ✅

### 4.2.3 commit 메시지

```
refactor: LoginScreen 을 @ingradient/edge-pages 의 LoginView 컨테이너로 축소
```

---

## 5. Phase 13.3 — LicenseScreen

Phase 13.2 패턴 그대로. `useLicense()` hook 신설 (edge 의 LicenseScreen 안 state 를 hook 으로 lift):

- `useLicense()` 가 fingerprint / mode / submitting / copied / error / bindMode / deviceId / serverUrl / handlers 반환
- `LicenseScreen.tsx` 는 hook + labels + view 호출만
- `LicenseScreen.styles.ts` 삭제

검증: 4.2.2 와 동일 패턴.

---

## 6. Phase 13.4 — DatasetSelectScreen + 3 모달

기존 `DatasetSelectScreen.tsx` 298 줄 → ~150 줄 container.

- `useDatasetSelectState()` hook 신설 (또는 기존 hook 조합)
- `DatasetSelectView` import
- modal slot 3개 mount 결정 (`exportModal`, `addDatasetModal`, `settingsDialog`)
- `<AccountMenu />` 그대로 slot 으로 (Phase 13.5 후 `<AccountMenuContainer />` 로 교체)

삭제:
- `DatasetSelectScreen.styles.ts`, `DatasetCard.styles.ts`, `DatasetGrid.styles.ts`, `DotMenu.styles.ts`
- `components/dataset/AddDatasetModal.tsx`, `ExportModal.tsx`, `CreateProjectForm.tsx`
- `components/dataset/AddDatasetModal.styles.ts`, `ExportModal.styles.ts`
- 각 모달의 IPC + state 는 `useAddDatasetModal()` / `useExportModal()` hook 으로 ingradient-edge 의 modules/dataset/state/ 로 이동

검증: 동일 패턴 + dataset CRUD 수동 smoke (add / export / delete).

---

## 7. Phase 13.5 — App chrome (TitleBar / TopBar / BottomBar / AccountMenu)

`src/frontend/app/App.tsx` 와 `pages/*` 가 사용하는 chrome 4 컴포넌트.

- `TitleBar.tsx` → 30 줄 container (`useTitleBarState()` hook + `<TitleBarView />`)
- `TopBar.tsx` → 80 줄 container
- `BottomBar.tsx` → 60 줄 container (3초 auto-clear setTimeout 잔류)
- `AccountMenu.tsx` → 60 줄 container

삭제:
- `TitleBar.tsx` 의 inline styled (edge-pages 안 이미 같음)
- `TopBar.styles.ts`, `AccountMenu.styles.ts`
- `BottomBar.tsx` 의 inline styled

검증: 모든 chrome 의 IPC / store / event 정상 동작.

---

## 8. Phase 13.6 — CameraSettingsDialog + 7 tab

기존 `components/settings/CameraSettingsDialog.tsx` 233줄 → ~120 줄 container.

7 tab 컨테이너 각각 (1 파일 → 1 hook + 1 view 호출):
- `AboutTab.tsx` 211 → ~60 줄
- `ServerTab.tsx` 170 → ~80 줄
- `DataTab.tsx` 136 → ~60 줄
- `CameraParamsTab.tsx` 322 → ~100 줄
- `FieldTestTab.tsx` 541 → ~150 줄
- `UnifiedLogsTab.tsx` 105 → ~50 줄
- `BackendLogsContent.tsx` 214 → ~80 줄
- `FrontendLogsContent.tsx` 143 → ~50 줄
- `UpdateSection.tsx` 152 → ~70 줄

container 가 각 tab 의 IPC / state 보관, view 에 props 주입.

삭제: 각 tab 의 styles file (edge-pages 안 있음).

검증: 7 tab 진입 + 각 액션 (save / cancel / refresh / cleanup / etc) 수동 smoke.

---

## 9. Phase 13.7 — Connection sub-tab (14 파일)

`settings/connection/` 14 파일 → 1 container (`ConnectionTab.tsx`) + view.

- `useConnectionWorkflow` / `useNicOperations` / `loadEffectiveConfig` / `saveProfileSettings` 모두 container 잔류
- container 가 9 props group object 생성 + `<ConnectionTabView {...9-groups} />`
- 12 sub-section 의 edge 측 file 모두 삭제 (view 가 edge-pages 안)

검증: GigE scan / connect / diagnose / NIC ops / profile save 전체 smoke. **edge 의 가장 도메인 특화 영역** — 실제 카메라 hardware 연결 검증 필수.

---

## 10. Phase 13.8 — SystemMonitor / LogPanel / RightPanel

- `SystemMonitorModal.tsx` + cleanup/monitor tab → 3 container
- `LogPanel.tsx` → 1 container
- `RightPanel.tsx` + comment section → 2 container

각 container 는 store/IPC orchestration + view 호출.

검증: BottomBar 클릭 → SystemMonitor 동작. labeling 모드 RightPanel + comment thread 동작. log panel hover/details 동작.

---

## 11. Phase 13.9 — Workspace shell

가장 까다로운 마이그레이션. `pages/Workspace.tsx` 933줄 → ~600 줄 container.

- 17 useEffect / 12 useCallback 모두 그대로 유지
- 모든 hook (`useCaptureFlow`, `useDeflectometry`, `useSamRoi`, etc) 그대로
- 마지막 `return (...)` 만 변경:

```tsx
const mode = pendingCapture && selectedDatasetId ? 'labeling' : 'main'
const labels = useWorkspaceLabels()

return (
  <WorkspaceView
    mode={mode}
    activeTab={activeTab}
    tabItems={tabItems}
    onTabChange={setActiveTab}
    isCapturing={isCapturing}
    capturingStatusText={capturingStatusText}
    sequenceFailure={deflectometry.sequenceFailure}
    onSequenceFailureCancel={deflectometry.handleSequenceFailureCancel}
    onSequenceFailureRetry={handleSequenceFailureRetry}
    labels={labels}
    selectedDatasetId={selectedDatasetId}
    isSetupMode={activeTab === 'setup'}
    setupPanelTarget={deflectometry.setupPanelTarget}
    setupPanelContent={<SetupPanelContainer ... />}              // Phase 13.10 후
    captureContent={<CaptureViewContainer ... />}
    imagesContent={<ImagesViewContainer datasetId={...} />}      // Phase 13.12 후
    staticsContent={<StaticsViewContainer datasetId={...} />}    // Phase 13.11 후
    labelingContent={
      selectedTaskType === 'object_detection'
        ? <BBoxCanvasContainer ... />
        : <CaptureReviewWithFullscreen ... />
    }
    isSavingLabel={isSavingLabel}
  />
)
```

본 sub-phase 에선 slot 의 sub-container 아직 미구현이라 임시로 기존 component (CaptureView / ImagesView / etc) 그대로 사용 가능. 13.10~13.12 에서 점진 교체.

### 11.1 결정: 본 sub-phase 의 slot 마운트 전략

옵션:
- **A**: Workspace 마이그레이션 마지막에 한 번에 (13.9 → 13.10~13.12 후 13.9 재방문)
- **B**: 본 sub-phase 는 shell + 임시 component slot, 후속 sub-phase 가 sub-container 교체

**결정**: **B** — 점진적 진행이 안전. 본 sub-phase 후 Workspace 가 동작하되 sub-view 는 기존 component 그대로.

---

## 12. Phase 13.10 — CaptureView + SetupPanel + Deflectometry

5 component (`CaptureView.tsx` / `SetupPanel.tsx` / `SequencePatternPanel.tsx` / `DeflectometryTuningControls.tsx` / `CaptureReviewWithFullscreen` (inline 이라 별도 화일 없음))

각 컴포넌트 → container + view 호출:
- `CaptureViewContainer` ≤ 180 줄 (snapshot polling + blob URL 관리)
- `SetupPanelContainer` ≤ 200 줄 (15 props 전달)
- `SequencePatternPanelContainer` ≤ 60 줄 (zustand subscribe)
- `DeflectometryTuningControlsContainer` ≤ 120 줄 (useDeflectometryTuning + toast)
- `CaptureReviewFullscreenContainer` ≤ 30 줄

helper (`capture.constants.ts`, `colormaps.ts`) 의 일부 export 가 edge-pages 안 복사되어 있음 — edge 측은 `@ingradient/edge-pages` 의 helper export 를 import 하는 방향으로 전환. 단 본 phase 에선 edge 의 원본 helper 도 그대로 유지 (다른 곳에서 import 가능). divergence 우려 → 추후 정리.

검증: capture 탭 (live preview / snapshot) + setup 탭 (deflectometry 설정 / settle delay / white balance) 모두 수동.

---

## 13. Phase 13.11 — StaticsView + charts

`StaticsView.tsx` 167 + 4 charts → 5 container.

- `StaticsViewContainer` 가 IPC (`getStatsAnalytics` / `getImageAnalytics`) + analytics 계산 + collapsed section localStorage
- 4 chart container 각각 props 변환만 (chart 자체는 zustand 의존 0)

검증: stats 탭 진입 + 4 section 차트 정상 표시.

---

## 14. Phase 13.12 — ImagesView + BBoxCanvas

가장 큰 sub-view 마이그레이션.

- `ImagesViewContainer` (≤ 300줄) — 1223줄 ImagesView 의 모든 hook + state 그대로 + render 만 view 위임
- `BBoxCanvasContainer` (≤ 200줄) — 701줄 BBoxCanvas 의 IPC (`getRoiMask` 등) + telemetry (`trackMount`) 잔류, props group 5개 생성 + view 호출
- `EdgeImagesGridContainer` (≤ 50줄) — zustand 의존 0 이라 거의 그대로

helper 복사: edge 측 `shared/images.ts` 등 일부는 edge-pages 안 복사본과 동일. 본 phase 에서 edge 가 edge-pages 의 helper 를 import 하는 방향으로 전환:

```diff
- import { buildGroups, getGroupKey, type ImageItem } from '../../shared/images'
+ import { buildGroups, getGroupKey, type ImageItem } from '@ingradient/edge-pages'
```

(edge-pages 가 helper 도 export 하도록 — Phase 12 의 §2.5 점검 시 결정)

검증: dataset image 탭의 grid / modal labeling / SAM ROI / sequence navigation / bulk delete 전체 수동 smoke. **labeling canvas 의 모든 동작** (bbox draw / SAM prompt / modulation overlay / debug overlay / ROI edit) 검증 필수.

---

## 15. Phase 13.13 — 정리 + 전체 e2e

### 15.1 사용 안 하는 component file 삭제

```bash
# edge-pages 가 view 모두 가져갔으므로 edge 측 component file 대량 삭제
rm -r src/frontend/pages/*.styles.ts
rm -r src/frontend/components/{capture,settings,system,log,labeling,dataset}/
# 남아 있는 건: container (xxxContainer.tsx) + chrome 4 container + 모달 slot 들
```

각 디렉토리에 container 만 남기고 view 는 edge-pages 사용. 정확한 삭제 목록은 본 sub-phase 시작 시 grep 으로 확정.

### 15.2 helper / module 정리

`modules/capture/model/capture.constants.ts`, `modules/labeling/model/colormaps.ts`, `shared/images.ts` 등 helper file 중 edge-pages 가 export 하는 것:
- edge 의 다른 코드 (container / hook) 이 사용 중이라 그대로 유지
- 또는 import 만 `@ingradient/edge-pages` 로 swap

### 15.3 e2e 전체 실행

```bash
npm run test:e2e          # playwright
npm run test              # unit / cross-system
```

`tests/e2e/playwright.config.ts` 의 모든 e2e scenario 가 통과해야 함.

### 15.4 release 빌드 점검

```bash
npm run build:win         # 또는 build:linux / build:mac (대상 OS)
```

electron-builder 가 production bundle 생성 + tree-shaking 후 size 가 이전 대비 크게 증가 안 함을 확인.

### 15.5 commit + release

```bash
git commit -am "refactor: ingradient-edge 컨테이너 전체 마이그레이션 (@ingradient/edge-pages 도입)"
# 또는 13.1~13.13 의 누적 commit 들이 이미 있으면 PR 생성
```

release tag (예: `v0.0.5`) 발행 — production 배포는 별도 결정.

---

## 16. 변경 파일 (Phase 13 누적)

### 16.1 수정

- `package.json` — dependency 추가
- `scripts/update-ui.mjs` / `sync-ui.mjs` — 2-package sync
- `src/frontend/pages/*.tsx` — container 로 축소 (4 파일)
- `src/frontend/components/*/*.tsx` — container 로 축소 또는 삭제 (~70 파일)
- 일부 `modules/*/state/*.ts` — hook return shape 미세 조정

### 16.2 삭제

- view-only styles file (~30 파일)
- view-only component file (~50 파일)
- edge-pages 안 복사된 helper 의 edge 측 원본 (논의 후 결정 — 본 spec §14.2)

### 16.3 신규

- `useXxxLabels()` helper hook ~15개 — 각 view 의 labels 빌드용
- container 들 (위 §3~§14 의 각 sub-phase)

---

## 17. 검증 — 누적 verification matrix

각 sub-phase 끝:

| 항목 | 명령 / 확인 |
|---|---|
| typecheck | `npm run typecheck` 0 error |
| build | `npm run build` exit 0 |
| dev 실행 | `npm run dev` 로 화면 진입 후 해당 sub-phase 의 화면 수동 검증 |
| lint | `npm run lint` 통과 |
| 영향받는 e2e | 해당 sub-phase 의 화면 관련 playwright spec |
| 회귀 없음 | 이전 sub-phase 의 화면 다시 smoke |

Phase 13 전체 끝:

| 항목 | 기준 |
|---|---|
| 전체 e2e | `npm run test:e2e` 모두 pass |
| python test | `npm run test:python` 모두 pass |
| cross-system | `npm run test:cross` 모두 pass |
| edge-pages import 사용률 | `grep -rE "from '@ingradient/edge-pages'" src/frontend/ \| wc -l` ≥ 50 |
| view JSX 잔재 | `find src/frontend/components -name "*.tsx" \| wc -l` ≤ 15 (container 만) |
| release build | `npm run build:win` / `build:linux` 성공 |
| bundle size | 이전 대비 ±10% 이내 |

---

## 18. 리스크

### 18.1 sub-phase 직렬화로 인한 PR 폭증

위험: 13.1~13.13 = 13 PR. review 부담.

대응:
- 의미적으로 묶을 수 있는 sub-phase 는 한 PR (예: 13.5 chrome 4개 + 13.8 sub-component 3개)
- 또는 각 PR 별 작은 변경 + fast review
- 결정은 review 부담 vs rollback 위험 절충

### 18.2 Workspace 의 17 useEffect 의 순서 변경 위험

위험: hook 호출 순서 변경 시 effect 누락 또는 race condition.

대응:
- Phase 13.9 의 Workspace 컨테이너 변경 시 모든 useEffect 순서 그대로 유지
- 본 phase 의 변경은 마지막 return 만 — hook 들은 1줄도 안 건드림

### 18.3 i18n key 추가 발생

위험: Phase 4/9 의 spec 에서 hard-coded literal (예: TitleBar 의 한국어 "최소화") 을 labels 평문 그대로 받기로 했으나, Phase 13 에서 i18n 처리 필요할 수 있음.

대응:
- 본 phase 의 useXxxLabels() hook 안에서 결정 — 새 i18n key 추가는 별도 PR
- 또는 그대로 hard-coded literal 전달 (요청받은 것만 구현 원칙)
- 기본: hard-coded 그대로

### 18.4 helper 의 양쪽 import 혼재

위험: `shared/images.ts` 같은 helper 가 edge 측 원본 + edge-pages 측 복사본 모두 존재. import path 가 코드마다 다를 수 있음.

대응:
- Phase 13.12 에서 edge → edge-pages 의 helper 로 swap
- 또는 edge 의 helper 가 edge-pages 의 export 를 re-export 하는 방향
- 본 phase 안 명확한 결정 필요

### 18.5 release CI 의 edge-pages tgz 생성

위험: ingradient-ui 측 release script 가 edge-pages tgz 도 생성하도록 변경 안 되면 update-ui.mjs 실패.

대응:
- Phase 13.1 시작 전 ingradient-ui 의 release script 변경 PR 머지 확인
- dev 환경은 sync-ui (file: protocol) 로 우회 가능 — 단 production 배포는 release CI 필수

### 18.6 BBoxCanvas 의 props group 5개 도입으로 caller 코드 폭증

위험: ingradient-edge 의 Workspace + ImagesView 양쪽에서 BBoxCanvas 호출 — 각각 30+ props 를 5 group 으로 묶는 작업 부담.

대응:
- `useBBoxCanvasProps()` helper hook 으로 group object 생성 한 곳에 모음
- caller 는 `<BBoxCanvasView {...useBBoxCanvasProps(state)} />` 한 줄

### 18.7 e2e 시 regression 발견

위험: Phase 13 전체 끝에 e2e 실행 시 일부 시나리오 깨짐.

대응:
- 각 sub-phase 끝에 영향받는 e2e 만 우선 실행 — 전체 e2e 는 13.13 의 마무리
- 깨짐 발견 시 해당 sub-phase 의 PR 에서 즉시 수정
- 회귀 패턴 (예: i18n 누락, hook 순서 변경) 은 본 spec 의 §18 에 추가

### 18.8 production 배포 타이밍

위험: 13.13 끝나도 production 배포는 사용자 결정. 그 사이에 더 변경 발생 가능.

대응:
- Phase 13 종료 = 본 spec 의 검증 통과 + release tag 발행까지
- production 배포 (electron-builder 결과를 사용자에게 배포) 는 별도 release 작업
- 본 spec 범위 밖

### 18.9 ingradient-edge 의 기존 hook signature 변경 필요

위험: edge-pages view 가 받는 props shape 와 기존 hook 의 return shape 가 다를 수 있음 (예: `loadingPackage` 가 hook 에 없는 경우).

대응:
- 각 sub-phase 시작 시 hook return 보강 (작은 변경)
- 또는 container 안에서 변환 (예: `loadingPackage: false`)
- 본 spec 의 §4 의 useLogin 예시 처럼 hook 확장 결정

### 18.10 edge-pages bundle 의 tree-shaking

위험: edge 가 edge-pages 의 50+ view 중 사용 안 하는 것 (예: 다른 page 에서만 쓰는 view) 도 모두 번들에 포함되면 size 증가.

대응:
- edge-pages 의 tsup 이 `splitting: false` 인데 ESM tree-shaking 은 가능
- 검증 #17 의 bundle size 확인에서 추적
- 필요 시 edge-pages 를 sub-export 로 분할 (별도 phase)

---

## 19. Rollback

각 sub-phase 가 별도 PR / commit 이라 sub-phase 단위 revert 가능:
- 13.x 의 commit 만 revert → 해당 화면이 기존 component 로 복귀
- 다른 sub-phase 영향 없음

전체 Phase 13 rollback:
- ingradient-edge 의 모든 13.x commit revert
- `package.json` 의 edge-pages dependency 제거
- 기존 component file 들이 git history 에 남아 있어 복원 가능

ingradient-ui 측은 영향 없음 (edge-pages 는 그대로).

---

## 20. 종료 후 상태

- `ingradient-edge/src/frontend/` 가 container + hook + IPC 만 — view 0
- `@ingradient/edge-pages` 가 production runtime 의 모든 view 제공
- ingradient-ui ↔ ingradient-edge 간 view 의 일관성 보장 (storybook 과 production 화면이 같은 JSX)
- 향후 edge UI 변경은 ingradient-ui 의 edge-pages 에서 일괄 — 두 repo drift 위험 제거
- **edge-pages 추출 로드맵 전체 완료** (Phase 0~13)

---

## 21. 다음 액션

1. 본 spec ok
2. ingradient-ui 측 release CI 의 edge-pages tgz 생성 변경 확인 (Phase 13.1 의 사전 조건)
3. Phase 13.1 실행 — dependency + sync script
4. Phase 13.2~13.13 직렬 진행
5. 전체 끝나면 production 배포 (별도)
