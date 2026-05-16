# Phase A — Dashboard Edge Analysis Sections 이전

> 상위 — [platform-edge-migration-roadmap.md](./platform-edge-migration-roadmap.md). 분량 ~143줄, pure UI 2 파일.

## 대상 파일

| Source | Lines | Description |
|---|---|---|
| [DeflectometryDashboardSection.tsx](../../../ingradient-platform/frontend/components/analysis/DeflectometryDashboardSection.tsx) | 61 | Deflectometry summary 카드 + step timing BarChart |
| [EdgeAnalyticsSection.tsx](../../../ingradient-platform/frontend/components/analysis/EdgeAnalyticsSection.tsx) | 82 | Edge session summary + outcome Pie + worker Table + 2 BarChart |

## 의존성

두 파일 모두 platform 의 의존성:
- `BarChartCard`, `PieChartCard` from `@ingradient/ui/components` ✓ (이미 있음)
- `formatDurationMs` from `./ChartingComponents` ✓ (Phase 직전에 `@ingradient/ui/utils` 로 이전 완료)
- `Card`, `CardHead`, `CardTitle`, `EdgeSection`, `StatRow/Label/Value`, `Empty`, `Table`, `CHART_COLORS` from `./analysis.styles` ✗ **이전 필요**
- `AnalysisOut['edge_analytics']` type from platform `api/projects` ✗ **타입은 inline 으로 재정의**

## 신규 파일

### A-1. Analysis section primitives (재사용 styled)

[packages/platform-pages/src/dashboard/analysis-section.styles.ts](../../packages/platform-pages/src/dashboard/) — platform 의 `analysis.styles.tsx` 의 dashboard 전용 부분만:

```ts
export const Card = styled(SectionPanel)`...`
export const CardHead = styled.div`...`
export const CardTitle = styled.span`...`
export const StatRow = styled.div`...`
export const StatLabel = styled.span`...`
export const StatValue = styled.span`...`
export const EdgeSection = styled.div`...`  // 2-col grid, mobile 1-col
export const Empty = styled.p`...`
export const Table = styled.table`...`
export const CHART_COLORS = [...]
```

→ 약 90줄.

### A-2. `EdgeAnalyticsView` type

[packages/platform-pages/src/dashboard/edge-analytics-types.ts](../../packages/platform-pages/src/dashboard/) — platform 의 `AnalysisOut['edge_analytics']` 의 inline 재정의. platform 의 import 호환성 위해 동일 필드명.

```ts
export interface EdgeAnalyticsSummary {
  total_capture_sessions: number
  total_labeling_sessions: number
}
export interface EdgeStepBreakdownEntry {
  step_key: string
  average_ms: number | null
}
export interface EdgeWorkerStat {
  worker_id?: string
  worker_name: string
  capture_count: number
  labeling_count: number
  retry_count: number
}
export interface EdgeOutcomeEntry {
  label: string
  count: number
}
export interface EdgeLabelingClassEntry {
  name: string
  count: number
  color: string
}
export interface EdgeAnalyticsView {
  summary: EdgeAnalyticsSummary
  step_breakdown: EdgeStepBreakdownEntry[]
  worker_stats: EdgeWorkerStat[]
  outcome_ratios: EdgeOutcomeEntry[]
  capture_duration: { average_ms: number | null }
  labeling_duration: { average_ms: number | null }
  labeling_class_distribution: EdgeLabelingClassEntry[]
}
```

→ 약 35줄.

### A-3. `DeflectometryDashboardSection`

[packages/platform-pages/src/dashboard/DeflectometryDashboardSection.tsx](../../packages/platform-pages/src/dashboard/) — 그대로 이전. import 만 swap:
- `BarChartCard` from `@ingradient/ui/components` (변경 X)
- `formatDurationMs` from `@ingradient/ui/utils` (변경)
- styled from `./analysis-section.styles` (변경)
- `EdgeAnalyticsView` from `./edge-analytics-types`

prop signature `{ edgeAnalytics: EdgeAnalyticsView }` 유지.

### A-4. `EdgeAnalyticsSection`

[packages/platform-pages/src/dashboard/EdgeAnalyticsSection.tsx](../../packages/platform-pages/src/dashboard/) — 그대로 이전. import swap 동일.

### A-5. Barrel export

[packages/platform-pages/src/dashboard/index.ts](../../packages/platform-pages/src/dashboard/index.ts) — 2 컴포넌트 + 타입 + section styles 노출.

```ts
export * from './DeflectometryDashboardSection'
export * from './EdgeAnalyticsSection'
export * from './edge-analytics-types'
```

## Storybook 추가

### A-6. Mock fixture

[stories/fixtures/platform/0.0.1/dashboard-edge-analytics.ts](../../stories/fixtures/platform/0.0.1/) — `mockEdgeAnalytics: EdgeAnalyticsView` 객체. 약 60줄.

### A-7. Dashboard story scenario

