---
title: Phase 3 — DatasetSelectView + dataset 모달 추출
purpose: ingradient-edge 의 DatasetSelectScreen + AddDatasetModal + ExportModal + CreateProjectForm 을 @ingradient/edge-pages/{dataset-select,dataset-modals} 로 승격하고 storybook story 를 새 view 기반으로 rewrite
audience: ingradient-ui contributor
date: 2026-05-19
status: draft
related:
  - ./edge-pages-extraction-roadmap.md
  - ./edge-pages-package-plan.md
  - ./edge-pages-phase-1-spec.md
  - ./edge-pages-phase-2-spec.md
---

# Phase 3 — DatasetSelectView + dataset 모달 추출

> Roadmap: [edge-pages-extraction-roadmap.md](./edge-pages-extraction-roadmap.md) § Phase 3
> Phase 1~2 의 i18n labels / slot prop 패턴 + **multi-file 분해 + 3 모달 동시 추출** 첫 검증.

---

## 1. 목적

storybook 의 `DatasetSelectScene` 과 ingradient-edge 의 `DatasetSelectScreen` (298 줄) + 3 모달 (AddDatasetModal 175 / ExportModal 124 / CreateProjectForm 33) 이 같은 JSX 를 공유하도록, 다음 view 를 추출:

- `DatasetSelectView` (page-level shell) — `packages/edge-pages/src/dataset-select/`
- `AddDatasetModalView`, `ExportModalView`, `CreateProjectFormView` — `packages/edge-pages/src/dataset-modals/`

본 phase 는 첫 multi-file view + 첫 모달 묶음 추출. **AccountMenu 는 slot** 으로 받음 (Phase 4 에서 자체 추출).

---

## 2. JSX 출처 — Edge 기준

storybook story 의 `DatasetSelectScene` (Card + StatusPill 기반 단순 mockup) 폐기. edge `DatasetSelectScreen` 의 JSX 채택.

| 항목 | Story 현행 | Edge | View 채택 |
|---|---|---|---|
| Page shell | inline style 3개 | styled `Wrap` / `Header` / `Content` | styled (edge) |
| 헤더 | `Edge Workstation` + `Badge` | `Title` + `ModeTag` + `StatusDot` + LangSelector + Refresh + Settings + AccountMenu | edge |
| Devices section | `SectionPanel` + Card grid | 없음 (edge 화면엔 device section 없음 — DatasetSelectScreen 안에서 device 표시 X) | edge (제거) |
| Recent | `SectionPanel` + `mockDatasets` grid | `RecentSection` + `RecentScroll` + `RecentCard` (실제 데이터셋 최대 5개) | edge |
| Project groups | 없음 | `ProjectSection` × N + `ProjectHeader` (name + ProjectTypeTag + RoleBadge + AddDatasetBtn) + `DatasetGrid` of `DatasetCard` | edge |
| Empty state | `EmptyState` 한 줄 | `<EmptyState>` (offline) 또는 `CreateProjectForm` (online) | edge |
| Loading | 없음 | `Spinner` + i18n string | edge |
| Error | 없음 | `ErrorMsg` | edge |
| 모달 | 없음 | Export / AddDataset (ReactDOM.createPortal) + CameraSettingsDialog (다른 phase) | edge (slot) |
| Session expired | 없음 | `ConfirmDialog` (i18n title/desc/buttons) | edge (props-driven, container 가 mount) |

DatasetSelectScreen (298 줄) + 4 styles file (209+190+80+58 = 537 줄) 가 본 view 의 입력. multi-file 분해 필수.

---

## 3. 모듈 구조

### 3.1 dataset-select/

```
packages/edge-pages/src/dataset-select/
├─ DatasetSelectView.tsx              — page shell (≤ 200 줄 목표)
├─ DatasetSelectHeader.tsx            — Header 영역 (Title / status / icons / slot for AccountMenu)
├─ DatasetSelectContent.tsx           — 본문 (loading / error / recent / groups / empty)
├─ RecentDatasetCard.tsx              — 최근 데이터셋 카드 (RecentCard render)
├─ DatasetCardView.tsx                — 단일 dataset 카드 + dot menu
├─ class-chips.tsx                    — renderClassChips helper (function export)
├─ DatasetSelectView.styles.ts        — Wrap/Header/Content + RoleBadge/ModeTag/StatusDot 등 page-level styles
├─ dataset-card.styles.ts             — DatasetCard/RecentCard 관련 styles (edge DatasetCard.styles.ts 이전)
├─ dataset-grid.styles.ts             — ProjectSection/Grid 관련 styles
├─ dot-menu.styles.ts                 — DotsBtn/DotMenu styles
├─ types.ts                           — DatasetSelectViewProps + sub-component props
└─ index.ts                           — barrel
```

