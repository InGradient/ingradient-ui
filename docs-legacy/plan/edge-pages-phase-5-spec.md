---
title: Phase 5 — WorkspaceView shell 분리
purpose: ingradient-edge 의 Workspace (933 줄) 의 shell + 탭 라우팅 + labeling 분기만 pure view 로 추출. sub-view (capture/images/statics/setup/labeling) 는 slot
audience: ingradient-ui contributor
date: 2026-05-19
status: draft
related:
  - ./edge-pages-extraction-roadmap.md
  - ./edge-pages-package-plan.md
  - ./edge-pages-phase-4-spec.md
---

# Phase 5 — WorkspaceView shell 분리

> Roadmap: [edge-pages-extraction-roadmap.md](./edge-pages-extraction-roadmap.md) § Phase 5
> 933 줄 Workspace 의 가장 까다로운 분리. **shell + 탭 swap + labeling 분기 + dialog/pill** 만 view 로. capture / images / statics / setup / labeling 본문은 Phase 6~8 의 sub-view 가 slot 으로 들어옴.

---

## 1. 목적

`ingradient-edge/src/frontend/pages/Workspace.tsx` (933 줄, 30+ hook, 17 useEffect, 12 useCallback) 의 **view-only** 부분만 `packages/edge-pages/src/workspace/WorkspaceView.tsx` 로 추출.

본 phase 이후 container 의 모양:

```tsx
// ingradient-edge/src/frontend/pages/Workspace.tsx (Phase 13 후 예상)
export const Workspace: FC<WorkspaceProps> = ({ platformBaseUrl }) => {
  // 모든 hook / IPC / store / side effect 그대로 유지 (933 줄 → ~600 줄 목표, hook 만)
  const captureFlow = useCaptureFlow(...)
  const deflectometry = useDeflectometry(...)
  // ... useEffect × 17 그대로 ...

  // 마지막 return 만 변경
  return (
    <WorkspaceView
      mode={pendingCapture && selectedDatasetId ? 'labeling' : 'main'}
      activeTab={activeTab}
      tabItems={tabItems}
      onTabChange={setActiveTab}
      isCapturing={isCapturing}
      capturingStatusText={capturingStatusText}
      sequenceFailure={deflectometry.sequenceFailure}
      onSequenceFailureCancel={deflectometry.handleSequenceFailureCancel}
      onSequenceFailureRetry={handleSequenceFailureRetry}
      labels={labels}
      // ── content slots — Phase 6~8 의 sub-view 가 들어옴 ──
      captureContent={<CaptureView ... />}
      imagesContent={<ImagesView ... />}
      staticsContent={<StaticsView ... />}
      setupPanelTarget={deflectometry.setupPanelTarget}
      setupPanelContent={<SetupPanelContent ... />}
      labelingContent={
        selectedTaskType === 'object_detection'
          ? <BBoxCanvas ... />
          : <CaptureReviewWithFullscreen ... />
      }
      isSetupMode={activeTab === 'setup'}
    />
  )
}
```

view 의 책임:
- 2 모드 분기 (labeling vs main)
- main 모드의 4 탭 swap
- setup 모드 시 `ReactDOM.createPortal(setupPanelContent, setupPanelTarget)`
- saving overlay (labeling 모드)
- sequenceFailure dialog (양 모드 공통)
- capturing pill (양 모드 공통)

view 가 책임지지 않는 것:
- camera pause/resume, sam-roi event, deflectometry sync 등 17 useEffect
- BBox 저장, label retry, capture handler 같은 12 useCallback
- pendingCapture 분기 결정 (container 가 `mode` prop 으로 통보)

---

## 2. 두 모드의 JSX 출처 (Workspace.tsx)

### 2.1 Labeling 모드 — `if (pendingCapture && selectedDatasetId)` (line 733-814)

```tsx
<Container $row>
  {isSavingLabel && <SavingOverlay><SavingSpinner />{t('workspace.saving')}</SavingOverlay>}
  <Container style={{ flex: 1, minWidth: 0 }}>
    {selectedTaskType === 'object_detection' ? <BBoxCanvas {...30+ props} /> : <CaptureReviewWithFullscreen ... />}
  </Container>
  {deflectometry.sequenceFailure && <DialogShell ...sequence failure dialog... />}
  {isCapturing && <CapturingStatusPill>{capturingStatusText}</CapturingStatusPill>}
</Container>
```

