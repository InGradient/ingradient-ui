# Patterns — Expected Classification

이 문서는 [`../components-vs-patterns.md`](../components-vs-patterns.md) 기준으로 봤을 때 `@ingradient/ui/patterns`에 들어가야 한다고 분류한 항목 목록이다.

## Scope

- 기준: [`../components-vs-patterns.md`](../components-vs-patterns.md)
- 범위: 현재 [`src/components/`](../../../src/components/) 와 [`src/patterns/`](../../../src/patterns/) 의 모든 파일을 같은 기준으로 한 번 훑은 결과
- 출력: provisional classification만 기록한다. 폴더 구조 변경이나 파일 이동은 본 문서 범위가 아니다 ("지금 단계에서는 폴더 구조를 먼저 흔들지 않는다").

## 분류 기준 (요약)

- `pattern` — 여러 component를 묶어 UX 구조를 만든다, slot/pane 관계가 중요, caller가 안을 채워 화면 완성
- `component` — generic UI building block, props contract가 핵심, size/tone/state/variant가 public surface

borderline 항목은 4-tuple로 기록한다.

- `current` — 지금 위치
- `classification` — 새 기준 분류
- `why` — generic contract인지, composition structure인지
- `follow-up` — 유지 / 이동 검토 / split 검토

---

## 1. 유지 — 이미 `src/patterns/`에 있고, 새 기준에서도 `pattern`

### `layouts/`

| 파일 | why |
| --- | --- |
| [`layouts`](../../../src/patterns/layouts/layouts.tsx) | 화면 골격 layout primitive — composition 자체가 재사용 가치 |

### `page/`

| 파일 | why |
| --- | --- |
| [`page-shell`](../../../src/patterns/page/page-shell.tsx) | 페이지 외곽 골격 — pane 관계 중심 |
| [`page-primary-header`](../../../src/patterns/page/page-primary-header.tsx) | 새 문서 예시 그대로 |
| [`page-top-bar`](../../../src/patterns/page/page-top-bar.tsx) | top bar composition rhythm |

### `shells/` — App-wide navigation / shell

| 파일 | why |
| --- | --- |
| [`navigation`](../../../src/patterns/shells/navigation.tsx) | sidebar 골격(`SidebarNav`, `AppSidebar`, `SidebarSection`) — slot 관계 중심 |
| [`sidebar-shell`](../../../src/patterns/shells/sidebar-shell.tsx) | sidebar 외곽 컨테이너 |
| [`mobile-nav-shell`](../../../src/patterns/shells/mobile-nav-shell.tsx) | 모바일 nav shell |
| [`dataset-selector-mobile`](../../../src/patterns/shells/dataset-selector-mobile.tsx) | 모바일 selector shell — caller가 안을 채움 |

### `shells/` — Catalog

| 파일 | why |
| --- | --- |
| [`catalog-shell`](../../../src/patterns/shells/catalog-shell.tsx) | 새 문서 예시 그대로 |
| [`catalog-mobile-shell`](../../../src/patterns/shells/catalog-mobile-shell.tsx) | shell variant |
| [`catalog-right-panel`](../../../src/patterns/shells/catalog-right-panel.tsx) | pane 관계 중심 |

### `shells/` — Dashboard

| 파일 | why |
| --- | --- |
| [`dashboard-header`](../../../src/patterns/shells/dashboard-header.tsx), [`dashboard-stats-header`](../../../src/patterns/shells/dashboard-stats-header.tsx) | 화면 header composition |
| [`dashboard-overview-panel`](../../../src/patterns/shells/dashboard-overview-panel.tsx) | panel composition |
| [`dashboard-widget`](../../../src/patterns/shells/dashboard-widget.tsx) | widget 외곽 shell — caller가 내용 채움 |
| [`dashboard-customize-popover`](../../../src/patterns/shells/dashboard-customize-popover.tsx) | 도메인 popover composition |
| [`dashboard-date-range-popover`](../../../src/patterns/shells/dashboard-date-range-popover.tsx) | 동일 |

### `shells/` — Analysis widgets

각 widget은 차트 + 헤더 + 필터/툴팁 슬롯을 묶은 composition이라 pattern이다.