총 12 파일. 각 ≤ 200 줄 목표.

### 3.2 dataset-modals/

```
packages/edge-pages/src/dataset-modals/
├─ AddDatasetModalView.tsx            — pure UI (≤ 180 줄)
├─ ExportModalView.tsx                — pure UI (≤ 130 줄)
├─ CreateProjectFormView.tsx          — empty state + status msg
├─ AddDatasetModalView.styles.ts      — InlineError
├─ ExportModalView.styles.ts          — ProgressBarTrack/Fill
├─ types.ts                           — Modal props
└─ index.ts                           — barrel
```

총 7 파일.

---

## 4. Props Interface

### 4.1 DatasetSelectView

```ts
// packages/edge-pages/src/dataset-select/types.ts

export interface EdgeClass {
  class_id?: string
  name: string
  color: string
}

export interface EdgeDataset {
  dataset_id: string
  dataset_name: string
  project_id: string
  project_name?: string
  deflectometry_enabled?: boolean
  role?: string
  image_count?: number
  classes?: EdgeClass[]
  task_type?: string
}

export interface EdgeProjectGroup {
  project_id: string
  project_name: string
  deflectometry_enabled: boolean
  role: string
  datasets: EdgeDataset[]
}

export interface RecentDatasetEntry {
  dataset: EdgeDataset
  isLatest: boolean
}

export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected'

export interface DatasetSelectLabels {
  title: string                                         // "Datasets" / edge 의 'dataset.title'
  online: string
  offline: string
  refresh: string
  settingsTitle: string                                 // 'topbar.settings' 또는 disabled tooltip
  settingsDisabledTitle: string                         // 'Camera setup — permission required'
  recentLabel: string                                   // "Recent"
  recentBadge: string                                   // "Latest"
  addDataset: string
  noClasses: string                                     // 클래스 비었을 때 chip
  more: string                                          // dot menu tooltip
  export: string                                        // dot menu item
  loading: string
  emptyOffline: string
  emptyOnline: string                                   // CreateProjectForm 의 EmptyState
  createOnPlatform: string                              // CreateProjectForm 의 status msg
  sessionExpiredTitle: string
  sessionExpiredDesc: string
  sessionExpiredConfirm: string
  cancel: string
  images: (count: number) => string                     // 'dataset.images' (count 보간) → "12 images"
  roleLabel: (role: string) => string                   // 'dataset.role.{role}' → fallback role 자체
}

export interface DatasetSelectViewProps {
  // header
  mode: 'online' | 'offline'
  connectionStatus: ConnectionStatus
  connectionTitle: string                               // hover tooltip (already translated)
  canSetupCamera: boolean

  // data
  loading: boolean
  fetchError: string | null
  recentDatasets: RecentDatasetEntry[]                  // ≤ 5
  groups: EdgeProjectGroup[]
  totalDatasets: number
  latestDatasetId: string | null

  // visual-only state (view 가 직접 관리해도 되지만 일관성을 위해 lift)
  openDotMenuDatasetId: string | null

  // session expired dialog
  sessionExpired: boolean

  // i18n
  labels: DatasetSelectLabels

  // slots — Phase 4/9/12 에서 채워질 dependency
  langSelector?: React.ReactNode                        // i18n 의존
  accountMenu?: React.ReactNode                         // Phase 4 AccountMenuView
  settingsDialog?: React.ReactNode                      // Phase 9 CameraSettingsDialogView, open 시 mount
  exportModal?: React.ReactNode                         // open 시 mount (caller 가 ReactDOM.createPortal)
  addDatasetModal?: React.ReactNode                     // open 시 mount

  // callbacks
  onRefresh: () => void
  onOpenSettings: () => void
  onSelectDataset: (dataset: EdgeDataset) => void
  onAddDatasetClick: (projectId: string) => void
  onExportClick: (dataset: EdgeDataset) => void
  onToggleDotMenu: (datasetId: string | null) => void   // null = close
  onSessionExpiredConfirm: () => void
  onSessionExpiredCancel: () => void
}
```

