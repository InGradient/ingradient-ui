# patterns → components / patterns / pages 재배치 결정

작성일: 2026-05-26
선행 문서: `docs/plan/patterns-to-components-promotion.md` (16 후보 분석)
결정자: 사용자 (Storybook 검토 후)

---

## 핵심 인사이트

**B 카테고리의 features/ 분리는 잘못된 방향.** 옳은 방향은:
- patterns/ 에 **generic 한 building block** (Matrix / Heatmap / StatsTable / BarChartWidget) 만 두기
- 도메인 결합 (devices, project, analysis, storage) 은 **외부 pages 에서 조립**
- 즉 features/ 라는 새 폴더는 만들지 않음

A 카테고리도 마찬가지로 generic 화 우선 — `CatalogShell` 같은 도메인 이름 대신 `ColumnsLayout` 처럼 유연한 컴포넌트.

---

## A 카테고리 결정 (8 후보 → 8 컴포넌트)

| 후보 | 결정 | 대상 위치 | 변경 사항 |
|---|---|---|---|
| **A1. DashboardDateRangePopover** | DayPicker 부분만 추출 + range 지원 추가 | `components/inputs/date-range-picker.tsx` | DayPicker 의 `selected` 가 `Date` 가 아닌 `{ from, to }` range 지원 |
| **A2. MobileNavShell** | components 로 이동 (그대로 promotion) | `components/navigation/mobile-nav-shell.tsx` 또는 `components/overlays/` | 신규 폴더 `navigation/` 신설 검토 |
| **A3. CatalogShell** | **ColumnsLayout 으로 추상화** | `components/layouts/columns-layout.tsx` | 3-column 고정이 아닌 N-column 유연한 layout. `columns: number` 또는 `columns: ['fixed', 'flex', 'fixed']` 같은 props |
| **A4. HoverPreview** | components 로 이동 | `components/overlays/hover-preview.tsx` | 그대로 promotion |
| **A5. FilterPopoverTrigger** | components 로 이동 | `components/inputs/filter-popover-trigger.tsx` | 그대로 promotion |
| **A6. PatternTabs** | components 로 이동 | `components/inputs/pattern-tabs.tsx` | 기존 `mode-switcher` 와 차이 확인 — 통합 또는 별개 컴포넌트 결정 |
| **A7. PermissionHelpTooltip** | **HelpTooltip 으로 이름 변경** + components 로 이동 | `components/overlays/help-tooltip.tsx` | "permission" 어휘 제거, generic 화 |
| **A8. GalleryImageCard** | **ImageCard 로 이름 변경** + components 로 이동 | `components/data-display/image-card.tsx` | "gallery" 어휘 제거. 기존 `AspectRatioImage` / `OverlayLayer` 합성 확인 |

### A 카테고리 영향
- **8 파일 components/ 로 이동**
- **인라인 styled 약 12개 추가 제거** (57 → ~45)
- **외부 사용처 import 경로 변경** 필요 (`@ingradient/ui/patterns/...` → `@ingradient/ui/components/...`)

---

## B 카테고리 결정 (8 후보 → generic patterns 4개 + components 1개 + pages 책임 N개)

### B-새. patterns 에 남는 generic building block (4개)

| 신규 patterns 컴포넌트 | 흡수 후보 | 이름 |
|---|---|---|
| **PermissionMatrix** | B2. ProjectPermissionMatrix | `patterns/permission-matrix.tsx` (도메인 어휘 제거, sticky-th + checkbox grid 기반) |
| **DistributionHeatmap** | B3. DatasetDistributionHeatmap | `patterns/distribution-heatmap.tsx` (rowLabels / columnLabels / matrix 기반 generic heatmap) |
| **StatsTable** | B4. StorageStatsTable | `patterns/stats-table.tsx` (footer 가능한 범용 table) |
| **BarChartWidget** | B5/B6/B7. analysis widgets + AnalysisPendingProcessedWidget 등 다른 widget | `patterns/bar-chart-widget.tsx` (옵션: range / grouping / stacking 등 변형 가능) |

### B-→components. 범용 컴포넌트로 이동 (1개)

| 후보 | 결정 | 대상 위치 |
|---|---|---|
| **B8. DatasetSelectorMobile** | **MobileDropdown 으로 이름 변경** + components 로 이동 | `components/inputs/mobile-dropdown.tsx` |

### B-→pages. 외부 pages 가 만드는 컴포지션 (3개)

| 후보 | 책임 위치 | 사용할 generic |
|---|---|---|
| **B1. DevicesTable** | `packages/platform-pages` (devices 페이지) | 기존 `components/data-display/table.tsx` 활용 — 확인 필요 |
| **(B2 컴포지션)** | pages | PermissionMatrix + role/permission 데이터 |
| **(B3 컴포지션)** | pages | DistributionHeatmap + dataset 데이터 |
| **(B4 컴포지션)** | pages | StatsTable + storage stats 데이터 |
| **(B5/B6/B7 컴포지션)** | pages | BarChartWidget + analysis 데이터 |

