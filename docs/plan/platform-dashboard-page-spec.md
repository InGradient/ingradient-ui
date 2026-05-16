# Platform Dashboard 페이지 — 완전 spec

> 목표 — platform 의 **Dashboard 페이지** (`/p/:projectId/dashboard` 또는 `/dashboard`) 를 storybook 에 1:1 시각 / 상호작용 재현. **Catalog stats view 에서 만든 부품 + mock 데이터 재활용**.

---

## 1. 페이지 entry & route

- 페이지: [pages/DashboardPage.tsx](../../workspace/projects/ingradient-platform/frontend/pages/DashboardPage.tsx) (53 lines) — 매우 간결한 페이지 컴포넌트
- 라우트: TopBar sidebar 의 "Dashboard" 항목

## 2. 페이지 레이아웃

```
┌────────────────────────────────────────────────────────────────┐
│ DashboardHeader                                                │
│ ┌── HeaderTop ─────────────────────────────────────────────────┐│
│ │ Title "Dashboard"             ProjectName (rightside)        ││
│ │ Subtitle "Watch project labeling status..."                  ││
│ └──────────────────────────────────────────────────────────────┘│
│ ┌── HeaderActions ─────────────────────────────────────────────┐│
│ │ {saveMessage} [Save PDF] [Customize ▾]                       ││
│ │                                                              ││
│ │ SettingsPopover (Customize 열림시) ↓                         ││
│ │   "Visible Sections" 헤더                                    ││
│ │   ☐ Data Collection                                          ││
│ │   ☐ Images Over Time                                         ││
│ │   ☐ Labeling Status                                          ││
│ │   ☐ Class Ratio                                              ││
│ │   ☐ Labeling by Person                                       ││
│ │   ☐ Defects by Source                                        ││
│ │   ☐ Pending vs Processed                                     ││
│ │   ☐ Dataset Distribution                                     ││
│ └──────────────────────────────────────────────────────────────┘│
│                                                                │
│ ┌── Content (state.reportRef, 캡처 대상) ──────────────────────┐│
│ │  ┌── DashboardOverviewPanel ───────────────────────────────┐ ││
│ │  │ ┌── PanelHeader ─────────────────────────────────────┐ │ ││
│ │  │ │ Title "Project Overview"      [Reset] [Date Range] │ │ ││
│ │  │ │ Hint "Current project stats · {date label}"        │ │ ││
│ │  │ │   ↓ DatePopover (date filter 열림 시)              │ │ ││
│ │  │ └────────────────────────────────────────────────────┘ │ ││
│ │  │ ┌── ProjectOverviewBody ─────────────────────────────┐ │ ││
│ │  │ │   AnalysisDashboard (드래그 가능 widget grid)      │ │ ││
│ │  │ │   ┌─Row 1: data_collection  │  timeline  │ ...    │ │ ││
│ │  │ │   ┌─Row 2: labeling_status  │  ...                │ │ ││
│ │  │ │   ┌─Row 3: defects_by_source                       │ │ ││
│ │  │ │   ┌─Row 4: dataset_distribution                    │ │ ││
│ │  │ │                                                     │ │ ││
│ │  │ │   Empty state: "Select a project to load…"          │ │ ││
│ │  │ │   Loading:    "Loading dashboard…"                  │ │ ││
│ │  │ │   Error:      "{errorMessage}"                      │ │ ││
│ │  │ │   No data:    "No dashboard data."                  │ │ ││
│ │  │ └─────────────────────────────────────────────────────┘ │ ││
│ │  └────────────────────────────────────────────────────────────┘ ││
│ │                                                                ││
│ │  (deflectometryEnabled 면 DeflectometryDashboardSection)       ││
│ │  (edge_analytics 있으면 EdgeAnalyticsSection)                  ││
│ └──────────────────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────────────┘
```

## 3. DashboardHeader

[DashboardHeader.tsx](../../workspace/projects/ingradient-platform/frontend/components/dashboard/DashboardHeader.tsx) (70 lines) + [.styles.tsx](../../workspace/projects/ingradient-platform/frontend/components/dashboard/DashboardHeader.styles.tsx) (86 lines)

### 3-1. Header (UiPageHeader)
- HeaderTop (flex space-between, items flex-start, gap 16, wrap):
  - 좌측 div: `<Title>Dashboard</Title>` + `<Subtitle>Watch project labeling status and dataset progress in one place.</Subtitle>` (subtitle margin-top 6)
  - 우측: `<HeaderProjectName>{projectName}</HeaderProjectName>` (font-size 18 weight 700 text-secondary, margin-left auto)