설계 노트:

- View 의 local state 0. `dotMenuDataset` 도 props (container 가 `useState`).
- `connectionTitle` 은 container 가 i18n 처리 후 평문 prop (`'Connected' / 'Connecting...' / 'Disconnected'`).
- `recentDatasets` 는 이미 정렬된 array (최대 5개) — view 는 그대로 render. 5 제한은 container 책임.
- `images(count)` / `roleLabel(role)` 처럼 보간 / fallback 이 필요한 항목은 함수 형태 labels.
- 4 slot (langSelector / accountMenu / settingsDialog / exportModal / addDatasetModal) — 모달 2개도 slot (Phase 3 안에서 view 도 정의하지만 mount 자체는 caller).
- `ConfirmDialog` 는 `@ingradient/ui` 가 export 하는 generic primitive — view 가 직접 사용 가능 (slot 아님).

### 4.2 AddDatasetModalView

```ts
// packages/edge-pages/src/dataset-modals/types.ts

export type EdgeTaskType = 'classification' | 'object_detection' | 'segmentation' | 'point'

export interface AddDatasetClass {
  class_id: string
  class_name: string
  color: string
}

export interface AddDatasetModalLabels {
  title: string                                         // 'dataset.addDataset'
  cancel: string                                        // 'dataset.cancel'
  add: string                                           // 'dataset.add'
  adding: string                                        // 'dataset.adding'
  datasetNameLabel: string                              // 'dataset.datasetNamePlaceholder'
  taskTypeLabel: string                                 // 'dataset.taskTypeLabel'
  classesLabel: (selected: number, total: number) => string  // "Classes (3/5)"
  taskTypeOptions: Record<EdgeTaskType, string>         // hard-coded EDGE_TASK_LABEL 이전 — labels 로 흡수
}

export interface AddDatasetModalViewProps {
  // form state
  name: string
  taskType: EdgeTaskType
  selectedClassIds: Set<string>
  allClasses: AddDatasetClass[]

  // placeholder
  namePlaceholder: string                               // container 가 nextAvailableName 계산 후 전달

  // status
  adding: boolean
  error: string | null

  // i18n
  labels: AddDatasetModalLabels

  // callbacks
  onNameChange: (value: string) => void
  onTaskTypeChange: (value: EdgeTaskType) => void
  onClassesChange: (ids: Set<string>) => void
  onSubmit: (e: React.FormEvent) => void
  onClose: () => void

  // ref (initial focus)
  nameInputRef?: React.RefObject<HTMLInputElement>
}
```

설계 노트:

- IPC (loadSession, addLocalDataset, updateDatasetClasses, getAllProjectClasses, fetch) 모두 container 잔류.
- `allClasses` 는 container 가 IPC 후 props 로 (loading 중엔 `[]` 전달).
- `nextAvailableName` 헬퍼는 container 측 util 또는 hook 으로. view 에는 단순 placeholder string 만.
- task type option `disabled` 는 현재 edge 가 hard-coded (object_detection 만 enabled). view 안 같은 hard-coded 유지 — `EdgeTaskType` 외 3개는 모두 disabled. 향후 변경 시 prop 추가.

### 4.3 ExportModalView

```ts
export type ExportPhase = 'idle' | 'running' | 'done' | 'error'

export interface ExportModalLabels {
  title: string                                         // "Export"
  cancel: string                                        // "Cancel"
  close: string                                         // "Close"
  export: string                                        // "Export"
  exporting: string                                     // "Exporting…"
  complete: string                                      // "Export complete."
  images: (count: number) => string                     // 'dataset.images'
  localImages: (count: number) => string                // 'dataset.localImages'
}

export interface ExportModalViewProps {
  datasetName: string
  imageCount: number                                    // 전체 이미지 수
  localImageCount: number                               // 로컬 라벨링된 이미지 수 (export 대상)
  phase: ExportPhase
  error: string | null
  labels: ExportModalLabels
  onClose: () => void
  onExport: () => void
}
```