- 외곽: [`analysis-dashboard`](../../../src/patterns/shells/analysis-dashboard.tsx), [`analysis-widget-grid`](../../../src/patterns/shells/analysis-widget-grid.tsx), [`analysis-widget-shell`](../../../src/patterns/shells/analysis-widget-shell.tsx)
- 개별 widget:
  - [`analysis-class-ratio-widget`](../../../src/patterns/shells/analysis-class-ratio-widget.tsx)
  - [`analysis-data-collection-widget`](../../../src/patterns/shells/analysis-data-collection-widget.tsx)
  - [`analysis-labeling-by-person-widget`](../../../src/patterns/shells/analysis-labeling-by-person-widget.tsx)
  - [`analysis-labeling-status-widget`](../../../src/patterns/shells/analysis-labeling-status-widget.tsx)
  - [`analysis-pending-processed-widget`](../../../src/patterns/shells/analysis-pending-processed-widget.tsx)
  - [`analysis-timeline-widget`](../../../src/patterns/shells/analysis-timeline-widget.tsx)
  - [`per-dataset-distribution-widget`](../../../src/patterns/shells/per-dataset-distribution-widget.tsx)
  - [`source-breakdown-widget`](../../../src/patterns/shells/source-breakdown-widget.tsx)
  - [`dataset-distribution-heatmap`](../../../src/patterns/shells/dataset-distribution-heatmap.tsx)

### `shells/` — Class management

| 파일 | why |
| --- | --- |
| [`class-list-sidebar`](../../../src/patterns/shells/class-list-sidebar.tsx), [`class-list-row`](../../../src/patterns/shells/class-list-row.tsx) | class browsing 맥락의 row/sidebar composition |
| [`class-info-sidebar`](../../../src/patterns/shells/class-info-sidebar.tsx), [`class-info-section`](../../../src/patterns/shells/class-info-section.tsx) | 도메인 정보 section composition |
| [`class-images-panel`](../../../src/patterns/shells/class-images-panel.tsx) | 도메인 panel composition |
| [`class-lightbox`](../../../src/patterns/shells/class-lightbox.tsx) | 도메인 dialog composition |
| [`class-pool-list`](../../../src/patterns/shells/class-pool-list.tsx) | 도메인 list composition |
| [`class-hover-card`](../../../src/patterns/shells/class-hover-card.tsx) | hover card composition (class 정보 슬롯 구조) |
| [`add-class-dialog`](../../../src/patterns/shells/add-class-dialog.tsx) | 도메인 dialog composition |
| [`color-input-row`](../../../src/patterns/shells/color-input-row.tsx) | swatch + input 도메인 row composition |

### `shells/` — Dataset

| 파일 | why |
| --- | --- |
| [`dataset-list-item`](../../../src/patterns/shells/dataset-list-item.tsx) | 새 문서 예시 그대로 — dataset browsing row composition |
| [`dataset-list-panel`](../../../src/patterns/shells/dataset-list-panel.tsx) | 새 문서 예시 그대로 |
| [`dataset-menu`](../../../src/patterns/shells/dataset-menu.tsx) | 도메인 menu composition |
| [`dataset-filter-chip-row`](../../../src/patterns/shells/dataset-filter-chip-row.tsx) | filter chip row composition |
| [`add-dataset-modal`](../../../src/patterns/shells/add-dataset-modal.tsx), [`duplicate-dataset-modal`](../../../src/patterns/shells/duplicate-dataset-modal.tsx) | 도메인 modal composition |

### `shells/` — Gallery

