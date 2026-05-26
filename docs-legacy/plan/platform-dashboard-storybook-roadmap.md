# Platform Dashboard 페이지 — storybook 재현 로드맵

> 기반: [platform-dashboard-page-spec.md](./platform-dashboard-page-spec.md). **Catalog Phase 4 의 차트·widget 부품 + mock 데이터 재활용** 으로 가장 작은 규모. 5 phase.

## 원칙

1. UI 부품은 ingradient-ui 의 정식 pattern / component 로 추가.
2. **Catalog 재활용 우선** — Catalog 의 `mock-dashboard.ts` (9 datasets) 는 그대로 재사용. 차트 컴포넌트 (`BarChartCard` / `LineChartCard` / `PieChartCard`) 그대로.
3. 각 신규 pattern 200줄 미만 + `*.stories.tsx` 동반.
4. Dashboard story 는 얇은 orchestrator — UI 본체는 ui pattern, mock state 는 `useDashboardScene` hook.
5. 매 phase 끝 typecheck + build + playwright probe 통과.

## Phase 의존 관계

```
Phase 1 (DashboardHeader + Customize popover)
   └→ Phase 2 (DashboardOverviewPanel + Date popover with DayPicker)
        └→ Phase 3 (AnalysisDashboardGrid — DnD widget grid)
             └→ Phase 4 (8 widgets — Catalog mock 데이터 매핑 + widget-specific 부품)
                  └→ Phase 5 (Page orchestrator + 시나리오 + polish)
```

각 phase 끝에 결과물 = ingradient-ui 의 신규 pattern + story + scenario.

---

## Phase 1 — DashboardHeader + Customize popover [S]

**목적**: 페이지 헤더 + 8 widget visibility 토글 popover.

### 1-1. 신규 ingradient-ui pattern
- `src/patterns/shells/dashboard-header.tsx` — DashboardHeader (Title + Subtitle + ProjectName + Actions[saveMessage + 2 Buttons])
- `src/patterns/shells/dashboard-customize-popover.tsx` — DashboardCustomizePopover (MenuPopover 기반, Title + Checkbox 리스트, generic items API)

### 1-2. 검증
- 각 pattern 의 stories: default / popoverOpen / saveMessage 표시 / projectName 없음 / 8 toggle 다양한 체크 상태

---

## Phase 2 — DashboardOverviewPanel + Date popover [M]

**목적**: Panel + 헤더 (Title/Hint/Reset/DateFilter) + DatePopover (DayPicker + presets + apply/reset).

### 2-1. 신규 ingradient-ui pattern
- `src/patterns/shells/dashboard-date-range-popover.tsx` — DashboardDateRangePopover (DayPicker mode=range + 3 preset buttons + DateSummary + apply/reset)
- `src/patterns/shells/dashboard-overview-panel.tsx` — DashboardOverviewPanel (Panel + PanelHeader[title/hint + actions] + Body slot)

### 2-2. 의존성
- `react-day-picker` — 이미 platform 에서 사용중. ui 에 없으면 add. (Catalog story 에서도 DatePickerField 가 있으니 확인)

### 2-3. 검증
- DateRangePopover: empty / applied range / preset / reset
- OverviewPanel: 4 body states (no-project / loading / error / data)

---

## Phase 3 — AnalysisDashboardGrid (DnD widget grid) [M]

**목적**: 드래그 가능한 widget grid (DnD-kit 기반). reorderable.

### 3-1. 신규 ingradient-ui pattern
- `src/patterns/shells/analysis-widget-grid.tsx` — AnalysisWidgetGrid (DnD context + WidgetRows + WidgetShell + drag handle + download action) — **이름 다르게** (Catalog 의 AnalysisDashboard 와 구분)
- `src/patterns/shells/analysis-widget-shell.tsx` — AnalysisWidgetShell (개별 widget wrapper, drag/drop state + 액션 슬롯)

### 3-2. 의존성
- `@dnd-kit/core` — 이미 platform 사용. ui 에 추가 필요 시 dep 추가.
- 또는 **DnD 생략** 옵션: 정적 grid 만 만들고 reorder 는 platform 마이그레이션 시 wrap. **스토리북에서는 시각만 보이면 충분** → 단순 grid 로 빠르게 진행 권장.

### 3-3. Layout 데이터 모델
```ts
type WidgetLayout = Array<Array<string>>  // rows of widget keys
type WidgetVisibility = Record<string, boolean>
```

### 3-4. 검증
- 1-row / 2-row / 3-row layouts
- visibility 토글로 widget 숨김 / 표시
- (선택) drag interaction

---

## Phase 4 — 8 widgets — Catalog mock 매핑 [M]

**목적**: 8개 widget pattern 만들기. 일부는 ui 기존 차트 + headerExtra props 로 충분.

### 4-1. 신규 ingradient-ui pattern (필요한 것만)
- 대부분 BarChartCard / LineChartCard / PieChartCard 의 `headerExtra` 슬롯으로 표현 가능 → 별도 pattern 안 만듦
- 신규 필요:
  - `src/patterns/shells/dashboard-stats-header.tsx` — HeaderStats (label/value pair list, 우측 정렬)
  - `src/patterns/shells/source-breakdown-widget.tsx` — SourceBreakdownWidget (SourceChip + Table + 작은 BarChart)
  - `src/patterns/shells/per-dataset-distribution-widget.tsx` — PerDatasetDistributionWidget (DatasetBlock × N: title + Table + BarChart)