설계 노트:

- IPC (`getLabeledImages`, `exportIgpPackage`) 모두 container.
- `localImages` array 자체는 view 에 안 보임 — count 만.
- `phase === 'running'` 시 close/export 둘 다 disabled.
- 본 phase 의 ExportModalView 는 edge 의 `'Export' / 'Cancel' / 'Close' / 'Export complete.'` literal 도 labels 로 흡수 (edge 는 이 부분은 i18n 안 함 — 그대로 hard-coded 였음). 본 phase 에서 i18n key 화 결정 — labels 로 전달, 향후 edge 의 locale 에 키 추가는 Phase 13.

### 4.4 CreateProjectFormView

```ts
export interface CreateProjectFormLabels {
  emptyOnline: string                                   // 'dataset.emptyOnline'
  createOnPlatform: string                              // 'dataset.createOnPlatform'
}

export interface CreateProjectFormViewProps {
  labels: CreateProjectFormLabels
}
```

설계 노트:

- 매우 단순 — `EmptyState` + 안내 한 줄. 별도 sub-view 없음.
- 이름 (`CreateProjectForm`) 은 platform-pages 의 `CreateProjectView` 와 헷갈리지 않게 **`CreateProjectFormView`** 로 명명 (form 만 보여주는 안내문이라 platform 의 full form 과 다름).

---

## 5. 변경 파일

### 5.1 신규 (19 file)

dataset-select/ 12 + dataset-modals/ 7 = 19.

styles 파일은 edge 원본을 그대로 이전:

- `dataset-select/DatasetSelectView.styles.ts` ← `pages/DatasetSelectScreen.styles.ts` (209 줄, 그대로 — 200 룰 약간 초과 시 §6 분할 결정)
- `dataset-select/dataset-card.styles.ts` ← `pages/DatasetCard.styles.ts` (190 줄)
- `dataset-select/dataset-grid.styles.ts` ← `pages/DatasetGrid.styles.ts` (80 줄)
- `dataset-select/dot-menu.styles.ts` ← `pages/DotMenu.styles.ts` (58 줄)
- `dataset-modals/AddDatasetModalView.styles.ts` ← `components/dataset/AddDatasetModal.styles.ts` (11 줄, `InlineError` 만)
- `dataset-modals/ExportModalView.styles.ts` ← `components/dataset/ExportModal.styles.ts` (25 줄, `ProgressBarTrack` / `ProgressBarFill`)

**styles 200 줄 룰 처리**: `DatasetSelectScreen.styles.ts` (209) 가 9 줄 초과. 본 phase 에서 그대로 이전 시 룰 위반. 두 옵션:

- **A**: section 별로 분할 (예: header.styles.ts / content.styles.ts) — 본 phase 작업 ↑
- **B**: 그대로 두고 200 룰 부분적 양보 (스타일 파일은 의미적 응집도 우선)

**결정**: 옵션 **A** 채택. `DatasetSelectScreen.styles.ts` 의 21 styled export 를 다음으로 분할:

```
dataset-select/styles/
├─ page.styles.ts        — Wrap / Content / Spinner / ErrorMsg / SectionLabel
├─ header.styles.ts      — Header / HeaderLeft / Title / HeaderRight / ModeTag / IconBtn / StatusItem / StatusDot / RefreshBtn / RoleBadge
└─ (DatasetCard.styles.ts / DatasetGrid.styles.ts / DotMenu.styles.ts 는 그대로 이전)
```

신규 파일 수: 13 → 14 (style 1 분할). dataset-modals 는 변동 없음.

### 5.2 수정 (2 file)

#### `packages/edge-pages/src/index.ts`

```diff
  export * from './login'
  export * from './license'
+ export * from './dataset-select'
+ export * from './dataset-modals'
```

#### `stories/pages/edge/0.0.1/DatasetSelect.stories.tsx`

- inline `DatasetSelectScene` 컴포넌트 삭제
- `DatasetSelectView` + `AddDatasetModalView` / `ExportModalView` / `CreateProjectFormView` import
- scenario rewrite (기존 `WithDatasets` / `Empty` → 8 scenario 확장):
  - **EmptyOffline** — offline + groups 0
  - **EmptyOnline** — online + groups 0 (CreateProjectFormView 표시)
  - **WithGroups** — online + 2 project groups
  - **WithRecent** — recent + groups
  - **Loading** — loading=true
  - **FetchError** — fetchError 채움
  - **AddDatasetModalOpen** — addDatasetModal slot mount
  - **ExportModalOpen** — exportModal slot mount