| 파일 | why |
| --- | --- |
| [`gallery-image-card`](../../../src/patterns/shells/gallery-image-card.tsx) | gallery 맥락의 card composition |
| [`gallery-images-table`](../../../src/patterns/shells/gallery-images-table.tsx) | table + 도메인 column composition |
| [`gallery-image-menu`](../../../src/patterns/shells/gallery-image-menu.tsx) | 도메인 menu composition |
| [`gallery-toolbar`](../../../src/patterns/shells/gallery-toolbar.tsx) | 새 문서 예시 그대로 |
| [`gallery-mobile-toolbar`](../../../src/patterns/shells/gallery-mobile-toolbar.tsx) | toolbar variant |
| [`gallery-filter-panel`](../../../src/patterns/shells/gallery-filter-panel.tsx) | filter panel composition |
| [`gallery-detail-modal`](../../../src/patterns/shells/gallery-detail-modal.tsx) | 도메인 modal composition |
| [`gallery-delete-dialog`](../../../src/patterns/shells/gallery-delete-dialog.tsx) | 도메인 dialog |
| [`gallery-export-config-dialog`](../../../src/patterns/shells/gallery-export-config-dialog.tsx), [`gallery-export-progress-dialog`](../../../src/patterns/shells/gallery-export-progress-dialog.tsx) | export dialog composition |
| [`gallery-dataset-transfer-dialog`](../../../src/patterns/shells/gallery-dataset-transfer-dialog.tsx) | 도메인 dialog |
| [`hover-preview`](../../../src/patterns/shells/hover-preview.tsx) | preview composition (도메인 정보 슬롯) |

### `shells/` — Image inspector / labeling

| 파일 | why |
| --- | --- |
| [`image-inspector-canvas`](../../../src/patterns/shells/image-inspector-canvas.tsx) | canvas composition |
| [`labeling-canvas`](../../../src/patterns/shells/labeling-canvas.tsx) | labeling canvas composition |
| [`canvas-overlays`](../../../src/patterns/shells/canvas-overlays.tsx) | overlay 묶음 composition |
| [`annotation-toolbar`](../../../src/patterns/shells/annotation-toolbar.tsx) | toolbar composition |
| [`image-detail-sidebar`](../../../src/patterns/shells/image-detail-sidebar.tsx) | sidebar composition |
| [`image-detail-class-list`](../../../src/patterns/shells/image-detail-class-list.tsx), [`image-detail-info-panel`](../../../src/patterns/shells/image-detail-info-panel.tsx), [`image-detail-labelers-list`](../../../src/patterns/shells/image-detail-labelers-list.tsx) | 도메인 list/panel composition |
| [`comments-panel`](../../../src/patterns/shells/comments-panel.tsx) | 도메인 panel composition |
| [`labeling-progress-bar`](../../../src/patterns/shells/labeling-progress-bar.tsx) | 도메인 progress composition |
| [`auto-save-status`](../../../src/patterns/shells/auto-save-status.tsx) | 도메인 상태 표시 composition |
| [`bbox-navigation`](../../../src/patterns/shells/bbox-navigation.tsx) | navigation composition |
| [`image-context-menu`](../../../src/patterns/shells/image-context-menu.tsx) | 도메인 menu composition |
| [`drag-drop-decide-modal`](../../../src/patterns/shells/drag-drop-decide-modal.tsx) | modal composition |

### `shells/` — Settings

| 파일 | why |
| --- | --- |
| [`settings-account-tab`](../../../src/patterns/shells/settings-account-tab.tsx), [`settings-general-tab`](../../../src/patterns/shells/settings-general-tab.tsx) | tab composition |
| [`settings-section`](../../../src/patterns/shells/settings-section.tsx) | 새 문서 “composition noun” 예시에 부합 |
| [`settings-row`](../../../src/patterns/shells/settings-row.tsx) | label/control row composition |
| [`delete-account-dialog`](../../../src/patterns/shells/delete-account-dialog.tsx), [`password-change-dialog`](../../../src/patterns/shells/password-change-dialog.tsx) | 도메인 dialog composition |
| [`project-settings-form`](../../../src/patterns/shells/project-settings-form.tsx), [`project-resolution-card`](../../../src/patterns/shells/project-resolution-card.tsx) | 도메인 form/card composition |
| [`delete-project-section`](../../../src/patterns/shells/delete-project-section.tsx) | 도메인 section composition |
| [`reference-image-drop-zone`](../../../src/patterns/shells/reference-image-drop-zone.tsx), [`reference-image-section`](../../../src/patterns/shells/reference-image-section.tsx) | 도메인 section composition |
| [`model-mapping-select`](../../../src/patterns/shells/model-mapping-select.tsx) | 도메인 select composition (단순 dropdown 아님 — row + select 묶음) |