view 는 inner `<Container>` 의 content 를 `labelingContent` slot 으로 받음. saving overlay / sequenceFailure / capturing pill 은 view 가 직접 render.

### 2.2 Main 모드 — `return` final (line 846-902)

```tsx
<Container>
  {selectedDatasetId && (
    <>
      <Tabs items={tabItems} value={activeTab} onChange={...} />
      {isSetupMode && deflectometry.setupPanelTarget && ReactDOM.createPortal(setupPanelContent, deflectometry.setupPanelTarget)}
    </>
  )}
  {activeTab === 'images' && selectedDatasetId ? <ImagesView .../>
    : activeTab === 'statics' ? <StaticsView .../>
    : <CaptureView .../>}
  {deflectometry.sequenceFailure && <DialogShell ... />}
  {isCapturing && <CapturingStatusPill>{capturingStatusText}</CapturingStatusPill>}
</Container>
```

view 는:
- `selectedDatasetId` 있을 때 `<Tabs>` 노출
- `isSetupMode` 일 때 portal target 으로 `setupPanelContent` mount
- 탭별로 `captureContent` / `imagesContent` / `staticsContent` slot 선택
- 단, `imagesContent` 는 `activeTab === 'images' && selectedDatasetId` 조건 — `selectedDatasetId` 없으면 captureContent fallback (edge 의 로직과 동일)

---

## 3. 모듈 구조

```
packages/edge-pages/src/workspace/
├─ WorkspaceView.tsx              — page shell (≤ 180 줄 목표)
├─ WorkspaceShell.tsx             — Tabs + content slot router (main 모드)  ≤ 80 줄
├─ WorkspaceLabelingShell.tsx     — saving overlay + labelingContent  ≤ 60 줄
├─ SequenceFailureDialog.tsx      — DialogShell wrapper  ≤ 60 줄
├─ CapturingPill.tsx              — fixed pill (양 모드 공통)  ≤ 30 줄
├─ WorkspaceView.styles.ts        — Container / ConfirmButton / FailureCode / SavingOverlay / SavingSpinner / CapturingStatusPill 등 (Workspace.styles.ts 의 사용 부분만 이전)
├─ types.ts                       — WorkspaceViewProps + sub-types
└─ index.ts                       — barrel
```

총 8 파일. CaptureReviewWithFullscreen 은 Phase 6 의 sub-view 로 위임 (labelingContent slot 으로 들어옴).

**styles 이전 범위**: 현 `Workspace.styles.ts` 260 줄 중 실제 Workspace.tsx 가 사용하는 export 만:

```
Container, ConfirmButton, FailureCode, CaptureReview, CaptureReviewFullscreenBtn,
CapturePreviewImg, CaptureReviewActions, CaptureReviewSkipBtn, CaptureReviewSaveBtn,
SavingOverlay, SavingSpinner, CapturingStatusPill
```

12 export. 단 `CaptureReview*` 는 `CaptureReviewWithFullscreen` 의존이라 Phase 6 로 위임 (style 도 같이 이동). 본 phase 의 `WorkspaceView.styles.ts` 는 `Container / ConfirmButton / FailureCode / SavingOverlay / SavingSpinner / CapturingStatusPill` 6 export 만.

`@deprecated` 마킹된 styles 는 무시.

---

## 4. Props Interface