- 기존 `mockDevices` / `mockDatasets` fixture 는 폐기 가능 (devices 는 본 view 에 없음). `stories/fixtures/edge/0.0.1/datasets.ts` 신규 — `EdgeProjectGroup[]` fixture.

target line count ≤ 250.

### 5.3 건드리지 않음

- `ingradient-edge/src/frontend/pages/DatasetSelectScreen.tsx` — Phase 13
- `ingradient-edge/src/frontend/pages/DatasetSelectScreen.styles.ts` / DatasetCard / DatasetGrid / DotMenu styles — Phase 13 에서 삭제
- `ingradient-edge/src/frontend/components/dataset/*` — Phase 13
- `ingradient-edge/src/frontend/components/AccountMenu*` — Phase 4
- `ingradient-edge/src/frontend/components/settings/CameraSettingsDialog*` — Phase 9

---

## 6. i18n 키 매핑

### 6.1 DatasetSelectLabels

| labels.* | i18next key | 비고 |
|---|---|---|
| title | `dataset.title` | |
| online | `dataset.online` | |
| offline | `dataset.offline` | |
| refresh | `dataset.refresh` | |
| settingsTitle | `topbar.settings` | |
| settingsDisabledTitle | (literal) `'Camera setup — permission required'` | edge 가 hard-coded — 본 phase 그대로 |
| recentLabel | `dataset.recentLabel` | |
| recentBadge | `dataset.recentBadge` | |
| addDataset | `dataset.addDataset` | |
| noClasses | `dataset.noClasses` | |
| more | `dataset.more` | |
| export | `dataset.export` | |
| loading | `dataset.loading` | |
| emptyOffline | `dataset.emptyOffline` | |
| emptyOnline | `dataset.emptyOnline` | |
| createOnPlatform | `dataset.createOnPlatform` | |
| sessionExpiredTitle | `dataset.sessionExpiredTitle` | |
| sessionExpiredDesc | `dataset.sessionExpiredDesc` | |
| sessionExpiredConfirm | `dataset.sessionExpiredConfirm` | |
| cancel | `dataset.cancel` | |
| images(count) | `dataset.images` w/ `{count}` | 함수 |
| roleLabel(role) | `dataset.role.{role}` w/ fallback `role` | 함수 |

총 22 항목 + 1 literal.

### 6.2 AddDatasetModalLabels

| labels.* | i18next key | 비고 |
|---|---|---|
| title | `dataset.addDataset` | |
| cancel | `dataset.cancel` | |
| add | `dataset.add` | |
| adding | `dataset.adding` | |
| datasetNameLabel | `dataset.datasetNamePlaceholder` | |
| taskTypeLabel | `dataset.taskTypeLabel` | |
| classesLabel(s,t) | (literal) `"Classes ({s}/{t})"` | edge 는 hard-coded — 본 phase 그대로 |
| taskTypeOptions | (literal Record) | edge `EDGE_TASK_LABEL` — labels 로 흡수 (caller 가 hard-coded 또는 i18n) |

### 6.3 ExportModalLabels

| labels.* | i18next key | 비고 |
|---|---|---|
| title | (literal) `"Export"` | edge hard-coded |
| cancel | (literal) `"Cancel"` | edge hard-coded |
| close | (literal) `"Close"` | edge hard-coded |
| export | (literal) `"Export"` | edge hard-coded |
| exporting | (literal) `"Exporting…"` | edge hard-coded |
| complete | (literal) `"Export complete."` | edge hard-coded |
| images(count) | `dataset.images` | |
| localImages(count) | `dataset.localImages` | |

### 6.4 CreateProjectFormLabels

| labels.* | i18next key | 비고 |
|---|---|---|
| emptyOnline | `dataset.emptyOnline` | |
| createOnPlatform | `dataset.createOnPlatform` | |

