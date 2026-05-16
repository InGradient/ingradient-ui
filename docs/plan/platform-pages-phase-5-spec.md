---
title: Phase 5 — Dashboard 추출
purpose: storybook 의 DashboardScene JSX 를 @ingradient/platform-pages/dashboard 로 추출. 15 scenario story 를 view import 기반으로 rewrite
audience: ingradient-ui contributor
date: 2026-05-15
status: draft
related:
  - ./platform-pages-extraction-roadmap.md
  - ./platform-pages-phase-4-spec.md
---

# Phase 5 — Dashboard 추출

> Roadmap: [platform-pages-extraction-roadmap.md](./platform-pages-extraction-roadmap.md) § Phase 5

---

## 1. 목적

storybook 의 `DashboardScene` (289 줄 + scene hook 86 줄 + 15 scenario) 를 `@ingradient/platform-pages/dashboard` 의 `DashboardView` 로 추출. Catalog / Settings 보다 구조가 단순 (single page, no tabs, no overlays).

---

## 2. 핵심 구조

| 레이어 | 내용 | 이미 ui 에 있는 patterns |
|---|---|---|
| **Shell** | AppShell (Page) + Content area | AppShell |
| **Header** | DashboardHeader 안에 Save PDF + Customize 버튼 + customize popover | DashboardHeader, DashboardCustomizePopover, Button |
| **Overview Panel** | 상태 분기 (no-project/loading/error/data) + date range popover slot + reset layout | DashboardOverviewPanel, DashboardDateRangePopover |
| **Widget Grid** (state=data) | 2D layout × 8 widgets × visibility | AnalysisWidgetGrid |
| **Widgets** | 8 chart/widget (BarChart × 3, LineChart, PieChart × 2, SourceBreakdown, PerDatasetDistribution) | AnalysisWidgetShell + 각 chart/widget pattern |

UI 부품 모두 patterns 에 존재. 8개 widget JSX 는 story-specific data 사용 → **slot 패턴** 적용.

---

## 3. View 파일 분할 — 4 file

Catalog (11) / Settings (12) 보다 간단:

```
packages/platform-pages/src/dashboard/
├─ DashboardView.tsx            — top view (≤ 130 줄)
├─ DashboardView.styles.ts      — Page + Content styled (≤ 30 줄)
├─ types.ts                     — Props + WidgetGridLayout 등 (≤ 90 줄)
└─ index.ts                     — barrel (≤ 10 줄)
```

---

## 4. Props 그룹핑 — 5 group

```ts
export interface DashboardViewProps {
  // Header
  projectName?: string | null
  saveMessage?: string | null
  onSavePdf: () => void

  // Customize
  customize: DashboardCustomizePaneProps

  // Overview panel + date range
  state: 'no-project' | 'loading' | 'error' | 'data'
  errorMessage?: string | null
  hint?: string
  dateLabel: string
  onResetLayout: () => void
  dateRange: DashboardDateRangePaneProps

  // Widget grid (state=data 일 때 사용)
  widgets: DashboardWidgetsPaneProps
}

export interface DashboardCustomizePaneProps {
  open: boolean
  onToggle: () => void
  items: DashboardCustomizeItem[]      // from @ingradient/ui/patterns
  visibility: Record<string, boolean>
  onToggleItem: (key: string, checked: boolean) => void
}

export interface DashboardDateRangePaneProps {
  open: boolean
  onToggle: () => void
  draft: DateRange | undefined         // react-day-picker DateRange
  onChangeDraft: (next: DateRange | undefined) => void
  onSelectPreset: (preset: DateRangePreset) => void   // 'today' | 'last7' | 'thisMonth' (DateRangePreset re-export)
  onReset: () => void
  onApply: () => void
  summaryLabel: string
}

export interface DashboardWidgetsPaneProps<K extends string = string> {
  layout: WidgetGridLayout<K>          // 2D array of widget keys
  widgets: Partial<Record<K, ReactNode>>
  visibility?: Partial<Record<K, boolean>>
  emptyState?: ReactNode
}
```

