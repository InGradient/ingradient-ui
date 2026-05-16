# Phase B — Settings Modal Edge Tab 이전

> 상위 — [platform-edge-migration-roadmap.md](./platform-edge-migration-roadmap.md). 분량 ~805줄, 8 파일. Container/pure split + 기존 `settings-modal` 패키지에 통합. **Phase A 완료 후 진행.**

## 대상 파일

| Source | Lines | Type |
|---|---|---|
| [EdgeManagementPanel.tsx](../../../ingradient-platform/frontend/components/edge/EdgeManagementPanel.tsx) | 42 | Container (3-tab shell) |
| [ImportTab.tsx](../../../ingradient-platform/frontend/components/edge/ImportTab.tsx) | 101 | Container (`useImportTab` hook) |
| [ExportTab.tsx](../../../ingradient-platform/frontend/components/edge/ExportTab.tsx) | 122 | Container (`useExportTab` hook) |
| [ExportHistory.tsx](../../../ingradient-platform/frontend/components/edge/ExportHistory.tsx) | 109 | Pure (local edit state only) |
| [WorkOptionsTab.tsx](../../../ingradient-platform/frontend/components/edge/WorkOptionsTab.tsx) | 95 | Container (`useWorkOptionsSave` + local state) |
| [DeflectometryOptions.tsx](../../../ingradient-platform/frontend/components/edge/DeflectometryOptions.tsx) | 144 | Pure (state via props) |
| [DeflectometryPreview.tsx](../../../ingradient-platform/frontend/components/edge/DeflectometryPreview.tsx) | 49 | Pure (canvas, util-only deps) |
| [edge.styles.tsx](../../../ingradient-platform/frontend/components/edge/edge.styles.tsx) | 143 | Styled |

## 의존성 (platform 의 hook / util / type)

이전 후에도 platform 에 남는 것:
- `useEdgeManagementState(projectId)` — `useProjects` store 접근
- `useImportTab()` — API polling + react-query invalidation
- `useExportTab(projectId, options)` — datasets/members/packages query + 4 mutations
- `useWorkOptionsSave(projectId, onSaved)` — mutation + toast
- `getStatusTone(status)` — status → tone mapping 유틸 (platform 의 `features/edge/utils.ts`)
- `computeTotalPatterns(defl)` — Deflectometry 총 패턴 수 계산 (platform 의 `features/edge/use-work-options-save.ts`)
- `drawPattern(canvas, label, config)` + `formatBadgeLabel(label)` — Canvas 패턴 렌더 (platform 의 `features/edge/deflectometry-pattern.ts`)
- `buildPatternLabels(config)` — 활성 라벨 목록 (platform 의 `shared/utils/deflectometryPatternLabels.ts`)
- 타입: `EdgePackage`, `EdgePackageOptions`, `DeflectometryConfig`, `Project`, `DEFAULT_DEFLECTOMETRY_CONFIG`

이전 후 추가 fan-out: platform 의 hook 들이 그대로 사용되며, UI 컴포넌트는 hook 의 return 을 `props` 로 받음.

## Sub-phase 분할 (각 200줄 미만 유지)

### B1 — Pure UI 부품 [S] (~336줄)

**대상**:
- `edge.styles.tsx` (143줄) → `packages/platform-pages/src/settings-modal/edge-tab/edge.styles.ts`
- `DeflectometryPreview.tsx` (49줄) → 동일 디렉토리. **단**, `drawPattern` / `formatBadgeLabel` / `buildPatternLabels` 가 platform util 이므로 callback 으로 받도록 prop refactor 필요. 또는 platform 만 우선 사용하고 storybook 은 mock canvas placeholder.
  - **추천**: prop 으로 `renderPatternCanvas(canvas, label, config)` + `formatBadgeLabel(label)` + `patternLabels: PatternLabel[]` 받음
- `DeflectometryOptions.tsx` (144줄) → 동일 디렉토리. `computeTotalPatterns(defl)` 는 prop `totalPatterns: number` 으로 받음

**B1 결과 파일** (~336줄 총합, 각 200줄 미만):
- `packages/platform-pages/src/settings-modal/edge-tab/edge.styles.ts` (~143줄)
- `packages/platform-pages/src/settings-modal/edge-tab/DeflectometryPreview.tsx` (~60줄)
- `packages/platform-pages/src/settings-modal/edge-tab/DeflectometryPreview.styles.ts` (이미 platform 에 분리되어 있음, 그대로 복사)
- `packages/platform-pages/src/settings-modal/edge-tab/DeflectometryOptions.tsx` (~150줄)

