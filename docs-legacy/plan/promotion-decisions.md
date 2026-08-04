# patterns → components / patterns / pages 재배치 결정

> **Status — archived historical decision record.** 아래 결정은 당시 근거를 보존한다. 현재 package ownership과 public surface는 [Components Vs Patterns](../../docs/reference/components-vs-patterns.md)와 [`@ingradient/platform-pages`](../../packages/platform-pages/README.md)를 따른다.

작성일: 2026-05-26
선행 문서: `docs-legacy/plan/patterns-to-components-promotion.md` (16 후보 분석)
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

## 검토 완료 — 권고안

### 1. 기존 Table — 확장 후 흡수 ✅
`components/data-display/Table` 이미 generic. **`TableColumn` 에 `numeric?: boolean` + `muted?: boolean` 추가** 하면 devices-table 흡수 가능.
- **DevicesTable** → 외부 pages 로 (확장된 Table 사용한 단순 컴포지션)
- **StatsTable** → footer 다르니 patterns 에 별도 추출 (혹은 Table 에 `footer?: ReactNode[]` 추가 검토)

### 2. ColumnsLayout — SplitLayout 과 별개 유지 ✅
기존 `SplitLayout` 은 정적 grid (resize 불가). CatalogShell 은 flex + drag-resize — **별개 컴포넌트**.
- **CatalogShell** → `ResizableColumnsLayout` 으로 generic 화
- **SplitLayout** → 그대로 유지 (정적 grid 용)

권고 API (옵션 C — 객체 배열):
```tsx
<ResizableColumnsLayout
  columns={[
    { width: 320, resizable: true, minWidth: 220, maxWidth: 480, collapsible: true },
    { width: 'auto' },
    { width: 320, resizable: true, minWidth: 220, maxWidth: 480 },
  ]}
  storageKey="my-shell"
>
  <aside>Left</aside>
  <main>Body</main>
  <aside>Right</aside>
</ResizableColumnsLayout>
```

### 3. BarChartWidget 신규 추출 불필요 ✅
`BarChartCard` (patterns/charts/) 이미 generic + 충분한 옵션 (layout, stacked, getCellColor, tooltipContent, headerExtra). 5 widget 들은 `BarChartCard + 도메인 사이드 table` 단순 컴포지션.
- **BarChartCard 그대로 유지**
- 사이드 table 들 → 확장된 Table 또는 StatsTable 로 흡수
- 5 widget 자체 → 외부 pages 책임 (BarChartCard + Table 합성)

### 4. PatternTabs — ModeSwitcher 와 별개 + 이름 변경 ✅
시각도 ARIA 도 다른 컴포넌트:
- **ModeSwitcher**: segmented control (붙어있는 옵션들, role=radiogroup)
- **PatternTabs**: separate chip tabs (떨어진 옵션들, role=tablist)

**별개 유지**. `pattern-tabs` 라는 이름이 도메인 ambiguous → **`ChipTabs` 같은 시각 명시 이름으로 변경** 후 components/inputs/ 로 promotion.

### 5. Storybook viewport addon — 별도 PR 로 추가 ✅
mobile-only 3-4 컴포넌트 검토 필수. 비용 작음 (1 package + 1 config 줄). 단 **이 refactor PR 과 분리** — 별도 PR.

---

## 업데이트된 작업 계획

### Phase A1: 단순 components/ promotion (선행)
1. **A4. HoverPreview** → `components/overlays/hover-preview.tsx` (그대로)
2. **A5. FilterPopoverTrigger** → `components/inputs/filter-popover-trigger.tsx` (그대로)
3. **A6. PatternTabs → ChipTabs** → `components/inputs/chip-tabs.tsx` (이름 변경)
4. **A7. PermissionHelpTooltip → HelpTooltip** → `components/overlays/help-tooltip.tsx` (이름 변경)
5. **A2. MobileNavShell** → `components/navigation/mobile-nav-shell.tsx` (navigation/ 폴더 신설)
6. **A8. GalleryImageCard → ImageCard** → `components/data-display/image-card.tsx` (이름 변경 + AspectRatioImage 활용)
7. **B8. DatasetSelectorMobile → MobileDropdown** → `components/inputs/mobile-dropdown.tsx` (이름 변경)

### Phase A2: API 설계 필요한 promotion
8. **A1. DateRangePicker** → DayPicker + range 지원 추가
9. **A3. ResizableColumnsLayout** → 옵션 C API + storageKey 지원

### Phase B1: generic patterns 추출 (3개로 축소)
1. **PermissionMatrix** → B2 generic 화 (기존 Table 확장으로 가능한지 먼저 검토 — sticky-col 패턴 때문에 안 될 수도)
2. **DistributionHeatmap** → B3 generic 화 (cell `$intensity` 패턴 보존)
3. **StatsTable** → B4 generic 화 (footer 가능한 범용 table — 또는 기존 Table 에 footer prop 추가하는 방향 고려)

### Phase B2: 기존 Table 확장
- `TableColumn` 에 `numeric?: boolean` + `muted?: boolean` 추가
- (선택) `footer?: ReactNode[]` 추가하면 StatsTable 흡수 가능 — 검토

### Phase B3: 외부 pages 책임 분리
- DevicesTable + 5 analysis widget 도메인 컴포지션을 외부로
- `@ingradient/ui` 에서 제거 또는 deprecate

### Phase 5 (별도 PR): Storybook viewport addon 설치

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
