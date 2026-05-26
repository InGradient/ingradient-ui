---
title: Phase 9 — Settings tabs + CameraSettingsDialog shell 추출
purpose: ingradient-edge 의 settings/ 10 파일 (~2230줄) 을 @ingradient/edge-pages/settings 로 pure view 추출. Connection tab 은 Phase 10 으로 분리
audience: ingradient-ui contributor
date: 2026-05-19
status: draft
related:
  - ./edge-pages-extraction-roadmap.md
  - ./edge-pages-package-plan.md
  - ./edge-pages-phase-8-spec.md
---

# Phase 9 — Settings tabs + CameraSettingsDialog shell 추출

> Roadmap: [edge-pages-extraction-roadmap.md](./edge-pages-extraction-roadmap.md) § Phase 9
> 10 파일 중 9개 본 phase, Connection tab (settings/connection/ 14 파일) 은 Phase 10 으로 별도.

---

## 1. 목적

`packages/edge-pages/src/settings/` 에 settings tab 9 view + dialog shell 추출.

CameraSettingsDialog 는 LoginScreen / LicenseScreen / DatasetSelectScreen / TopBar 모두에서 mount — Phase 1~4 spec 에서 `settingsDialog` slot 으로 받기로 결정한 것을 본 phase 에서 실체화.

---

## 2. 대상 파일 + 의존

| 파일 | 줄 | i18n | store | IPC | 처리 |
|---|---|---|---|---|---|
| `CameraSettingsDialog.tsx` | 233 | ✅ | useAuthStore / useDeviceStore + camera connection hook | electron.getEdgeConfig / saveEdgeConfig / checkConnectivity / deactivateLicense + camera ops | shell view (분해 필요) |
| `AboutTab.tsx` | 211 | ✅ | 없음 | (확인 필요) | pure (multi-file 분해) |
| `CameraParamsTab.tsx` | 322 | ✅ | 없음 | fetch(CAMERA_SETTINGS_URL) | pure + container 분리 (분해 필요) |
| `CameraSettingsDialog` (위와 동일) | | | | | |
| `DataTab.tsx` | 136 | ✅ | 없음 | (확인 필요) | pure |
| `FieldTestTab.tsx` | 541 | ✅ | (확인 필요) | (확인 필요) | pure (분해 필요 — 200 룰 위반) |
| `ServerTab.tsx` | 170 | ✅ | 없음 | parent props | pure |
| `UnifiedLogsTab.tsx` | 105 | ✅ | 없음 | parent props (logs) | pure |
| `BackendLogsContent.tsx` | 214 | ✅ | 없음 | IPC | pure (분해 검토) |
| `FrontendLogsContent.tsx` | 143 | ✅ | useCaptureLogStore | pure |
| `UpdateSection.tsx` | 152 | ✅ | 없음 | electron.checkForUpdates / downloadUpdate / installUpdate | pure |

연관 store / IPC 모두 container 잔류 (Phase 1~8 와 동일 원칙).

**Connection tab 14 파일 (~1500줄)** 은 별도 Phase 10 으로 분리. CameraSettingsDialog 의 `connection` tab slot 으로 받음 — 본 phase 의 `connectionContent` slot prop.

---

## 3. 모듈 구조