**B1 검증**: typecheck + build:package. (storybook scenario 추가는 B4 에서)

### B2 — ImportTab + ExportHistory [M] (~210줄)

**B2a — `ImportTabUI`**:
- 입력: `useImportTab()` 의 모든 return 필드 + `getStatusTone` callback
- props: `{ job, busy, pct, label, cancelling, onFiles, onCancel, getStatusTone? }`
- `getStatusTone` 은 default 제공 (status string → tone string) — platform util 의 단순 매핑이라 default 로 인라인 가능

**B2b — `ExportHistory`**:
- 거의 dumb. 입력 type 만 generic 으로 (`EdgePackageView`):
  ```ts
  interface EdgePackageView {
    id: string
    device_name: string | null
    status: string
    progress: number
    created_at: string
  }
  ```
- props: 그대로 (`packages`, callbacks, pending flags)

**B2 결과**:
- `packages/platform-pages/src/settings-modal/edge-tab/ImportTabUI.tsx` (~110줄)
- `packages/platform-pages/src/settings-modal/edge-tab/ExportHistory.tsx` (~110줄)
- `packages/platform-pages/src/settings-modal/edge-tab/edge-types.ts` (type 정의 — ~40줄)

**B2 검증**: typecheck + build:package.

### B3 — ExportTab + WorkOptionsTab [M] (~220줄)

**B3a — `ExportTabUI`**:
- 입력: `useExportTab()` 의 모든 필드 (datasets, members, packages, selected*, deviceName, mutations) + ExportHistory 의 callbacks
- props 가 많으므로 group:
  ```ts
  interface ExportTabUIProps {
    datasets: { id: string; name: string }[]
    members: { id: string; user_id: string; name?: string; email: string }[]
    packages: EdgePackageView[]
    selectedDatasets: Set<string>
    selectedUsers: Set<string>
    deviceName: string
    uniqueMissingHash: string[]
    pending: {
      create: boolean
      download: boolean
      reissue: boolean
      rename: boolean
    }
    error: { create?: string | null }
    onDeviceNameChange: (v: string) => void
    onToggleDataset: (id: string) => void
    onToggleUser: (userId: string) => void
    onSelectAllDatasets: (checked: boolean) => void
    onCreate: () => void
    onDownload: (packageId: string) => void
    onReissue: (packageId: string) => void
    onRenameDevice: (packageId: string, newName: string) => void
  }
  ```
- 내부 — ExportHistory 그대로 사용

**B3b — `WorkOptionsTabUI`**:
- platform 의 WorkOptionsTab 의 로컬 state (defl) + useEffect 도 platform 으로 lift. `WorkOptionsTabUI` 는 다음만 받음:
  ```ts
  interface WorkOptionsTabUIProps {
    options: EdgePackageOptions
    onOptionsChange: (next: EdgePackageOptions) => void
    deflectometryEnabled: boolean
    defl: DeflectometryConfig
    onDeflChange: (next: DeflectometryConfig) => void
    totalPatterns: number
    patternLabels: PatternLabel[]
    formatBadgeLabel: (label: PatternLabel) => string
    renderPatternCanvas: (canvas: HTMLCanvasElement, label: PatternLabel, config: DeflectometryConfig) => void
    savePending: boolean
    saveError?: string | null
    onSave: () => void
  }
  ```
- DeflectometryOptions / Preview 컴포넌트를 내부에서 사용

**B3 결과**:
- `packages/platform-pages/src/settings-modal/edge-tab/ExportTabUI.tsx` (~180줄)
- `packages/platform-pages/src/settings-modal/edge-tab/WorkOptionsTabUI.tsx` (~120줄)

**B3 검증**: typecheck + build:package.

### B4 — EdgeManagementPanel + 통합 [S] (~50줄)

**대상**:
- `EdgeManagementPanel.tsx` (42줄) — 3-tab Tabs shell. tab state 만 들음. 각 tab UI 를 prop 으로 받거나 직접 rendering 하는 컴포넌트 swap.

