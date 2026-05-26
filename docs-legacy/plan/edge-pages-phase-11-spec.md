---
title: Phase 11 — Labeling RightPanel + LogPanel + SystemMonitor 추출
purpose: ingradient-edge 의 남은 큰 component (labeling RightPanel 304줄, log LogPanel 191줄, system SystemMonitorModal 304줄) 을 @ingradient/edge-pages 로 pure view 추출
audience: ingradient-ui contributor
date: 2026-05-19
status: draft
related:
  - ./edge-pages-extraction-roadmap.md
  - ./edge-pages-package-plan.md
  - ./edge-pages-phase-10-spec.md
---

# Phase 11 — Labeling RightPanel + LogPanel + SystemMonitor 추출

> Roadmap: [edge-pages-extraction-roadmap.md](./edge-pages-extraction-roadmap.md) § Phase 11
> view 추출의 **마지막 phase**. 모든 큰 component 가 본 phase 까지 처리됨. Phase 12 부터는 정리/문서 작업.

---

## 1. 목적

`packages/edge-pages/src/{labeling,log,system}/` 에 3 영역의 마지막 view 추출.

| 영역 | 파일 | 줄 | 비고 |
|---|---|---|---|
| labeling/ | RightPanel.tsx + RightPanelCommentSection.tsx | 201 + 103 = 304 | 라벨링 모드 우측 sidebar (class palette + comment thread) |
| log/ | LogPanel.tsx + LogDetailTable.tsx | 154 + 37 = 191 | 화면 하단 log panel (Workspace 외부) |
| system/ | SystemMonitorModal/CleanupTab/MonitorTab | 45 + 180 + 79 = 304 | BottomBar 클릭 시 열리는 시스템 모니터 모달 |

labeling/ 는 Phase 7 의 BBoxCanvas 와 다른 component — BBoxCanvas 안 sidebar 가 아니라 Workspace 의 labeling 분기에서 우측에 별도 마운트되는 panel. (현 edge 구조 확인 필요 — 별도 mount 인지 BBoxCanvas 내부인지)

---

## 2. 의존 매핑

### 2.1 RightPanel (labeling/)

| 의존 | 처리 |
|---|---|
| `useWorkspaceUIStore` (selectedImage, setSelectedImage, pendingComment, setPendingComment) | container 잔류 |
| `useDatasetStore`, `useCaptureStore` | container |
| `useTranslation` | labels prop |
| `useClickOutside` | view 안 OK (visual) |
| `window.electron.addComment` / `getComments` | container |
| ROI button (window event dispatch) | callback prop |

### 2.2 RightPanelCommentSection (labeling/)

| 의존 | 처리 |
|---|---|
| `useTranslation` | labels |
| comment thread state (props from RightPanel) | props |

### 2.3 LogPanel (log/)

| 의존 | 처리 |
|---|---|
| `useCaptureLogStore` (logs, loadLogsFromDb) | container |
| `useDatasetStore` (selectedDatasetId) | container (props) |
| `useTranslation` | labels |
| `useEffect` for auto-scroll | view 안 OK (visual) |
| hover index state | view 안 OK |

### 2.4 LogDetailTable (log/)

| 의존 | 처리 |
|---|---|
| 없음 (pure presentational) | 그대로 |

### 2.5 SystemMonitorModal (system/)

| 의존 | 처리 |
|---|---|
| `useSystemStatsStore` (modal, closeModal) | container |
| `useTranslation` | labels |
| tab state | view 안 OK (visual) |

### 2.6 SystemMonitorCleanupTab (system/)

| 의존 | 처리 |
|---|---|
| `window.electron.getCleanupStats` / `runCleanup` | container |
| stats state | props |
| `useTranslation` | labels |

### 2.7 SystemMonitorMonitorTab (system/)

| 의존 | 처리 |
|---|---|
| `useSystemStatsStore` (latest, history) | container (props) |
| `useTranslation` | labels |

---

## 3. 모듈 구조

```
packages/edge-pages/src/labeling-panel/        ← labeling 폴더 이름 충돌 회피 (Phase 7 의 labeling/ 와 분리)
├─ RightPanelView.tsx                          — ≤ 200
├─ RightPanelCommentSection.tsx                — ≤ 110
├─ RightPanelView.styles.ts
├─ types.ts
└─ index.ts

packages/edge-pages/src/log/
├─ LogPanelView.tsx                            — ≤ 160
├─ LogDetailTableView.tsx                      — ≤ 40
├─ LogPanelView.styles.ts                      — 215 줄 (200 초과 — 분할 검토)
├─ LogDetailTableView.styles.ts
├─ types.ts
└─ index.ts

packages/edge-pages/src/system/
├─ SystemMonitorModalView.tsx                  — shell (≤ 60)
├─ SystemMonitorCleanupTabView.tsx             — ≤ 180
├─ SystemMonitorMonitorTabView.tsx             — ≤ 80
├─ SystemMonitorModalView.styles.ts
├─ SystemMonitorCleanupTabView.styles.ts
├─ SystemMonitorMonitorTabView.styles.ts
├─ types.ts
└─ index.ts
```

