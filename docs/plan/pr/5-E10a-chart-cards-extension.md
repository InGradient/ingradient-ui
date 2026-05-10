---
title: PR-E10a — ui chart cards 확장 (BarChart layout/stackId/cellColors, LineChart dual-Y, PieChart radius/labels, 공통 tooltip/header)
date: 2026-05-11
parent: docs/plan/pr/5-E10-chart-cards-migration.md
scope: ingradient-ui
status: planning — 사용자 review 대기
---

# PR-E10a — ui chart cards 확장

## 1. 목적

PR-E10 의 3 sub-PR 중 첫 번째. ui chart cards 가 양 repo consumer charts 의 feature 를 cover 하도록 확장. **consumer 코드 변경 0** — ui 만 확장.

## 2. 추가 API 정의

### 2.1 BarChartCard 확장 props (3 신규)

```ts
export function BarChartCard<T>({
  title, description, data, series, xKey,
  height = 260, loading = false,
  // 신규 ↓
  layout = 'horizontal',           // 'horizontal' (default) or 'vertical'
  stacked = false,                  // true 시 모든 series 가 stackId='a' 로 stack
  getCellColor,                     // optional: (datum, index) => string — row 별 색상
  tooltipContent,                   // optional: ReactNode — custom tooltip
  headerExtra,                      // optional: ReactNode — header right slot
}: {
  ...
  layout?: 'horizontal' | 'vertical'
  stacked?: boolean
  getCellColor?: (datum: T, index: number) => string
  tooltipContent?: React.ReactNode
  headerExtra?: React.ReactNode
})
```

**recharts 매핑**:
- `layout="vertical"` → `<RechartsBarChart layout="vertical">` + XAxis type="number" + YAxis type="category" dataKey={xKey}
- `stacked` → 모든 `<Bar stackId="a" ...>`
- `getCellColor` 가 있고 series.length === 1 일 때 → `<Bar>` 안에 `<Cell fill={getCellColor(d,i)}>` 매핑 (다중 series + cell color 동시는 일반적이지 않으므로 단일 series 한정)
- `tooltipContent` → `<Tooltip content={tooltipContent ?? <ChartTooltipContent />}>`
- `headerExtra` → ChartContainer 의 legend slot 옆 (또는 새 slot) 으로 전달

**radius**: horizontal layout 시 `[8, 8, 4, 4]` → vertical layout 시 `[0, 4, 4, 0]` 자동 적용 (rendering 의도 맞춤)

### 2.2 LineChartCard 확장 props (3 신규)

```ts
{
  title, description, data, series, xKey, height, loading, onPointClick,
  // 신규 ↓
  secondaryAxisKeys?: string[]      // series.key 중 이 항목들은 right Y-axis 사용
  tooltipContent?: React.ReactNode
  headerExtra?: React.ReactNode
}
```

**recharts 매핑**:
- `secondaryAxisKeys` 가 있으면 두 개 `<YAxis yAxisId="left">` + `<YAxis yAxisId="right" orientation="right">` 렌더. `<Line>` 마다 secondaryAxisKeys.includes(item.key) ? yAxisId="right" : "left"

### 2.3 PieChartCard 확장 props (3 신규)

```ts
{
  title, description, data, height, loading,
  // 신규 ↓
  innerRadius?: number              // default 60 (donut). 0 → full pie
  outerRadius?: number              // default 90
  paddingAngle?: number             // default 3
  labelRender?: (entry: PieDatum, pctValue: number) => React.ReactNode  // optional slice label
  tooltipContent?: React.ReactNode
  headerExtra?: React.ReactNode
}
```

**recharts 매핑**:
- innerRadius / outerRadius / paddingAngle → `<Pie>` 직접 prop
- labelRender → `<Pie label={({entry}) => labelRender(entry, pct)}>` 매핑. pct 는 dataset total 대비 entry.value 비율

### 2.4 ChartContainer 확장 (1 신규 slot)

