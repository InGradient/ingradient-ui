# Components — Expected Classification

이 문서는 [`../components-vs-patterns.md`](../components-vs-patterns.md) 기준으로 봤을 때 `@ingradient/ui/components`에 들어가야 한다고 분류한 항목 목록이다.

## Scope

- 기준: [`../components-vs-patterns.md`](../components-vs-patterns.md)
- 범위: 현재 [`src/components/`](../../../src/components/) 와 [`src/patterns/`](../../../src/patterns/) 의 모든 파일을 같은 기준으로 한 번 훑은 결과
- 출력: provisional classification만 기록한다. 폴더 구조 변경이나 파일 이동은 본 문서 범위가 아니다 ("지금 단계에서는 폴더 구조를 먼저 흔들지 않는다").

## 분류 기준 (요약)

- `component` — generic UI building block, props contract가 핵심, size/tone/state/variant가 public surface, 여러 pattern/page에 반복 삽입
- `pattern` — 여러 component를 묶어 UX 구조를 만든다, slot/pane 관계가 중요, caller가 안을 채워 화면 완성

> 내부적으로 여러 element를 조합했다는 사실만으로 `pattern`이 되지 않는다.
> 부품이면 `component`, 조립 구조면 `pattern`.

borderline 항목은 4-tuple로 기록한다.

- `current` — 지금 위치
- `classification` — 새 기준 분류
- `why` — generic contract인지, composition structure인지
- `follow-up` — 유지 / 이동 검토 / split 검토

---

## 1. 유지 — 이미 `src/components/`에 있고, 새 기준에서도 `component`

### `charts/` (primitive만)

차트 카드는 “card 외곽 + 헤더 + legend + 차트 body”를 묶은 composition이므로 pattern으로 분류한다 (§2 이동 검토 참고). 여기서는 *카드 안에 들어가는 부품*만 component로 둔다.

| 파일 | why |
| --- | --- |
| [`chart-legend`](../../../src/components/charts/chart-legend.tsx) | 단일 legend contract |
| [`chart-tooltip`](../../../src/components/charts/chart-tooltip.tsx) | 단일 tooltip contract |
| [`pie-slice-label`](../../../src/components/charts/pie-slice-label.tsx) | 단일 label primitive |
| [`chart-responsive`](../../../src/components/charts/chart-responsive.tsx) | generic sizing primitive |
| [`safe-responsive-container`](../../../src/components/charts/safe-responsive-container.tsx) | 동일 |

### `data-display/`

| 파일 | why |
| --- | --- |
| [`table`](../../../src/components/data-display/table.tsx) | generic table contract — Quick Rule 예시 그대로 |
| [`info-row`](../../../src/components/data-display/info-row.tsx) | label + value 한 줄 contract |
| [`stat-card`](../../../src/components/data-display/stat-card.tsx) | 단일 stat 표시 contract |
| [`preview-card`](../../../src/components/data-display/preview-card.tsx) | media + title + actions 통합 contract — generic feedback contract와 동일 결 |
| [`image-grid`](../../../src/components/data-display/image-grid.tsx), [`image-grid-cell`](../../../src/components/data-display/image-grid-cell.tsx), [`virtualized-image-grid`](../../../src/components/data-display/virtualized-image-grid.tsx) | generic image grid contract |
| [`image-viewer`](../../../src/components/data-display/image-viewer.tsx) | generic viewer shell |
| [`progress-block`](../../../src/components/data-display/progress-block.tsx) | 단일 progress block contract |
| [`selectable-list-item`](../../../src/components/data-display/selectable-list-item.tsx) | 새 문서 예시 그대로 — generic reusable row contract |
| [`search-result-row`](../../../src/components/data-display/search-result-row.tsx) | generic row contract |
| [`assignment-row`](../../../src/components/data-display/assignment-row.tsx) | title/desc/meta/control slot 한 contract — 도메인 약함 |
| [`tag-list`](../../../src/components/data-display/tag-list.tsx) | 단일 list contract |
| [`chip-group`](../../../src/components/data-display/chip-group.tsx) | 단일 chip group contract |
| [`color-swatch`](../../../src/components/data-display/color-swatch.tsx) | primitive |
| [`dataset-task-tag`](../../../src/components/data-display/dataset-task-tag.tsx) | 새 문서 예시 그대로 — domain 이름이 있어도 generic tag contract |
| [`annotation-overlay`](../../../src/components/data-display/annotation-overlay.tsx), [`annotation-overlay-interactive`](../../../src/components/data-display/annotation-overlay-interactive.tsx) | image 위 generic 그리기 contract |
| [`drawing-layer`](../../../src/components/data-display/drawing-layer.tsx) | generic canvas drawing primitive |
| [`comment-thread`](../../../src/components/data-display/comment-thread.tsx) | item 배열 → thread contract |
| [`keyboard-shortcut-hint`](../../../src/components/data-display/keyboard-shortcut-hint.tsx) | 단일 hint contract |
| [`resizable-panel`](../../../src/components/data-display/resizable-panel.tsx) | generic resize primitive |