### `shells/` — Org & Members

| 파일 | why |
| --- | --- |
| [`org-members-tab`](../../../src/patterns/shells/org-members-tab.tsx), [`org-settings-tab`](../../../src/patterns/shells/org-settings-tab.tsx) | tab composition |
| [`invitations-section`](../../../src/patterns/shells/invitations-section.tsx), [`invitations-tab`](../../../src/patterns/shells/invitations-tab.tsx) | 도메인 section/tab composition |
| [`join-codes-section`](../../../src/patterns/shells/join-codes-section.tsx) | 도메인 section composition |
| [`member-pool-list`](../../../src/patterns/shells/member-pool-list.tsx) | 도메인 list composition |
| [`project-member-invite`](../../../src/patterns/shells/project-member-invite.tsx), [`project-members-list`](../../../src/patterns/shells/project-members-list.tsx), [`project-member-row`](../../../src/patterns/shells/project-member-row.tsx) | 도메인 list/row composition (DatasetListItem 선례) |
| [`project-permission-matrix`](../../../src/patterns/shells/project-permission-matrix.tsx) | 도메인 matrix composition |

### `shells/` — Devices & License

| 파일 | why |
| --- | --- |
| [`devices-tab`](../../../src/patterns/shells/devices-tab.tsx) | tab composition |
| [`devices-table`](../../../src/patterns/shells/devices-table.tsx) | 도메인 table column composition |
| [`devices-forms`](../../../src/patterns/shells/devices-forms.tsx) | 도메인 form composition |
| [`device-detail-dialog`](../../../src/patterns/shells/device-detail-dialog.tsx) | 도메인 dialog composition |
| [`devices-license-section`](../../../src/patterns/shells/devices-license-section.tsx) | 도메인 section composition |
| [`license-info-display`](../../../src/patterns/shells/license-info-display.tsx) | 도메인 info composition (다중 row) |

### `shells/` — Storage

| 파일 | why |
| --- | --- |
| [`storage-analytics-tab`](../../../src/patterns/shells/storage-analytics-tab.tsx) | tab composition |
| [`storage-overview`](../../../src/patterns/shells/storage-overview.tsx) | 도메인 overview composition |
| [`storage-stats-table`](../../../src/patterns/shells/storage-stats-table.tsx) | 도메인 table composition |
| [`storage-recommendations-list`](../../../src/patterns/shells/storage-recommendations-list.tsx) | 도메인 list composition |

### `shells/` — Generic filter / sort composition

| 파일 | why |
| --- | --- |
| [`filter-popover-trigger`](../../../src/patterns/shells/filter-popover-trigger.tsx), [`sort-popover-trigger`](../../../src/patterns/shells/sort-popover-trigger.tsx) | trigger + popover composition |
| [`filter-searchable-list`](../../../src/patterns/shells/filter-searchable-list.tsx) | search + list composition |
| [`filter-section`](../../../src/patterns/shells/filter-section.tsx) | filter section composition |

### `shells/` — Misc

| 파일 | why |
| --- | --- |
| [`igp-export-modal`](../../../src/patterns/shells/igp-export-modal.tsx) | 도메인 export modal composition |
| [`upload-quality-modal`](../../../src/patterns/shells/upload-quality-modal.tsx) | 도메인 modal composition |

### (제안) `shells/` — Chart cards

차트 카드는 “card 외곽 + 헤더(title/description) + legend + 차트 body”를 묶은 composition이라 pattern으로 본다. 본 카테고리는 현재 `src/patterns/`에는 없고 `src/components/charts/`에서 이동해야 하는 후보 묶음이다. 세부는 §2 이동 검토 참고.

- `bar-chart-card`
- `line-chart-card`
- `pie-chart-card`
- `chart-container` (card 외곽 자체 — surfaceCard + title/description/legend/headerExtra slot)

---

## 2. 이동 검토 — 지금은 `src/components/`에 있지만 새 기준에서는 `pattern`

