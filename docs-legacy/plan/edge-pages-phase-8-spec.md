---
title: Phase 8 — StaticsView + 4 chart sub-view 추출
purpose: ingradient-edge 의 stats 탭 5 파일 (StaticsView 167 + Session/Image/Labeling/Camera Charts 407줄, 총 ~574줄) 을 @ingradient/edge-pages/statics 로 pure view 추출
audience: ingradient-ui contributor
date: 2026-05-19
status: draft
related:
  - ./edge-pages-extraction-roadmap.md
  - ./edge-pages-package-plan.md
  - ./edge-pages-phase-7-spec.md
---

# Phase 8 — StaticsView + 4 chart sub-view 추출

> Roadmap: [edge-pages-extraction-roadmap.md](./edge-pages-extraction-roadmap.md) § Phase 8
> Phase 7 대비 단순. 모든 파일 ≤ 200 (LabelingCharts 166, StaticsView 167 이 max). store/IPC 의존이 상대적으로 적음. **recharts peer dependency 첫 등장**.

---

## 1. 목적

`packages/edge-pages/src/statics/` 에 stats 탭 5 view 추출.

Phase 5 의 `staticsContent` slot 의 실체화. Phase 7 의 BBoxCanvas 같은 복잡도 없음 — chart 는 recharts 기반 pure render.

---

## 2. 대상 파일 + 의존

| 파일 | 줄 | recharts | i18n | store | IPC | 결정 |
|---|---|---|---|---|---|---|
| `StaticsView.tsx` | 167 | ❌ | ✅ | useAuthStore + useDatasetStore + useImages | electron.getStatsAnalytics / getImageAnalytics / upsertUserProfile / claimUnknownStatsWorker + localStorage | shell view (≤ 200) |
| `SessionCharts.tsx` | 123 | ✅ | ✅ | 없음 | 없음 | pure (≤ 200) |
| `ImageCharts.tsx` | 56 | ✅ | ✅ | 없음 | 없음 | pure |
| `LabelingCharts.tsx` | 166 | ✅ | ✅ | 없음 | 없음 | pure |
| `CameraCharts.tsx` | 62 | ✅ | ✅ | 없음 | 없음 | pure |
| `StaticsView.styles.ts` | 103 | - | - | - | - | 그대로 이전 |
| `SessionCharts.styles.ts` | 47 | - | - | - | - | 그대로 이전 |

4 chart 는 store / IPC / localStorage 의존 없음 — 단순 props-driven 변환만 필요 (`useTranslation` → labels prop). StaticsView 는 store + IPC + localStorage 모두 container 잔류.

---

## 3. recharts peer dependency

본 phase 에서 처음으로 recharts 를 view 안에서 직접 import. edge-pages 의 `package.json` 에 peer 추가 필요:

```diff
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "styled-components": "^6.0.0",
+   "recharts": "^3.0.0",
    "@ingradient/ui": "*"
  }
```

tsup `external` 에도 추가:

```diff
  external: [
    'react',
    'react-dom',
    'styled-components',
    'lucide-react',
+   'recharts',
    '@ingradient/ui',
    ...
  ]
```

ingradient-edge 와 storybook smoke-consumer 가 이미 recharts ^3.7.0 의존 — 추가 install 불필요.

---

## 4. 모듈 구조

```
packages/edge-pages/src/statics/
├─ StaticsView.tsx                  — shell (≤ 180 줄)
├─ StaticsSummary.tsx               — SummaryGrid + SummaryCard (≤ 60 줄)
├─ StaticsSection.tsx               — collapsible SectionHeader + content wrapper (≤ 50 줄)
├─ SessionChartsView.tsx            — ≤ 130 줄
├─ ImageChartsView.tsx              — ≤ 70 줄
├─ LabelingChartsView.tsx           — ≤ 170 줄
├─ CameraChartsView.tsx             — ≤ 70 줄
├─ StaticsView.styles.ts            — 그대로 이전 (103줄)
├─ SessionChartsView.styles.ts      — 그대로 이전 (47줄)
├─ chart-helpers.ts                 — formatDuration / formatPct 등 pure util (필요 시)
├─ types.ts                         — view props + analytics types
└─ index.ts                         — barrel
```

