---
title: PR-E10c — edge stats 13 차트 ui card 마이그
date: 2026-05-11
parent: docs/plan/pr/5-E10-chart-cards-migration.md
scope: ingradient-edge
status: planning — 사용자 review 대기
---

# PR-E10c — edge stats charts 마이그

## 1. 목적

PR-E10a 확장된 ui chart cards 를 edge stats 4 파일 (ImageCharts / CameraCharts / LabelingCharts / SessionCharts) 의 13 chart 인스턴스에 적용.

## 2. 마이그 범위 — chart 만, stat card / table 은 skip

edge stats 4 파일에는 chart 외에 stat card / table 도 포함:
- SessionCharts.durationSummary: 3x2 stat card grid — **chart 아님**. skip
- SessionCharts.workerStats: Table — **chart 아님**. skip

**마이그 대상**:

| 파일 | chart 인스턴스 | 패턴 |
|---|---|---|
| ImageCharts (68) | daily_captures BarChart | 단일 series + EmptyState |
| ImageCharts | sync_status PieChart | per-Cell color (SYNC_COLORS) |
| CameraCharts (70) | exposure_distribution BarChart | 단일 + EmptyState |
| CameraCharts | gain_distribution BarChart | 단일 + EmptyState |
| CameraCharts | param_trends LineChart | **dual-Y axis (yAxisId left/right)** + X tickFormatter |
| LabelingCharts (170) | class_labeling_trend stacked BarChart | stackId + **panel header DropdownSelect** + **custom TrendTooltip** (value>0 filter) + dynamic series |
| LabelingCharts | class_bbox_count BarChart | **layout="vertical"** + **per-Cell color** + **dynamic height** (n*36) |
| LabelingCharts | class_image_count BarChart | 동일 (vertical + cell + dynamic height) |
| LabelingCharts | bbox_per_image_distribution BarChart | 단일 |
| LabelingCharts | class_avg_size BarChart | **layout="vertical"** + 2 series (avg_w + avg_h) + **dynamic height** + custom tooltip formatter (.toFixed(1) + Width/Height label) |
| SessionCharts (130) | countsByHour BarChart | 단일 |
| SessionCharts | outcomeRatios PieChart | per-Cell color + **현재 side-legend layout — header legend 로 변경 (시각 변화 받아들임)** |
| SessionCharts | stepBreakdown BarChart | 단일 + **custom formatMs tooltip** |

→ 13 chart 마이그.

## 3. 핵심 마이그 패턴

### 3.1 Panel + PanelTitle + EmptyState 제거

현재:
```tsx
<Panel>
  <PanelTitle>{t('statics.title')}</PanelTitle>
  {hasData ? <ResponsiveContainer>...</ResponsiveContainer> : <EmptyState>...</EmptyState>}
</Panel>
```

마이그:
```tsx
<BarChartCard
  title={t('statics.title')}
  data={data}
  xKey="..."
  series={[...]}
  empty={...}             // 또는 ui 가 !data.length 자동 처리
  emptyMessage={t('statics.noData')}
  height={240}
/>
```

ChartContainer 가 *empty 자동 처리*: BarChartCard 가 `empty={!data.length}` 로 ChartContainer 에 전달. 단 *명시적 emptyMessage* 가 필요한 경우 prop 전달.

### 3.2 dynamic height

```tsx
height={Math.max(240, data.class_bbox_counts.length * 36)}
```
ui card 가 `height` prop 수용 — 그대로 적용.

### 3.3 per-Cell color (Pie + Bar)

**Pie**: `PieDatum.color` field 사용 (PR-E10a 이전부터 지원)
```tsx
data={data.map((d) => ({ name: d.label, value: d.count, color: SYNC_COLORS[...] }))}
```

**Bar (단일 series)**: PR-E10a 의 `getCellColor`
```tsx
<BarChartCard
  series={[{ key: 'count', label: 'Count' }]}
  getCellColor={(d) => d.color}
  ...
/>
```

### 3.4 dual-Y axis

PR-E10a 의 `secondaryAxisKeys` 사용:
```tsx
<LineChartCard
  data={transformedData}                  // ts 가 'MM-ddTHH:mm' 형태로 미리 변환
  xKey="ts"
  series={[
    { key: 'exposure', label: 'Exposure (μs)', color: CHART_WARNING },
    { key: 'gain', label: 'Gain', color: CHART_PURPLE },
  ]}
  secondaryAxisKeys={['gain']}
  height={260}
/>
```

X tickFormatter 손실 → caller 가 *data 변환* 으로 cover (캡쳐 시점 문자열을 미리 slice).

### 3.5 panel header DropdownSelect (LabelingCharts trend)