| 파일 | current | classification | why | follow-up |
| --- | --- | --- | --- | --- |
| [`tag-list-panel.tsx`](../../../src/components/data-display/tag-list-panel.tsx) | components/data-display | pattern | 이름 `Panel`, search input + dropdown + result list 조합 — composition rhythm이 가치 | 이동 검토 |
| [`form-section.tsx`](../../../src/components/inputs/form-section.tsx) | components/inputs | pattern | 이름 `Section`, label slot + content slot — settings-section과 같은 결 | 이동 검토 |
| [`filter-bar.tsx`](../../../src/components/inputs/filter-bar.tsx) | components/inputs | pattern | 이름 `Bar`, 자식 filter 슬롯 + clear action — caller가 안을 채움 | 이동 검토 |
| [`selection-action-bar.tsx`](../../../src/components/feedback/selection-action-bar.tsx) | components/feedback | pattern | 이름 `Bar`, count + spacer + actions 슬롯 구조 | 이동 검토 |
| [`chart-container.tsx`](../../../src/components/charts/chart-container.tsx) | components/charts | pattern | surfaceCard + title/description/legend/headerExtra/children slot — 차트 카드 외곽 자체가 composition | 이동 검토 |
| [`bar-chart-card.tsx`](../../../src/components/charts/bar-chart-card.tsx) | components/charts | pattern | `ChartContainer` + `ChartResponsive` + recharts body + `ChartLegend` 묶음 — 차트는 카드가 아니라 부품 | 이동 검토 / split 검토 |
| [`line-chart-card.tsx`](../../../src/components/charts/line-chart-card.tsx) | components/charts | pattern | 동일 | 이동 검토 / split 검토 |
| [`pie-chart-card.tsx`](../../../src/components/charts/pie-chart-card.tsx) | components/charts | pattern | 동일 | 이동 검토 / split 검토 |

> 이 항목들은 외부 contract가 “단일 control”이 아니라 “여러 component가 들어가는 슬롯 구조”라 새 기준의 pattern 정의에 부합한다. 다만 *Current Policy*에 따라 본 PR에서는 이동하지 않는다.

### 차트의 split 안

`*ChartCard`는 단순 이동을 넘어 split 가능성이 있다.

- `ChartLegend`, `ChartTooltip`, `PieSliceLabel`, `ChartResponsive`, `SafeResponsiveContainer` → 그대로 **component** (현재 위치 유지)
- 추후: 각 차트의 “순수 body” (recharts wrapper)도 `BarChart` / `LineChart` / `PieChart` 같은 이름으로 별도 **component**로 추출 검토
- `ChartContainer`(card 외곽) + 위 body + legend를 묶은 `*ChartCard`는 **pattern**

이 split을 적용하면 새 문서의 *Recommended Split* — “base reusable unit → component, screen/domain wrapper → pattern” 결과 정확히 부합한다.

---

## 3. 참고 — 새 기준이 유지하는 결정들

새 문서가 “조합되었다는 사실만으로 pattern이 아니다”라고 강조한 만큼, 아래는 *유지*로 본다.

- [`preview-card`](../../../src/components/data-display/preview-card.tsx) — media/title/desc/actions를 묶지만 `EmptyState`와 같은 generic feedback contract 결
- [`assignment-row`](../../../src/components/data-display/assignment-row.tsx) — title/desc/meta/control 슬롯이지만 generic row contract (도메인 약함)
- [`comment-thread`](../../../src/components/data-display/comment-thread.tsx) — 여러 item을 묶지만 item 배열 단일 contract
- [`stat-card`](../../../src/components/data-display/stat-card.tsx), [`info-row`](../../../src/components/data-display/info-row.tsx) — 단일 표시 contract

이 결정들이 흔들리면 그때 `tag-list-panel`/`form-section`/`filter-bar`/`selection-action-bar` 이동 검토와 함께 한 번에 다시 본다.

---

## 4. Sub-grouping 후보 — `patterns/shells/` 도메인별 분리

`shells/`는 현재 한 폴더에 ~140개 파일이 평면적으로 쌓여 있다. §1에서 이미 의미적으로 그룹핑한 도메인을 그대로 sub-folder로 만들 수 있다. component/pattern 분류는 그대로 두고, 폴더 위치만 정리하는 작업이다.