총 18 파일.

**LogPanel.styles.ts 215 → 분할 검토**: 200 초과 15줄. 다음 옵션:
- A: 그대로 (의미 응집도 우선)
- B: `panel.styles.ts` + `entry.styles.ts` 분할
- **결정**: B 채택. Phase 3 / 7 의 styles 분할 패턴 일관 적용.

---

## 4. Props Interface (요약)

### 4.1 RightPanelViewProps

```ts
export interface RightPanelLabels {
  classPaletteTitle: string                       // 'labeling.classPalette'
  commentsTitle: string                           // 'labeling.comments'
  roiTitle: string                                // 'labeling.roi'
  roiEnter: string
  roiExit: string
  // ~10 key
}

export interface RightPanelViewProps {
  // class palette
  classes: { class_id: string; class_name: string; color: string }[]
  selectedClassId: string | null
  editMode: 'cursor' | 'bbox'

  // ROI mode
  samRoiActive: boolean
  samEmbedStatus: 'idle' | 'loading_model' | 'embedding' | 'ready' | 'error'

  // comments (slot 으로 받기 권장 — comment thread sub-view)
  commentSection?: React.ReactNode

  // i18n
  labels: RightPanelLabels

  // callbacks
  onSelectClass: (classId: string) => void
  onSetEditMode: (mode: 'cursor' | 'bbox') => void
  onEnterRoi: () => void
  onExitRoi: () => void
}
```

### 4.2 RightPanelCommentSectionProps

```ts
export interface RightPanelCommentSectionProps {
  comments: { id: string; author: string; text: string; timestamp: string }[]
  pendingComment: string
  isSending: boolean
  labels: { placeholder: string; send: string; sending: string; empty: string }
  onPendingCommentChange: (value: string) => void
  onSend: () => void
}
```

### 4.3 LogPanelViewProps

```ts
export interface LogEntry {
  timestamp: string                               // ISO or formatted
  level: 'info' | 'warn' | 'error' | 'success'
  message: string
  source?: string                                 // optional category
  details?: Record<string, unknown>               // for LogDetailTable
}

export interface LogPanelLabels {
  empty: string
  details: string
  copy: string
  copied: string
  expand: string
  collapse: string
  // log level labels
  info: string
  warn: string
  error: string
  success: string
}

export interface LogPanelViewProps {
  logs: LogEntry[]
  expanded: boolean
  hoveredLogIndex: number | null                  // visual state lifted
  displayedLogIndex: number | null
  labels: LogPanelLabels
  onSetHoveredLogIndex: (index: number | null) => void
  onSetDisplayedLogIndex: (index: number | null) => void
  onToggleExpanded: () => void
  onCopyLog: (log: LogEntry) => void
}
```

### 4.4 LogDetailTableViewProps

```ts
export interface LogDetailTableViewProps {
  details: Record<string, unknown>
}
```

매우 단순 — 37줄 그대로.

### 4.5 SystemMonitorModalViewProps

```ts
export type SystemMonitorTab = 'monitor' | 'cleanup'

export interface SystemMonitorModalLabels {
  title: string
  tabMonitor: string
  tabCleanup: string
  close: string
}

export interface SystemMonitorModalViewProps {
  activeTab: SystemMonitorTab
  labels: SystemMonitorModalLabels
  monitorContent?: React.ReactNode
  cleanupContent?: React.ReactNode
  onClose: () => void
  onSetActiveTab: (tab: SystemMonitorTab) => void
}
```

### 4.6 SystemMonitorCleanupTabViewProps

```ts
export interface CleanupStats {
  totalSize: number
  itemCounts: { datasets: number; sessions: number; logs: number; thumbs: number }
  oldestEntry: string | null
}

export interface SystemMonitorCleanupTabViewProps {
  stats: CleanupStats | null
  loading: boolean
  running: boolean
  result: { ok: boolean; freedBytes: number } | null
  selectedCategories: Set<string>
  labels: CleanupTabLabels
  onToggleCategory: (category: string) => void
  onRun: () => void
  onRefresh: () => void
}
```

### 4.7 SystemMonitorMonitorTabViewProps

```ts
export interface SystemMonitorMonitorTabViewProps {
  latest: SystemStats | null
  history: SystemStats[]                          // recent N points for chart
  labels: MonitorTabLabels
}
```

recharts 사용 가능 — Phase 8 의 peer dependency 재사용.

---

## 5. 변경 파일

