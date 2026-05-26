---
title: PR-E10 — Chart cards 양 repo 마이그 (gap 분석 + scope 결정)
date: 2026-05-11
parent: docs/plan/phase-5-components-audit.md
scope: ingradient-ui (foundation) + ingradient-platform / ingradient-edge (consumers)
status: planning — 사용자 review 대기 (scope 결정 필요)
---

# PR-E10 — Chart cards 양 repo 마이그

## 1. 의도 (audit plan 발췌)

ui 의 `BarChartCard / LineChartCard / PieChartCard / ChartContainer / ChartLegend` 가 양 repo 모두 *미사용* (직접 styled chart 작성). 마이그 시 -300+ 줄 + 시각 일관 cross-app.

## 2. 현황 inventory

### 2.1 ui chart cards (현재)

[bar-chart-card.tsx](src/components/charts/bar-chart-card.tsx) (44줄):
```ts
BarChartCard<T>({ title, description, data, series, xKey, height, loading })
```
- 항상 vertical (XAxis 하단)
- 단일 + 다중 series 지원 — **stackId 미지원** (병렬 표시만)
- 모든 row 같은 fill — **per-Cell coloring 미지원**
- radius `[8, 8, 4, 4]` 고정

[line-chart-card.tsx](src/components/charts/line-chart-card.tsx) (51줄):
```ts
LineChartCard<T>({ title, description, data, series, xKey, height, loading, onPointClick })
```
- 단일 Y-axis — **dual Y-axis 미지원**

[pie-chart-card.tsx](src/components/charts/pie-chart-card.tsx) (39줄):
```ts
PieChartCard({ title, description, data, height, loading })
```
- Donut 모양 고정 (innerRadius=60, outerRadius=90)
- 슬라이스 label 미표시

### 2.2 platform 사용처 (4 chart, 115줄)

| 파일 | 줄수 | recharts feature |
|---|---|---|
| TierChart | 28 | BarChart `layout="vertical"` (가로 막대) |
| ProjectChart | 33 | BarChart 3 series + `stackId` (스택 막대) + custom Legend wrapper |
| FormatChart | 31 | PieChart + custom slice label + outerRadius 70 (donut 아님) |
| ResolutionChart | 23 | BarChart vertical 단일 series (단순) |

### 2.3 edge 사용처 (4 파일, 438줄)

| 파일 | 줄수 | 차트 | recharts feature |
|---|---|---|---|
| ImageCharts | 68 | daily_captures BarChart + sync_status PieChart | per-Cell color, EmptyState branch |
| CameraCharts | 70 | exposure / gain BarChart + param_trends LineChart | LineChart **dual Y-axis** (`yAxisId`), 기타 단순 |
| LabelingCharts | 170 | 5 chart (trend stacked bar + 4 distribution) | `stackId`, per-Cell color, custom Tooltip, BarChart `layout="vertical"`, panel header 안 DropdownSelect, 동적 height |
| SessionCharts | 130 | 3 chart + table | per-Cell color, custom legend layout, custom tooltip formatter |

## 3. Gap 식별 — ui API 가 cover 못 하는 feature

| Feature | 현재 ui | 필요 사용처 |
|---|---|---|
| `layout="vertical"` (horizontal bar) | ❌ | TierChart, class_bbox_count, class_image_count, class_avg_size |
| `stackId` 스택 | ❌ | ProjectChart, class_labeling_trend |
| per-Cell color | ❌ | sync_status, class_bbox_count, class_image_count, outcomeRatios |
| dual Y-axis LineChart | ❌ | param_trends |
| Custom Pie size (donut/non-donut, radius) | ❌ | FormatChart, sync_status, outcomeRatios (다 다른 size) |
| Custom slice labels | ❌ | FormatChart |
| Custom tooltip 컴포넌트 | ❌ | class_labeling_trend (TrendTooltip), session formatter |
| Empty state branch | ✅ (empty prop) | 다수 |
| Dynamic height (data 길이 기반) | ❌ | class_bbox_count `Math.max(240, n*36)` |
| Panel header 안 control (DropdownSelect 등) | ❌ | class_labeling_trend |

## 4. 두 가지 접근

### 4.1 접근 A — ui 그대로 + "단순 케이스" 만 마이그