### `feedback/`

| 파일 | why |
| --- | --- |
| [`alert`](../../../src/components/feedback/alert.tsx) | 단일 alert contract |
| [`toast`](../../../src/components/feedback/toast.tsx) | 단일 toast contract |
| [`badge`](../../../src/components/feedback/badge.tsx) | 단일 badge contract |
| [`notification-badge`](../../../src/components/feedback/notification-badge.tsx) | 단일 badge variant |
| [`group-count-badge`](../../../src/components/feedback/group-count-badge.tsx) | 단일 badge variant |
| [`avatar-badge` (story)](../../../src/components/feedback/avatar-badge.stories.tsx) | badge variant |
| [`empty-state`](../../../src/components/feedback/empty-state.tsx) | 새 문서 예시 그대로 — generic feedback contract |
| [`spinner`](../../../src/components/feedback/spinner.tsx), [`skeleton`](../../../src/components/feedback/skeleton.tsx), [`progress`](../../../src/components/feedback/progress.tsx) | primitive feedback contract |
| [`status`](../../../src/components/feedback/status.tsx) | 단일 status display contract |
| [`step-indicator`](../../../src/components/feedback/step-indicator.tsx) | 단일 step indicator contract |
| [`sync-status-chip`](../../../src/components/feedback/sync-status-chip.tsx) | tone/state 중심 chip contract |
| [`media-overlay`](../../../src/components/feedback/media-overlay.tsx) | generic media overlay primitive |
| [`error-boundary`](../../../src/components/feedback/error-boundary.tsx) | utility wrapper |

### `icons/`

| 파일 | why |
| --- | --- |
| [`catalog-icons`](../../../src/components/icons/catalog-icons.tsx), [`registry`](../../../src/components/icons/registry.ts) | icon registry — generic primitive |
| [`icon-gallery`](../../../src/components/icons/icon-gallery.tsx) | gallery display contract |

### `inputs/`

모두 단일 input contract로 size/tone/state가 public surface인 generic control이다.

- [`button`](../../../src/components/inputs/button.tsx), [`icon-button`](../../../src/components/inputs/icon-button.tsx), [`copy-button`](../../../src/components/inputs/copy-button.tsx)
- [`text-fields`](../../../src/components/inputs/text-fields.tsx), [`number-field`](../../../src/components/inputs/number-field.tsx), [`search-field`](../../../src/components/inputs/search-field.tsx), [`select-field`](../../../src/components/inputs/select-field.tsx)
- [`mention-textarea`](../../../src/components/inputs/mention-textarea.tsx)
- [`toggles`](../../../src/components/inputs/toggles.tsx), [`checkbox-group`](../../../src/components/inputs/checkbox-group.tsx), [`radio-card-group`](../../../src/components/inputs/radio-card-group.tsx), [`mode-switcher`](../../../src/components/inputs/mode-switcher.tsx)
- [`date-picker`](../../../src/components/inputs/date-picker.tsx), [`date-range-field`](../../../src/components/inputs/date-range-field.tsx)
- [`dropdown-select`](../../../src/components/inputs/dropdown-select.tsx)
- [`file-input`](../../../src/components/inputs/file-input.tsx), [`upload-dropzone`](../../../src/components/inputs/upload-dropzone.tsx)

### `navigation/`