총 12 파일. 모두 ≤ 200 줄.

---

## 5. Props Interface

### 5.1 StaticsViewProps

```ts
// Analytics types (edge 의 types 복사 — pure data shape)

export interface SessionAnalytics {
  summary: {
    daily_count: number
    weekly_count: number
    monthly_count: number
    total_sessions: number
    total_labeling_sessions: number
    tracked_since: string | null
  }
  counts_by_hour: { label: string; count: number }[]
  duration_summary: { average_ms: number | null; median_ms: number | null; p95_ms: number | null }
  labeling_duration_summary: { average_ms: number | null; median_ms: number | null; p95_ms: number | null }
  step_breakdown: { step_key: string; average_ms: number }[]
  outcome_ratios: { label: 'success' | 'retry' | 'timeout'; count: number; ratio: number }[]
  labeling_class_distribution: { class_id: string; class_name: string; count: number }[]
  worker_stats: { worker_id: string | null; worker_name: string; capture_count: number; labeling_count: number; retake_count: number; retake_rate: number }[]
}

export interface ImageAnalytics {
  total_images: number
  total_sequences: number
  labeled_ratio: number
  avg_bbox_count: number
  class_bbox_counts: { class_id: string; count: number }[]
  class_image_counts: { class_id: string; count: number }[]
  bbox_per_image_distribution: { bucket: string; count: number }[]
  class_avg_size: { class_id: string; avg_size: number }[]
  // ... 나머지 (필요 시 edge 의 ImageAnalytics interface 참조)
}

export interface StaticsViewLabels {
  // header
  title: string
  trackedFromVersion: string
  startedSince: (date: string) => string

  // summary cards
  dailyCaptures: string
  weeklyCaptures: string
  monthlyCaptures: string
  totalImages: string
  labeledRatio: string

  // sections
  sessions: string                                // 'statics.section.sessions'
  images: string                                  // 'statics.section.images'
  labeling: string
  camera: string

  // empty states
  selectDataset: string
  loading: string
  noData: string

  // sub-view labels
  sessionCharts: SessionChartsLabels
  imageCharts: ImageChartsLabels
  labelingCharts: LabelingChartsLabels
  cameraCharts: CameraChartsLabels
}

export interface StaticsViewProps {
  hasDataset: boolean                             // datasetId !== null
  loading: boolean
  imagesLoading: boolean

  // data
  session: SessionAnalytics | null
  enhancedImage: ImageAnalytics | null
  classNameMap: Map<string, string>               // class_id → class_name
  classes: { class_id: string; class_name: string; color: string }[]
  images: ImageItem[]                             // LabelingChartsView 의 input

  // visual state (collapsible sections — lifted for storybook scenario)
  collapsedSections: Partial<Record<'sessions' | 'images' | 'labeling' | 'camera', boolean>>

  // i18n
  labels: StaticsViewLabels

  // callbacks
  onToggleSection: (key: 'sessions' | 'images' | 'labeling' | 'camera') => void
}
```

설계 노트:

- StaticsView 의 IPC (getStatsAnalytics / getImageAnalytics / upsertUserProfile / claimUnknownStatsWorker) 모두 container 잔류
- `localStorage` 읽기/쓰기 (`STORAGE_KEY = 'edge_stats_collapsed_sections'`) container 잔류 — view 는 `collapsedSections` props 만
- `useImages({datasetId, projectId, ...})` container 잔류 — `images` 와 `imagesLoading` 을 props 로 받음
- `buildCurrentLabelingAnalytics` 와 `enhancedImage` 계산 container 잔류 — `enhancedImage` props
- `classNameMap` 도 container 가 미리 Map 생성 후 전달 (`new Map(...)` 은 visual-only 라 view 안에서 만들어도 OK 지만 일관성)