### B 카테고리 영향
- **patterns 에 신규 4 generic 컴포넌트** (Matrix / Heatmap / StatsTable / BarChartWidget)
- **components 에 MobileDropdown 1개**
- **DevicesTable 등 도메인 wrapper 는 사실상 pages 책임** — `@ingradient/ui` 에서 제거 또는 deprecate
- **인라인 styled 약 17개 추가 제거** (45 → ~28)

---

## 추가 검토 사항

### 1. 기존 Table 컴포넌트 확인 필요
> "이거 table이 이미 따로 있지 않아?"

`components/data-display/table.tsx` 가 이미 존재. devices-table 의 자식 selector 패턴이 이 generic Table 로 흡수 가능한지 검토.
- 가능하면 → DevicesTable 는 generic Table 사용한 단순 컴포지션
- 불가능하면 → StatsTable 처럼 patterns 에 별도 footer-table 추출

### 2. ColumnsLayout 의 API 설계
> "components에 columns 또는 layout 같은 걸로 만든 후 숫자를 넣으면 유연하게"

후보 API:
```tsx
// 옵션 A — 단순 숫자
<ColumnsLayout columns={3} gap={4}>
  <aside>Sidebar</aside>
  <main>Body</main>
  <aside>Inspector</aside>
</ColumnsLayout>

// 옵션 B — 각 컬럼 너비 명시
<ColumnsLayout columns={[320, 'auto', 320]} resizable={[0, 2]}>
  ...
</ColumnsLayout>

// 옵션 C — 객체 배열 (더 풍부한 props)
<ColumnsLayout columns={[
  { width: 320, resizable: true, collapsible: true },
  { width: 'auto' },
  { width: 320, resizable: true },
]}>
  ...
</ColumnsLayout>
```

기존 `patterns/layouts/layouts.tsx` 의 `SplitLayout` 과의 관계도 검토 필요.

### 3. BarChartWidget 의 옵션 범위
> "AnalysisLabelingByPersonWidget 이런 건 바그래프에 옵션을 넣어서 쓸 수 있게"

옵션 후보:
- 데이터 그룹화 (by-person / by-class / by-source 등)
- range / 기간 필터
- 색 매핑 (도메인별 색)
- legend / tooltip 형식

기존 `patterns/charts/bar-chart-card.tsx` 와의 관계 — 통합 또는 확장?

### 4. PatternTabs vs mode-switcher
> "기존 mode-switcher 와의 차별점 확인 필요"

코드 검토 후 결정 — 통합 또는 별개.

### 5. Storybook viewport addon
mobile-nav-shell 안 보이는 이유는 viewport addon 미설치. 별도 작업으로 viewport addon 추가 결정 가능.

---

## 작업 우선순위 (구현 순서)

### Phase A1: components/ promotion (선행)
1. **A4. HoverPreview** → 가장 단순, 의존성 없음
2. **A5. FilterPopoverTrigger** → 단순 promotion
3. **A6. PatternTabs** → mode-switcher 통합 검토 후
4. **A7. HelpTooltip** → 이름 변경 + promotion
5. **A2. MobileNavShell** → navigation/ 폴더 신설
6. **A8. ImageCard** → AspectRatioImage 조합 검토
7. **A1. DateRangePicker** → range 지원 추가 작업
8. **A3. ColumnsLayout** → API 설계 후 SplitLayout 정리 같이

### Phase B1: generic patterns 추출
1. **PermissionMatrix** → B2 generic 화
2. **DistributionHeatmap** → B3 generic 화
3. **StatsTable** → B4 generic 화
4. **BarChartWidget** → B5/B6/B7 통합 generic 화

### Phase B2: components 신규
1. **MobileDropdown** → B8 generic 화 + 이동

### Phase B3: pages 책임 분리 (외부 작업)
- DevicesTable / 기타 widget 도메인 컴포지션을 `@ingradient/ui` 에서 제거 → `packages/platform-pages` 로 이동
- 또는 deprecation 표시 후 단계적 제거

### Phase 5: 외부 import 경로 일괄 변경
- A 모두 + 일부 B 의 import 경로 변경 (`@ingradient/ui` 의 export 변경)
- `packages/platform-pages` / `packages/edge-pages` import 갱신

---

## 예상 최종 상태

| 항목 | 현재 | 결정 적용 후 |
|---|---|---|
| 인라인 styled | 57 (89%) | ~25 (95%) |
| patterns 파일 수 | ~100 | ~70 (도메인 wrapper 제거) |
| components 파일 수 | ~40 | ~50 (8 promotion + 1 MobileDropdown + 1 ColumnsLayout) |
| patterns 의 generic 빌딩블록 | 0 | 4 (Matrix / Heatmap / StatsTable / BarChartWidget) |
| pages 책임 | 거의 없음 | DevicesTable / Permission / Heatmap / Analysis 컴포지션 |

---

## 다음 단계

1. 이 문서로 결정 확정
2. Phase A1 부터 순서대로 진행 (작은 단위로)
3. 매 단계마다 TypeScript + Storybook 확인
4. 외부 사용처 영향 최소화 위해 단계별 PR 분리 가능