| 파일 | why |
| --- | --- |
| [`tabs`](../../../src/components/navigation/tabs.tsx) | 새 문서 Heuristics 그대로 — generic UI noun |
| [`vertical-tabs`](../../../src/components/navigation/vertical-tabs.tsx) | tabs variant |
| [`breadcrumbs`](../../../src/components/navigation/breadcrumbs.tsx) | 단일 nav contract |
| [`pagination`](../../../src/components/navigation/pagination.tsx) | 단일 pagination contract |
| [`stepper`](../../../src/components/navigation/stepper.tsx) | 단일 stepper contract |

### `overlays/`

| 파일 | why |
| --- | --- |
| [`tooltip`](../../../src/components/overlays/tooltip.tsx), [`popovers`](../../../src/components/overlays/popovers.tsx) | 단일 overlay primitive |
| [`context-menu`](../../../src/components/overlays/context-menu.tsx) | 단일 menu primitive |
| [`dialog-shell`](../../../src/components/overlays/dialog-shell.tsx), [`dialog-close-button`](../../../src/components/overlays/dialog-close-button.tsx), [`modal-primitives`](../../../src/components/overlays/modal-primitives.tsx) | dialog primitive contract |
| [`drawer`](../../../src/components/overlays/drawer.stories.tsx) | dialog variant |
| [`filter-popover`](../../../src/components/overlays/filter-popover.tsx) | generic popover contract (filter 내용은 caller가 채움) |
| [`settings-dialog`](../../../src/components/overlays/settings-dialog.tsx) | dialog shell contract |
| [`use-confirm`](../../../src/components/overlays/use-confirm.tsx) | hook + 확인 다이얼로그 primitive |

### `shared/` (내부)

| 파일 | why |
| --- | --- |
| [`button-root`](../../../src/components/shared/button-root.tsx), [`button-types`](../../../src/components/shared/button-types.ts) | components 내부에서 공유하는 primitive |

---

## 2. 이동 검토 — 지금은 `src/patterns/`에 있지만 새 기준에서는 `component`

| 파일 | current | classification | why | follow-up |
| --- | --- | --- | --- | --- |
| [`pattern-tabs.tsx`](../../../src/patterns/shells/pattern-tabs.tsx) | patterns/shells | component | item 배열 + active id 단일 contract — 사실상 generic tabs variant | 이동 검토 |
| [`device-status-badge.tsx`](../../../src/patterns/shells/device-status-badge.tsx) | patterns/shells | component | tone variant + children — `DatasetTaskTag` 선례에 동일 | 이동 검토 |
| [`project-type-tag.tsx`](../../../src/patterns/shells/project-type-tag.tsx) | patterns/shells | component | tone variant 단일 tag — 같은 사유 | 이동 검토 |
| [`expand-sidebar-btn.tsx`](../../../src/patterns/shells/expand-sidebar-btn.tsx) | patterns/shells | component | onClick 하나만 받는 icon button wrapper | 이동 검토 |
| [`settings-hint.tsx`](../../../src/patterns/shells/settings-hint.tsx) | patterns/shells | component | 단일 styled `<p>` — props contract가 명확 | 이동 검토 |
| [`widget-drag-handle.tsx`](../../../src/patterns/shells/widget-drag-handle.tsx) | patterns/shells | component | icon button wrapper, 부품 성격 | 이동 검토 |
| [`permission-help-tooltip.tsx`](../../../src/patterns/shells/permission-help-tooltip.tsx) | patterns/shells | component | trigger + bubble — generic help tooltip contract에 가까움 | 이동 검토 |
| [`filter-class-chip.tsx`](../../../src/patterns/shells/filter-class-chip.tsx) | patterns/shells | component | checkbox + color + label 한 줄 칩 — generic chip primitive | 이동 검토 |

> 새 문서 *Important Clarification* — “내부적으로 여러 element/component를 썼다고 자동으로 pattern이 아니다”에 비춰보면 위 항목은 외부 contract가 단일 control이라 component 쪽이 맞다. 다만 *Current Policy* 에 따라 본 PR에서는 이동하지 않는다.

---

## 3. 참고 — “patterns로 보이지만 component”의 일관된 패턴

위 이동 검토 후보의 공통점은 다음과 같다.

- public surface가 `tone`, `state`, `onClick`, `children` 같은 단일 contract다
- slot 관계가 없거나 한 곳뿐이다
- 여러 pattern/page에 반복 삽입되는 부품 역할이다
- Storybook에서 composition example보다 single-state review가 더 자연스럽다

이 결과가 더 쌓이면 그때 실제 이동/export 정리를 묶어서 검토한다.