**hard-coded literal 정책**: edge 가 i18n 처리 안 한 string 은 본 phase 에서도 변경 안 함 — labels prop 에 평문 string 으로 받되 caller (storybook 또는 edge container) 가 hard-coded 또는 향후 i18n 결정. 본 phase 는 새 i18n key 추가하지 않음 (요청받은 것만 구현 원칙).

---

## 7. 실행 순서

1. styles 이전:
   - `dataset-select/styles/page.styles.ts` + `header.styles.ts` (DatasetSelectScreen.styles.ts 분할)
   - `dataset-select/dataset-card.styles.ts`
   - `dataset-select/dataset-grid.styles.ts`
   - `dataset-select/dot-menu.styles.ts`
   - `dataset-modals/AddDatasetModalView.styles.ts`
   - `dataset-modals/ExportModalView.styles.ts`
2. types:
   - `dataset-select/types.ts`
   - `dataset-modals/types.ts`
3. 모달 view (의존성 적음):
   - `dataset-modals/CreateProjectFormView.tsx`
   - `dataset-modals/ExportModalView.tsx`
   - `dataset-modals/AddDatasetModalView.tsx`
   - `dataset-modals/index.ts`
4. dataset-select sub-view:
   - `dataset-select/class-chips.tsx` (helper)
   - `dataset-select/DatasetCardView.tsx`
   - `dataset-select/RecentDatasetCard.tsx`
   - `dataset-select/DatasetSelectHeader.tsx`
   - `dataset-select/DatasetSelectContent.tsx`
5. page view:
   - `dataset-select/DatasetSelectView.tsx` (≤ 200 줄)
   - `dataset-select/index.ts`
6. `packages/edge-pages/src/index.ts` 수정
7. fixture 신규: `stories/fixtures/edge/0.0.1/dataset-groups.ts` (5~10 개 dataset, 2 project group)
8. story rewrite: `stories/pages/edge/0.0.1/DatasetSelect.stories.tsx`
9. typecheck + build + storybook build

---

## 8. 검증

| # | 명령 | 기대 결과 |
|---|---|---|
| 1 | `ls packages/edge-pages/src/dataset-select/` + `ls packages/edge-pages/src/dataset-modals/` | dataset-select 14 파일 + dataset-modals 7 파일 |
| 2 | `cd packages/edge-pages && npx tsc --noEmit` | 0 error |
| 3 | `cd packages/edge-pages && npm run build` | `lib/index.{js,d.ts}` 갱신, 4 view export 포함 |
| 4 | 각 파일 `wc -l` | 모든 파일 < 200 |
| 5 | `wc -l packages/edge-pages/src/dataset-select/DatasetSelectView.tsx` | ≤ 200 |
| 6 | `wc -l stories/pages/edge/0.0.1/DatasetSelect.stories.tsx` | ≤ 250 |
| 7 | `npx tsc --noEmit -p tsconfig.json` (root) | 0 error |
| 8 | `npm run build:storybook` | exit 0 |
| 9 | Storybook 수동 확인 — 8 scenario 모두 렌더 | EmptyOffline / EmptyOnline / WithGroups / WithRecent / Loading / FetchError / AddDatasetModalOpen / ExportModalOpen |
| 10 | grep — 금지 import 0 | `grep -rE 'useTranslation\|window\.electron\|zustand\|i18next\|sql\.js' packages/edge-pages/src/dataset-select/ packages/edge-pages/src/dataset-modals/` → 0 match |

---

## 9. 성공 기준

- 검증 1~10 통과
- 모든 파일 < 200 줄
- 4 view (DatasetSelectView / AddDatasetModalView / ExportModalView / CreateProjectFormView) + 5 sub-view (Header / Content / DatasetCardView / RecentDatasetCard / class-chips) 가 store/IPC/i18n hook 의존 0
- 8 storybook scenario 가 props 만으로 렌더
- diff 가 ~22 file 범위 (신규 ~20 + 수정 2)

---

## 10. 리스크

### 10.1 `DatasetSelectScreen.styles.ts` 209 줄 분할로 import 경로 폭증

위험: 21 styled export 가 2 파일로 분할되면 view 가 두 경로에서 import.

대응:
- §5.1 의 page.styles.ts / header.styles.ts 2 파일로만 분할 (3+ 분할 안 함)
- view 가 한 곳에서 가져오게 `styles/index.ts` re-export:
  ```ts
  export * from './page.styles'
  export * from './header.styles'
  ```