```
packages/edge-pages/src/settings/
├─ CameraSettingsDialogView.tsx       — shell + VerticalTabs (≤ 180 줄)
├─ CameraSettingsDialog.styles.ts     — neue tab 별 styles split (필요 시)
├─ tabs/
│  ├─ AboutTabView.tsx                — ≤ 180 줄 (분해 안 됨 — 211줄 이지만 분할 검토)
│  ├─ AboutLicenseSection.tsx         — license info + deactivate (AboutTab 의 절반)
│  ├─ AboutTabView.styles.ts
│  ├─ ServerTabView.tsx               — ≤ 180 줄
│  ├─ ServerTabView.styles.ts
│  ├─ DataTabView.tsx                 — ≤ 140 줄
│  ├─ DataTabView.styles.ts
│  ├─ CameraParamsTabView.tsx         — ≤ 180 줄 (분해 필요 — 322 → multi-file)
│  ├─ CameraParamsForm.tsx            — 카메라 설정 form (exposure / gain / 등)
│  ├─ CameraParamsTabView.styles.ts
│  ├─ FieldTestTabView.tsx            — ≤ 200 줄 (분해 필수 — 541 → multi-file)
│  ├─ FieldTestForm.tsx               — 설정 입력
│  ├─ FieldTestResults.tsx            — 결과 표시
│  ├─ FieldTestActions.tsx            — Run / Reset 버튼
│  ├─ FieldTestTabView.styles.ts
│  ├─ UnifiedLogsTabView.tsx          — ≤ 130 줄 (Backend / Frontend swap)
│  ├─ BackendLogsContentView.tsx      — ≤ 180 줄 (분해 검토)
│  ├─ FrontendLogsContentView.tsx     — ≤ 150 줄
│  ├─ LogsTabView.styles.ts           — 공통 logs styles
│  └─ index.ts
├─ UpdateSectionView.tsx              — ≤ 150 줄 (CameraSettingsDialog 에서 호출되는 utility section)
├─ UpdateSectionView.styles.ts
├─ types.ts                           — 9 view props + sub-types
└─ index.ts                           — barrel
```

총 ~24 파일 (분해 후). 모두 ≤ 200 목표.

---

## 4. CameraSettingsDialogViewProps

```ts
export type SettingsTab = 'connection' | 'camera' | 'logs' | 'about' | 'server' | 'data' | 'fieldtest'

export interface CameraSettingsDialogLabels {
  // tab labels
  tabConnection: string
  tabCamera: string
  tabServer: string
  tabData: string
  tabLogs: string
  tabFieldTest: string
  tabAbout: string

  // dialog
  close: string
  title: string                                   // 'settings.title'
}

export interface CameraSettingsDialogViewProps {
  activeTab: SettingsTab
  currentUserRole: string | null                  // 'owner' / 'manager' 등 — tab visibility 결정

  // server tab — container 가 IPC 결과 props 로
  serverConfig: { platformBaseUrl: string; runtimeMode: 'auto' | 'online' | 'offline' } | null
  serverSaving: boolean
  serverSaveResult: 'connected' | 'no-connect' | 'error' | null
  serverSaveMessage: string | null
  connectivityResult: 'online' | 'offline' | 'checking' | null

  // about tab — license deactivation
  deactivationCode: string | null
  deactivateError: string | null

  // logs tab — log entries
  logs: { timestamp: string; level: string; message: string }[]
  hoveredLogIndex: number | null

  // i18n
  labels: CameraSettingsDialogLabels

  // tab content slots — Phase 10 의 ConnectionTabView 등 plug-in
  connectionContent?: React.ReactNode             // Phase 10 의 ConnectionTabView
  cameraContent?: React.ReactNode                 // CameraParamsTabView
  serverContent?: React.ReactNode                 // ServerTabView
  dataContent?: React.ReactNode                   // DataTabView
  fieldTestContent?: React.ReactNode              // FieldTestTabView
  logsContent?: React.ReactNode                   // UnifiedLogsTabView
  aboutContent?: React.ReactNode                  // AboutTabView

  // confirm dialogs (slot — caller 가 mount)
  deactivateConfirmDialog?: React.ReactNode

  // callbacks
  onClose: () => void
  onSetActiveTab: (tab: SettingsTab) => void
  onSetHoveredLogIndex: (index: number | null) => void
}
```

설계 노트:

- CameraSettingsDialog 233줄 의 **모든 IPC + state 는 container 잔류**. view 는 receive props.
- tab content 는 7 slot — 각 tab view 가 plug-in.
- 또 다른 옵션: view 가 tab content 직접 import (`<AboutTabView ... />`) — 단 props drilling 폭증. **결정**: slot 패턴 (Phase 5 의 Workspace 와 동일 — caller 가 active tab content 만 mount).