도메인 type 은 모두 `@ingradient/ui/patterns` 의 type re-export:
- `DashboardCustomizeItem`
- `DateRangePreset`
- `WidgetGridLayout<K>`

`DateRange` 는 react-day-picker.

---

## 5. 변경 파일

### 5.1 신규 5 file
- 4 view file + `tests/probes/dashboard.mjs`

### 5.2 수정 (2 file)

- `packages/platform-pages/src/index.ts` — `export * from './dashboard'` 추가
- `stories/pages/platform/0.0.1/Dashboard.stories.tsx` — view 호출로 교체. 8 widget JSX 는 story 의 helper 로 유지 (`buildWidgets`). ≤ 150 줄 목표 (현재 289)
- 필요 시 `stories/pages/platform/0.0.1/dashboard/build-widgets.tsx` helper 추가

### 5.3 건드리지 않음

- `stories/fixtures/platform/0.0.1/dashboard-*.ts`
- `stories/pages/platform/0.0.1/dashboard/use-dashboard-scene.ts`
- 모든 dashboard 관련 patterns

---

## 6. 검증

| # | 명령 | 기대 |
|---|---|---|
| 1 | `npx tsc --noEmit -p tsconfig.json` | 0 error |
| 2 | `npm run build:package` | `packages/platform-pages/lib/index.js` 57 KB → ~62 KB |
| 3 | `npm run build:storybook` | exit 0 |
| 4 | Playwright probe — 6 scenario | 6/6 pass |
| (회귀) | 4 prior probes (create-project, class, catalog, settings) | 모두 pass |

probe 6 scenario:
- `default` — 8 widget 렌더링
- `no-project` — placeholder
- `loading` — spinner
- `error` — alert
- `customize-open` — popover visible
- `date-range-open` — DayPicker popover visible

---

## 7. 성공 기준

- 검증 1~4 통과 + 회귀 없음
- view 파일 4개 각 < 200 줄
- story file ≤ 150 줄 (현재 289)
- 5 페이지 모든 view 가 `@ingradient/platform-pages` export

---

## 8. 리스크

### 8.1 widgets 가 slot 이라 storybook 의 buildWidgets 부담

대응: Catalog stats / Settings storage 와 동일 패턴. story 측 helper 로 유지. platform 마이그레이션 시 platform 도 자체 `buildWidgets` 작성.

### 8.2 `DashboardCustomizePopover<K>` / `AnalysisWidgetGrid<K>` 가 generic

위험: view 가 generic 을 유지하면 사용성 복잡 / 잃으면 type 좁아짐

대응: view 의 `widgets` group 도 generic `<K extends string>` 유지. story 가 `<DashboardWidgetKey>` 로 인스턴스화.

### 8.3 `DateRange` 의존이 patterns 외부 (react-day-picker)

위험: view 의 prop interface 가 react-day-picker 에 직접 의존

대응: react-day-picker 는 이미 `@ingradient/ui` peerDeps 에 포함 (Phase 0 검증). type import 만 사용 — bundle 영향 없음.

### 8.4 saveMessage 등 optional prop 의 null/undefined 일관성

대응: 패턴이 받는 시그니처와 동일하게 view 도 `string | null` 사용.

---

## 9. Rollback

git revert 신규 5 + 수정 2. workspace 빌드 동일 상태.

---

## 10. 다음 액션

1. 본 spec ok
2. types → styles → View → index 순 작성
3. story rewrite + buildWidgets helper
4. probe 작성
5. 검증 + 회귀 확인
6. 5 페이지 추출 완료 → Phase 6 (Story 정리 + 문서) 진입 또는 사용자 결정에 따라 종료

---

## 11. 종료 상태

Phase 5 완료 후 `@ingradient/platform-pages` 가 노출하는 view:
- `CreateProjectView`
- `ClassManageView`
- `CatalogView`
- `SettingsModalView`
- `DashboardView`

ingradient-platform 의 5 개 페이지 컨테이너 (Phase 7) 가 hook → props 만 주입하면 동작.