### 5.2 SessionChartsViewProps

```ts
export interface SessionChartsLabels {
  hourlyCount: string
  outcomeRatios: string
  durationStats: string
  averageDuration: string
  medianDuration: string
  p95Duration: string
  labelingDurationStats: string
  stepBreakdown: string
  workerStats: string
  workerName: string
  captureCount: string
  labelingCount: string
  retakeCount: string
  retakeRate: string
  outcomeSuccess: string
  outcomeRetry: string
  outcomeTimeout: string
}

export interface SessionChartsViewProps {
  countsByHour: SessionAnalytics['counts_by_hour']
  outcomeRatios: SessionAnalytics['outcome_ratios']
  durationSummary: SessionAnalytics['duration_summary']
  labelingDurationSummary: SessionAnalytics['labeling_duration_summary']
  stepBreakdown: SessionAnalytics['step_breakdown']
  workerStats: SessionAnalytics['worker_stats']
  labels: SessionChartsLabels
}
```

### 5.3 ImageChartsViewProps

```ts
export interface ImageChartsLabels {
  totalImages: string
  totalSequences: string
  labeledRatio: string
  avgBboxCount: string
}

export interface ImageChartsViewProps {
  data: ImageAnalytics
  labels: ImageChartsLabels
}
```

### 5.4 LabelingChartsViewProps

```ts
export interface LabelingChartsLabels {
  classBboxCounts: string
  classImageCounts: string
  bboxPerImageDistribution: string
  classAvgSize: string
  classLabel: string
  // ... 5~10 key
}

export interface LabelingChartsViewProps {
  data: ImageAnalytics
  classNameMap: Map<string, string>
  classes: { class_id: string; class_name: string; color: string }[]
  images: ImageItem[]                             // 현재 dataset 의 ImageItem[] (chart input)
  labels: LabelingChartsLabels
}
```

### 5.5 CameraChartsViewProps

```ts
export interface CameraChartsLabels {
  // ~5 key
}

export interface CameraChartsViewProps {
  data: ImageAnalytics
  labels: CameraChartsLabels
}
```

---

## 6. 변경 파일

### 6.1 신규 (12 file)

§4 의 statics/ 12 파일.

### 6.2 수정 (3 file)

#### `packages/edge-pages/src/index.ts`

```diff
  export * from './labeling'
+ export * from './statics'
```

#### `packages/edge-pages/package.json`

§3 의 recharts peer 추가.

#### `packages/edge-pages/tsup.config.ts`

§3 의 recharts external 추가.

### 6.3 신규 story

```
stories/pages/edge/0.0.1/statics/
├─ StaticsView.stories.tsx           — 6 scenario (NoDataset / Loading / NoData / WithSession / WithImage / AllCollapsed)
├─ SessionCharts.stories.tsx         — 4 scenario (Empty / HighVolume / OutcomeImbalanced / WithWorkers)
├─ ImageCharts.stories.tsx           — 3 scenario (Empty / SmallDataset / LargeDataset)
├─ LabelingCharts.stories.tsx        — 4 scenario (Empty / SingleClass / MultiClass / WideRange)
└─ CameraCharts.stories.tsx          — 3 scenario (Empty / NormalRange / HighSaturation)
```

총 5 story × 3~6 scenario = 20 scenario.

신규 fixture:
- `stories/fixtures/edge/0.0.1/stats-analytics.ts` — SessionAnalytics + ImageAnalytics mock 3개 (small / medium / large)
- `stories/fixtures/edge/0.0.1/stats-images.ts` — labeling chart 용 ImageItem[] (Phase 7 의 images fixture reuse 가능)

### 6.4 건드리지 않음