PR-E10a 의 `headerExtra`:
```tsx
<BarChartCard
  title={t('statics.classLabelingTrend')}
  headerExtra={
    <div style={{ width: 180 }}>
      <DropdownSelect value={trendMode} options={...} onChange={...} />
    </div>
  }
  data={trendData}
  xKey="label"
  series={visibleTrendClasses.map((c) => ({ key: c.class_id, label: c.class_name, color: c.color }))}
  stacked
  tooltipContent={<TrendTooltip />}
  height={280}
/>
```

### 3.6 custom tooltip

각 파일 안에 local Tooltip helper 정의 후 `tooltipContent={<MyTooltip ... />}`:

```tsx
// LabelingCharts.tsx 의 TrendTooltip — 이미 존재. 그대로 사용
// CameraCharts param_trends — Tooltip labelFormatter slice — caller 가 X data 미리 변환으로 cover
// SessionCharts stepBreakdown — formatMs — local FormatMsTooltip helper
// LabelingCharts class_avg_size — formatter `[${v.toFixed(1)}px, 'Width'/'Height']` — local helper
```

### 3.7 outcomeRatios side-legend → header legend (시각 변화)

현재 SessionCharts.outcomeRatios 가 `<OutcomeLayout>` grid 2 col 로 pie 왼쪽 + legend 오른쪽 표시. PieChartCard 는 header 안 legend.

→ 시각 변화 받아들임. side legend 가 필요한 경우 별도 컴포넌트 후속.

## 4. 변경 파일 list

| 파일 | 변경 |
|---|---|
| `ImageCharts.tsx` | recharts → BarChartCard + PieChartCard. Panel/PanelTitle/EmptyState/SYNC_COLORS 매핑 |
| `CameraCharts.tsx` | recharts → 2 BarChartCard + LineChartCard (dual-Y). param_trends 데이터 사전 변환 |
| `LabelingCharts.tsx` | recharts → 5 BarChartCard. TrendTooltip 유지, header DropdownSelect 사용 |
| `SessionCharts.tsx` | recharts → 2 BarChartCard + PieChartCard. durationSummary/workerStats Panel 부분은 그대로 유지 (stat card / table) |
| `StaticsView.styles.ts` | Panel/PanelTitle 사용처가 SessionCharts durationSummary/workerStats 외 모두 사라지면 일부 styled 제거 (별도 PR 검토) |

## 5. 영향 분석

**줄수 변화**:
- ImageCharts 68 → ~40 (-28)
- CameraCharts 70 → ~50 (-20). param_trends 가 dual-Y + tickFormatter 변환 코드 추가
- LabelingCharts 170 → ~120 (-50). 5 chart 압축
- SessionCharts 130 → ~95 (-35). 3 chart 마이그 + 2 panel 유지
- 합 **약 -130 ~ -150줄 edge**

**시각 변화**:
- Panel 색상 → ChartContainer surfaceCard (양 모두 dark surface, 색감 미세 차이)
- Tooltip 스타일 → ui ChartTooltipContent (custom 은 별도 보존)
- outcomeRatios legend layout 변경 (side → header)
- skeleton 모양 (현재 loading 처리 없음 — empty 만, ui card 와 동일)

**기능 변화**:
- param_trends Tooltip 의 `labelFormatter (date slice + replace T)` 손실 → tooltipContent 로 별도 보존 가능 (선택)
- class_avg_size Tooltip formatter `.toFixed(1) + Width/Height` → local tooltip helper 로 보존

## 6. 기술 위험

| 위험 | 대응 |
|---|---|
| ui chart card 가 `<Cell>` 사용 시 stacked bar 와 호환 | series.length === 1 한정 — class_bbox_count 등 단일이라 안전 |
| LineChartCard dual-Y 가 ui 에서 storybook a11y test pass | PR-E10a Variants story 이미 카드 추가 (PR-E10a commit 에 포함). spot-check |
| Recharts legend 충돌 (ChartContainer 의 ChartLegend + Recharts Legend) | 기존 ui card 가 `<Legend content={() => null}>` 로 disable. 회귀 없음 |
| TrendTooltip 가 recharts 의 payload typing 과 정합 | 기존 LabelingCharts 에서 동작 중. import 만 분리 |

## 7. 검증 절차

1. edge typecheck: `npm run typecheck` (또는 빌드)
2. edge dev (Electron): Statistics 화면 4 section 모두 정상 렌더
3. 데이터 분기: 데이터 0 / sparse / overloaded 각각 시각 확인
4. 인터랙션: LabelingCharts trend 의 DropdownSelect 토글 → trendData 갱신
5. param_trends Tooltip: hover 시 dual-Y 값 표시

## 8. 일정

추정 1.5~2 일 (13 chart). chart 별 약 15분 + 검증 30분.

## 9. 후속

- 손실된 Tooltip 단위 / locale / tickFormatter 거리 → ui card 에 더 많은 escape hatch (`xAxisFormatter` 등) 추가 별도 PR 거리
- outcomeRatios side-legend 패턴 — 새 ui 컴포넌트 `<PieWithSideLegend>` 후보 (또는 caller 가 직접 layout 으로 처리)