```ts
// packages/edge-pages/src/workspace/types.ts

export type WorkspaceMode = 'main' | 'labeling'
export type WorkspaceTab = 'capture' | 'images' | 'statics' | 'setup'

export interface WorkspaceTabItem {
  value: WorkspaceTab
  label: string                                   // already translated
}

export interface SequenceFailureInfo {
  message: string                                 // already translated
  errorCode: string
}

export interface WorkspaceLabels {
  saving: string                                  // 'workspace.saving'
  sequenceFailed: string                          // 'workspace.sequenceFailed'
  errorCode: string                               // 'workspace.errorCode' — prefix
  cancel: string                                  // 'workspace.cancel'
  retry: string                                   // 'workspace.retry'
}

export interface WorkspaceViewProps {
  // mode
  mode: WorkspaceMode

  // shared (양 모드 공통)
  isCapturing: boolean
  capturingStatusText: string                     // already translated
  sequenceFailure: SequenceFailureInfo | null
  labels: WorkspaceLabels
  onSequenceFailureCancel: () => void
  onSequenceFailureRetry: () => void

  // main 모드
  selectedDatasetId: string | null                // tab visibility 결정자
  activeTab: WorkspaceTab
  tabItems: WorkspaceTabItem[]
  onTabChange: (value: WorkspaceTab) => void
  isSetupMode: boolean
  setupPanelTarget: HTMLElement | null            // ReactDOM.createPortal target
  setupPanelContent?: React.ReactNode             // portal 안 mount 될 내용
  captureContent?: React.ReactNode                // Phase 6 의 CaptureView
  imagesContent?: React.ReactNode                 // Phase 7 의 ImagesView (selectedDatasetId 없으면 무시)
  staticsContent?: React.ReactNode                // Phase 8 의 StaticsView

  // labeling 모드
  isSavingLabel: boolean
  labelingContent?: React.ReactNode               // BBoxCanvas 또는 CaptureReviewWithFullscreen
}
```

설계 노트:

- View 의 local state 0. 모든 분기는 props.
- `mode` 가 view 모드 결정. `pendingCapture` 자체는 view 에 안 보임 — container 가 미리 계산.
- `selectedDatasetId` 는 view 에 string 자체로 들어옴 (Tabs 의 disable 결정자). 단순 boolean 으로 줄여도 되지만 main 모드의 `activeTab === 'images' && selectedDatasetId` 조건에서 동일 변수 reuse 목적.
- `setupPanelTarget` 은 DOM element ref — container 의 `useDeflectometry` 가 결정. view 는 그대로 portal target 으로 전달.
- 4 slot (captureContent / imagesContent / staticsContent / setupPanelContent) + 1 slot (labelingContent) = 5 slot. 모두 ReactNode.
- sequenceFailure dialog 는 양 모드 공통이라 `SequenceFailureDialog` sub-view 가 분기 안에 들어감.
- `WorkspaceTab` literal type 으로 'capture' | 'images' | 'statics' | 'setup' 만 허용 — 미래 확장은 별도 phase.

---

## 5. View 골격 (참고)