[stories/fixtures/platform/0.0.1/dashboard-scenarios.ts](../../stories/fixtures/platform/0.0.1/dashboard-scenarios.ts) 에 `'with-edge-analytics'` + `'with-deflectometry'` scenario key 추가. `edgeAnalytics` + `deflectometryEnabled` 필드 추가.

### A-8. `DashboardView` 통합

[packages/platform-pages/src/dashboard/DashboardView.tsx](../../packages/platform-pages/src/dashboard/DashboardView.tsx) — widget grid 아래에 (있을 시) `DeflectometryDashboardSection` + `EdgeAnalyticsSection` 렌더. 새 props 추가:

```ts
edgeAnalytics?: EdgeAnalyticsView
deflectometryEnabled?: boolean
```

### A-9. Storybook story 연결

[stories/pages/platform/0.0.1/Dashboard.stories.tsx](../../stories/pages/platform/0.0.1/Dashboard.stories.tsx) — scenario 에서 `edgeAnalytics` / `deflectometryEnabled` 가 있으면 prop 으로 전달.

새 story exports:
- `WithEdgeAnalytics`
- `WithDeflectometry`

### A-10. Probe scenarios

[tests/probes/dashboard.mjs](../../tests/probes/dashboard.mjs) — 2 새 scenario 추가:
- `with-edge-analytics` — "Edge session summary" text visible
- `with-deflectometry` — "Deflectometry summary" text visible

## 실행 step 순서

1. [ ] A-1 `analysis-section.styles.ts` 작성
2. [ ] A-2 `edge-analytics-types.ts` 작성
3. [ ] A-3 `DeflectometryDashboardSection.tsx` 작성
4. [ ] A-4 `EdgeAnalyticsSection.tsx` 작성
5. [ ] A-5 barrel export 갱신
6. [ ] typecheck (중간 check)
7. [ ] A-6 mock fixture 작성
8. [ ] A-7 scenario key 추가
9. [ ] A-8 `DashboardView` 에 section 통합
10. [ ] A-9 story scenario 연결 + 2 story exports
11. [ ] A-10 probe scenario 추가
12. [ ] 전체 typecheck + build:package + build:storybook
13. [ ] dashboard probe 실행 (재시도 flake 허용)
14. [ ] 이 문서 끝에 완료 기록 추가

## Verification

```bash
# 모두 EXIT=0 또는 통과
npx tsc --noEmit
npm run build:package
npm run build:storybook
node tests/probes/dashboard.mjs   # 8/8 (기존 6 + 새 2) — 1차 cascade flake 시 재시도
```

## 완료 기록

**완료일**: 2026-05-16

### 신규 파일 (platform-pages/dashboard/)
- `analysis-section.styles.ts` (88줄) — Card / CardHead / CardTitle / StatRow / StatLabel / StatValue / EdgeSection / Empty / Table / CHART_COLORS
- `edge-analytics-types.ts` (42줄) — `EdgeAnalyticsView` + 5 sub-types
- `DeflectometryDashboardSection.tsx` (66줄) — Pure UI, prop `{ edgeAnalytics }`
- `EdgeAnalyticsSection.tsx` (123줄) — Pure UI, prop `{ edgeAnalytics }`

### 신규 파일 (storybook fixture)
- `stories/fixtures/platform/0.0.1/dashboard-edge-analytics.ts` (44줄) — `mockEdgeAnalytics` + `mockEdgeAnalyticsEmpty`

### 수정 파일
- `packages/platform-pages/src/dashboard/index.ts` — 3 export 추가
- `packages/platform-pages/src/dashboard/types.ts` — `DashboardViewProps` 에 `edgeAnalytics?` + `deflectometryEnabled?` 추가
- `packages/platform-pages/src/dashboard/DashboardView.tsx` — widget grid 아래에 2 section 조건부 렌더
- `stories/fixtures/platform/0.0.1/dashboard-scenarios.ts` — 2 scenario key 추가 (`with-edge-analytics`, `with-deflectometry`)
- `stories/pages/platform/0.0.1/Dashboard.stories.tsx` — `edgeAnalytics` / `deflectometryEnabled` prop 전달 + 2 story export
- `tests/probes/dashboard.mjs` — 2 probe scenario 추가

### 검증
- `npx tsc --noEmit` EXIT=0
- `npm run build:package` 성공 (lib/index.js 73.83 → 82.26 KB)
- `npm run build:storybook` 성공
- `node tests/probes/dashboard.mjs` 8/8 pass (1차 cascade flake 후 재실행)

### Platform 마이그레이션 경로
플랫폼이 import 만 swap 하면 동작 동일:
```tsx
// before
import { DeflectometryDashboardSection } from './DeflectometryDashboardSection'
import { EdgeAnalyticsSection } from './EdgeAnalyticsSection'

// after
import { DeflectometryDashboardSection, EdgeAnalyticsSection } from '@ingradient/platform-pages'
```
`AnalysisOut['edge_analytics']` 타입은 `EdgeAnalyticsView` 와 1:1 호환 — 캐스트 불필요.