- `ingradient-edge/src/frontend/components/stats/*` — Phase 13
- `ingradient-edge/src/frontend/modules/stats/model/stats.utils.ts` — Phase 13 (단 `buildCurrentLabelingAnalytics` / `EMPTY_IMAGE_ANALYTICS` 는 container 가 사용 계속)

---

## 7. i18n 키 매핑

총 ~50 key. helper hook (`useStaticsViewLabels()` 등) 패턴 — Phase 13 spec 결정.

요약 (key prefix `statics.*`):
- StaticsView: ~15 key (title / trackedFromVersion / startedSince / 5 summary / 4 section / 3 empty)
- SessionCharts: ~17 key
- ImageCharts: ~5 key
- LabelingCharts: ~10 key
- CameraCharts: ~5 key

---

## 8. 실행 순서

1. `statics/types.ts` — analytics + labels types
2. styles 이전:
   - `statics/StaticsView.styles.ts`
   - `statics/SessionChartsView.styles.ts`
3. recharts peer + external 추가 (`package.json` + `tsup.config.ts`)
4. chart sub-view (의존성 적은 것부터):
   - `statics/CameraChartsView.tsx`
   - `statics/ImageChartsView.tsx`
   - `statics/LabelingChartsView.tsx`
   - `statics/SessionChartsView.tsx`
5. shell sub-view:
   - `statics/StaticsSection.tsx`
   - `statics/StaticsSummary.tsx`
6. shell:
   - `statics/StaticsView.tsx`
7. `statics/index.ts` — barrel
8. `packages/edge-pages/src/index.ts` 수정
9. fixtures + stories
10. typecheck + build + storybook build

---

## 9. 검증

| # | 명령 | 기대 |
|---|---|---|
| 1 | `ls packages/edge-pages/src/statics/` | 12 파일 |
| 2 | `cd packages/edge-pages && npx tsc --noEmit` | 0 error |
| 3 | `cd packages/edge-pages && npm run build` | StaticsView + 4 chart view export |
| 4 | 모든 파일 `wc -l` | 모두 < 200 |
| 5 | `npx tsc --noEmit -p tsconfig.json` (root) | 0 error |
| 6 | `npm run build:storybook` | exit 0 — recharts external 적용 확인 |
| 7 | Storybook 수동 — 20 scenario | 모두 props 만으로 렌더 |
| 8 | grep — 금지 import 0 | `grep -rE 'useTranslation\|window\.electron\|zustand\|i18next\|localStorage\|useAuthStore\|useDatasetStore\|useImages' packages/edge-pages/src/statics/` → 0 match |
| 9 | grep — recharts import 확인 | `grep -rE "from 'recharts'" packages/edge-pages/src/statics/` → 4 chart file 에 있어야 함 |
| 10 | tsup 산출물 size 확인 | recharts 가 external 처리되어 lib/index.js 에 포함 안 됨 (size 폭증 없음) |

---

## 10. 성공 기준

- 검증 1~10 통과
- 5 view 가 store/IPC/i18n/localStorage 의존 0
- 20 storybook scenario 가 props 만으로 렌더
- 모든 파일 < 200 줄
- recharts peer dependency 등록 + tsup external 처리 검증
- Phase 5 의 `staticsContent` slot 이 본 phase view 로 plug-in 가능

---

## 11. 리스크

### 11.1 `buildCurrentLabelingAnalytics` 의 위치

위험: edge 의 `enhancedImage` 계산은 `buildCurrentLabelingAnalytics(currentImages, classes)` + 기본 `image` 의 merge. container 안에서 한다 하더라도 helper 의 이전 여부 결정 필요.

대응:
- helper 는 edge 잔류 (container 가 호출 후 결과만 props 로)
- 본 phase 의 view 는 enhanced 결과만 받음 — `buildCurrentLabelingAnalytics` 모름

### 11.2 recharts 의 chart resize 동작

