---
title: PR-E0a — ChartContainer 스토리에 실 chart 예시 추가
date: 2026-05-10
parent: docs/plan/phase-5-components-audit.md
scope: ingradient-ui
status: planning — 사용자 review 대기
---

# PR-E0a — ChartContainer story 실 chart 예시

## 1. 증상

ui Storybook `Components / Charts / ChartContainer` Review story 의 chart area 5곳 모두 텍스트 placeholder (`<Placeholder label="(chart area)" />` 등) 만 렌더 — 컴포넌트 실 사용 모습 안 보임. 비직관적.

다른 chart 스토리 `Components / Charts / Overview` 는 LineChartCard / BarChartCard / PieChartCard (= ChartContainer 를 *내부에 사용* 하는 chart cards) 의 실 차트를 보여주지만, ChartContainer 자체 스토리는 sub-components 를 직접 사용 안 함.

## 2. 의도

ChartContainer 는 *shell* 컴포넌트 (title + description + height + legend slot + loading/empty state). chart child 는 caller 가 자유롭게 결정. 현재 stories 는 shell 동작만 보여주려 placeholder 사용.

→ 단 사용자 입장에서 "실제 어떻게 차트를 wrap 하는지" 가 명확히 안 보임. 실 차트로 교체 시 직관성 향상 + caller 가 reference 로 활용 가능.

## 3. Fix — 5 placeholder 모두 실 차트 사용

### 3.1 placeholder 사용처 식별

[chart-container.stories.tsx](src/components/charts/chart-container.stories.tsx) 5 곳:
1. "Default (height=260)" — `<Placeholder label="(chart area)" />` → LineChart (단일 series trend)
2. "Sync state breakdown" + legend → 스택 BarChart (synced/pending/failed)
3. "Loading" 카드 → loading=true 라 children 안 보이지만, 일관성 위해 LineChart 사용
4. "Empty" 카드 → empty=true 라 children 안 보이지만 동일하게 LineChart 사용
5. "Custom height (height=180)" → 컴팩트 LineChart
6. "Custom height (height=380)" → 큰 LineChart

→ 6곳 (placeholder 5 + custom height 두 개 → 6) 으로 카운트.

### 3.2 어떤 chart 를 import 할지

ChartContainer 자체 스토리이므로 sub-component (LineChartCard / BarChartCard) 를 import 하면 *재귀적 ChartContainer wrap* 발생 (XCard 가 내부에 ChartContainer 사용). story 의도에 안 맞음.