### 5.1 신규 (~18 file)

§3 의 3 디렉토리 총 18 파일.

### 5.2 수정 (1 file)

```diff
  export * from './connection'
+ export * from './labeling-panel'
+ export * from './log'
+ export * from './system'
```

### 5.3 신규 story

```
stories/pages/edge/0.0.1/labeling-panel/
├─ RightPanelView.stories.tsx                 — 5 scenario (Default / RoiMode / EmbedLoading / CommentThread / Empty)
└─ RightPanelCommentSection.stories.tsx       — 4 scenario (Empty / WithComments / Typing / Sending)

stories/pages/edge/0.0.1/log/
├─ LogPanelView.stories.tsx                   — 5 scenario (Empty / WithLogs / Expanded / Hovered / WithDetails)
└─ LogDetailTableView.stories.tsx             — 2 scenario (Simple / Complex)

stories/pages/edge/0.0.1/system/
├─ SystemMonitorModalView.stories.tsx         — 3 scenario (Monitor / Cleanup / WithContent slots)
├─ SystemMonitorCleanupTabView.stories.tsx    — 5 scenario (Loading / NoData / WithStats / Running / Completed)
└─ SystemMonitorMonitorTabView.stories.tsx    — 4 scenario (Empty / NormalLoad / HighLoad / LongHistory)
```

총 7 story × 2~5 scenario = ~28 scenario.

신규 fixture:
- `stories/fixtures/edge/0.0.1/logs-detail.ts` — LogEntry[] with details
- `stories/fixtures/edge/0.0.1/cleanup-stats.ts` — CleanupStats mock
- `stories/fixtures/edge/0.0.1/comments.ts` — Comment[] mock

### 5.4 건드리지 않음

- `ingradient-edge/src/frontend/components/{labeling,log,system}/*` — Phase 13
- `ingradient-edge/src/frontend/modules/log/*` — Phase 13
- `ingradient-edge/src/frontend/modules/stats/*` — Phase 13

---

## 6. i18n 키 매핑 (요약)

총 ~50 key. 본 spec 본문에 전부 나열 안 함.

요약:
- RightPanelLabels + comment: ~15 key
- LogPanelLabels: ~10 key
- SystemMonitorLabels: ~25 key

---

## 7. 실행 순서

1. types:
   - `labeling-panel/types.ts`
   - `log/types.ts`
   - `system/types.ts`
2. styles:
   - `labeling-panel/RightPanelView.styles.ts`
   - `log/{panel,entry}.styles.ts` + `styles/index.ts` (LogPanel.styles.ts 215 분할)
   - `log/LogDetailTableView.styles.ts`
   - `system/*.styles.ts` (3 파일)
3. sub-view:
   - `labeling-panel/RightPanelCommentSection.tsx`
   - `labeling-panel/RightPanelView.tsx`
   - `log/LogDetailTableView.tsx`
   - `log/LogPanelView.tsx`
   - `system/SystemMonitorMonitorTabView.tsx`
   - `system/SystemMonitorCleanupTabView.tsx`
   - `system/SystemMonitorModalView.tsx`
4. `*/index.ts` × 3
5. `packages/edge-pages/src/index.ts` 수정
6. fixtures + stories
7. typecheck + build + storybook build

---

## 8. 검증

| # | 명령 | 기대 |
|---|---|---|
| 1 | `ls packages/edge-pages/src/{labeling-panel,log,system}/` | 각 5~7 파일 |
| 2 | `cd packages/edge-pages && npx tsc --noEmit` | 0 error |
| 3 | `cd packages/edge-pages && npm run build` | 7 view export |
| 4 | 모든 파일 `wc -l` | 모두 < 200 |
| 5 | `npx tsc --noEmit -p tsconfig.json` (root) | 0 error |
| 6 | `npm run build:storybook` | exit 0 |
| 7 | Storybook 수동 — ~28 scenario | 모두 props 만으로 렌더 |
| 8 | grep — 금지 import 0 | `grep -rE 'useTranslation\|window\.electron\|zustand\|i18next\|useWorkspaceUIStore\|useDatasetStore\|useCaptureLogStore\|useCaptureStore\|useSystemStatsStore' packages/edge-pages/src/{labeling-panel,log,system}/` → 0 match |
| 9 | Phase 5 의 Workspace 통합 | RightPanelView 가 Workspace 의 labeling 모드 sidebar 로 plug-in 가능 확인 (수동) |

---

## 9. 성공 기준

- 검증 1~9 통과
- 7 view 가 store/IPC/i18n 의존 0
- ~28 storybook scenario 가 props 만으로 렌더
- 모든 파일 < 200 줄 (LogPanel.styles.ts 215 → 2 파일 분해)
- **view 추출 완료** — 본 phase 후 ingradient-edge 의 모든 page-level + 큰 component-level JSX 가 edge-pages 에 매핑됨

