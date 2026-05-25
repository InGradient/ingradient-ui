# patterns → components / features 승격 판단 문서

작성일: 2026-05-25
브랜치: `refactor/components-vs-patterns-audit`
선행 작업: `docs/reference/components-extraction-candidates.md` (Phase 0~4 완료, 인라인 styled 499 → 57 / 89% 제거)

---

## 목적

남은 57 개 인라인 styled 정의 중 **patterns 가 아닌 위치가 더 적합한 것들**을 식별하고, Storybook 에서 직접 보고 판단할 수 있도록 후보별 평가 기준을 정리한다.

핵심 질문: "이 컴포넌트는 도메인 결합 없이 generic 한가?"
- Yes → `components/` 로 promotion
- 도메인 결합 강함 → `features/{domain}/` 로 분리
- 작은 도메인 특수 케이스 → `patterns/` 에 유지

---

## Storybook 실행 + 확인 방법

```bash
npm run storybook
# → http://localhost:6006 자동 오픈
```

좌측 사이드바 트리에서 각 후보의 위치 (예: `Patterns/Shells/MobileNavShell`) 로 이동해 확인.

판단 기준 (각 후보마다 체크):
1. **도메인 어휘** — Props 이름, JSX 텍스트, 라벨에 도메인 단어 (dataset, class, member, devices, analysis...) 가 있나?
2. **재사용 가능성** — 다른 도메인 (예: devices 페이지의 컴포넌트를 storage 페이지에도?) 에 그대로 쓸 수 있나?
3. **시각의 generic 함** — 표면 (border / shadow / radius) 이 design-system 표준에 가까운가?
4. **외부 라이브러리** — DayPicker 같은 deep-style 대상이 있나?

→ **1~4 모두 generic** 이면 `components/` promotion 후보
→ **1번이 강하면** `features/` 분리 후보

---

## 🟢 A. components/ promotion 후보 (8 파일, ~12 styled 정의)

generic + 재사용 가능. patterns 가 아닌 components 가 적합.

### A1. `dashboard-date-range-popover` (2 정의 — Popover / Calendar)
- **Storybook**: `Patterns/Shells/DashboardDateRangePopover`
- **확인 포인트**: DayPicker 가 통째로 들어간 date-range picker. preset 버튼 + calendar.
- **promotion 대상**: `components/inputs/date-range-picker.tsx`
- **제거되는 인라인**: `.rdp-root` 자식 selector + MenuPopover 확장 (라이브러리 deep style 까지 함께 이동)
- **외부 영향**: `@ingradient/ui` 의 export 경로 변경 (`/patterns/...` → `/components/...`)

### A2. `mobile-nav-shell` (5 정의 — AppHeader / Backdrop / DrawerPanel / DrawerTitleRow / Item)
- **Storybook**: `Patterns/Shells/MobileNavShell`
- **확인 포인트**: 모바일 hamburger + drawer + nav rows. 도메인 props (label/icon/onClick) 만 외부 주입.
- **promotion 대상**: `components/navigation/mobile-nav-shell.tsx` (또는 `components/overlays/`)
- **제거되는 인라인**: `${media.md}` 미디어 쿼리 + drawer transform 동적 prop
- **검토 사항**: 현재 generic 한가? brand/title/items 등 모두 props 로 주입되니 OK 추정 — Storybook 에서 확인.

### A3. `catalog-shell` (2 정의 — Left / Right)
- **Storybook**: `Patterns/CatalogShell`
- **확인 포인트**: 좌측 사이드바 + center + 우측 사이드바 + 양쪽 resize handle. body/toolbar/sidebar 모두 slot.
- **promotion 대상**: `components/data-display/split-shell.tsx` (또는 `layouts/` 가 더 맞을지 검토)
- **제거되는 인라인**: dynamic `$width` / `$collapsed`
- **검토 사항**: 이름이 "catalog" 인데 실제로는 generic 3-column shell — 이름 변경 (`SplitShell` / `ThreeColumnShell` 등) 필요.

### A4. `hover-preview` (1 정의 — Wrapper)
- **Storybook**: `Patterns/HoverPreview`
- **확인 포인트**: hover 시 floating 미리보기 표시. 자식 wrapping + transform scale + delay.
- **promotion 대상**: `components/overlays/hover-preview.tsx`
- **제거되는 인라인**: `$open` / `$scale` 동적 transform
- **검토 사항**: API 가 `preview` / `placement` / `delay` 등 generic prop 만 — promotion OK 추정.