```tsx
// WorkspaceView.tsx (≤ 180 줄)

export function WorkspaceView(props: WorkspaceViewProps): JSX.Element {
  if (props.mode === 'labeling') {
    return <WorkspaceLabelingShell {...props} />
  }
  return <WorkspaceShell {...props} />
}

// WorkspaceLabelingShell.tsx
function WorkspaceLabelingShell(props: WorkspaceViewProps): JSX.Element {
  const { isSavingLabel, labelingContent, sequenceFailure, isCapturing, capturingStatusText, labels, onSequenceFailureCancel, onSequenceFailureRetry } = props
  return (
    <Container $row>
      {isSavingLabel && <SavingOverlay><SavingSpinner />{labels.saving}</SavingOverlay>}
      <Container style={{ flex: 1, minWidth: 0 }}>
        {labelingContent}
      </Container>
      {sequenceFailure && (
        <SequenceFailureDialog
          info={sequenceFailure}
          labels={labels}
          onCancel={onSequenceFailureCancel}
          onRetry={onSequenceFailureRetry}
        />
      )}
      {isCapturing && <CapturingPill>{capturingStatusText}</CapturingPill>}
    </Container>
  )
}

// WorkspaceShell.tsx
function WorkspaceShell(props: WorkspaceViewProps): JSX.Element {
  const {
    selectedDatasetId, activeTab, tabItems, onTabChange,
    isSetupMode, setupPanelTarget, setupPanelContent,
    captureContent, imagesContent, staticsContent,
    sequenceFailure, isCapturing, capturingStatusText, labels,
    onSequenceFailureCancel, onSequenceFailureRetry,
  } = props
  return (
    <Container>
      {selectedDatasetId && (
        <>
          <Tabs
            items={tabItems}
            value={activeTab}
            onChange={(v) => onTabChange(v as WorkspaceTab)}
            style={{ margin: '0 0 4px' }}
          />
          {isSetupMode && setupPanelTarget && setupPanelContent
            && ReactDOM.createPortal(setupPanelContent, setupPanelTarget)}
        </>
      )}
      {activeTab === 'images' && selectedDatasetId
        ? imagesContent
        : activeTab === 'statics'
          ? staticsContent
          : captureContent}
      {sequenceFailure && (
        <SequenceFailureDialog
          info={sequenceFailure}
          labels={labels}
          onCancel={onSequenceFailureCancel}
          onRetry={onSequenceFailureRetry}
        />
      )}
      {isCapturing && <CapturingPill>{capturingStatusText}</CapturingPill>}
    </Container>
  )
}

// SequenceFailureDialog.tsx — DialogShell wrapper
function SequenceFailureDialog({ info, labels, onCancel, onRetry }) {
  return (
    <DialogShell
      title={
        <><AlertTriangle size={18} color="var(--ig-color-danger)" style={{ marginRight: 6 }} />
        {labels.sequenceFailed}</>
      }
      description={<>{info.message}<FailureCode>{labels.errorCode} {info.errorCode}</FailureCode></>}
      onClose={onCancel}
      width="min(480px, 100%)"
      actions={
        <>
          <ConfirmButton type="button" onClick={onCancel}>{labels.cancel}</ConfirmButton>
          <ConfirmButton type="button" $danger onClick={onRetry}>{labels.retry}</ConfirmButton>
        </>
      }
    />
  )
}
```

각 sub-view ≤ 80 줄.

---

## 6. 변경 파일

### 6.1 신규 (8 file)

§3 의 workspace/ 8 파일.

### 6.2 수정 (1 file)

#### `packages/edge-pages/src/index.ts`

```diff
  export * from './chrome'
+ export * from './workspace'
```

### 6.3 신규 fixture / story

본 phase 는 storybook story 어렵다 — slot 패턴이라 sub-view 가 있어야 의미 있는 render. **방안**:

**A**: 본 phase 에선 story 안 작성. Phase 6~8 의 sub-view 가 추출되면 그 시점에 Workspace story 작성.

**B**: 본 phase 에서 dummy slot (`<div>capture content placeholder</div>`) 으로 shell-only story 작성.

**결정**: **B** 채택. shell 만 검증할 수 있어야 phase 검증이 닫힘. story 4 scenario:

```
stories/pages/edge/0.0.1/Workspace.stories.tsx
- MainCapture            — mode='main', activeTab='capture', selectedDatasetId 있음, captureContent=<DummyCapture/>
- MainImages             — activeTab='images'
- MainSetup              — activeTab='setup', setupPanelTarget=null (portal 검증 어려움, container ref 필요)
- Labeling               — mode='labeling', labelingContent=<DummyBBoxCanvas/>
- LabelingWithFailure    — labeling + sequenceFailure 채움
- MainCapturing          — isCapturing=true, capturingStatusText='Capturing 3/14'
```

setup portal 은 storybook 에서 검증 어려움 — `setupPanelTarget` null 인 scenario 만 (실제 portal 동작은 Phase 13 의 edge runtime 에서 검증).

target ≤ 200 줄.

`stories/fixtures/edge/0.0.1/workspace-tabs.ts` 신규 — tabItems mock.

### 6.4 건드리지 않음

- `ingradient-edge/src/frontend/pages/Workspace.tsx` — Phase 13 (container 만)
- `ingradient-edge/src/frontend/components/capture/Workspace.styles.ts` — Phase 13 (단 본 phase 가 사용한 6 export 는 Phase 13 에서 삭제 대상)
- 모든 hook (`useCaptureFlow`, `useDeflectometry`, `useCaptureStore`, …) — Phase 13
- BBoxCanvas / CaptureView / ImagesView / SetupPanel — Phase 6~7

