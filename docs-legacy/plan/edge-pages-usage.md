---
title: Edge Pages Usage Guide
purpose: ingradient-edge 측 개발자가 @ingradient/edge-pages 의 view 를 어떻게 import / props 주입 / 마이그레이션할지 가이드
audience: ingradient-edge frontend developer
date: 2026-05-19
status: draft
related:
  - ./edge-pages-extraction-roadmap.md
  - ./edge-pages-package-plan.md
  - ./edge-pages-phase-13-spec.md
  - ./platform-pages-usage.md
---

# Edge Pages Usage Guide

> Phase 0~12 완료 후 ingradient-edge 측 마이그레이션 (Phase 13) 가이드.
> `@ingradient/platform-pages` 의 사용 패턴 ([platform-pages-usage.md](./platform-pages-usage.md)) 를 그대로 따르되, **i18n labels prop 패턴** + **electron IPC 추상화** + **slot prop** 이 edge 특유.

---

## 1. Quick start

### 1.1 dependency 추가

`ingradient-edge/package.json`:

```diff
  "dependencies": {
    "@ingradient/ui": "file:ingradient-ui-0.0.1.tgz",
+   "@ingradient/edge-pages": "file:ingradient-edge-pages-0.0.1.tgz",
    ...
  }
```

dev 환경 (file: protocol):

```diff
+   "@ingradient/edge-pages": "file:../ingradient-ui/packages/edge-pages",
```

### 1.2 sync script 확장

`ingradient-edge/scripts/update-ui.mjs` 가 두 tgz 모두 다운로드하도록 변경:

```diff
- const REPO = 'InGradient/ingradient-ui'
+ const PACKAGES = [
+   { name: '@ingradient/ui',          asset: 'ingradient-ui' },
+   { name: '@ingradient/edge-pages',  asset: 'ingradient-edge-pages' },
+ ]
```

`scripts/sync-ui.mjs` 도 두 path sync. 자세한 diff 는 [edge-pages-phase-13-spec.md §3.1](./edge-pages-phase-13-spec.md) 참고.

### 1.3 첫 import

```tsx
import { LoginView, type LoginLabels } from '@ingradient/edge-pages'
```

---

## 2. 60+ view export 요약

### 2.1 영역별 분류

| 영역 | view export | 비고 |
|---|---|---|
| `login/` | LoginView | i18n labels + langSelector/settingsDialog slot |
| `license/` | LicenseView | bind/key mode 분기 |
| `dataset-select/` | DatasetSelectView + Header + Content + Card + Recent | multi-file 분해 |
| `dataset-modals/` | AddDatasetModalView, ExportModalView, CreateProjectFormView | 3 모달 |
| `chrome/` | TitleBarView, TopBarView, BottomBarView, AccountMenuView | electron drag + click-outside |
| `workspace/` | WorkspaceView + Shell + LabelingShell + SequenceFailureDialog + CapturingPill | 5 slot 패턴 |
| `capture/` | CaptureView, SetupPanelView, SequencePatternPanelView, DeflectometryTuningControlsView, CaptureReviewFullscreen | snapshot polling container 잔류 |
| `images/` | ImagesView, EdgeImagesGridView | 단순화 — modal labeling 은 slot |
| `labeling/` | BBoxCanvasView | 기본 bbox 그리기. SAM/modulation/debug 는 follow-up |
| `statics/` | StaticsView, SessionChartsView, ImageChartsView, LabelingChartsView, CameraChartsView | recharts peer |
| `settings/` | CameraSettingsDialogView + 8 tab views + UpdateSectionView | 7 tab slot |
| `connection/` | ConnectionTabView + 9 sections + ForceIpDialogView | 9 props group |
| `labeling-panel/` | RightPanelView, RightPanelCommentSection | sidebar (Workspace 와 분리) |
| `log/` | LogPanelView, LogDetailTableView | 하단 log panel |
| `system/` | SystemMonitorModalView, CleanupTabView, MonitorTabView | BottomBar onOpenMonitor 의 대상 |

총 ~60 view export.

### 2.2 도메인 type re-export

view 의 props type 외에도 도메인 type 이 export 됨:

- `LoginMode`, `LoginPackageInfo`, `LoginSavedSession`, `LoginAccountEntry`
- `EdgeDataset`, `EdgeProjectGroup`, `RecentDatasetEntry`, `EdgeClass`
- `EdgeTaskType`, `AddDatasetClass`, `ExportPhase`
- `ConnectionStatus`, `SystemStats`, `SyncStatus`, `AccountUser`, `AccountHistoryEntry`
- `WorkspaceMode`, `WorkspaceTab`, `WorkspaceTabItem`, `SequenceFailureInfo`
- `DeflectometryMetrics`, `PreviewPatternLabel`, `DeflectometryConfigState`, `CameraParams`, `SetupConfigState`
- `ImageItem`, `ProjectGroupSettings`, `ImagesDatePreset`, `BBox`, `ClassInfo`
- `SessionAnalytics`, `ImageAnalytics`, `TrendMode`
- `SettingsTab`, `ServerRuntimeMode`, `UpdateStatus`, `LogsSource`
- `USBDevice`, `GigEDevice`, `AnyCamera`, `NicCandidate`, `NicStatus`, `ConnectionClassification`, `GuideState`
- `PanelClassInfo` (RightPanel — `ClassInfo` 와 별개)
- `LogPanelEntry` (LogPanel — `LogEntry` 와 별개)
- `SystemMonitorTab`, `CleanupStats`, `SystemStatsPoint`
- helpers: `buildPatternLabels`, `patternLabelToUI`, `computeTotalPatterns`, `DERIVED_ORDER`, `COLORMAP_OPTIONS`, `labelToDerivedKind`, `ColormapName`, `DerivedKind`, `buildGroups`, `getGroupKey`, `dedupeSequenceMembers`, `imagePassesDateFilter`, `useFullscreen`, `toDrawingObjects`, `toBboxes`, `buildClassTrend`, `formatDay`, `startOfDay`

---

## 3. 마이그레이션 예시

### 3.1 LoginScreen (가장 단순)

기존 (`ingradient-edge/src/frontend/pages/LoginScreen.tsx`):

```tsx
export function LoginScreen({ mode, config }: LoginScreenProps): JSX.Element {
  const { t } = useTranslation()
  const login = useLogin({ mode, config })
  const [showSettings, setShowSettings] = useState(false)
  return (
    <Wrap>
      {/* ... 143줄의 JSX ... */}
    </Wrap>
  )
}
```

마이그레이션 후 (~80 줄):

```tsx
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LoginView, type LoginLabels } from '@ingradient/edge-pages'
import { LangSelector } from '../shared/LangSelector'
import { CameraSettingsDialog } from '../components/settings/CameraSettingsDialog'
import { useLogin } from '../modules/auth/state/use-login'

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

### 3.2 Workspace (가장 복잡, slot 5개)

`ingradient-edge/src/frontend/pages/Workspace.tsx` (933 줄 → ~600 줄 container, render JSX 만 변경):

```tsx
import { WorkspaceView, type WorkspaceLabels } from '@ingradient/edge-pages'
import { CaptureView } from './CaptureViewContainer'  // edge container
import { ImagesView } from './ImagesViewContainer'
import { StaticsView } from './StaticsViewContainer'
import { SetupPanelContent } from './SetupPanelContainer'
import { BBoxCanvas } from './BBoxCanvasContainer'

export const Workspace: FC<WorkspaceProps> = ({ platformBaseUrl }) => {
  // 17 useEffect / 12 useCallback / 30+ hook 모두 그대로 유지

  const labels: WorkspaceLabels = useMemo(() => ({
    saving: t('workspace.saving'),
    sequenceFailed: t('workspace.sequenceFailed'),
    errorCode: t('workspace.errorCode'),
    cancel: t('workspace.cancel'),
    retry: t('workspace.retry'),
  }), [t])

  const mode = pendingCapture && selectedDatasetId ? 'labeling' : 'main'

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
      setupPanelContent={<SetupPanelContent {...setupProps} />}
      captureContent={<CaptureView {...captureProps} />}
      imagesContent={<ImagesView datasetId={selectedDatasetId} />}
      staticsContent={<StaticsView datasetId={selectedDatasetId} />}
      labelingContent={
        selectedTaskType === 'object_detection'
          ? <BBoxCanvas {...bboxProps} />
          : <CaptureReviewWithFullscreen {...reviewProps} />
      }
      isSavingLabel={isSavingLabel}
    />
  )
}
```

### 3.3 BBoxCanvas (props group 패턴)

```tsx
<BBoxCanvasView
  imageDataUrl={pendingCapture.dataUrl}
  displayImageUrl={pendingCapture.displayDataUrl}
  classes={edgeClasses}
  selectedClassId={selectedClassId}
  editMode={editMode}
  initialBboxes={pendingBboxes}
  options={edgeOptions}
  pendingClassChange={pendingClassChange}
  labels={useBBoxCanvasLabels()}
  onSave={handleLabelSave}
  onSkip={handleLabelSkip}
  onRetry={handleLabelRetry}
  onSelectionChange={(idx, classId) => {
    setSelectedBboxIdx(idx)
    if (classId) setSelectedClassId(classId)
  }}
  onBboxesChange={handleBboxesChange}