---

## 4. Sub-grouping 후보 — 카테고리 내부의 자연스러운 cluster

대부분의 카테고리가 한 폴더에 평면적으로 쌓여있다. component/pattern 분류는 그대로 두고, 카테고리 내부를 **sub-folder**로 한 단계 더 나눌 수 있는 cluster가 보인다. 본 PR에서는 실제 폴더 분리를 하지 않고 후보만 기록한다 (*Current Policy*).

### `charts/` — parts 분리

차트 카드(`*ChartCard`)와 `ChartContainer`를 patterns로 옮긴다고 가정하면, 남는 component는 다음 두 결로 나뉜다.

| 후보 sub-folder | 파일 | 공통점 |
| --- | --- | --- |
| `charts/parts/` | [`chart-legend`](../../../src/components/charts/chart-legend.tsx), [`chart-tooltip`](../../../src/components/charts/chart-tooltip.tsx), [`pie-slice-label`](../../../src/components/charts/pie-slice-label.tsx) | 차트 body 안에 직접 렌더되는 작은 부품 (`<Tooltip content={…} />`, `<Pie label={…} />`, header legend) |
| `charts/sizing/` | [`chart-responsive`](../../../src/components/charts/chart-responsive.tsx), [`safe-responsive-container`](../../../src/components/charts/safe-responsive-container.tsx) | recharts에 width/height을 주입하는 sizing primitive |

### `data-display/` — 가장 평면적인 카테고리

현재 26개 파일이 한 폴더에 모여있다. 자연스러운 cluster:

| 후보 sub-folder | 파일 |
| --- | --- |
| `data-display/rows/` | [`selectable-list-item`](../../../src/components/data-display/selectable-list-item.tsx), [`search-result-row`](../../../src/components/data-display/search-result-row.tsx), [`assignment-row`](../../../src/components/data-display/assignment-row.tsx), [`info-row`](../../../src/components/data-display/info-row.tsx) |
| `data-display/tags/` | [`tag-list`](../../../src/components/data-display/tag-list.tsx), [`chip-group`](../../../src/components/data-display/chip-group.tsx), [`color-swatch`](../../../src/components/data-display/color-swatch.tsx), [`dataset-task-tag`](../../../src/components/data-display/dataset-task-tag.tsx) |
| `data-display/cards/` | [`preview-card`](../../../src/components/data-display/preview-card.tsx), [`stat-card`](../../../src/components/data-display/stat-card.tsx) |
| `data-display/image-grid/` | [`image-grid`](../../../src/components/data-display/image-grid.tsx), [`image-grid-cell`](../../../src/components/data-display/image-grid-cell.tsx), [`virtualized-image-grid`](../../../src/components/data-display/virtualized-image-grid.tsx), [`use-grid-selection`](../../../src/components/data-display/use-grid-selection.ts) |
| `data-display/annotation/` | [`annotation-overlay`](../../../src/components/data-display/annotation-overlay.tsx), [`annotation-overlay-interactive`](../../../src/components/data-display/annotation-overlay-interactive.tsx), [`drawing-layer`](../../../src/components/data-display/drawing-layer.tsx) |
| (단독 유지) | [`table`](../../../src/components/data-display/table.tsx), [`image-viewer`](../../../src/components/data-display/image-viewer.tsx), [`comment-thread`](../../../src/components/data-display/comment-thread.tsx), [`keyboard-shortcut-hint`](../../../src/components/data-display/keyboard-shortcut-hint.tsx), [`resizable-panel`](../../../src/components/data-display/resizable-panel.tsx), [`progress-block`](../../../src/components/data-display/progress-block.tsx) |

### `feedback/` — badge family 분리

| 후보 sub-folder | 파일 |
| --- | --- |
| `feedback/badges/` | [`badge`](../../../src/components/feedback/badge.tsx), [`notification-badge`](../../../src/components/feedback/notification-badge.tsx), [`group-count-badge`](../../../src/components/feedback/group-count-badge.tsx), avatar-badge (story-only), [`sync-status-chip`](../../../src/components/feedback/sync-status-chip.tsx) |
| `feedback/loading/` | [`spinner`](../../../src/components/feedback/spinner.tsx), [`skeleton`](../../../src/components/feedback/skeleton.tsx), [`progress`](../../../src/components/feedback/progress.tsx) |
| `feedback/notifications/` | [`alert`](../../../src/components/feedback/alert.tsx), [`toast`](../../../src/components/feedback/toast.tsx) |
| (단독 유지) | [`empty-state`](../../../src/components/feedback/empty-state.tsx), [`status`](../../../src/components/feedback/status.tsx), [`step-indicator`](../../../src/components/feedback/step-indicator.tsx), [`media-overlay`](../../../src/components/feedback/media-overlay.tsx), [`error-boundary`](../../../src/components/feedback/error-boundary.tsx) |