---

## 7. i18n 키 매핑

| labels.* | i18next key |
|---|---|
| saving | `workspace.saving` |
| sequenceFailed | `workspace.sequenceFailed` |
| errorCode | `workspace.errorCode` |
| cancel | `workspace.cancel` |
| retry | `workspace.retry` |

`tabItems[i].label` 은 container 가 미리 `t('workspace.captureTab')` 등으로 변환해서 평문 전달. view 는 array 만.

`capturingStatusText` 는 container 가 미리 조합 (`t('workspace.capturing') + ' 3/14'` 또는 `progressText`).

---

## 8. 실행 순서

1. `workspace/WorkspaceView.styles.ts` — Workspace.styles.ts 의 6 export 이전
2. `workspace/types.ts` — props + sub-types
3. sub-view (의존성 없는 것부터):
   - `workspace/CapturingPill.tsx`
   - `workspace/SequenceFailureDialog.tsx`
4. shell view:
   - `workspace/WorkspaceLabelingShell.tsx`
   - `workspace/WorkspaceShell.tsx`
   - `workspace/WorkspaceView.tsx`
5. `workspace/index.ts` — barrel
6. `packages/edge-pages/src/index.ts` 수정
7. fixture: `stories/fixtures/edge/0.0.1/workspace-tabs.ts`
8. story: `stories/pages/edge/0.0.1/Workspace.stories.tsx`
9. typecheck + build + storybook build

---

## 9. 검증

| # | 명령 | 기대 결과 |
|---|---|---|
| 1 | `ls packages/edge-pages/src/workspace/` | 8 파일 |
| 2 | `cd packages/edge-pages && npx tsc --noEmit` | 0 error |
| 3 | `cd packages/edge-pages && npm run build` | `WorkspaceView` export |
| 4 | 각 파일 `wc -l` | 모두 < 200 |
| 5 | `npx tsc --noEmit -p tsconfig.json` (root) | 0 error |
| 6 | `npm run build:storybook` | exit 0 |
| 7 | Storybook 수동 — 6 scenario | 모두 dummy slot 으로 렌더 |
| 8 | grep — 금지 import 0 | `grep -rE 'useTranslation\|window\.electron\|zustand\|useEffect\|useCallback' packages/edge-pages/src/workspace/` → `useEffect`/`useCallback` 0 match (view 는 pure render). `useTranslation`/`electron`/`zustand` 0 match |
| 9 | ingradient-edge 측 `npx tsc --noEmit` | 0 error (edge 는 새 package 아직 안 씀 — trivially 통과) |

---

## 10. 성공 기준

- 검증 1~9 통과
- 6 storybook scenario 가 dummy slot 으로 렌더
- WorkspaceView 가 5 slot (capture/images/statics/setup/labeling) 을 받는 pure shell
- diff 가 ~11 file 범위 (신규 ~9 + 수정 2)
- 모든 sub-view ≤ 80 줄, WorkspaceView ≤ 180 줄

---

## 11. 리스크

### 11.1 `setupPanelTarget` portal 의 storybook 검증 불가

위험: edge runtime 에서 `setupPanelTarget` 은 SetupPanel container 의 ref. storybook 엔 그 ref 가 없음.

대응:
- 본 phase storybook scenario 는 `setupPanelTarget: null` 만 검증
- portal mount 실제 동작은 Phase 13 의 edge runtime 검증으로 위임
- view 코드는 `setupPanelTarget && setupPanelContent && ReactDOM.createPortal(...)` 가드로 안전

### 11.2 17 useEffect 가 view 가 아닌 container 에 남는 게 정말 OK 인가

위험: pendingCapture 변경, captureGroup sync, samRoi event listener 등은 view 가 받는 props 와 분리되어 있어 동기화 누락 가능성.

대응:
- view 는 props 만 받음 — props 가 항상 최신 상태라고 가정
- container 가 모든 effect 실행 후 새 props 전달 (React 의 정상 flow)
- 본 phase 에선 container 변경 없음 — Phase 13 에서 hook 호출 후 props 전달 패턴 정착

### 11.3 5 slot 의 mount/unmount 정책