---

## 10. 리스크

### 10.1 labeling/ 폴더 이름 충돌

위험: Phase 7 의 `labeling/` (BBoxCanvas + SAM) 와 본 phase 의 RightPanel 도 라벨링 영역. 같은 폴더 이름 사용 시 의미 혼동.

대응:
- 본 phase 는 `labeling-panel/` 폴더로 분리
- 또는 Phase 7 의 `labeling/` 안에 `right-panel/` sub-folder
- **결정**: `labeling-panel/` 채택 — barrel 에서 분리 노출 (`@ingradient/edge-pages` 의 export 는 동일 namespace 라 충돌 없음)

### 10.2 RightPanel 의 ROI button → window event

위험: edge 의 RightPanel 은 ROI 버튼 클릭 시 `window.dispatchEvent(new CustomEvent('edge-sam-roi-enter'))`. window event 는 visual-only 가 아닌 side effect.

대응:
- container 가 callback (`onEnterRoi`) 안에서 `dispatchEvent` 호출
- view 는 callback prop 만
- Phase 13 spec 에서 dispatcher 패턴 정착

### 10.3 LogPanel 의 auto-scroll

위험: edge LogPanel 의 `useEffect` 로 hovered/displayed log index 동기화 + DOM 스크롤.

대응:
- 스크롤 조정은 visual-only — view 안 useEffect OK
- 단 IPC (loadLogsFromDb) 은 container 잔류
- props 로 logs array 받으면 array 변경 시 scroll-to-bottom 효과

### 10.4 SystemMonitorMonitorTab 의 recharts

위험: Phase 8 의 recharts peer 가 이미 등록되어 있음 — 본 phase 도 동일 사용 OK.

대응:
- 추가 peer 등록 불필요
- view 안 recharts import OK (Phase 8 의 검증 #9 처럼 확인)

### 10.5 comment thread 의 IPC (addComment / getComments)

위험: comment 추가 / 로드가 IPC. container 잔류.

대응:
- container 가 IPC 호출 후 comments array props 로 전달
- view 의 `onSend` callback 이 container 의 `addComment` 호출 트리거

### 10.6 LogDetailTable 의 Record<string, unknown> 렌더

위험: 임의 객체 렌더 — JSON.stringify 또는 key-value 표.

대응:
- view 가 `Object.entries(details)` 로 key-value 표 그대로 (edge 와 동일)
- 깊은 중첩 객체는 JSON.stringify (visual-only)
- 200 룰 안 OK

### 10.7 cleanup category 의 hard-coded list

위험: cleanup category (`datasets / sessions / logs / thumbs`) 가 view 안 hard-coded.

대응:
- 본 phase 는 edge 와 동일하게 hard-coded
- 향후 동적 category 필요 시 props 로 lift (별도 phase)

### 10.8 RightPanel 과 BBoxCanvas 의 분리 명확화

위험: 둘 다 labeling 모드의 UI 인데 BBoxCanvas 는 canvas, RightPanel 은 sidebar. 의존 방향 명확화 필요.

대응:
- 본 phase 의 RightPanelView 는 BBoxCanvasView 와 무관 — Workspace 의 labeling 분기에서 horizontal flex 로 양쪽 마운트
- props 도 분리 (classes / selectedClassId 는 공유하지만 각각 받음)
- caller (Phase 13 의 edge Workspace) 가 양쪽 동시 mount

---

## 11. Rollback

git revert. 산출물:
- `packages/edge-pages/src/{labeling-panel,log,system}/` 디렉토리 삭제
- `packages/edge-pages/src/index.ts` 의 3 export 제거
- `stories/pages/edge/0.0.1/{labeling-panel,log,system}/` 삭제
- 신규 fixture 3개 삭제
- `npm run build --workspace packages/edge-pages` 재실행

---

## 12. 종료 후 상태

- `@ingradient/edge-pages` 가 50+ view export (Phase 1-10 누적 + Phase 11 의 7)
- **모든 view 추출 완료** — ingradient-edge 의 페이지/컴포넌트 → edge-pages 매핑 100%
- 200 룰 위반 1 파일 (LogPanel.styles.ts 215) 분할 완료
- Phase 5 의 Workspace 의 labeling 분기에 RightPanel slot plug-in 가능
- Phase 4 의 BottomBar 의 onOpenMonitor → SystemMonitorModal plug-in 가능
- Phase 12 (Story 정리 + 문서 동기화) 진입 준비 완료

---

## 13. 다음 액션

1. 본 spec ok
2. 실행 (§7 의 7 step)
3. 검증 (§8 의 9 step)
4. Phase 12 spec 작성 (`edge-pages-phase-12-spec.md`) — story 정리, usage 가이드 작성