---

## 5. tab 별 view props (요약)

### 5.1 ServerTabViewProps

```ts
export interface ServerTabLabels {
  baseUrl: string
  runtimeMode: string
  modeAuto: string
  modeOnline: string
  modeOffline: string
  save: string
  saving: string
  connected: string
  noConnect: string
  error: string
}

export interface ServerTabViewProps {
  config: { platformBaseUrl: string; runtimeMode: 'auto' | 'online' | 'offline' }
  saving: boolean
  saveResult: 'connected' | 'no-connect' | 'error' | null
  saveMessage: string | null
  connectivityResult: 'online' | 'offline' | 'checking' | null
  labels: ServerTabLabels
  onConfigChange: (config: { platformBaseUrl: string; runtimeMode: 'auto' | 'online' | 'offline' }) => void
  onSave: () => void
}
```

### 5.2 AboutTabViewProps

```ts
export interface AboutTabLabels {
  version: string
  licenseType: string
  validUntil: string
  fingerprint: string
  copy: string
  copied: string
  deactivate: string
  deactivating: string
  deactivationCodeTitle: string
  // ~10 key
}

export interface AboutTabViewProps {
  appVersion: string
  licenseInfo: { type: string; validUntil: string | null; fingerprint: string }
  fingerprintCopied: boolean
  deactivationCode: string | null
  deactivateError: string | null
  labels: AboutTabLabels

  // slot
  updateSection?: React.ReactNode                 // UpdateSectionView 마운트

  onCopyFingerprint: () => void
  onOpenDeactivateConfirm: () => void
  onCloseDeactivationCode: () => void
}
```

### 5.3 DataTabViewProps

```ts
export interface DataTabViewProps {
  diskUsage: { dataDirPath: string; totalBytes: number; freeBytes: number }
  cacheSize: number
  isCleaningCache: boolean
  cleanupCompleted: boolean
  labels: DataTabLabels
  onCleanCache: () => void
  onOpenDataDir: () => void
}
```

### 5.4 CameraParamsTabViewProps

```ts
export interface CameraParamsTabViewProps {
  isConnected: boolean
  cvsCamDllPath: string | undefined
  cameraParams: CameraParams
  fetching: boolean
  saving: boolean
  saveResult: 'success' | 'error' | null
  labels: CameraParamsTabLabels
  onParamsChange: (params: CameraParams) => void
  onSave: () => void
  onReset: () => void
  onDllPathChange: (path: string) => void
}
```

### 5.5 FieldTestTabViewProps

```ts
export interface FieldTestTabViewProps {
  config: FieldTestConfig
  results: FieldTestResults | null
  running: boolean
  progress: number                                // 0~1
  log: string[]
  labels: FieldTestTabLabels
  onConfigChange: (config: FieldTestConfig) => void
  onRun: () => void
  onCancel: () => void
  onReset: () => void
  onExport: () => void
}
```

### 5.6 UnifiedLogsTabViewProps

```ts
export type LogsSource = 'backend' | 'frontend'

export interface UnifiedLogsTabViewProps {
  source: LogsSource
  backendLogsContent: React.ReactNode             // BackendLogsContentView slot
  frontendLogsContent: React.ReactNode            // FrontendLogsContentView slot
  labels: { backend: string; frontend: string }
  onSetSource: (source: LogsSource) => void
}
```

### 5.7 BackendLogsContentViewProps

```ts
export interface BackendLogsContentViewProps {
  logs: { timestamp: string; level: string; message: string; source?: string }[]
  loading: boolean
  refreshing: boolean
  searchQuery: string
  levelFilter: string                             // 'all' | 'info' | 'warn' | 'error'
  labels: BackendLogsLabels
  onSearchChange: (query: string) => void
  onLevelFilterChange: (level: string) => void
  onRefresh: () => void
  onClear: () => void
  onExport: () => void
}
```

### 5.8 FrontendLogsContentViewProps