### 3-2. HeaderActions
- `display: flex, gap 10, padding 8 24, justify-content flex-end, data-report-hide`
- 내부:
  - `{saveMessage}` — `<HeaderMessage>` (font-size 12 text-soft) — 조건부
  - `<Button variant="secondary">Save PDF</Button>` — onSavePdf
  - `<Button variant="secondary">Customize</Button>` — settingsOpen 토글
  - `{settingsOpen && <SettingsPopover>}` — 절대 위치 right 0 top calc(100%+8)

### 3-3. SettingsPopover (MenuPopover 기반)
- width `min(320px, calc(100vw - 32px))`, padding 14, radius 16, z-index 20
- 본문:
  - `<SettingsTitle>Visible Sections</SettingsTitle>` (font-size 12 weight 700 text-soft uppercase letter-spacing 0.05em)
  - `<SettingsList>` (flex column gap 8)
    - 8 SettingsRow (label, items center, gap 10, font-size 13):
      - `<SettingsCheckbox>` (16x16 accent-color) + `<span>{label}</span>`

### 3-4. 8 widget toggle items
| key | label |
|---|---|
| `show_data_collection` | Data Collection |
| `show_timeline` | Images Over Time |
| `show_labeling_status` | Labeling Status |
| `show_class_ratio` | Class Ratio |
| `show_labeling_by_person` | Labeling by Person |
| `show_defects_by_source` | Defects by Source |
| `show_pending_processed` | Pending vs Processed |
| `show_dataset_distribution` | Dataset Distribution |

## 4. DashboardOverviewPanel

[DashboardOverviewPanel.tsx](../../workspace/projects/ingradient-platform/frontend/components/dashboard/DashboardOverviewPanel.tsx) (124 lines)

### 4-1. Panel
- `<Panel>` (border, radius, surface)
- PanelHeader (flex space-between):
  - PanelHeaderMain (좌측 column):
    - PanelTitle "Project Overview"
    - PanelHint "Current project stats · {date label}" 또는 "Select a project to load stats"
  - PanelHeaderActions (`ref`, `data-report-hide`):
    - `<OverviewResetButton>Reset</OverviewResetButton>` — layout reset
    - `<DateFilterButton>{date label}</DateFilterButton>` — date popover 토글
    - `{overviewDateOpen && <DatePopover>}`

### 4-2. DatePopover
- Header:
  - `<DatePopoverTitle>Overview Date Range</DatePopoverTitle>`
  - `<DatePopoverSubtitle>Filter all Project Overview widgets by created date.</DatePopoverSubtitle>`
- `<DatePresetRow>`: 3 buttons (Today / Last 7 days / This month)
- `<CalendarCard>`: react-day-picker DayPicker (mode range, 1 month)
- `<DateSummary>`: 선택된 date range 텍스트 ("All time" or "YYYY-MM-DD → YYYY-MM-DD")
- DatePopoverFooter:
  - `<SmallText>Saved per user and restored on next visit.</SmallText>`
  - DateFooterActions: [Reset] / `<Button variant="secondary">Apply</Button>`

### 4-3. ProjectOverviewBody states
| 상태 | 표시 |
|---|---|
| `!currentProjectId` | `<EmptyState>Select a project to load dashboard stats.</EmptyState>` |
| `isLoading` | `<EmptyState>Loading dashboard…</EmptyState>` |
| `errorMessage` | `<EmptyState>{errorMessage}</EmptyState>` |
| `analysisData` | `<AnalysisDashboard ...>` 본체 |
| 그 외 | `<EmptyState>No dashboard data.</EmptyState>` |

## 5. AnalysisDashboard (platform component, NOT same as Catalog 의 것)

[AnalysisDashboard.tsx](../../workspace/projects/ingradient-platform/frontend/components/analysis/AnalysisDashboard.tsx) (72 lines)

> ⚠️ **이름 겹침 주의** — Catalog Phase 4 에서 만든 `AnalysisDashboard` (ui 의 stats grid pattern) 와 platform 의 `AnalysisDashboard` 는 **이름만 같고 다른 컴포넌트**. platform 의 것은 **DnD 가능한 widget grid** + **edge/deflectometry section** 까지 포함.

구조:
- `<AnalysisDashboardGrid>` — 드래그 가능한 8 widget grid (DnD-kit)
- 조건부: `<DeflectometryDashboardSection>` (deflectometry 프로젝트일 때)
- 조건부: `<EdgeAnalyticsSection>` (edge_analytics 데이터 있을 때)

### 5-1. AnalysisDashboardGrid
[AnalysisDashboardGrid.tsx](../../workspace/projects/ingradient-platform/frontend/components/analysis/AnalysisDashboardGrid.tsx) (85 lines)

