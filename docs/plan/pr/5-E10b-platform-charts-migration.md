---
title: PR-E10b — platform storage-analytics 4 차트 ui card 마이그
date: 2026-05-11
parent: docs/plan/pr/5-E10-chart-cards-migration.md
scope: ingradient-platform
status: planning — 사용자 review 대기
---

# PR-E10b — platform storage-analytics charts 마이그

## 1. 목적

PR-E10a 에서 확장된 ui chart cards 를 platform 의 4 차트에 적용. raw recharts 직접 사용 → @ingradient/ui chart cards 사용.

**전제**: PR-E10a 가 `@ingradient/ui` 에 적용됨. platform 이 새 build 또는 sync-ui 로 최신 ui 를 참조해야 함 (구현 직전 확인).

## 2. 마이그 매핑

### 2.1 [TierChart.tsx](frontend/components/settings/storage-analytics/TierChart.tsx) (28줄 → ~12줄)

**현재**: vertical-layout BarChart + 단일 series `gb` + custom margin + Tooltip formatter

**ui 마이그**:
```tsx
import { BarChartCard } from '@ingradient/ui/components'

const chartData = data.tier_breakdown.map((t) => ({
  name: t.tier,
  gb: Number(bytesToGB(t.total_bytes).toFixed(2)),
}))

return loading || !data ? <SkeletonBlock $h={200} /> : (
  <BarChartCard
    title=""                                     // SectionTitle 이 외부에서 제공
    data={chartData}
    xKey="name"
    series={[{ key: 'gb', label: 'GB', color: 'var(--ig-color-accent)' }]}
    layout="vertical"
    height={180}
  />
)
```

**Issue**: ui BarChartCard 가 *title 필수* — SectionTitle 이 caller 외부 있어 title 비워야 함. 두 옵션:
- **옵션 A**: title prop optional 로 ui 수정 (PR-E10a 미세 추가) — title 안 주면 ChartTitle 안 렌더
- **옵션 B**: SectionTitle 을 ui card title 로 흡수 — `<StorageTierChart>` 가 자기 title 제공, 외부 SectionTitle 제거
- **옵션 C**: title 에 빈 문자열 ' ' — display 어색

→ **옵션 A 추천**. ui card 자연스러운 변경 (description 도 이미 optional). PR-E10a 보강 거리 1줄.

**Tooltip formatter `[${v} GB, 'Size']`**: ui 의 ChartTooltipContent 가 단위 표시 못 함. custom tooltip prop 사용:
```tsx
tooltipContent={<UnitTooltip unit=" GB" />}
```
또는 단위 없이 사용. 사용자 결정 — 기본은 단위 없음 (간소화).

### 2.2 [ProjectChart.tsx](frontend/components/settings/storage-analytics/ProjectChart.tsx) (33줄 → ~16줄)

**현재**: 스택 3-series BarChart (original/preview/thumb) + Legend wrapper + XAxis angle

**ui 마이그**:
```tsx
<BarChartCard
  title=""
  data={chartData}
  xKey="name"
  series={[
    { key: 'original', label: 'Original', color: 'var(--ig-color-accent)' },
    { key: 'preview', label: 'Preview', color: '#7cc576' },
    { key: 'thumb', label: 'Thumb', color: '#f0ad4e' },
  ]}
  stacked
  height={260}
/>
```

**Loss**: XAxis `angle={-20} textAnchor="end" height={50}` 는 ui card 가 노출 안 함. **option B**: long label 잘리는 문제는 platform 이 이미 line 12 에서 `name.length > 16 ? slice(0,15)+'…'` 처리 — 자동 절단 후 가로 표시. fallback 동작 OK.

만약 angle 필요 시 ui 에 `xAxisProps` 같은 escape hatch 추가 거리 (현재 PR scope 밖, 별도 PR).

### 2.3 [FormatChart.tsx](frontend/components/settings/storage-analytics/FormatChart.tsx) (31줄 → ~14줄)

**현재**: PieChart (innerRadius=0 = full pie) + custom label (entry name + pct)

**ui 마이그** (PR-E10a 의 `innerRadius`/`labelRender` 사용):
```tsx
<PieChartCard
  title=""
  data={chartData.map((d, i) => ({
    name: d.format,
    value: d.count,
    color: COLORS[i % COLORS.length],
  }))}
  innerRadius={0}
  outerRadius={70}
  labelRender={(entry, pct) => `${entry.name} ${(pct * 100).toFixed(1)}%`}
  height={200}
/>
```

**Tooltip formatter `[Number(v).toLocaleString(), 'Images']`**: ChartTooltipContent 기본은 단순 v + name. locale string 안 됨. 다음 옵션:
- ui ChartTooltipContent 가 `value.toLocaleString()` 사용하도록 수정 (전역 효과)
- 별도 PR

→ 본 PR 은 toLocaleString 손실 허용. ui 변경 별도.

### 2.4 [ResolutionChart.tsx](frontend/components/settings/storage-analytics/ResolutionChart.tsx) (23줄 → ~12줄)

**현재**: 단일 series vertical BarChart

**ui 마이그** — 가장 단순:
```tsx
<BarChartCard
  title=""
  data={data.resolution_distribution}
  xKey="bucket"
  series={[{ key: 'count', label: 'Images', color: '#8b7ed8' }]}
  height={200}
/>
```