→ 직접 recharts primitives + `ChartResponsive` 사용. 이미 [line-chart-card.tsx:1-7](src/components/charts/line-chart-card.tsx#L1-L7) 가 동일 pattern 사용 — recharts + ChartResponsive 조합.

### 3.3 sample data

`stories/builders/review-builders.ts` 의 `buildChartData('realistic')` 가 trend / pipeline / distribution 제공 — 다른 chart 스토리와 데이터 일관:
- `trend`: `{ period, reviewed, approved }[]`
- `pipeline`: `{ stage, items }[]` (단일 series)
- `distribution`: `{ name, value }[]` (PieChart 용)

ChartContainer 스토리는 stacked bar 가 필요 (sync 상태). pipeline 데이터는 단일 series — Stacked 표현 불가. 새로 inline 데이터 정의 (sync state):
```ts
const syncBreakdown = [
  { day: 'Mon', synced: 320, pending: 40, failed: 8 },
  { day: 'Tue', synced: 410, pending: 28, failed: 4 },
  ...
]
```
또는 sample 패키지 거기 별도 구분 — 현재 story 안 inline 정의 (storybook 데이터 근접 + 재활용 빈도 낮음).

## 4. 변경 내용 요약

[chart-container.stories.tsx](src/components/charts/chart-container.stories.tsx):

**추가 import**:
```tsx
import { Bar, BarChart, CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartResponsive } from './chart-responsive'
import { ChartTooltipContent } from './chart-tooltip'
import { chartPalette } from './types'
```

**제거**: `Placeholder` 함수 + 5 곳 사용

**inline sample 데이터** (story 파일 내):
- `trendData`: 7 day 단일 series LineChart 용
- `syncBreakdown`: 7 day 3 series stacked BarChart 용
- `compactTrend` / `largeTrend`: height variant 용 (또는 trendData 재사용)

**신규 helper** (story 내부):
```tsx
function SampleLineChart({ data, height }: { data: typeof trendData, height: number }) {
  return (
    <ChartResponsive height={height}>
      {({ width, height: h }) => (
        <LineChart width={width} height={h} data={data}>
          <CartesianGrid stroke="var(--ig-color-chart-grid)" strokeDasharray="3 3" />
          <XAxis dataKey="period" stroke="var(--ig-color-text-soft)" tickLine={false} axisLine={false} />
          <YAxis stroke="var(--ig-color-text-soft)" tickLine={false} axisLine={false} />
          <Tooltip content={<ChartTooltipContent />} />
          <Line type="monotone" dataKey="value" stroke={chartPalette[0]} strokeWidth={2.4} dot={false} activeDot={{ r: 4 }} />
        </LineChart>
      )}
    </ChartResponsive>
  )
}

function SampleStackedBar({ data, height }: { data: typeof syncBreakdown, height: number }) {
  return (
    <ChartResponsive height={height}>
      {({ width, height: h }) => (
        <BarChart width={width} height={h} data={data}>
          <CartesianGrid stroke="var(--ig-color-chart-grid)" strokeDasharray="3 3" />
          <XAxis dataKey="day" stroke="var(--ig-color-text-soft)" tickLine={false} axisLine={false} />
          <YAxis stroke="var(--ig-color-text-soft)" tickLine={false} axisLine={false} />
          <Tooltip content={<ChartTooltipContent />} />
          <Bar dataKey="synced" stackId="a" fill="var(--ig-color-success)" />
          <Bar dataKey="pending" stackId="a" fill="var(--ig-color-warning)" />
          <Bar dataKey="failed" stackId="a" fill="var(--ig-color-danger)" />
        </BarChart>
      )}
    </ChartResponsive>
  )
}
```

**카드 child 교체**: `<Placeholder ... />` → `<SampleLineChart data={trendData} height={260} />` 등

## 5. 영향 분석

**스토리 파일만 변경** — 컴포넌트 코드 변경 0
- ChartContainer.tsx 수정 없음
- consumer (platform / edge) 영향 없음
- ui chart cards 와 동일 recharts 패턴 — 일관

**번들 영향**: storybook only — production 번들 영향 0

**파일 줄수**: 현재 117 줄. 추가 helper / data → 약 +60 ~ -10 줄 = 약 170 줄 (200줄 limit 안)

## 6. 검증 절차

1. typecheck `npx tsc --noEmit`
2. ui storybook 시각 (양 mode):
   - "Default (height=260)" — LineChart 표시
   - "Sync state breakdown" — Stacked BarChart 표시 + legend
   - "Loading" — skeleton 표시 (chart 가려짐, 정상)
   - "Empty" — empty message 표시 (chart 가려짐, 정상)
   - "Custom height" 두 변형 — 다른 height LineChart
3. ui storybook tests `npm run test-storybook` — 102 tests pass
4. a11y panel — 양 mode "error" 위반 없음

## 7. 위험

- 낮음. story 파일만 변경. recharts 가 storybook 환경에서 동작 안 하는 경우는 다른 chart 스토리 (charts.stories.tsx) 가 이미 검증 — 위험 0
- 200 줄 limit 근접 — split 거리. 단 같은 파일 안 sample 데이터 + helper 가 자연스럽고 split 의도 약함

## 8. 후속

- 본 PR 의 SampleLineChart / SampleStackedBar 는 stories 안 helper. ChartContainer 스토리 *외* 에서 재사용 의도 없음