추천 API:
```ts
interface EdgeTabViewProps {
  tab: 'work' | 'export' | 'import'
  onTabChange: (next: 'work' | 'export' | 'import') => void
  workOptions: WorkOptionsTabUIProps  // group
  export: ExportTabUIProps  // group
  importTab: ImportTabUIProps  // group
}
```

또는 더 간단 — `EdgeTabView` 가 children slot 으로 받음:
```ts
interface EdgeTabViewProps {
  tab: 'work' | 'export' | 'import'
  onTabChange: ...
  work: ReactNode      // WorkOptionsTabUI 인스턴스
  export: ReactNode    // ExportTabUI 인스턴스
  import: ReactNode    // ImportTabUI 인스턴스
}
```

**B4 결과**:
- `packages/platform-pages/src/settings-modal/edge-tab/EdgeTabView.tsx` (~50줄)
- `packages/platform-pages/src/settings-modal/edge-tab/index.ts` — barrel
- `packages/platform-pages/src/settings-modal/index.ts` — Edge tab export

### B4-2 — Storybook scenarios (선택, 가능 시)

Settings modal story 에 Edge tab scenarios 추가. 각 sub-tab 별 mock state:
- `edge-work-options-default`
- `edge-export-with-packages`
- `edge-import-uploading`
- `edge-import-completed`

mock 데이터 — `EdgePackageView[]`, `EdgeImportJobView`, `EdgeAnalyticsView`.

### B4-3 — Probe scenarios

[tests/probes/settings-modal.mjs](../../tests/probes/settings-modal.mjs) — 새 scenario 추가.

## 실행 step 순서

B1:
1. [ ] B1-1 `edge.styles.ts` 작성
2. [ ] B1-2 `DeflectometryPreview.styles.ts` 작성
3. [ ] B1-3 `DeflectometryPreview.tsx` 작성 (prop 으로 render callback / labels / formatter 받음)
4. [ ] B1-4 `DeflectometryOptions.tsx` 작성 (prop 으로 totalPatterns 받음)
5. [ ] B1-5 typecheck

B2:
6. [ ] B2-1 `edge-types.ts` 작성
7. [ ] B2-2 `ExportHistory.tsx` 작성
8. [ ] B2-3 `ImportTabUI.tsx` 작성
9. [ ] B2-4 typecheck

B3:
10. [ ] B3-1 `ExportTabUI.tsx` 작성
11. [ ] B3-2 `WorkOptionsTabUI.tsx` 작성
12. [ ] B3-3 typecheck

B4:
13. [ ] B4-1 `EdgeTabView.tsx` 작성
14. [ ] B4-2 `edge-tab/index.ts` barrel + `settings-modal/index.ts` 갱신
15. [ ] B4-3 (선택) Settings modal storybook story 에 edge tab scenarios 추가
16. [ ] B4-4 (선택) Probe scenarios 추가
17. [ ] 전체 typecheck + build:package + build:storybook
18. [ ] Settings modal probe 실행
19. [ ] 이 문서 끝에 완료 기록 추가

## Verification

```bash
# 모두 EXIT=0 또는 통과
npx tsc --noEmit
npm run build:package
npm run build:storybook
node tests/probes/settings-modal.mjs   # 기존 8 + 새 scenarios
```

## 완료 기록

**완료일**: 2026-05-16

### 신규 파일 (packages/platform-pages/src/settings-modal/edge-tab/)

| File | Lines | Role |
|---|---|---|
| `edge.styles.ts` | 134 | Section / CheckList / Hint / NumberInput / StatusPill / ReportBox 등 styled |
| `DeflectometryPreview.styles.ts` | 52 | BadgeRow / Badge / CanvasFrame / PreviewHint |
| `edge-types.ts` | 86 | `DeflectometryConfig`, `DEFAULT_DEFLECTOMETRY_CONFIG`, `EdgePackageOptions`, `EdgePackageView`, `EdgeImportJobView`, `EdgeDatasetOption`, `EdgeMemberOption`, `EdgeProjectView`, `DeflectometryPatternLabel` |
| `edge-status-tone.ts` | 14 | `getEdgeStatusTone(status) → StatusTone` |
| `DeflectometryPreview.tsx` | 72 | Pure UI — canvas + badge tabs (renderPattern callback prop) |
| `DeflectometryOptions.tsx` | 173 | Pure UI — phase shift / direction / fringe period / exposure 폼 + Preview |
| `DeflectometryQualityFields.tsx` | 67 | Quality 필드 (retry / contrast / saturation) — 200줄 제한 위해 분리 |
| `ExportHistory.tsx` | 120 | Pure UI — 패키지 이력 표 + device name 인라인 편집 |
| `ImportTabUI.tsx` | 134 | Pure UI — UploadDropzone + ProgressBar + Report. `useImportTab()` shape props |
| `ExportTabUI.tsx` | 165 | Pure UI — datasets / members / deviceName + ExportHistory. `useExportTab()` shape props |
| `WorkOptionsTabUI.tsx` | 118 | Pure UI — work options + DeflectometryOptions slot |
| `EdgeTabView.tsx` | 54 | 3-tab shell. Sub-tab UI 는 slot 으로 받음 |
| `index.ts` | 10 | Barrel |