| 후보 sub-folder | 파일 묶음 |
| --- | --- |
| `shells/app/` | navigation, sidebar-shell, mobile-nav-shell, dataset-selector-mobile, expand-sidebar-btn |
| `shells/page/` | page-shell, page-primary-header, page-top-bar (현재 `patterns/page/` 그대로 유지 가능 — 이미 분리되어 있음) |
| `shells/catalog/` | catalog-shell, catalog-mobile-shell, catalog-right-panel |
| `shells/dashboard/` | dashboard-header, dashboard-stats-header, dashboard-overview-panel, dashboard-widget, dashboard-customize-popover, dashboard-date-range-popover |
| `shells/analysis/` | analysis-dashboard, analysis-widget-grid, analysis-widget-shell, analysis-* (개별 widget), per-dataset-distribution-widget, source-breakdown-widget, dataset-distribution-heatmap |
| `shells/class/` | class-list-sidebar, class-list-row, class-info-sidebar, class-info-section, class-images-panel, class-lightbox, class-pool-list, class-hover-card, add-class-dialog, color-input-row |
| `shells/dataset/` | dataset-list-item, dataset-list-panel, dataset-menu, dataset-filter-chip-row, add-dataset-modal, duplicate-dataset-modal |
| `shells/gallery/` | gallery-image-card, gallery-images-table, gallery-image-menu, gallery-toolbar, gallery-mobile-toolbar, gallery-filter-panel, gallery-detail-modal, gallery-delete-dialog, gallery-export-config-dialog, gallery-export-progress-dialog, gallery-dataset-transfer-dialog, hover-preview |
| `shells/labeling/` | image-inspector-canvas, labeling-canvas, canvas-overlays, annotation-toolbar, image-detail-sidebar, image-detail-class-list, image-detail-info-panel, image-detail-labelers-list, comments-panel, labeling-progress-bar, auto-save-status, bbox-navigation, image-context-menu, drag-drop-decide-modal |
| `shells/settings/` | settings-account-tab, settings-general-tab, settings-section, settings-row, settings-hint, delete-account-dialog, password-change-dialog, project-settings-form, project-resolution-card, delete-project-section, reference-image-drop-zone, reference-image-section, model-mapping-select |
| `shells/members/` | org-members-tab, org-settings-tab, invitations-section, invitations-tab, join-codes-section, member-pool-list, project-member-invite, project-members-list, project-member-row, project-permission-matrix, permission-help-tooltip |
| `shells/devices/` | devices-tab, devices-table, devices-forms, device-detail-dialog, devices-license-section, device-status-badge, license-info-display |
| `shells/storage/` | storage-analytics-tab, storage-overview, storage-stats-table, storage-recommendations-list |
| `shells/filters/` | filter-popover-trigger, sort-popover-trigger, filter-searchable-list, filter-section, filter-class-chip |
| (단독 유지) | igp-export-modal, upload-quality-modal, pattern-tabs, project-type-tag, widget-drag-handle |

### Chart cards (제안)

§2의 차트 카드 이동 검토 항목은 그 자체로 새 sub-folder가 된다.

- `shells/charts/` (제안): bar-chart-card, line-chart-card, pie-chart-card, chart-container

### Sub-grouping 판단 기준

새 sub-folder를 만들 때 다음을 확인한다.

- 같은 cluster의 파일이 3개 이상인가? (2개 이하는 단독 유지)
- cluster 이름이 도메인 명사로 자연스럽게 떨어지는가? (catalog, dataset, gallery, labeling 등)
- 같은 cluster 내 파일끼리 import 관계가 있는가? (예: `dataset-list-item`은 `dataset-list-panel`에 들어가고, `dataset-menu`는 `gallery-image-menu`의 base다)
- 새 sub-folder가 §1의 도메인 그룹과 1:1 매칭되는가?

`shells/`의 도메인 그룹은 §1에서 이미 13개로 정리되어 있어 매핑이 명확하다. 다만 이 분리는 ergonomic 정리일 뿐 component/pattern 분류 자체는 바꾸지 않는다.