### `inputs/` — 컨트롤 타입별

지금 한 폴더에 ~25개 파일. 타입별로 명확하게 갈린다:

| 후보 sub-folder | 파일 |
| --- | --- |
| `inputs/buttons/` | [`button`](../../../src/components/inputs/button.tsx), [`icon-button`](../../../src/components/inputs/icon-button.tsx), [`copy-button`](../../../src/components/inputs/copy-button.tsx) |
| `inputs/text/` | [`text-fields`](../../../src/components/inputs/text-fields.tsx), [`number-field`](../../../src/components/inputs/number-field.tsx), [`search-field`](../../../src/components/inputs/search-field.tsx), [`mention-textarea`](../../../src/components/inputs/mention-textarea.tsx) |
| `inputs/select/` | [`select-field`](../../../src/components/inputs/select-field.tsx), [`dropdown-select`](../../../src/components/inputs/dropdown-select.tsx), [`dropdown-shared`](../../../src/components/inputs/dropdown-shared.tsx), [`dropdown-layout`](../../../src/components/inputs/dropdown-layout.ts) |
| `inputs/toggles/` | [`toggles`](../../../src/components/inputs/toggles.tsx), [`checkbox-group`](../../../src/components/inputs/checkbox-group.tsx), [`radio-card-group`](../../../src/components/inputs/radio-card-group.tsx), [`mode-switcher`](../../../src/components/inputs/mode-switcher.tsx) |
| `inputs/date/` | [`date-picker`](../../../src/components/inputs/date-picker.tsx), [`date-range-field`](../../../src/components/inputs/date-range-field.tsx) |
| `inputs/files/` | [`file-input`](../../../src/components/inputs/file-input.tsx), [`upload-dropzone`](../../../src/components/inputs/upload-dropzone.tsx) |

### `overlays/` — dialog vs floating

| 후보 sub-folder | 파일 |
| --- | --- |
| `overlays/dialog/` | [`dialog-shell`](../../../src/components/overlays/dialog-shell.tsx), [`dialog-close-button`](../../../src/components/overlays/dialog-close-button.tsx), [`modal-primitives`](../../../src/components/overlays/modal-primitives.tsx), [`settings-dialog`](../../../src/components/overlays/settings-dialog.tsx), drawer (story-only), [`use-confirm`](../../../src/components/overlays/use-confirm.tsx) |
| `overlays/floating/` | [`tooltip`](../../../src/components/overlays/tooltip.tsx), [`popovers`](../../../src/components/overlays/popovers.tsx), [`filter-popover`](../../../src/components/overlays/filter-popover.tsx), [`context-menu`](../../../src/components/overlays/context-menu.tsx) |

### `navigation/` — tabs vs page-nav

| 후보 sub-folder | 파일 |
| --- | --- |
| `navigation/tabs/` | [`tabs`](../../../src/components/navigation/tabs.tsx), [`vertical-tabs`](../../../src/components/navigation/vertical-tabs.tsx) |
| `navigation/page-nav/` | [`breadcrumbs`](../../../src/components/navigation/breadcrumbs.tsx), [`pagination`](../../../src/components/navigation/pagination.tsx), [`stepper`](../../../src/components/navigation/stepper.tsx) |

### Sub-grouping 판단 기준

새 sub-folder를 만들 때 다음을 확인한다.

- 같은 cluster의 파일이 3개 이상인가? (2개 이하는 단독 유지)
- cluster 이름이 어색하지 않은 generic noun인가? (rows, tags, badges, dialog, floating 같은)
- import path가 짧아지고 카테고리 찾기가 쉬워지는가?
- cluster 내부 파일끼리 서로 import하거나 공유 helper를 갖는가? (응집도 신호)

이 기준을 만족하지 못하면 단독 유지를 우선한다.