```ts
export interface FrontendLogsContentViewProps {
  logs: { timestamp: string; level: string; message: string }[]
  labels: FrontendLogsLabels
  onClear: () => void
  onExport: () => void
}
```

### 5.9 UpdateSectionViewProps

```ts
export type UpdateStatus = 'idle' | 'checking' | 'available' | 'downloading' | 'downloaded' | 'error' | 'noUpdate'

export interface UpdateSectionViewProps {
  currentVersion: string
  status: UpdateStatus
  availableVersion: string | null
  progress: number                                // 0~1
  error: string | null
  labels: UpdateSectionLabels
  onCheckForUpdates: () => void
  onDownloadUpdate: () => void
  onInstallUpdate: () => void
}
```

---

## 6. 변경 파일

### 6.1 신규 (~24 file)

§3 의 settings/ 24 파일.

### 6.2 수정 (1 file)

```diff
  export * from './statics'
+ export * from './settings'
```

### 6.3 신규 story

```
stories/pages/edge/0.0.1/settings/
├─ CameraSettingsDialog.stories.tsx       — 5 scenario (Default / TabSwitch / RoleRestricted / DeactivateFlow / WithConnection slot)
├─ AboutTabView.stories.tsx               — 4 scenario (Default / WithLicense / Deactivating / WithUpdate)
├─ ServerTabView.stories.tsx              — 4 scenario (Empty / Editing / Saving / SaveError)
├─ DataTabView.stories.tsx                — 3 scenario (LowUsage / HighUsage / Cleaning)
├─ CameraParamsTabView.stories.tsx        — 4 scenario (Connected / Disconnected / Saving / Error)
├─ FieldTestTabView.stories.tsx           — 5 scenario (Idle / Configuring / Running / Done / Failed)
├─ UnifiedLogsTabView.stories.tsx         — 2 scenario (Backend / Frontend)
├─ BackendLogsContentView.stories.tsx     — 4 scenario (Empty / WithLogs / Filtered / Searching)
├─ FrontendLogsContentView.stories.tsx    — 3 scenario (Empty / WithLogs / ManyLogs)
└─ UpdateSectionView.stories.tsx          — 5 scenario (Idle / Checking / Available / Downloading / NoUpdate)
```

총 10 story × 2~5 scenario = ~39 scenario.

신규 fixture:
- `stories/fixtures/edge/0.0.1/settings-config.ts` — serverConfig / cameraParams mock
- `stories/fixtures/edge/0.0.1/logs.ts` — backend + frontend log entries
- `stories/fixtures/edge/0.0.1/field-test-results.ts` — FieldTestResults mock

### 6.4 건드리지 않음

- `ingradient-edge/src/frontend/components/settings/*` — Phase 13
- `ingradient-edge/src/frontend/components/settings/connection/*` — Phase 10
- `ingradient-edge/src/frontend/modules/settings/*` — Phase 13

---

## 7. i18n 키 매핑 (요약)

총 ~100 key. 본 spec 본문에 전부 나열 안 함.

요약:
- CameraSettingsDialogLabels: ~10 key (tabs + close + title)
- ServerTabLabels: ~10 key
- AboutTabLabels: ~15 key
- DataTabLabels: ~10 key
- CameraParamsTabLabels: ~15 key
- FieldTestTabLabels: ~25 key (가장 많음 — 541줄에 비례)
- UnifiedLogsTabLabels: 2 key
- BackendLogsLabels: ~10 key
- FrontendLogsLabels: ~5 key
- UpdateSectionLabels: ~10 key

Phase 13 에서 helper hook (`useSettingsLabels()` 등) 으로 묶음.

---

## 8. 실행 순서

1. `settings/types.ts` — 9 view props
2. styles 이전:
   - `settings/tabs/AboutTabView.styles.ts`
   - `settings/tabs/ServerTabView.styles.ts`
   - `settings/tabs/DataTabView.styles.ts`
   - `settings/tabs/CameraParamsTabView.styles.ts`
   - `settings/tabs/FieldTestTabView.styles.ts`
   - `settings/tabs/LogsTabView.styles.ts`
   - `settings/UpdateSectionView.styles.ts`
   - `settings/CameraSettingsDialog.styles.ts` (필요 시)