### A5. `filter-popover-trigger` (1 정의 — Trigger)
- **Storybook**: `Patterns/FilterPopoverTrigger`
- **확인 포인트**: pill-style filter button + 열림 시 panel popover. icon-only 도 지원.
- **promotion 대상**: `components/inputs/filter-popover-trigger.tsx`
- **제거되는 인라인**: `$active` / `$iconOnly` + hover
- **검토 사항**: `panel` 이 ReactNode slot 이라 generic.

### A6. `pattern-tabs` (1 정의 — Tab)
- **Storybook**: `Patterns/Shells/PatternTabs`
- **확인 포인트**: 작은 pill toggle tabs (class lightbox 의 sibling 전환에 사용). 한 줄 옵션 toggle.
- **promotion 대상**: `components/inputs/pattern-tabs.tsx` (또는 기존 mode-switcher 확장)
- **제거되는 인라인**: `$active` + hover
- **검토 사항**: 기존 `mode-switcher`, `radio-card-group` 과의 차별점 확인 필요.

### A7. `permission-help-tooltip` (2 정의 — Wrap / Bubble)
- **Storybook**: `Patterns/Shells/PermissionHelpTooltip`
- **확인 포인트**: 작은 "?" 아이콘 + hover 시 텍스트 tooltip. project permission matrix 에서 사용.
- **promotion 대상**: `components/overlays/help-tooltip.tsx`
- **제거되는 인라인**: `${Wrap}:hover &` 자식 selector + TooltipBubble 확장
- **검토 사항**: 이름이 "permission" 이지만 실제로는 generic. 이름 변경.

### A8. `gallery-image-card` (1 정의 — Card)
- **Storybook**: `Patterns/GalleryImageCard`
- **확인 포인트**: 썸네일 + selected ring + hover border. 4/3 aspect. kebab/group count overlay.
- **promotion 대상**: `components/data-display/image-card.tsx` (이미 image-grid-cell 과 비슷, 분리 또는 통합 고민)
- **제거되는 인라인**: `$selected` + hover
- **검토 사항**: 이미 추출한 `AspectRatioImage` / `OverlayLayer` 와 어떻게 합칠지.

### A 카테고리 요약
- **8 파일, ~12 인라인 styled 추가 제거** (57 → ~45, **91% 제거**)
- **외부 영향**: `@ingradient/ui` 의 모든 사용처 import 경로 변경 (patterns → components)

---

## 🟡 B. features/ 폴더 분리 후보 (8 파일, ~17 styled 정의)

도메인 결합 강함. `features/{domain}/` 신설 필요.

### B1. `devices-table` (1 정의 — Table)
- **Storybook**: `Patterns/Shells/DevicesTable`
- **도메인**: devices
- **검토 포인트**: device UID / status / register / revoke 등 devices 도메인 어휘 강함.
- **분리 위치**: `features/devices/devices-table.tsx`

### B2. `project-permission-matrix` (1 정의 — StyledTable)
- **Storybook**: `Patterns/Shells/ProjectPermissionMatrix`
- **도메인**: project + role + permission
- **검토 포인트**: sticky role header + checkbox grid. role/permission 도메인 결합.
- **분리 위치**: `features/project/permission-matrix.tsx`

### B3. `dataset-distribution-heatmap` (4 정의 — Table / HeadCell / RowLabel / Cell)
- **Storybook**: `Patterns/DatasetDistributionHeatmap`
- **도메인**: dataset distribution
- **검토 포인트**: heatmap 셀 의 `$intensity` 동적 → 도메인 특수. Cell 의 자식 selector + dynamic prop.
- **분리 위치**: `features/dataset/distribution-heatmap.tsx`

### B4. `storage-stats-table` (1 정의 — Table)
- **Storybook**: `Patterns/Shells/StorageStatsTable`
- **도메인**: storage stats
- **검토 포인트**: footer row + numeric columns. storage 도메인 특수.
- **분리 위치**: `features/storage/stats-table.tsx`

### B5. `analysis-labeling-by-person-widget` (1 정의 — PersonTable)
- **Storybook**: `Patterns/Shells/AnalysisLabelingByPersonWidget`
- **도메인**: analysis
- **분리 위치**: `features/analysis/labeling-by-person.tsx`