- DnD context (dnd-kit) — pointer collision
- WidgetRows (flex column)
- 각 WidgetRow: 옆으로 N 개 widget (`$count`)
- 각 WidgetShell:
  - `$dragging` state
  - `$dropTarget` state (before/after/below)
  - DropTargetControl × 2 (position before/after)
  - WidgetActions (`data-report-hide`):
    - Download button (PNG)
    - DragHandleControl
  - AnalysisWidgetRenderer

### 5-2. 8 widgets

#### 5-2-A. DataCollectionWidget — "Images by dataset"
[DataCollectionWidget.tsx](../../workspace/projects/ingradient-platform/frontend/components/analysis/widgets/DataCollectionWidget.tsx)
- `<BarChartCard>` (이미 ui 에 존재)
- xKey "name", series count
- headerExtra: "Total: {totalImages}" muted text

#### 5-2-B. TimelineWidget — "Images over time"
[TimelineWidget.tsx](../../workspace/projects/ingradient-platform/frontend/components/analysis/widgets/TimelineWidget.tsx)
- `<LineChartCard>` (이미 ui)
- xKey "label", series: total (accent) / labeled (#00b894) / unlabeled (#fdcb6e)
- headerExtra: "Granularity: Hourly|Daily" muted

#### 5-2-C. LabelingStatusWidget — "Labeled vs unlabeled"
[LabelingWidgets.tsx](../../workspace/projects/ingradient-platform/frontend/components/analysis/widgets/LabelingWidgets.tsx) 의 1번
- `<PieChartCard>` (innerRadius 0, outerRadius 92)
- headerExtra: HeaderStats (Labeled / Unlabeled / Total — 우측 정렬 강조)

#### 5-2-D. ClassRatioWidget — "Class distribution"
[ClassAndPeopleWidgets.tsx](../../workspace/projects/ingradient-platform/frontend/components/analysis/widgets/ClassAndPeopleWidgets.tsx) 의 1번
- `<BarChartCard layout="vertical">` (cell color from data)
- empty: "No classes or no labels yet."

#### 5-2-E. LabelingByPersonWidget — "Uploader activity"
- 2단 구조 (flex column gap 16):
  - `<BarChartCard>` (images vs labeled, dual series)
  - `<Card>` 안에 Table (uploader / images / labeled)
- empty: "No data."

#### 5-2-F. DefectsBySourceWidget — "Source breakdown"
[DistributionWidgets.tsx](../../workspace/projects/ingradient-platform/frontend/components/analysis/widgets/DistributionWidgets.tsx) 의 1번
- 각 source 별로 SourceBlock:
  - SourceChip (e.g. "Camera 10.0.0.1" 또는 "camera")
  - 좌: Table (Class / Count)
  - 우: 작은 BarChart (recharts 직접)

#### 5-2-G. PendingProcessedWidget — "Labeling progress"
[LabelingWidgets.tsx](../../workspace/projects/ingradient-platform/frontend/components/analysis/widgets/LabelingWidgets.tsx) 의 2번
- `<PieChartCard>` (innerRadius 56 = donut, outerRadius 100)
- headerExtra: "Pending / Processed" stats

#### 5-2-H. DatasetDistributionWidget — "Per-dataset class counts"
[DistributionWidgets.tsx](../../workspace/projects/ingradient-platform/frontend/components/analysis/widgets/DistributionWidgets.tsx) 의 2번
- 각 dataset 별로 DatasetBlock:
  - DatasetSectionTitle (dataset name)
  - Table (Class / Image count)
  - BarChart (class_counts)

### 5-3. EdgeAnalyticsSection (edge_analytics 데이터 있을 때만)
[EdgeAnalyticsSection.tsx](../../workspace/projects/ingradient-platform/frontend/components/analysis/EdgeAnalyticsSection.tsx) (82 lines)

- "Edge session summary" Card — StatRow (Capture/Labeling sessions, average durations)
- 추가 차트 (outcome ratios PieChart, step breakdown BarChart)

### 5-4. DeflectometryDashboardSection (deflectometry 프로젝트일 때만)
[DeflectometryDashboardSection.tsx](../../workspace/projects/ingradient-platform/frontend/components/analysis/DeflectometryDashboardSection.tsx) (61 lines)

- deflectometry 전용 차트 / stats

## 6. AnalysisOut 데이터 모델

```ts
type AnalysisOut = {
  total_images: number
  data_collection: Array<{ name: string; count: number }>
  timeline: { granularity: 'hour' | 'day'; data: Array<{ label, total, labeled, unlabeled }> }
  labeling_status: { labeled, unlabeled, labeled_pct }
  class_ratio: Array<{ name, count, ratio, color }>
  labeling_by_person: Array<{ uploader, image_count, labeled_count }>
  defects_by_source: Array<{ source, camera_ip?, defect_counts }>
  pending_processed: { pending, processed }
  dataset_distribution: Array<{ dataset_id, name, class_counts }>
  edge_analytics?: { summary, capture_duration, labeling_duration, outcome_ratios, step_breakdown }
}
```

## 7. DashboardPreferences 데이터 모델

```ts
type DashboardPreferences = {
  // 8 widget visibility
  show_data_collection: boolean
  show_timeline: boolean
  show_labeling_status: boolean
  show_class_ratio: boolean
  show_labeling_by_person: boolean
  show_defects_by_source: boolean
  show_pending_processed: boolean
  show_dataset_distribution: boolean
  // Date range
  overview_date_start: string | null  // ISO date
  overview_date_end: string | null
  // Layout
  analysis_widget_layout: Array<Array<DashboardAnalysisWidgetKey>>  // 2D rows
}
```

## 8. 인터랙션 매트릭스

| 동작 | 위치 | 결과 |
|---|---|---|
| Save PDF 클릭 | HeaderActions | `handleSavePdf()` — reportRef 캡처 → PDF 생성 |
| Customize 클릭 | HeaderActions | SettingsPopover 토글 |
| Checkbox 토글 | SettingsPopover | `handleTogglePreference(key, checked)` — widget visibility 즉시 적용 |
| Reset (layout) 클릭 | PanelHeaderActions | `handleResetOverviewLayout()` — DnD layout 초기화 |
| Date filter 클릭 | PanelHeaderActions | DatePopover 토글 |
| Today / Last 7 / This month | DatePopover | `handlePresetRange(preset)` — date range preset |
| DayPicker select | DatePopover | `setDateDraft(range)` |
| Reset (date) | DatePopover footer | `handleResetOverviewDates()` |
| Apply | DatePopover footer | `handleApplyOverviewDates()` — preferences 저장 |
| Widget drag | AnalysisDashboardGrid | `handleLayoutAnalysisWidgets(nextLayout)` |
| Widget download | WidgetActions | PNG 저장 |

## 9. 현 storybook 상태 — Gap

| 영역 | Storybook 현재 | platform | 차이 |
|---|---|---|---|
| Page 진입 story | **없음** | 풀 페이지 | 신규 |
| DashboardHeader pattern | 없음 | Title / Subtitle / Project / Actions / Popover | 신규 |
| DashboardOverviewPanel pattern | 없음 | Panel + Header + Date popover + Body | 신규 |
| Date popover | 없음 | DayPicker + presets + apply/reset | 신규 (DayPicker 의존) |
| AnalysisDashboard (widget grid) | Catalog 의 `AnalysisDashboard` 는 정적 stats grid — DnD 없음 | DnD-kit 기반 reorderable grid | **신규 pattern 필요** |
| 8 widgets | Catalog Phase 4 부품 일부 재활용 가능 | (자세히 §10) | 부분 재활용 |
| EdgeAnalyticsSection | 없음 | 세션 summary + 차트 | 신규 |
| DeflectometryDashboardSection | 없음 | deflectometry 차트 | 신규 |

## 10. Catalog 재활용 가능 자산

| Catalog 부품 (Phase 4) | Dashboard 재활용 |
|---|---|
| `AnalysisDashboard` (정적 stats grid) | ❌ — 이름 충돌 + DnD 없음. **별도 패턴 필요** |
| `DashboardWidget` (title/subtitle/actions/span wrapper) | ✅ widget shell 로 재사용 가능 |
| `LabelingProgressBar` | ✅ stats 모드에서 재사용 가능 |
| `DatasetDistributionHeatmap` | ⚠️ platform 은 table+chart 페어 — 별도 pattern 만들거나 reuse |
| `BarChartCard` / `LineChartCard` / `PieChartCard` (ui 기존) | ✅ 그대로 사용 |
| **Catalog mock-dashboard.ts**: `dashboardStats` / `dataCollectionData` / `timelineData` / `labelingStatusData` / `classRatioData` / `labelingByPersonData` / `defectsBySourceData` / `labelingProgress` / `datasetDistribution` | ✅ **대부분 그대로 재활용** (필요 시 필드명만 조정) |

## 11. Storybook reproduction scope

별도 URL/모달 아님 — Catalog/Class 처럼 **full page story**. `Pages/Platform/0.0.1/Dashboard`.

### 11-1. Scope IN
- DashboardHeader + Customize popover (8 checkboxes)
- DashboardOverviewPanel + Date popover (DayPicker)
- AnalysisDashboardGrid (drag 가능, layout state)
- 8 widgets (mock 차트 + table)

### 11-2. Scope OUT (다음 phase 후보)
- Real PDF capture (mock 만)
- Edge Analytics + Deflectometry section (별도 시나리오 / 후속 phase)
- Real preferences persistence

## 12. 변경 이력
- 2026-05-15: 초안 (Joon Ho Lee)