**적용 가능 차트**:
- platform: ResolutionChart 만 (-23 + alpha) — 4개 중 1개
- edge:
  - ImageCharts daily_captures (한 panel만 마이그, sync는 유지)
  - CameraCharts exposure_distribution + gain_distribution (param_trends 유지)
  - LabelingCharts bbox_per_image_distribution (1개)
  - SessionCharts captureByHour + deflectometry steps

**효과**:
- 마이그 ~7 차트 / 13 차트 = 50%
- 줄수 감소 약 -120~150줄 (원래 300+ 목표 대비 절반)
- 양 repo 안에 *2 가지 chart 패턴 혼재* (ui 사용 + raw recharts) — 시각 일관성 *부분 향상*만

**위험**: 낮음 (ui 변경 0, consumer 단순 wrap 만)

### 4.2 접근 B — ui chart cards 확장 → 풀 마이그

**ui 신규 props**:
- BarChartCard: `layout?: 'vertical'|'horizontal'` (default vertical), `stackId?: string` (per-series), `cellColors?: (row, idx) => string` 또는 series 별 `getColor`
- LineChartCard: `secondaryYAxis?: { keys: string[], orientation: 'left'|'right', tick?: ... }`
- PieChartCard: `innerRadius?`, `outerRadius?`, `paddingAngle?`, `labelRender?: (entry) => ReactNode`
- 모든 카드: `tooltipContent?: ReactNode` (custom tooltip 슬롯), `headerExtra?: ReactNode` (DropdownSelect 등)

**적용**:
- platform 4 차트 모두 ui 마이그 가능
- edge 13 차트 중 11~12 가능 (LabelingCharts trend 의 dynamic class series 는 caller 가 series prop 동적 생성으로 cover)

**효과**:
- 줄수 감소 -300+ 줄 양 repo (audit 원래 추정 달성)
- 시각 일관 cross-app
- ui chart API 가 강해짐 → 향후 다른 chart 마이그 거리에도 효과

**위험**:
- **중간**. ui 카드 props 가 6~10개 추가 — D-007 governance "props ≤ 5" 와 tension. 단 chart 도메인은 *config-rich* 자연스러운 영역이라 일부 예외 인정 거리
- recharts 옵션 매핑 코드 약 +120줄 ui (저 비용. consumer 마이그 후 -300+ 가 압도)
- migration 작업량 ~13 차트 → 2~3 일

### 4.3 접근 C — 양 단계 PR

**PR-E10a**: ui chart cards 확장 (Group: BarChart `layout`/`stackId`/cellColors, LineChart `secondaryYAxis`, PieChart radius/`labelRender`, 공통 `tooltipContent`/`headerExtra`)
- ui 변경만. consumer 0 영향. story 갱신 + a11y check.

**PR-E10b**: platform storage-analytics 4 차트 마이그 (-115 줄)

**PR-E10c**: edge stats 13 차트 마이그 (-300+ 줄)

→ 각 단계 검증 가능 + risk 분산. 추천.

## 5. scope 결정 의제

다음 중 선택 필요:

1. **접근 A** — 단순 케이스만 (작은 PR, 효과 절반)
2. **접근 B** — 확장 + 풀 마이그 (한 큰 PR, 효과 큼)
3. **접근 C 추천** — 3 sub-PR 로 분리 (관리 + 검증 용이)
4. 본 PR 보류 → 다른 PR 우선 (E1 / E13 등)

선택에 따라 PR-E10 sub-plan (E10a / E10b / E10c) 작성 후 진행.

## 6. governance 검토

D-007 ("도메인 무관 + 재사용 가능성 + props ≤ 5"):
- chart 카드는 *generic 시각화* 도메인 무관 — ✅
- 재사용 가능성: 양 repo + 향후 다른 화면 — ✅
- props ≤ 5: 현재 cards 가 6~7 props. 확장 시 10~12. **chart 도메인 예외 인정 거리** (recharts 자체가 config-rich)

D-016 (storybook 의무): 확장 시 모든 신규 prop variant 스토리 추가

## 7. 추정 일정

| 옵션 | 작업 | 기간 |
|---|---|---|
| A | consumer 단순 wrap만 | 0.5 일 |
| B | 한 PR 안 모두 | 2~3 일 |
| C | E10a (1 일) + E10b (0.5 일) + E10c (1.5 일) | 3 일 (3 PR 분산) |

## 8. 다음 단계

사용자가 위 4 옵션 중 선택 후 → 해당 sub-plan 작성 → 구현