- view 는 `import { Wrap, Header, Title } from './styles'` 한 줄

### 10.2 `AccountMenu` slot 의존

위험: Phase 3 의 DatasetSelectView 는 AccountMenu slot 을 받지만, Phase 4 까지는 AccountMenuView 가 없음.

대응:
- storybook 에선 `<div>Account ▾</div>` placeholder
- ingradient-edge 컨테이너에선 기존 `<AccountMenu />` (Phase 13 까지 그대로 mount)
- view 는 slot 의 내용 불문 — render 만

### 10.3 `ConfirmDialog` 의 `@ingradient/ui` 의존

위험: edge 의 ConfirmDialog 가 `@ingradient/ui` 에서 export 되는지 확인 필요.

대응: edge `DatasetSelectScreen.tsx:2` 가 `import { ConfirmDialog, EmptyState } from '@ingradient/ui'` 사용 중 → 이미 export 됨. view 도 동일 import 가능.

### 10.4 모달 portal 책임

위험: edge 가 `ReactDOM.createPortal(...document.body)` 로 mount. view 안에서 portal 처리 시 storybook 의 root 와 충돌 가능.

대응:
- view 는 portal 처리 안 함 — 그냥 DialogShell 그대로 render
- container (또는 storybook decorator) 가 필요 시 createPortal
- DialogShell 자체가 `@ingradient/ui` 제공이라 z-index / overlay 는 component 가 책임

### 10.5 `nextAvailableName` 헬퍼 위치

위험: AddDatasetModal 의 `nextAvailableName(base, existingNames)` 가 placeholder 계산용 — view 에 둘지 container 에 둘지.

대응:
- container 가 placeholder string 계산 후 `namePlaceholder` prop 으로 전달
- view 는 string 만 받음
- `nextAvailableName` 자체는 ingradient-edge 의 util 에 잔류 (Phase 13 까지 변경 없음)

### 10.6 `RadioCardGroup` 의 disabled option 처리

위험: edge 가 `disabled: type !== 'object_detection'` 으로 hard-coded. 향후 task type 확장 시 view 수정 필요.

대응:
- 본 phase 는 hard-coded 그대로 이전 (요청받은 것만 구현)
- 향후 확장 시 `taskTypeOptions: { value, label, disabled }[]` 같은 prop 으로 진화

### 10.7 fixture 신규 작성

위험: 기존 `mockDatasets` / `mockDevices` 와 모양 다른 fixture (`EdgeProjectGroup[]`) 신규 필요.

대응:
- `stories/fixtures/edge/0.0.1/dataset-groups.ts` 신규 — 2 project group × 3 dataset 정도
- 기존 fixture 는 폐기하지 않음 (다른 미래 view 에서 reuse 가능)
- preset.ts 에서 noop reference 유지

---

## 11. Rollback

git revert. 산출물:
- `packages/edge-pages/src/dataset-select/` + `packages/edge-pages/src/dataset-modals/` 디렉토리 삭제
- `packages/edge-pages/src/index.ts` 의 dataset-select / dataset-modals export 제거
- `stories/pages/edge/0.0.1/DatasetSelect.stories.tsx` 원본 복구
- `stories/fixtures/edge/0.0.1/dataset-groups.ts` 삭제 (신규 fixture)
- `npm run build --workspace packages/edge-pages` 재실행

---

## 12. 종료 후 상태

- `@ingradient/edge-pages` 가 5 view export (Login / License / DatasetSelect / AddDatasetModal / ExportModal / CreateProjectForm)
- multi-file view 분해 패턴 검증 (12 파일 dataset-select)
- 모달 view 분리 패턴 검증 (3 모달 동시 추출)
- slot prop 패턴 확장 (5 slot — langSelector / accountMenu / settingsDialog / exportModal / addDatasetModal)
- Phase 4 (App chrome — TitleBar / TopBar / BottomBar / AccountMenu) 진입 준비 완료

---

## 13. 다음 액션

1. 본 spec ok
2. 실행 (§7 의 9 step)
3. 검증 (§8 의 10 step)
4. Phase 4 spec 작성 (`edge-pages-phase-4-spec.md`)