### 4-2. 위젯별 mapping
| Widget | ui 부품 | 신규 |
|---|---|---|
| Data Collection | `BarChartCard` + headerExtra("Total: N") | (dashboard-stats-header) |
| Timeline | `LineChartCard` + headerExtra("Granularity: Daily") | (dashboard-stats-header) |
| Labeling Status | `PieChartCard` + headerExtra(3 stats) | dashboard-stats-header |
| Class Ratio | `BarChartCard layout="vertical"` + getCellColor | — |
| Labeling by Person | `BarChartCard` + Table (2-stack) | dashboard-stats-header |
| **Defects by Source** | (커스텀: source 별 SourceBlock) | **source-breakdown-widget** |
| Pending vs Processed | `PieChartCard` (donut innerRadius=56) | dashboard-stats-header |
| **Dataset Distribution** | (커스텀: dataset 별 DatasetBlock) | **per-dataset-distribution-widget** |

### 4-3. Catalog mock-dashboard.ts 재활용
- 위치 이동: `stories/fixtures/platform/0.0.1/dashboard-analysis.ts` 로 복사 + Dashboard 전용 mock 추가 (granularity / source breakdown / dataset distribution / edge analytics 등)
- Catalog 의 mock 도 그대로 유지

### 4-4. 검증
- 각 widget 의 stories (default / empty / loading)
- mock 데이터 시각 정상 표시

---

## Phase 5 — Page orchestrator + scenarios + polish [M]

**목적**: 모든 부품 wire — Catalog story 와 동일한 구조.

### 5-1. 신규 / 수정 파일
- `stories/pages/platform/0.0.1/dashboard/use-dashboard-scene.ts` — useDashboardScene mock state hook
- `stories/fixtures/platform/0.0.1/dashboard-analysis.ts` — full AnalysisOut mock + preferences + layout
- `stories/fixtures/platform/0.0.1/dashboard-scenarios.ts` — 15+ scenarios
- `stories/pages/platform/0.0.1/Dashboard.stories.tsx` — orchestrator

### 5-2. 시나리오 후보 (15+)
**Priority 1**:
- `default` — 8 widgets all visible
- `no-project` — empty state
- `loading` — loading state
- `error` — error state
- `no-data` — empty AnalysisOut
- `customize-open` — Customize popover 열림
- `date-range-open` — Date popover 열림

**Priority 2**:
- `subset-widgets` — 4 widgets 만 visible
- `layout-2-rows` — custom layout
- `layout-3-rows`
- `save-message` — "PDF saved"

**Priority 3**:
- `with-edge-analytics` — edge_analytics 포함
- `deflectometry-project` — deflectometry section
- `long-uploader-names` — overflow
- `empty-individual-widgets` — 일부 widget 빈 데이터

### 5-3. Polish
- header padding / actions 정렬
- popover 그림자
- widget shell spacing
- empty state typography 매칭

### 5-4. 검증
- 15+ stories 정상 렌더
- console error 0
- 핵심 interaction: tab visibility 토글 / date popover / drag (선택)

---

## Cross-cutting

매 phase:
1. typecheck — `npx tsc --noEmit -p tsconfig.json`
2. build — `npm run build:storybook`
3. probe — playwright 신규 story id 정상 렌더 + console error 0
4. barrel — `src/patterns/index.ts`

커밋 한국어, feat: / refactor: 접두사.

---

## 신규 file 누적 추정

### Patterns (ingradient-ui)
- Phase 1: 2 patterns (header + customize popover)
- Phase 2: 2 patterns (date popover + overview panel)
- Phase 3: 2 patterns (grid + widget shell)
- Phase 4: 3 patterns (stats header + source-breakdown-widget + per-dataset-distribution-widget)

**합계: 9 신규 patterns + 9 stories (18 신규 파일)**

### Fixtures (storybook)
- dashboard-analysis.ts + dashboard-scenarios.ts (2 파일)

### Story side
- use-dashboard-scene.ts + Dashboard.stories.tsx (2 파일)

---

## Catalog 부품 재활용 인벤토리

| 파일 | 재사용 형태 |
|---|---|
| Catalog 의 `mock-dashboard.ts` 9 datasets | Dashboard 의 fixture 로 복사 + 추가 필드 |
| `BarChartCard`, `LineChartCard`, `PieChartCard` | 그대로 사용 |
| `DashboardWidget` (title/subtitle/span wrapper) | `AnalysisWidgetShell` 의 기반으로 reuse 가능 |
| `LabelingProgressBar` | Pending vs Processed widget 의 대안으로 옵션 사용 |

---

## Gaps — 추후 platform 마이그레이션 시 작업

- `useDashboardPageState()` (preferences debounce / mutation) — platform 유지
- `useAnalysisWidgets()` (data → widget components) — platform 유지
- DnD-kit 실제 reorder logic — phase 3 에서 storybook 측에서도 작동시킬지 결정
- `downloadCaptureAsPng()` (html2canvas) — storybook 에서는 mock
- `handleSavePdf()` PDF 생성 — storybook 에서는 mock

---

## 변경 이력
- 2026-05-15: 초안 (Joon Ho Lee)