## 3. PR-E10a 보강 거리 (본 PR 진행 전 적용)

본 PR 진행 직전 ui 에 1 추가 변경 필요:

**ChartContainer title 을 optional 로 변경**:
[chart-container.tsx](src/components/charts/chart-container.tsx):
```tsx
title?: string                                  // 필수 → optional
...
{title ? <ChartTitle>{title}</ChartTitle> : null}
```

세 카드 (BarChartCard / LineChartCard / PieChartCard) 의 title prop 도 동일 optional 적용.

→ 별도 commit `feat(charts): chart card title optional (PR-E10a 보강)` 으로 분리, PR-E10b 진행 전 ui 측 적용 + 빌드.

## 4. 양 repo 빌드 의존

platform 이 ui 의 새 API 사용하려면:
- ingradient-ui 에서 `npm run build:package` 실행 → `lib/` 갱신
- 또는 sync-ui.mjs (PR-D7) 실행 — dev 흐름
- platform 의 `node_modules/@ingradient/ui/lib` 가 최신 반영되어야 typecheck pass

본 PR 구현 절차에 빌드 단계 포함.

## 5. SkeletonBlock / ChartCard 처리

기존 `storage-analytics.styles.ts` 의 `ChartCard` (background/border/padding) 는 ui ChartContainer 의 `surfaceCard` recipe 와 동등. **제거 가능** — 단 platform 의 외부 chart 가 ChartCard 를 또 쓸 가능성:

```bash
grep -rn "ChartCard" frontend/components/
```

→ storage-analytics 안 4 chart 만 사용 (확인). 본 PR 에서 styled `ChartCard` 제거. `SkeletonBlock` 은 ui ChartContainer 의 `loading` 가 cover — caller 의 `if (loading || !data) return <SkeletonBlock>` 제거. `loading={loading}` + `data` (empty 면 ui 가 empty 처리) 로 일원화.

**문제**: ui ChartContainer 의 loading skeleton 모양이 SkeletonBlock 의 pulse animation 과 다름. 시각 변화 받아들임 (시각 일관 cross-app 이 본 PR 의도).

## 6. 변경 파일 list

| 파일 | 변경 |
|---|---|
| `TierChart.tsx` | recharts → BarChartCard. 외부 ChartCard wrap 제거. |
| `ProjectChart.tsx` | recharts → BarChartCard stacked. |
| `FormatChart.tsx` | recharts → PieChartCard with labelRender. |
| `ResolutionChart.tsx` | recharts → BarChartCard. |
| `storage-analytics.styles.ts` | `ChartCard` styled 제거 (사용처 0 후) + `SkeletonBlock` 유지 (Overview 가 사용) |
| `StorageAnalyticsTab.tsx` | 동일 (4 chart wrapper 그대로 호출) |

## 7. 영향 분석

**줄수 변화**:
- TierChart 28 → 12 (-16)
- ProjectChart 33 → 16 (-17)
- FormatChart 31 → 14 (-17)
- ResolutionChart 23 → 12 (-11)
- styles ChartCard 7줄 제거 (-7)
- 합 **약 -68줄**

**시각 변화**:
- background / border 가 ui ChartContainer 의 surfaceCard 로 통일 (현재 #1a1a1a → var(--ig-color-surface-raised))
- padding 16 → ui ChartContainer 의 padding-8 (~32px)
- skeleton 모양 변경 (pulse → ui Skeleton)
- Tooltip 스타일 통일 (현재 #1e1e1e 검정 → ui ChartTooltipContent)

→ 본 PR 의 *시각 일관* 의도와 정합. 단 UX 검토 spot-check 필요.

**기능 변화**:
- TierChart Tooltip 의 ` GB` 단위 손실 (별도 후속)
- FormatChart Tooltip 의 `toLocaleString` 손실 (별도 후속)
- ProjectChart XAxis angle 손실 (long label 시 절단으로 대체)

**recharts 의존**:
- 4 chart 가 recharts 직접 import 안 함 → platform package.json 에서 recharts 제거 가능? ingradient-ui 가 추이 의존 — confirm 필요. 본 PR scope 밖, 향후 정리

## 8. 검증 절차

1. ui (PR-E10a 보강 적용 후) `npm run build:package`
2. platform: ui package 새 lib 반영 (sync-ui 또는 reinstall)
3. platform typecheck: `npm run typecheck` (또는 빌드 명령)
4. platform 시각 spot-check: Settings → Storage Analytics (admin 전용) 4 차트 정상 렌더
5. 데이터 로딩 / 빈 데이터 / 에러 분기 동작

## 9. 위험

- 중간. ui card title optional 변경 (PR-E10a 보강) 이 기존 storybook 카드 영향 없는지 검증 필요 — 모두 title 전달이라 회귀 0 예상
- 시각 변화 (background / padding / skeleton) — *의도된 일관성*. 사용자 시각 OK 확인 필요

## 10. 후속

- PR-E10b 완료 후 → PR-E10c (edge 13 chart 마이그)
- 손실된 Tooltip 단위 / toLocaleString 거리 별도 PR (`tooltipContent` slot 사용)