/>
```

(modulation / debug overlay / SAM ROI 는 본 phase 의 view 에 미구현 — 후속 작업.)

---

## 4. Hook → props 변환 패턴

### 4.1 i18n labels helper hook

각 view 별 `useXxxLabels()` 권장. 예시:

```tsx
function useDatasetSelectLabels(): DatasetSelectLabels {
  const { t } = useTranslation()
  return useMemo(() => ({
    title: t('dataset.title'),
    online: t('dataset.online'),
    offline: t('dataset.offline'),
    // ... 22 항목
    images: (count) => t('dataset.images', { count }),
    roleLabel: (role) => t(`dataset.role.${role}` as const) || role,
  }), [t])
}
```

container 에서:

```tsx
const labels = useDatasetSelectLabels()
return <DatasetSelectView ... labels={labels} ... />
```

### 4.2 slot prop 패턴

`langSelector` / `accountMenu` / `settingsDialog` / 모달 — caller 가 ReactNode 로 전달:

```tsx
<DatasetSelectView
  langSelector={<LangSelector />}
  accountMenu={<AccountMenu logoutReason="..." changeAccountReason="..." />}
  settingsDialog={showSettings ? <CameraSettingsDialog onClose={...} /> : null}
  exportModal={exportModal ? <ExportModal {...exportProps} /> : null}
  addDatasetModal={addingToProject ? <AddDatasetModal {...} /> : null}
  ...
/>
```

### 4.3 store subscribe → props 변환

```tsx
// container 안:
const { isConnected, isConnecting } = useDeviceStore()
const { selectedDatasetName, selectedProjectName } = useDatasetStore()
const connectionStatus = isConnected ? 'connected' : isConnecting ? 'connecting' : 'disconnected'

return (
  <TopBarView
    selectedProjectName={selectedProjectName}
    selectedDatasetName={selectedDatasetName}
    connectionStatus={connectionStatus}
    ...
  />
)
```

---

## 5. 검증 체크리스트 (Phase 13 sub-phase 별)

각 sub-phase 끝:
- `npm run typecheck` — 0 error
- `npm run build` — exit 0
- `npm run dev` 로 실제 화면 동작 (해당 sub-phase 의 화면)
- `npm run lint` — exit 0
- 영향받는 e2e (`tests/e2e/`) 실행

전체 끝 (Phase 13.13):
- `npm run test:e2e` — 전체 통과
- `npm run test:python` — 전체 통과
- `npm run test:cross` — 전체 통과
- bundle size 이전 대비 ±10%
- `find src/frontend/components -name "*.tsx" | wc -l` ≤ 15 (대부분 삭제됨)

---

## 6. 알려진 제약 (Phase 0-11 의 scope 조정 사항)

본 추출은 spec 대비 다음 부분이 **simplified / deferred**:

### 6.1 BBoxCanvasView 의 모듈 미구현

- modulation overlay (props group 안에 정의되어 있으나 view 가 사용 안 함)
- debug overlay (valid_mask / edge band)
- SAM ROI (mask overlay / point markers / toolbar / status)
- ROI 편집 모드
- colormap (derived 뷰)
- pixel hover info

ingradient-edge 측은 기존 BBoxCanvas 그대로 사용 권장 — 또는 Phase 13 의 BBoxCanvasContainer 에서 추가 props 처리.

### 6.2 ImagesView 의 modal labeling 미통합

modal 안 BBoxCanvas labeling 은 `modalLabelingContent` slot 으로만 받음. 실제 modal 본체 (overlay + header + navigation) 는 추출 안 됨.

### 6.3 SetupPanel 의 advanced section 미추출

camera 의 모든 파라미터 (frame rate, gamma, black level, sharpness, pixel format, ROI, trigger 등) 은 view 에 없음. 핵심 (exposure / gain / WB) 만.

### 6.4 FieldTestTab / CameraParamsTab 매우 간소화

원본 541 / 322 줄의 복잡한 form 이 simplified placeholder 로 추출됨. edge container 가 추가 form fields 를 직접 render 또는 SetupPanelView 패턴을 따라 확장.

### 6.5 SystemMonitor / Connection 부분 단순화

각 sub-view 가 핵심 props 만. 일부 hard-coded 영어 string 이 있음 (예: NicStatusCardView).

### 6.6 styles 200 룰 위반 6 파일

| 파일 | 줄수 |
|---|---|
| `capture/CaptureView.styles.ts` | 357 |
| `images/ImagesView.styles.ts` | 288 |
| `capture/DeflectometryTuningControlsView.styles.ts` | 269 |
| `capture/types.ts` | 296 |
| `settings/types.ts` | 279 |
| `connection/types.ts` | 217 |

edge 원본 그대로 복사 (styles) 또는 consolidated types. 향후 sub-file 분해는 follow-up.

---

## 7. Phase 13 진행

본 가이드는 ingradient-edge 측 작업 (Phase 13) 의 사전 참고 자료. 실제 sub-phase 분할 + 각 step 세부 사항은 [edge-pages-phase-13-spec.md](./edge-pages-phase-13-spec.md) 참고.

전체 Phase 13 = 13.1 (인프라) → 13.2~13.8 (단순 페이지) → 13.9 (Workspace shell) → 13.10~13.12 (sub-view 교체) → 13.13 (정리 + e2e). 13 sub-phase.

---

## 8. 다음 액션

1. ingradient-edge 의 `update-ui.mjs` / `sync-ui.mjs` 확장 (Phase 13.1)
2. ingradient-ui 의 release CI 변경 — edge-pages tgz 별도 생성
3. Phase 13.2 (LoginScreen 마이그레이션) 부터 시작