### B6. `source-breakdown-widget` (3 정의 — Card / Block / Table)
- **Storybook**: `Patterns/Shells/SourceBreakdownWidget`
- **도메인**: analysis
- **분리 위치**: `features/analysis/source-breakdown.tsx`

### B7. `per-dataset-distribution-widget` (3 정의 — Card / Block / Table)
- **Storybook**: `Patterns/Shells/PerDatasetDistributionWidget`
- **도메인**: analysis + dataset
- **분리 위치**: `features/analysis/per-dataset-distribution.tsx`

### B8. `dataset-selector-mobile` (2 정의 — Trigger / Dropdown)
- **Storybook**: `Patterns/Shells/DatasetSelectorMobile`
- **도메인**: dataset (mobile-specific)
- **검토 포인트**: `linear-gradient` + `backdrop-filter` 가 mobile-only deep style. 도메인 결합.
- **분리 위치**: `features/dataset/selector-mobile.tsx`

### B 카테고리 요약
- **8 파일, ~17 인라인 추가 제거** (45 → ~28, **94% 제거**)
- **추가 작업**: `features/` 폴더 신설 + `@ingradient/ui` export 경로 결정
- **현재 features 폴더 없음** → 신설 정책 결정 필요 (Phase 3 문서에 device-status-badge / project-type-tag 도 같은 후보로 명시됨)

---

## ⚪ C. patterns 에 유지 (~28 정의)

작은 도메인 케이스 + pseudo/dynamic/media query 가 본질인 것들. promotion 가치 적음.

| 분류 | 파일들 |
|---|---|
| `:last-child` border row | filter-section / catalog-right-panel / image-detail-sidebar / project-member-row |
| 도메인 list item (hover/$selected) | class-pool-list / class-list-row / image-detail-class-list / add-dataset-modal |
| 작은 dynamic chip | dataset-filter-chip-row / filter-class-chip |
| Dynamic prop 한두 개 | analysis-widget-shell / analysis-widget-grid / labeling-progress-bar / igp-export-modal / gallery-toolbar / gallery-mobile-toolbar / dashboard-widget / dashboard-customize-popover / chart-container / class-lightbox / layouts (SplitLayoutRoot) |
| virtualizer ref + 3 dynamic | virtualized-image-grid |

→ 시각 일관성 정리 단계 (Phase 5) 에서 검토.

---

## 결정 가이드 — Storybook 에서 후보별 체크리스트

각 A/B 후보를 Storybook 에서 열고 다음을 확인하세요.

### A 후보 (components/ promotion)
- [ ] Props 가 generic 한가? (도메인 단어 없음)
- [ ] 다른 페이지/도메인에 그대로 쓸 수 있는 형태인가?
- [ ] 이름이 patterns-friendly 인가 components-friendly 인가? (예: `CatalogShell` → `SplitShell` 변경 필요)
- [ ] 이미 components 에 비슷한 게 있나? (예: `pattern-tabs` vs `mode-switcher`)

### B 후보 (features/ 분리)
- [ ] features 폴더 신설 의사가 있나?
- [ ] 도메인 그룹화가 어떻게 되나? (devices / project / dataset / analysis / storage)
- [ ] export 경로를 `@ingradient/ui/features/{domain}` 같이 열까 아니면 closed (internal) 로 둘까?

### 공통
- [ ] 외부 사용처 (`packages/platform-pages`, `packages/edge-pages`) 의 import 경로 변경 영향
- [ ] 한 PR 로 묶을지 vs 후보별 분리할지

---

## 결정 후 예상 작업 규모

| 시나리오 | 인라인 잔존 | 작업 규모 |
|---|---|---|
| 현재 상태 유지 | 57 / 499 (89%) | 0 (PR 머지만) |
| A 만 진행 (8 파일 promotion) | ~45 / 499 (91%) | 중간 (import 경로 변경 + 이름 정리) |
| A + B 진행 (16 파일 재배치) | ~28 / 499 (94%) | 큰 (features/ 신설 + 폴더 재구조) |
| A + B + 1.7 Phase 5 시각 정리 | ~25 / 499 (95%) | 가장 큼 (시각 표준화까지) |

---

## 다음 단계

1. `npm run storybook` 실행
2. 위 A1~A8 + B1~B8 후보를 좌측 사이드바 트리에서 하나씩 열기
3. 각 후보 옆 "Promotion OK / Features 분리 / 유지" 체크
4. 결정 후 이 문서에 결과 기록
5. 결정 결과에 따라 코드 변경 진행