3. tab sub-view (간단한 것부터):
   - `settings/UpdateSectionView.tsx`
   - `settings/tabs/DataTabView.tsx`
   - `settings/tabs/ServerTabView.tsx`
   - `settings/tabs/FrontendLogsContentView.tsx`
   - `settings/tabs/BackendLogsContentView.tsx`
   - `settings/tabs/UnifiedLogsTabView.tsx`
4. AboutTab sub-view:
   - `settings/tabs/AboutLicenseSection.tsx`
   - `settings/tabs/AboutTabView.tsx`
5. CameraParamsTab sub-view:
   - `settings/tabs/CameraParamsForm.tsx`
   - `settings/tabs/CameraParamsTabView.tsx`
6. FieldTestTab sub-view:
   - `settings/tabs/FieldTestForm.tsx`
   - `settings/tabs/FieldTestResults.tsx`
   - `settings/tabs/FieldTestActions.tsx`
   - `settings/tabs/FieldTestTabView.tsx`
7. dialog shell:
   - `settings/CameraSettingsDialogView.tsx`
8. `settings/tabs/index.ts` + `settings/index.ts`
9. `packages/edge-pages/src/index.ts` 수정
10. fixtures + stories
11. typecheck + build + storybook build

---

## 9. 검증

| # | 명령 | 기대 |
|---|---|---|
| 1 | `find packages/edge-pages/src/settings -type f \| wc -l` | ~24 파일 |
| 2 | `cd packages/edge-pages && npx tsc --noEmit` | 0 error |
| 3 | `cd packages/edge-pages && npm run build` | 9 view export |
| 4 | 모든 파일 `wc -l` | 모두 < 200 |
| 5 | `npx tsc --noEmit -p tsconfig.json` (root) | 0 error |
| 6 | `npm run build:storybook` | exit 0 |
| 7 | Storybook 수동 — 39 scenario | 모두 props 만으로 렌더 |
| 8 | grep — 금지 import 0 | `grep -rE 'useTranslation\|window\.electron\|zustand\|i18next\|fetch(\|localStorage\|useAuthStore\|useDeviceStore\|useCaptureLogStore' packages/edge-pages/src/settings/` → 0 match |
| 9 | grep — settings 가 connection sub-folder 의존 0 | `grep -rE 'connection' packages/edge-pages/src/settings/` → connectionContent prop 외 0 match (Phase 10 격리) |
| 10 | CameraSettingsDialog 의 7 tab slot 검증 | story 의 한 scenario 에서 7 tab 모두 placeholder slot 으로 채워보기 |

---

## 10. 성공 기준

- 검증 1~10 통과
- 9 view + 1 dialog shell 가 store/IPC/i18n/fetch/localStorage 의존 0
- 39 storybook scenario 가 props 만으로 렌더
- 모든 파일 < 200 줄 (FieldTestTab 541 → 4 파일 분해)
- CameraSettingsDialog 가 7 tab slot 받는 shell — Phase 10 의 ConnectionTab plug-in 가능
- Phase 1~4 의 `settingsDialog` slot 이 본 phase 의 `CameraSettingsDialogView` 로 plug-in 가능 (수동 확인)

---

## 11. 리스크

### 11.1 FieldTestTab 541 줄의 multi-file 분해

위험: 541줄 단일 파일을 4 파일로 분해 시 form state / results state / action handler 의 의존성 얽힘.

대응:
- 최상위 `FieldTestTabView` 가 모든 props 받고 sub-view 에 분배
- sub-view 3개는 평면 prop (no nested state)
- 분해 후 import 폭증은 `tabs/field-test/index.ts` re-export 로 완화

### 11.2 CameraSettingsDialog 의 IPC 의 양이 많음