```ts
{
  ..., legend, children,
  headerExtra?: React.ReactNode    // 신규. legend 와 같은 row, legend 왼쪽
}
```

[chart-container.tsx](src/components/charts/chart-container.tsx) ChartHead 안에 headerExtra 추가:
```tsx
<ChartHead>
  <ChartCopy>...</ChartCopy>
  <ChartActions>
    {headerExtra}
    {legend}
  </ChartActions>
</ChartHead>
```

(headerExtra 와 legend 둘 다 right-align 영역에 표시. 보통 caller 가 하나만 사용)

## 3. 변경 파일 list

| 파일 | 변경 |
|---|---|
| [bar-chart-card.tsx](src/components/charts/bar-chart-card.tsx) | layout/stacked/getCellColor/tooltipContent/headerExtra 추가 |
| [line-chart-card.tsx](src/components/charts/line-chart-card.tsx) | secondaryAxisKeys/tooltipContent/headerExtra 추가 |
| [pie-chart-card.tsx](src/components/charts/pie-chart-card.tsx) | innerRadius/outerRadius/paddingAngle/labelRender/tooltipContent/headerExtra 추가 |
| [chart-container.tsx](src/components/charts/chart-container.tsx) | headerExtra slot |
| `charts.stories.tsx` | 신규 variant 스토리 (vertical bar / stacked bar / dual-Y line / non-donut pie / labeled pie / header dropdown 등) |
| `chart-container.stories.tsx` (PR-E0a 에서 갱신됨) | headerExtra 데모 1 카드 추가 |

## 4. governance 검토

D-007 ("props ≤ 5"):
- **현재 카드 별 props ~7개** (`title/description/data/series/xKey/height/loading`)
- **확장 후 ~12개** — props 가 6개 이상이지만 chart 도메인은 *config-rich* 자연스러움. recharts 자체가 30+ props
- 모든 신규 props 가 **optional + sensible default** — caller burden 없음
- **MASTER-PLAN § 6 D-007 보강 1줄**: "chart 도메인은 config-rich 예외 — recharts API 노출이 자연스러움"

D-016 (storybook 의무):
- charts.stories.tsx 에 신규 variant 추가 (vertical / stacked / per-Cell color / dual-Y / Pie radius / Pie labels / header extra) — 6~8 신규 카드
- a11y 'error' pass 양 mode

## 5. 영향 분석

**ui 단**:
- 모든 신규 props optional + default 값 = 기존 동작 변경 0
- 기존 caller (charts.stories.tsx Review / States, chart-container.stories.tsx) — 변경 0

**consumer**:
- 본 PR 에서는 consumer 변경 0
- 후속 PR-E10b/E10c 에서 caller 가 새 prop 활용 마이그

**번들 영향**:
- recharts 가 이미 의존성 — 신규 추가 0
- ui card 코드 약 +120줄 양 (3 card 분산)

## 6. 검증 절차

1. typecheck `npx tsc --noEmit`
2. ui storybook 시각 (양 mode):
   - 기존 카드 동작 동일 (회귀 0)
   - 신규 variant 카드 모두 정상 렌더
   - a11y panel "error" 위반 없음
3. ui storybook tests `npm run test-storybook` — 신규 카드 pass
4. consumer (platform/edge) 빌드 spot-check (ui card import 명세 그대로 — 영향 없어야 함)

## 7. 위험

- 낮음. ui 만 확장 + 기존 default 보존
- 잠재: `getCellColor` 가 series 1개 + Bar 1개일 때만 동작 — 다중 series 와 동시 사용 시 무시. 문서화 명시

## 8. 일정

추정 ~1 일. 카드 별 약 30~50줄 + 스토리 갱신.

## 9. 후속 PR

- **PR-E10b**: platform storage-analytics 4 차트 마이그 (TierChart / ProjectChart / FormatChart / ResolutionChart)
- **PR-E10c**: edge stats 13 차트 마이그 (ImageCharts / CameraCharts / LabelingCharts / SessionCharts)

각 sub-PR 진행 시 별도 plan 작성.