위험: 탭 전환 시 slot 마운트 변경. 예) `imagesContent` 가 unmount 되면 ImagesView 의 내부 state (스크롤 위치, 선택된 image 등) 소실.

대응:
- 본 phase 의 shell 은 conditional render — 탭이 바뀌면 다른 slot 만 mount
- 내부 state 보존 필요하면 caller 가 `display: none` 패턴 사용 (Phase 6~8 에서 결정)
- 본 phase 는 edge 의 현재 동작 (조건부 mount) 그대로 이전

### 11.4 `selectedDatasetId` 없을 때 captureContent fallback

위험: edge 의 로직은 `activeTab === 'images' && selectedDatasetId` 조건 — datasetId 없으면 images 탭에서도 captureContent. 직관적이지 않음.

대응:
- edge 의 기존 동작 그대로 이전 (요청받은 것만 구현)
- 향후 UX 개선 시 별도 phase
- 본 phase 의 view 코드 주석에 명시

### 11.5 `WorkspaceTab` type 이 edge 의 store 와 일치하는가

위험: `useWorkspaceUIStore` 의 `workspaceTab` type 이 'capture' | 'images' | 'statics' | 'setup' 인지 확인.

대응:
- edge 의 `useWorkspaceUIStore.ts` 의 type 확인 후 일치. 다르면 본 spec types.ts 갱신
- 본 phase 검증 #2 에서 typecheck 로 즉시 잡힘

### 11.6 `tabItems` 가 store 와 결합되어 있음

위험: edge 는 i18n 결과로 `tabItems` array 생성 (`t('workspace.captureTab')` × 4). view 가 평문 array 받는 게 OK 인지.

대응:
- container 가 `useMemo` 로 array 생성 + 평문 label
- view 는 array iterate render만
- locale 변경 시 array re-create (이미 t 의존성으로 자동 처리됨 — Phase 13 spec 에 명시)

### 11.7 `WorkspaceView` 의 mode 분기로 child unmount

위험: `mode` 가 'main' ↔ 'labeling' 변경 시 한쪽 shell unmount → 자식 (captureContent 등) state 소실.

대응:
- 이건 edge 의 기존 동작과 동일 (pendingCapture 변경 시 render tree 자체가 분기)
- caller 가 child state 보존 필요하면 caller 측에서 state lifting
- view 는 단순 분기

### 11.8 styles 의 deprecated section 처리

위험: Workspace.styles.ts 260 줄 중 1/3 이상이 `@deprecated`. 본 phase 에서 다 이전하면 dead code 증가.

대응:
- 본 phase 는 실제 사용 6 export 만 이전 — deprecated 무시
- Workspace.styles.ts 의 deprecated 정리는 별도 정리 작업
- 사용 export 의 정확한 의존성 (예: `ConfirmButton` 이 다른 export 참조) 은 typecheck 로 검증

---

## 12. Rollback

git revert. 산출물:
- `packages/edge-pages/src/workspace/` 삭제
- `packages/edge-pages/src/index.ts` 의 workspace export 제거
- `stories/pages/edge/0.0.1/Workspace.stories.tsx` 삭제
- `stories/fixtures/edge/0.0.1/workspace-tabs.ts` 삭제
- `npm run build --workspace packages/edge-pages` 재실행

---

## 13. 종료 후 상태

- `@ingradient/edge-pages` 가 `WorkspaceView` export
- 5 slot 패턴 검증 — Phase 6~8 의 sub-view 가 plug-in 형태로 들어올 준비 완료
- container/view 분리의 가장 까다로운 케이스 (Workspace) 가 spec 수준에서 결정
- ingradient-edge 의 Workspace.tsx 는 미변경 (Phase 13 에서 컨테이너 축소)
- Phase 6 (CaptureView + SetupPanel + Deflectometry) 진입 준비 완료

---

## 14. 다음 액션

1. 본 spec ok
2. 실행 (§8 의 9 step)
3. 검증 (§9 의 9 step)
4. Phase 6 spec 작성 (`edge-pages-phase-6-spec.md`) — capture/setup/deflectometry sub-view