위험: 233줄 dialog 가 IPC 4종 (saveEdgeConfig / checkConnectivity / deactivateLicense / getEdgeConfig) + state 10+. container 화 시 props 폭증.

대응:
- props 50+ 예상 — group object 패턴 적용 (server / about / camera 별로 group)
- 본 spec §4 의 인터페이스를 group object 로 refactor 가능 (구현 시 결정)

### 11.3 `BackendLogsContent.tsx` 의 IPC 호출 누락 확인

위험: 214줄 — IPC 호출이 있을 수 있음 (`grep` 으로 확인 필요).

대응:
- 본 phase 시작 전 모든 settings tab 파일의 IPC / store / fetch 사용 매핑
- 위 §2 의 표 갱신 후 구현

### 11.4 `FrontendLogsContent.tsx` 의 `useCaptureLogStore`

위험: zustand store 직접 의존.

대응:
- container 가 store subscribe + logs array 를 props 로 전달
- view 는 array 만

### 11.5 settings ↔ connection 간 격리

위험: Phase 10 의 connection 코드가 settings/ 안에 있는 상태에서 본 phase 의 settings/ 가 그걸 import 하면 결합도 증가.

대응:
- 본 phase 의 settings/ 는 connection 의존 0 — `connectionContent: ReactNode` slot 으로만
- Phase 10 의 ConnectionTabView 가 별도 sub-package 로 격리
- 검증 #9 에서 grep 확인

### 11.6 deactivate confirm dialog 의 slot 위치

위험: 본 phase 의 dialog 가 confirm sub-dialog 를 가질 수 있음 (DialogShell 안 ConfirmDialog).

대응:
- slot prop `deactivateConfirmDialog?: ReactNode` 으로 받음
- container 가 visibility 결정 후 mount
- 또는 view 안 ConfirmDialog 직접 (DialogShell 과 동일 `@ingradient/ui` 제공) — **결정**: slot 으로 (caller 가 confirm 액션 정의)

### 11.7 `useCameraConnection` hook 의 위치

위험: edge 의 CameraSettingsDialog 가 `useCameraConnection()` 호출 — hook 자체가 store + IPC 의존.

대응:
- container 잔류
- view 는 connection 상태를 props 로 받음 (connection tab 안 한정 — 본 phase 의 dialog shell 은 connection state 모름. Phase 10 의 ConnectionTab 가 받음)

### 11.8 200줄 가까운 ServerTab(170) / DataTab(136) / UpdateSection(152) 분해 여부

위험: 분해 불필요한 파일을 무리하게 분해 시 보일러플레이트 증가.

대응:
- ≤ 200 인 파일은 그대로
- ≥ 200 만 분해 (AboutTab 211, CameraParamsTab 322, FieldTestTab 541, BackendLogsContent 214)

---

## 12. Rollback

git revert. 산출물:
- `packages/edge-pages/src/settings/` 디렉토리 삭제
- `packages/edge-pages/src/index.ts` 의 settings export 제거
- `stories/pages/edge/0.0.1/settings/` 삭제
- 신규 fixture 3개 삭제
- `npm run build --workspace packages/edge-pages` 재실행

---

## 13. 종료 후 상태

- `@ingradient/edge-pages` 가 32+ view export (Phase 1-8 누적 + Phase 9 의 9 + dialog shell)
- CameraSettingsDialog 가 7 tab slot 받는 shell — Phase 10 의 ConnectionTab plug-in 준비
- Phase 1~4 의 `settingsDialog` slot 실체화
- 200줄 룰 위반 4 파일 (AboutTab 211, CameraParamsTab 322, FieldTestTab 541, BackendLogsContent 214) multi-file 분해 완료
- Phase 10 (Connection sub-tab 14 파일) 진입 준비 완료

---

## 14. 다음 액션

1. 본 spec ok
2. 실행 (§8 의 11 step)
3. 검증 (§9 의 10 step)
4. Phase 10 spec 작성 (`edge-pages-phase-10-spec.md`) — Connection sub-tab 14 파일