총 **13 파일, 1199줄** (각 파일 < 200줄).

### 수정 파일

- `packages/platform-pages/src/settings-modal/index.ts` — `export * from './edge-tab'` 추가

### 검증

- `npx tsc --noEmit` EXIT=0
- `npm run build:package` 성공 (lib/index.js 82.26 → 111.72 KB)
- `npm run build:storybook` 성공
- `node tests/probes/settings-modal.mjs` 8/8 pass (1차 cascade flake 후 재실행)

### Platform 마이그레이션 경로

플랫폼이 `frontend/components/edge/` 의 UI 컴포넌트를 제거하고 `@ingradient/platform-pages` 의 pure UI 로 교체:

```tsx
// before: SettingsModal.tsx
import { EdgeManagementPanel } from '../edge/EdgeManagementPanel'
{tab === 'edge' && <EdgeManagementPanel projectId={currentProjectId} />}

// after: SettingsModal.tsx
import {
  EdgeTabView, ExportTabUI, ImportTabUI, WorkOptionsTabUI,
  type EdgePackageOptions, type DeflectometryConfig,
} from '@ingradient/platform-pages'
import { useEdgeManagementState } from '../../features/edge/use-edge-management-state'
import { useImportTab } from '../../features/edge/use-import-tab'
import { useExportTab } from '../../features/edge/use-export-tab'
import { useWorkOptionsSave, computeTotalPatterns } from '../../features/edge/use-work-options-save'
import { drawPattern, formatBadgeLabel } from '../../features/edge/deflectometry-pattern'
import { buildPatternLabels } from '../../shared/utils/deflectometryPatternLabels'

const { currentProject, tab, setTab, options, setOptions, handleWorkOptionsSaved } = useEdgeManagementState(currentProjectId)
const importState = useImportTab()
const exportState = useExportTab(currentProjectId, options)
const saveMutation = useWorkOptionsSave(currentProjectId, handleWorkOptionsSaved)
const [defl, setDefl] = useState(currentProject?.deflectometry_config ?? DEFAULT_DEFLECTOMETRY_CONFIG)

<EdgeTabView
  projectId={currentProjectId}
  tab={tab}
  onTabChange={setTab}
  workSlot={<WorkOptionsTabUI options={options} onOptionsChange={setOptions} deflectometryEnabled={!!currentProject?.deflectometry_enabled} defl={defl} onDeflChange={setDefl} totalPatterns={computeTotalPatterns(defl)} patternLabels={buildPatternLabels(defl)} formatBadgeLabel={formatBadgeLabel} renderPattern={drawPattern} savePending={saveMutation.isPending} saveError={saveMutation.isError ? String(saveMutation.error.message) : null} onSave={() => saveMutation.mutate({ opts: options, defl: currentProject?.deflectometry_enabled ? defl : null })} />}
  exportSlot={<ExportTabUI {...spreadExportState} />}
  importSlot={<ImportTabUI {...spreadImportState} />}
/>
```

플랫폼 hook (`useEdgeManagementState`, `useImportTab`, `useExportTab`, `useWorkOptionsSave`) + util (`drawPattern`, `formatBadgeLabel`, `buildPatternLabels`, `computeTotalPatterns`) 은 그대로 유지. UI 만 swap.

### 후속 작업 (선택, 본 phase 의 scope 밖)

- Storybook Settings modal story 에 Edge tab scenarios 추가 (`edge-work-default`, `edge-export-with-packages`, `edge-import-uploading`)
- Probe scenarios 추가
- 플랫폼 측에서 실제 import + 컴파일 검증 (별도 PR)