위험: recharts 의 `ResponsiveContainer` 는 부모 크기 따라감. storybook 의 default layout 에서 부모 0px 시 chart 안 보임.

대응:
- storybook decorator 또는 story 의 wrapper 에 `min-height: 400px` 설정
- view 자체는 ResponsiveContainer 그대로 사용 (edge 와 동일)

### 11.3 `localStorage` 의 container 화로 storybook persist 안 됨

위험: collapsed section 상태가 storybook 에서 reload 시 reset.

대응:
- storybook 은 fixture 의 `collapsedSections` 값 그대로 사용
- 실제 persist 동작은 Phase 13 의 edge runtime 에서 검증
- 본 phase scenario 에 `AllCollapsed` 포함해서 visual 검증

### 11.4 `tracked_since` 의 date string 변환

위험: edge 는 `new Date(session.summary.tracked_since).toLocaleString()` 으로 변환. view 에 두면 locale 의존성 (storybook 의 default locale 과 다를 수 있음).

대응:
- container 가 미리 변환 후 `labels.startedSince(formattedDate)` 호출하는 형태로 전달
- 또는 view 안에서 `toLocaleString()` 호출 그대로 (visual-only, side effect 없음) — **결정**: container 가 변환. view 는 string only.

### 11.5 chart axis labels 의 i18n

위험: recharts 의 XAxis / YAxis label / tooltip formatter 는 view 안에서 t() 호출.

대응:
- labels prop 으로 평문 전달
- formatter 함수도 labels 안 (예: `labels.tooltipFormatter: (value, name) => string`)
- 본 phase 검증 #8 에서 useTranslation 0 match 강제

### 11.6 `EMPTY_IMAGE_ANALYTICS` 상수의 위치

위험: container 가 fallback 으로 사용. view 도 같은 상수 필요할 수 있음.

대응:
- view 는 fallback 없음 — `enhancedImage: ImageAnalytics | null` 받고 null 시 chart 안 render
- `EMPTY_IMAGE_ANALYTICS` 는 container 잔류

### 11.7 storybook smoke-consumer 의 recharts 의존성

위험: smoke-consumer 가 recharts 사용 안 하면 추가 install 필요.

대응:
- smoke-consumer 는 lib 산출물의 type 만 import — runtime recharts 호출 0
- recharts external 처리되어 lib 에 포함 안 됨 → smoke-consumer 영향 없음
- 검증 #10 에서 확인

### 11.8 chart 의 mock data 생성 부담

위험: SessionAnalytics 의 shape 가 복잡 — fixture 작성 부담.

대응:
- 3 size (small / medium / large) preset 작성
- factory 함수 (`makeSessionAnalytics(overrides)`) 로 scenario 별 derive
- Phase 7 의 image fixture reuse

---

## 12. Rollback

git revert. 산출물:
- `packages/edge-pages/src/statics/` 디렉토리 삭제
- `packages/edge-pages/src/index.ts` 의 statics export 제거
- `packages/edge-pages/package.json` 의 recharts peer 제거
- `packages/edge-pages/tsup.config.ts` 의 recharts external 제거
- `stories/pages/edge/0.0.1/statics/` 삭제
- 신규 fixture 2개 삭제
- `npm run build --workspace packages/edge-pages` 재실행

---

## 13. 종료 후 상태

- `@ingradient/edge-pages` 가 23+ view export (Phase 1-7 누적 + Phase 8 의 5)
- recharts peer dependency 패턴 검증 — 이후 phase 에서 다른 chart 사용 시 동일 방식
- Phase 5 의 staticsContent slot plug-in 가능
- Phase 9 (Settings tabs + CameraSettingsDialog) 진입 준비 완료

---

## 14. 다음 액션

1. 본 spec ok
2. 실행 (§8 의 10 step)
3. 검증 (§9 의 10 step)
4. Phase 9 spec 작성 (`edge-pages-phase-9-spec.md`) — Settings 10 파일 + Camera dialog shell
