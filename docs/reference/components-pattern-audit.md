# Components Pattern Audit

[Components Vs Patterns](./components-vs-patterns.md) 기준으로 `src/components/` 전체를 1회 분류한 결과를 고정한다.

이 문서는 정책이 아니라 현황 기록이다. 정책 본문은 분리된 파일에 둔다.

## How To Read

- 각 표는 한 단위에 대한 단발 결정 기록이다.
- `근거`는 정책 본문의 어느 기준이 적용됐는지 한 줄로 적는다.
- `결정`은 `이동` `split` `유지` `보류` 넷 중 하나다.
- `보류`는 다음 라운드에서 다시 본다. 근거 없이 미루는 칸이 아니다.

## A. Pattern 으로 이동

| 현재 위치 | 단위 | 근거 | 결정 |
|---|---|---|---|
| `src/components/charts/bar-chart-card.tsx` | `BarChartCard` | ChartContainer + ChartLegend + ChartTooltip + Responsive 조합. card composition. | 이동 |
| `src/components/charts/line-chart-card.tsx` | `LineChartCard` | 위와 동일 구조. | 이동 |
| `src/components/charts/pie-chart-card.tsx` | `PieChartCard` | 위와 동일 구조. | 이동 |
| `src/components/charts/chart-container.tsx` | `ChartContainer` | title / description / legend / headerExtra slot 가진 chart card shell. | 이동 |
| `src/components/data-display/image-grid.tsx` | `ImageGrid` | gallery 도메인, cell composition host. | 이동 + split (B-3) |
| `src/components/data-display/image-grid-cell.tsx` | `ImageGridCell` | renderCellOverlay / TopRight / Footer slot, gallery composition. | 이동 + split (B-4) |
| `src/components/data-display/virtualized-image-grid.tsx` | `VirtualizedImageGrid` | ImageGrid 의 가상화 wrapper. 같은 도메인. | 이동 |
| `src/components/data-display/drawing-layer.tsx` | `DrawingLayer` | annotation 도메인, ImageViewerContext 소비. | 이동 |
| `src/components/data-display/annotation-overlay.tsx` | `AnnotationOverlay` | annotation 도메인 composition. | 이동 + split (B-5) |
| `src/components/data-display/annotation-overlay-interactive.*` | (별도 컴포넌트 없음, stories + helpers 만) | annotation 도메인 stories. | 이동 |
| `src/components/overlays/settings-dialog.tsx` | `SettingsDialog` | Sidebar + MainPanel 고정 구조. settings 도메인 wrapper. | 이동 + split (B-6) |
| `src/components/overlays/use-confirm.tsx` | `useConfirm` hook + `ConfirmProvider` | hook + Provider 는 사용 흐름. `ConfirmDialog` 자체는 component 로 잔류. | 이동 |

## B. Split — base component 신설

각 항목은 옮기면서 base 를 component 로 따로 뽑는다.

| 옮기는 pattern | 신설 base component | 위치 |
|---|---|---|
| `CommentThread` wrapper | `CommentItem`, `CommentInput` 그대로 components 에 잔류 | `src/components/data-display/comment-thread.tsx` |
| `AssignmentRow` | `LabelValueRow` 로 rename (도메인 default 없어 wrapper 무의미, 사용처도 story 뿐) | `src/components/data-display/label-value-row.tsx` |
| `ImageGrid` | `GridContainer` (auto-fit grid layout) | `src/components/layouts/grid-container.tsx` |
| `ImageGridCell` | `SelectableGridCell` (selection + dragOver + slot) | `src/components/data-display/selectable-grid-cell.tsx` |
| `AnnotationOverlay` / `AnnotationOverlayInteractive` | `coverCropRegion` utility (중복 제거) | `src/components/shared/cover-crop.ts` |
| `SettingsDialog` | `TwoColumnDialog` (Header + Sidebar + MainPanel 골격) | `src/components/overlays/two-column-dialog.tsx` |
| `ChartLegend` (잔류) | `LegendItem` (ColorSwatch + label inline-flex) | `src/components/data-display/legend-item.tsx` |
| `ChartTooltipContent` (잔류) | `TooltipCard` (surfaceRaised card) | `src/components/feedback/tooltip-card.tsx` |
| `ChartTooltipContent` (잔류) | `KeyValueRow` (label / value 양끝 row) | `src/components/data-display/key-value-row.tsx` |

## C. Component 유지

정책 기준상 contract 가 generic 이라 그대로 둔다.

- `ChartLegend` — props 가 `{ items: { label, color }[] }`. 내부 swatch + label item 은 `LegendItem` 으로 분리 (B-8). swatch 는 기존 `ColorSwatch` 활용.
- `ChartTooltipContent` — recharts `Tooltip content` slot 용 adapter. 내부 card + label/value row 는 `TooltipCard`, `KeyValueRow` 로 분리 (B-8).
- `DialogShell` — `{ title, description, children, actions, onClose }` generic dialog contract.
- `ConfirmDialog` — DialogShell + Button 조합이지만 contract 자체는 generic. 이전 라운드 분류를 정정.
- `ChartResponsive`, `PieSliceLabel`, `SafeResponsiveContainer` — chart 내부 generic helper.

## D. 보류 (다음 라운드)

지금 손대지 않는다. 새 사용처가 등장하거나 다른 split 이 합쳐질 때 다시 본다.

| 단위 | 보류 이유 |
|---|---|
| `ImageViewer` | useZoomPan host + DrawingLayer Context provider. generic image viewer 로 볼 여지 있음. |
| `TagListPanel` | search + select 조합이라 pattern 같지만 `SearchableList` 같은 base 가 먼저 필요. |
| `TagList` | color swatch 의존이 strong domain 은 아님. selectable list 일반화 가능. |
| `FilterPopover` | popover 자체는 generic, `FilterPopoverSection` 이 도메인 helper. 한쪽만 옮기는 문제 |
| `SearchResultRow` | `{ primary, secondary, actionLabel }` generic 인데 이름만 도메인. |
| `DrawingLayer` 내부 SVG primitive (`BboxLabel`, `BboxHandles`, `RectObject`, `PointObject`) | 다른 viewer / editor 가 등장하면 `SvgBboxShape` / `SvgPointShape` / `SvgShapeLabel` / `SvgShapeHandle` 로 추출. 지금은 내부 helper 유지. |

## Next Round Triggers

다음 라운드는 아래 중 하나라도 생기면 연다.

- 보류 항목과 같은 도메인의 새 단위가 추가된다
- 보류 항목을 다른 pattern 이 재사용한다
- 같은 SVG primitive 가 새 viewer / editor 에서 또 등장한다

---

# Round 2

1차 audit 이후 `inputs/` `navigation/` `feedback/` 폴더 + 잔여 `data-display/` `overlays/` `charts/` 를 다시 훑었다. 1차에서 놓친 후보 발견.

## A. 처리 완료

| 항목 | 조치 |
|---|---|
| `feedback/badge.tsx` 가 `Badge` + `Chip` + `Avatar` 3 추상화 혼재 | `feedback/chip.tsx`, `feedback/avatar.tsx` 분리. `badge.tsx` 는 `Badge` 만. |
| `search-field` + `number-field` 가 같은 absolute slot 패턴을 각자 구현 | `inputs/input-adornment.tsx` (`InputAdornment` — side / inset / stretchY) 신설 후 양쪽 리팩터. |
| `StatCard`, `PreviewCard`, `ProgressBlock` — surface 카드 + slot composition 패턴 | `src/patterns/cards/` 로 이동. |
| 4 단위 (`StatCard`, `PreviewCard`, `ProgressBlock`, `LabelValueRow`) 의 surface + radius + padding 중복 | `data-display/card.tsx` (`Card` primitive — elevation / radius / padding / overflow) 신설. 4 단위 모두 base 로 사용. |

## B. 평가 후 보류

| 항목 | 보류 이유 |
|---|---|
| `dropdown-shared/DropdownMenu` + `mention-textarea/Menu` (PopoverMenu 통합 후보) | 실제 코드 확인 결과 시각 (gradient vs solid, border-strong vs subtle, radius/padding 다름) + positioning (fixed portal vs absolute parent) 모두 달라 base 추출 가치 작음. 양쪽 모두 거의 모든 css 를 override 해야 함. |
| `Tabs` ↔ `VerticalTabs` highlight 공통화 | 재확인 결과 horizontal 과 vertical 의 차이가 커서 (border-left, $left/$width vs $top/$height) 진짜 공통은 `position:absolute + transition + pointer-events:none` 3 줄. over-extraction. |
| ~~`SegmentedControl` 추출 (mode-switcher)~~ | **처리됨**: `mode-switcher.tsx` 가 이미 generic. `SegmentedControl` alias 추가로 이름 명확화. |
| `SelectableList` / `OptionList` (checkbox-group + radio-card-group) | medium. 동일. |
| ~~`InlineMessage` (alert.tsx 내부 variant)~~ | **이미 분리됨**: `alert.tsx` 에 `export const InlineMessage = styled(Alert)` 로 노출. 보류 분류가 오기였음. |
| ~~`NotificationBubble` (notification-badge.tsx 내부 styled)~~ | **처리됨**: 비공개 `Bubble` styled 를 `export const NotificationBubble` 로 노출. |
| `StateChip` (sync-status-chip → generic state map chip) | 재확인 결과 `SyncState` enum 이 hardcoded. generic 화 = state→style map 을 prop 으로 받는 큰 리팩터. 사용처 1 곳뿐이라 가치 작음. |
| `PopoverTriggerField` (date-picker 가 dropdown 패턴 재발명) | high gain 이지만 큰 리팩터. 다음 라운드. |
| `ChartResponsive` vs `SafeResponsiveContainer` 통일 | 사용 패턴 미묘하게 달라 회귀 위험. 보류. |
| `InfoRow` ↔ `KeyValueRow` 통합 | 라벨 정렬 (baseline + min-width) vs 양끝 정렬 시나리오 다름. 합치면 둘 다 약화. 양립 유지. |
| `LabelValueRow` 를 patterns 로 이동 | Card primitive 활용 후 components 잔류로 결정. 사용처 등장 시 재평가. |
| `toggles.tsx` 의 `ToggleIndicator` 공통화 | track / box / dot 시각 다름. 가치 작음. |
| `form-section.tsx` row 분리 | 더 쪼개면 과한 추상화. |

---

# Round 3 — Token 일관성

방향 전환. 1~2차에서 shell 추출 후보를 찾았지만 실제 코드 보니 표면적 중복일 뿐이었음. 진짜 문제는 `src/patterns/shells/` 내부에서 design token 을 일관되게 안 쓰고 raw px / hex / rgba 가 흩어져 있다는 점. **추출보다 token 일관성 잡기가 먼저**라는 인사이트.

## A. 처리 완료

| 카테고리 | 변경 | 시각 영향 |
|---|---|---|
| Spacing (padding / margin / gap) | 65 파일에 252 개 `Npx` → `var(--ig-space-N)` | 0 (1:1 매핑) |
| Radius — 정확 매핑 | 21 개 (10/12/14/16/18/20/22/24/999 px → 대응 token) | 0 |
| Radius — 근사 매핑 | 30 개 (6/8/4 px → `var(--ig-radius-xs)` = 10px) | 미세 (2-4px 더 둥글어짐, 4px 케이스 2 곳은 6px 차이) |
| Color — 정확/semantic 매핑 | 9 개 (gallery-toolbar `rgba(12,15,20,0.76)` → `surface-header` 등) | 미세 (alpha 0.04 차이 통합) |

자동화 스크립트: `/tmp/migrate_spacing.py`, `/tmp/migrate_radius.py` (재실행 가능). Color 는 case-by-case 수동 처리.

**확장 (shells 외 영역)**

| 영역 | 변경 |
|---|---|
| `src/components/` spacing | 9 changes / 6 files (search-field padding 계산식 등) |
| `src/components/` radius | 3 changes (toggles.tsx `4px` → xs 등) |
| `src/primitives/` radius | 2 changes (surface.tsx fallback `'20px'` → `'var(--ig-radius-2xl)'`) |
| `src/patterns/` (charts/annotation/gallery/dialogs/cards/comment/page/layouts/shared) | 0 (이미 작성 시 token 사용) |

## B. Raw 유지 + 후속 작업 필요

semantic token 이 아직 없어 raw 그대로 둔 케이스. 새 token 추가 시 정리 가능.

| 위치 | 값 | 의도 | 필요 token 제안 |
|---|---|---|---|
| `class-lightbox.tsx:8` | `rgba(0, 0, 0, 0.85)` | lightbox modal backdrop | `--ig-color-modal-backdrop` |
| `class-lightbox.tsx:60` | `rgba(7, 10, 20, 0.7)` | lightbox content surface | `--ig-color-modal-content-bg` |
| `canvas-overlays.tsx:90` | `rgba(12, 12, 12, 0.28)` | canvas dim overlay (약) | `--ig-color-canvas-overlay-soft` |
| `canvas-overlays.tsx:122` | `rgba(12, 12, 12, 0.72)` | canvas dim overlay (강) | `--ig-color-canvas-overlay-strong` |
| `dataset-distribution-heatmap.tsx:35` | `rgba(77, 136, 255, ${dynamic})` | 데이터 강도 기반 동적 alpha | 정당한 raw 유지 (계산식) |
| `gallery-image-card.tsx:75` | `linear-gradient(to top, rgba(0,0,0,0.55), transparent)` | footer fade gradient | gradient mixin / token? |

## C. 발견된 시스템 외 값

radius token scale 의 최소가 `xs:10px`. shell 들이 `6px`, `8px`, `4px` 같은 더 작은 radius 를 다수 사용 중이었다. 이번 라운드는 `xs(10)` 으로 통일 (사용자 결정). 추후 디자인 시스템에 `2xs:6` / `xxs:8` 같은 더 작은 radius token 도입 검토 가치 있음.

## Next Round Triggers — Round 4

- shells 외 영역 (`src/components/`, `src/patterns/page,layouts,shared`) 도 같은 token audit
- `src/components/inputs/` 일부에 raw `font-size: 15px` 같은 typography raw 값 존재 — typography token 매핑
- backdrop/overlay 색 semantic token 추가 (B 표)
- 이 라운드의 4px → 10px 변화 시각 검토 (member-pool-list RemoveBtn, source-breakdown-widget) — 디자인 의도와 다르면 원복

---

# Round 4 — 보류 항목 장기 가치 재평가

기존 R1/R2 보류 항목 13 개를 "현재 사용처" 가 아니라 "장기 일관성 + 명확한 추상화" 관점으로 다시 본 라운드. 결과: 4 개 처리, 5 개는 재확인 후 정직하게 skip (이미 분리 / 이미 generic / 회귀 위험).

## A. 처리 완료

| # | 항목 | 조치 |
|---|---|---|
| R4-1 | `SearchResultRow` → `OptionRow` rename | 도메인 prefix 제거. contract `{ primary, secondary, actionLabel }` 가 generic. 파일 + 사용처 2 곳 (project-member-invite, invitations-section) 모두 새 이름. alias 없음. |
| R4-2 | `LabelValueRow` → `src/patterns/cards/` 이동 | composition pattern 으로 분류 (Card + RowGrid + ActionBar 조합). components 잔류는 책임 모호함. |
| R4-3 | `FilterPopoverSection` 별도 파일 분리 | `src/components/overlays/filter-popover-section.tsx` 신설. `filter-popover.tsx` 와 책임 분리. 둘 다 generic. |
| R4-7 | `TagListItem` 추출 | `TagList` (sidebar 형) + `TagListSearch` (autocomplete 형) 둘 다 `ColorSwatch + label + count` visual 을 재발명 중이었음. 공통 `TagListItem` (color, label, active, count) component 신설. 두 곳에서 사용. |

## B. 재확인 결과 skip (정직한 평가)

| # | 항목 | skip 이유 |
|---|---|---|
| R4-4 | `SelectableList` / `OptionList` (checkbox-group + radio-card-group 공통화) | 실제 비교 시 두 단위가 의외로 다름. CheckboxGroup 은 bordered scrollable container + select-all header + Checkbox 사용, RadioCardGroup 은 flex column + full-width card button. 공통은 `display: flex; flex-direction: column` 3 줄 정도. over-extraction. |
| R4-5 | `form-section.tsx` row 분리 (FormFieldRow generic) | **이미 잘 분리되어 있음**. `FormGroup` + `FieldRow` + `FormField` 가 별도 export 로 책임 분리. 보류 분류가 오기였음. |
| R4-6 | `ImageViewer` 분류 재평가 | 분류만 변경 (보류 → component 유지 확정). contract `{ src, alt, zoomOptions, onZoomChange, children }` generic. useZoomPan 이미 hook 으로 분리. 도메인 의존 없음. 코드 변경 0. |
| R4-8 | `DrawingLayer` 내부 SVG primitive (Bbox/Point/Label/Handle) | **이미 `.renderers.tsx` 로 분리되어 있음**. `RectObject`, `PointObject` 가 export. `DrawingObject` 타입은 prop 으로 받는 형태라 다른 viewer 에서 import 가능. 더 generic 화 (`SvgBboxShape` 등) 는 사용처 등장 시 정확한 contract 설계 가능. |
| R4-9 | `PopoverTriggerField` 추출 (date-picker + dropdown 일관성) | `useDropdownLayout` (dropdown-shared) 의 contract 는 width 강제, date-picker 의 Popover 는 DayPicker 고유 너비 사용. 통합 시 width override 부담 + 동작 회귀 위험. PopoverField 가족 (color/time picker 등) 이 실제로 등장하면 그때 정확한 contract 설계 가능. |

## C. 결론 — Audit 정확도에 대한 메타 노트

R4 진행 결과 9 개 중 5 개가 "이미 분리됨" / "재확인 시 차이 큼" / "회귀 위험" 으로 skip 됨. 1~3 차 audit 에이전트들이 표면적 유사성을 보고 "추출 후보" 로 잡은 케이스가 다수. **장기 가치 관점도 실제 코드와 대조 필수**. 표면적 유사성 ≠ 진짜 base 가능성.

## D. 진짜 남은 보류 (다음 라운드 트리거 대기)

새 사용처나 디자인 변경 같은 명확한 트리거가 없으면 미룸:

- `TagListPanel` 의 search dropdown 패턴 — 다른 autocomplete 등장 시 `SearchableList` 추출
- `DrawingLayer` SVG primitive 의 generic shape props 화 — 다른 annotation viewer / editor 등장 시
- `PopoverTriggerField` 가족 — color/time picker 등 추가 PopoverField 등장 시
- `StateChip` (sync-status-chip generic 화) — 다른 state 도메인 등장 시
- `ChartResponsive` vs `SafeResponsiveContainer` 통일 — 사용 패턴 검증 후
- `ToggleIndicator` 공통화 — switch/checkbox/radio 외 추가 toggle variant 등장 시
- `InfoRow` ↔ `KeyValueRow` — align variant 통일은 가능하나 시나리오 합치면 둘 다 약화. 현재 양립이 합리적.

---

# Round 5 — 보류 9 개 + hooks audit 전면 진행

R4 후 사용자가 "장기 가치 위해 진행하자" 결정. R4 의 "트리거 대기" 결정을 뒤집고 보류 9 개 + 안 본 영역 (`src/hooks/`) 모두 진행.

## A. 처리 완료

| # | 항목 | 조치 |
|---|---|---|
| R5-1 | 6 / 8px radius token 신설 | `2xs: '6px'`, `xxs: '8px'` 추가. R3 에서 xs(10) 으로 통일했던 21 곳 원복 (시각 100% 보존). 4px 케이스 2 곳도 `2xs` 통일 (디자인 시스템 외 값 인정 안 함, 1px 더 둥글어짐). 자동화: `/tmp/revert_radius.py`. |
| R5-2 | backdrop / overlay semantic token 4 개 신설 | `--ig-color-lightbox-backdrop` / `--ig-color-lightbox-surface` / `--ig-color-canvas-overlay-soft` / `--ig-color-canvas-overlay-strong`. 5 곳 raw 마이그레이션 (class-lightbox 2 + canvas-overlays 2 + media-overlay 1). |
| R5-3 | `SearchableList` 추출 | `src/components/data-display/searchable-list.tsx` 신설 (generic `<T>` candidates + renderItem). `TagListPanel` 이 그것 + `TagListItem` 조합으로 단순화 (60 줄 → 25 줄). |
| R5-4 | `StateChip` generic 화 | `src/components/feedback/state-chip.tsx` 신설 (state → style map 을 prop 으로). `SyncStatusChip` 은 SOFT/OPAQUE state styles 상수 + StateChip wrapper. |
| R5-5 | SVG primitive 4 종 + 위치 결정 | `src/primitives/svg/` 신설 — `SvgBboxRect`, `SvgPointDot` (auto `<circle>`/`<ellipse>`), `SvgShapeLabel`, `SvgShapeHandle`. `drawing-layer.renderers.tsx` 의 `BboxLabel` / `BboxHandles` / `RectObject` / `PointObject` 가 새 primitive 사용. 다른 viewer/editor 에서 import 가능. |
| R5-6 | `PopoverTriggerField` 추출 + 일부 마이그레이션 | `src/components/inputs/popover-trigger-field.tsx` 신설. `useDropdownLayout` + `DropdownRoot` + `DropdownMenu` + portal 패턴 추출. `DropdownSelect`, `SelectField` 가 그것을 사용. |
| R5-7 | hooks audit + 작은 정리 | `useDropdownLayout` 의 click-outside 로직을 `useClickOutside` hook 으로 위임 (중복 제거). |

## B. R5-6 부분 처리 — `date-picker` 는 제외

사용자 결정은 "date-picker + dropdown-select + select-field 모두 PopoverTriggerField 로". 실제 코드 보니:
- `useDropdownLayout` 은 트리거 너비를 popover 에 강제 (드롭다운 메뉴 패턴)
- `date-picker` 는 `DayPicker` 의 고유 너비 사용 (라이브러리 콘텐츠 너비)
- 통합 시 width 강제 / DayPicker 너비 override 충돌

date-picker 는 자체 유지. 다음 라운드 트리거: **PopoverTriggerField 에 `layout: 'menu' | 'free'` mode 추가** 또는 별도 `FloatingPanelField` 신설.

## C. R5-5 — `useZoomInvariantRenderer` hook 은 보류

`drawing-layer.tsx` 의 `RendererCtx` 생성 로직을 별도 hook 으로 추출 검토했으나:
- 사용처가 `drawing-layer.tsx` 1 곳뿐
- 다른 viewer 등장 시 정확한 contract 가능
- 지금 추출 시 over-engineering 위험

보류. 다음 라운드 트리거: 다른 viewer / measurement tool 이 같은 zoom-invariant 패턴 필요할 때.

## D. R5-7 — 큰 hooks 통합은 보류

| hook | 보류 이유 |
|---|---|
| `useCanvasMouse` (191 줄) + `useDrawingCanvas` (299 줄) + `useZoomPan` (108 줄) | 셋 다 mouse coord 변환을 자체 처리. 통합 시 큰 리팩터 + canvas 동작 회귀 검증 필수. mouse coord 만 분리하면 응집도 깨질 수 있음. |
| `useSelection` ↔ `use-grid-selection.ts` 통합 | `useSelection` 은 state hook, `classifySelectionAction` 은 event 분류 함수. 서로 다른 역할로 보완. 통합보다 양립이 명확. |

진짜 가치 있는 정리 (`useDropdownLayout` 의 `useClickOutside` 위임) 만 적용. 나머지는 over-extraction.

## Next Round Triggers — Round 6

- `PopoverTriggerField` 의 `free mode` (DayPicker / color picker / time picker 같은 라이브러리-너비 popover 통합)
- mouse coord 통합 (`useMousePosition` 또는 `useImageCoord` hook 신설) — canvas 도구 추가 시
- 디자인 검토: 4px → 2xs(6px) 으로 1px 더 둥글어진 2 곳 (member-pool-list RemoveBtn, source-breakdown-widget) — 의도 확인

---

# Round 6 — Token 시스템 자체 audit

R1~R5 에서 token 시스템을 많이 사용·확장 (radius `2xs/xxs` 신설, backdrop semantic 4 종, OptionRow rename 등). 그 위에 token 시스템 **자체** 정리. Explore agent 가 195 CSS variable 중 미사용 / hardcoded / 모호 케이스 점검.

## A. 처리 완료

### 미사용 token 제거 (9 개)

| 카테고리 | 토큰 | 정의 위치 (이전) |
|---|---|---|
| Color theme-aware | `--ig-color-bg-canvas-alt` | line 26 |
| Color theme-aware | `--ig-color-dropdown-chevron-bg` | line 140 |
| Color theme-aware | `--ig-color-dropdown-chevron-border` | line 141 |
| Color theme-aware | `--ig-color-dropdown-trigger-shadow` | line 135-136 |
| Color foundation | `--ig-color-white-96` | line 175 |
| Color foundation | `--ig-color-blue-tint-42` | line 182 |
| Radius scale | `--ig-radius-3xl` (+ `radiusScale['3xl']` 도 함께) | line 199 / radius.ts |
| Radius scale | `--ig-radius-sm-alt` | line 196 |
| Radius scale | `--ig-radius-lg-alt` | line 197 |

검증: `grep -rn "var(--ig-XXX)" src/ packages/ stories/` → 0 사용처 확인 후 제거. 시각 영향 0.

### z-index hardcode → scale 이동

`src/tokens/core/z-index.ts` 의 `zIndexScale` 에 `dropdown / contextMenu / tooltip` 3 개 추가. `token-css-variables.ts` 의 hardcoded `'100' / '1000' / '9999'` → `String(zIndexScale.XXX)` 참조로 변경. 단일 source-of-truth 회복.

순서도 z-order 순으로 재정렬: `dropdown(100) < popover(500) < contextMenu(1000) < drawer(1100) < modal(1200) < tooltip(9999)`.

## B. 검토 후 유지

| 항목 | 유지 이유 |
|---|---|
| `--ig-color-sidebar-bg-top` (1 사용) | `sidebar-bg-bottom` 과 gradient pair. 시각 의도 유지. |
| `--ig-color-danger-soft-surface` (1 사용) | annotation-toolbar 의도된 hover state. semantic 명확. |
| `--ig-font-size-5xl` (1 사용) | `heading.tsx` H1 사용. typography scale 의미 있음. |
| 중복 값 (`blueTint18` 7 token, `amberTint18` 3 token 등) | 의미적 grouping (queued/badge/avatar/tab/image-ring 등 각자 semantic name). consolidate 시 의도 손실. |
| recipes (14 개) | 모두 활용 중. dead code 없음. |
| light / dark mode 매핑 | 누락 없음. `buildTheme()` 양쪽 모두 호출. |

## C. 발견된 보류 / 후속

- `-alt` suffix 의미 — 1, 2 번 항목 (`radius-sm-alt`, `radius-lg-alt`) 은 제거됨. 다른 곳에도 `-alt` 가 남아있으면 audit 필요.
- semantic vs raw token 공존 (예: `--ig-color-accent-soft-surface` 와 `--ig-color-blue-tint-18` 둘 다 같은 값) — 의미적 grouping 으로 인정 + 향후 JSDoc 으로 명확화 검토.

## Next Round Triggers — Round 7

- semantic token 에 JSDoc / 카테고리 주석 추가 (token-css-variables.ts 가 점점 길어짐, 230+ 줄)
- `-alt` suffix 가 남은 다른 token 점검 (현재는 radius 만)
- color palette 중 미사용 색 (foundation `palette.X` 중 token 매핑 안 된 것) audit
- shadow scale 일관성 (현재 `shadowScale` / `shadowScaleLight` 둘만 있음, raw `box-shadow: ...` 사용처 점검)

---

# Round 7 — 남은 항목 전면 진행

R6 후 사용자 "장기 가치 위해 남은 것 전부 검토 후 진행" 요청. audit C/D 후속 트리거 + 안 본 영역 (`hooks`) 을 한 번에. 사용자 핵심 원칙: **components 는 atomic 최소 단위, 그 조합이 patterns**.

## A. 처리 완료

| # | 항목 | 결과 |
|---|---|---|
| R7-A | shadow scale + raw box-shadow → token | `menu` shadow 신설 (dark + light). 3 곳 마이그레이션 (`image-context-menu`, `table.styles`, `dataset-selector-mobile` → menu/popover). class-lightbox (rgba 0.5 강함, 단일 사용) + buttons.ts danger gradient (의도된 색) 는 raw 유지. |
| R7-B | foundation palette 미사용 색 정리 | `borderMuted`, `white96` 제거 (각 light/dark 양쪽). 71 → 69 palette key. typecheck OK. |
| R7-C | semantic token JSDoc / section header | `token-css-variables.ts` 에 `// ── Background / Surface / Border-Text / Accent-Status ────` section 주석. radius 도 2xs→pill 순서로 재정렬 + section header. |
| R7-D | `FloatingPanelField` 신설 + date-picker 통합 | `PopoverTriggerField` (menu mode, width 강제) 와 별도 `FloatingPanelField` (free mode, panel 고유 너비) 신설. `date-picker.tsx` 의 자체 positioning 로직 제거 후 FloatingPanelField 사용. R5 명시 후속 완료. |
| R7-G | `useZoomInvariantRenderer` hook 추출 | `drawing-layer.tsx` 의 inline RendererCtx 생성 로직 → hook (`{ ref, containerWidth, containerHeight, zoom }` → `ZoomInvariantRendererCtx`). `drawing-layer.renderers.tsx` 의 `RendererCtx` 는 `type RendererCtx = ZoomInvariantRendererCtx` alias. 다른 viewer / measurement tool 에서 재사용 가능. |
| R7-I | `useElementSize` hook 추출 | `ChartResponsive` + `SafeResponsiveContainer` 의 ResizeObserver + window resize listener 중복 → 공통 hook. 두 wrapper 의 API (render prop vs cloneElement) 는 사용 시나리오가 달라 통합하지 않고 hook 만 공유. |
| R7-F | `getNormalizedCoord` utility 추출 | `useCanvasMouse` 의 toNorm 함수를 `src/hooks/normalized-coord.ts` utility 로. `useDrawingCanvas` 는 `e.currentTarget` 패턴이라 ref 기반 utility 와 contract 다름 — 부분 통합. |

## B. 평가 후 skip

| # | 항목 | 정직한 skip 이유 |
|---|---|---|
| R7-H | InfoRow ↔ KeyValueRow 통합 | 실제 코드 보니 **API 완전 다름**: InfoRow 는 styled 3 개 composable (`<InfoRow><InfoRowLabel/><InfoRowValue/></InfoRow>`, value 안에 자유 React node + flex-wrap), KeyValueRow 는 props (`label`, `value`). 통합 시 한쪽 사용 패턴 (사용처 6+ 파일) 변경 부담 + API 약화. atomic 1개 줄이는 가치 < 통합 부담. **양립 유지가 정직**. |
| R7-E | layouts / page / shared audit | `layouts.tsx` (SplitLayout / DashboardGrid / ListDetailLayout / SettingsShell / InspectorLayout) 5 개 named layouts 각자 의도 명확 — 통합 시 의도 흐려짐. `shared/surfaces.ts` 는 recipe re-export 1 줄. `page-shell.tsx` 는 R3 token 일관성 후 잘 정리. **추가 정리 없음**. |
| R7-X1 | `src/utils` audit | 6 파일 모두 독립 도메인 utility. 공통 패턴 없음. |
| R7-X2 | `src/brand` audit | brand-specific. 다른 brand 추가 시 audit 가치 생김. |
| R7-X4 | ToggleIndicator 공통화 | switch / checkbox / radio 시각 근본적 다름. 안쪽 더 작은 atomic 없음. 이미 최소. |
| R7-X6 | 4px → 2xs 디자인 검토 | 디자이너 결정 사항. 코드 변경 아님. |

## C. 남은 추가 변경 가능 영역 (Round 8 트리거)

지금 강행 시 over-extraction 위험. 트리거:

| 항목 | 트리거 |
|---|---|
| `useDrawingCanvas` 도 `getNormalizedCoord` utility 사용 | `e.currentTarget` 패턴 → ref 패턴 리팩터 필요. 큰 회귀 검증 부담. 사용처 변경 시 자연스럽게. |
| `useCanvasMouse` + `useDrawingCanvas` + `useZoomPan` 의 pan drag / scroll wheel 등 다른 mouse helpers 통합 | mouse coord 외 다른 패턴은 hook 책임이 너무 달라 통합 어려움. 새 mouse-driven 도구 추가 시. |
| 4px → 2xs 변화 두 곳 (member-pool-list, source-breakdown-widget) | 디자이너 결정. |
| `-alt` suffix 가 남은 다른 token | 점검 안 함 (R6 에서 radius 는 정리, 다른 카테고리 확인 필요). |

## 최종 평가

R1~R7 (7 rounds) 후 디자인 시스템 라이브러리로서 정리 완성도 매우 높음:
- 정책 ([components-vs-patterns.md](docs/reference/components-vs-patterns.md)) 기준 분류 정착
- atomic primitive 다수 노출 (Card, GridContainer, OptionRow, TagListItem, SearchableList, StateChip, TooltipCard, KeyValueRow, LegendItem, Avatar, Chip, InputAdornment, FilterPopoverSection, TwoColumnDialog, PopoverTriggerField, FloatingPanelField, SelectableGridCell, LabelValueRow + 4 SVG primitive)
- token 일관성 (spacing / radius / color / shadow 모두)
- hooks atomic 정리 (useClickOutside / useElementSize / useZoomInvariantRenderer / getNormalizedCoord)
- 보류 항목은 모두 명확한 트리거 명시

---

# Round 8 — ChipGroup atomic 분리 + chip 패턴 정리

사용자 지적: "components/data-display/chip-group 도 더 쪼갤 수 있는데 왜 안 했냐?". audit C/D 에서 chip-group 을 "도메인 중복" 카테고리로 묶어 보류했지만 **재평가 결과 정확하지 않았음**.

## 발견

3 종류 chip 이 의미·시각 다 다른 채 공존:

| 위치 | 종류 | 처리 |
|---|---|---|
| `feedback/chip.tsx` (R2 분리) | 정적 display tag (`styled(Badge)` + border-subtle) | 유지 |
| `data-display/chip-group.tsx` 내부 `Chip` | **interactive action chip** (button + color swatch + label) | **`ActionChip` 으로 추출** |
| `patterns/shells/filter-class-chip.tsx` | filter checkbox chip (label + Checkbox + color) | 유지 (도메인 wrapper) |

또 `filter-class-chip.tsx` 가 **자체 `ColorSwatch` styled 를 중복 정의** (10px circle) — 기존 [`color-swatch.tsx`](src/components/data-display/color-swatch.tsx) 가 있음에도. 정리.

## A. 처리 완료

| 항목 | 결과 |
|---|---|
| `ActionChip` atomic 추출 | `src/components/data-display/action-chip.tsx` 신설. props `{ color?, children, ...buttonAttrs }`. 내부 `Chip` styled + 기존 `ColorSwatch` 사용. forwardRef + button type='button' default. |
| `ChipGroup` 리팩터 | 내부 `Chip` styled 제거 + `ActionChip` 호출. `Wrap` + `MoreChip` 만 잔류. |
| `filter-class-chip.tsx` 중복 제거 | 자체 `ColorSwatch` styled 제거 + 기존 `ColorSwatch` ($size="sm") 사용. 시각 미세 (10 → 12px). |

검증: typecheck OK, 178 tests OK.

## B. 메타 노트

audit 정확도 문제: 1차 audit 에서 "도메인 중복" 카테고리로 grouping 한 항목들은 **실제 코드 대조 시 별도 평가 필수**. ChipGroup 처럼 명백한 atomic 후보가 묻혀 있을 수 있음.

## Round 9 트리거

- `feedback/chip` rename (Tag 등) — 정적 display 인데 "Chip" 이름. 사용처 광범위해 부담.
- 다른 chip-like 패턴 (sync-status-chip, state-chip 등) 의미 통합 검토

---

# Round 9 — DatasetTaskTag atomic 분리 + tag 시각 패턴 정리

사용자 지적 (R8 패턴 반복): "DatasetTaskTag 도 Chip 같은 걸로 대체 안 되나?" audit 에서 DatasetTaskTag 를 "도메인 의미 강한 component 예시" 로만 분류하고 atomic 추출은 안 했음. **재평가 결과 atomic 분리 가능했음**.

## 발견

4 종류 tag/badge 가 비슷한 의미 (span + bg + color + small text) 인데 시각 다 다른 채 공존:

| 위치 | radius | font | padding | text |
|---|---|---|---|---|
| `data-display/dataset-task-tag` | xs (10px) | 10px | 1×2 | 정상 |
| `patterns/shells/project-type-tag` | pill | 10px | 0×4 | UPPERCASE |
| `patterns/shells/device-status-badge` | 4xl (24px) | 11px | 1×7 | 정상 |
| `feedback/chip` (Badge extend) | pill | xs (12px) | 1×4 | 정상 |

## A. 처리 완료

| 항목 | 결과 |
|---|---|
| `Tag` atomic 추출 | `src/components/data-display/tag.tsx` 신설. `styled.span<{ $bg, $color }>` + DatasetTaskTag 의 기존 시각 그대로 (radius-xs, font 10px, padding 1×space-2, weight 600). |
| `DatasetTaskTag` → patterns 이동 | `src/components/data-display/dataset-task-tag.tsx` → `src/patterns/shells/dataset-task-tag.tsx`. 내부 `Tag` styled 제거 + `Tag` atomic 사용. `taskTypeStyles` (도메인 매핑) + label (short/full) 잔류. data-ig-layer="patterns" 로 갱신. |
| 외부 import 갱신 | `DatasetTaskType` import 를 `@ingradient/ui/components` → `@ingradient/ui/patterns` (3 파일: platform-pages catalog/types.ts, fixtures catalog-datasets, catalog-scenarios). |

검증: typecheck OK, 178 tests OK. 시각 변화 0.

## B. 미처리 (시각 통일 = 디자이너 결정)

ProjectTypeTag, DeviceStatusBadge, feedback/chip 은 시각이 DatasetTaskTag 와 명백히 다름 — Tag atomic 적용 시 시각 변경 발생. **디자이너 결정 사항**. 코드 정리만으로는 불가.

## Round 10 트리거

- 4 tag 시각 통일 (디자이너 결정 후)
- `feedback/chip` rename — 정적 display 인데 "Chip" 이름 (interactive `ActionChip` 과 혼동)
- audit 정확도 메타: **"도메인 의미 강한 component"** 분류도 atomic 추출 가능한지 재평가 필요 (R8 ChipGroup + R9 DatasetTaskTag 모두 audit 보류였음)

---

# Round 10 — atomic 누락분 patterns 이관 + Tooltip 위치 버그

사용자 지적 (또 audit 미스): "DateRangeField는 Patterns로 옮기는게 맞지 않아? CheckboxGroup 안에 있는 Checkbox는 component로 분리하고, CheckboxGroup은 Patterns으로 옮겨도 되지 않을까? FormGroup & FieldRow 이것도 그렇고 ... 분명 너가 이제 더 이상 없다고 했는데. 계속 발견되잖아." R7~R9 audit 가 inputs/ 영역 composition 후보를 누락했음.

## A. 처리 완료 — patterns 이관

| 항목 | 결과 |
|---|---|
| `DateRangeField` → patterns | `src/components/inputs/date-range-field.tsx` → `src/patterns/shells/date-range-field.tsx`. 내부 atomic 없음 (DatePickerField × 2 + Dash + Row layout). |
| `CheckboxGroup` → patterns + ColorSwatch dedupe | `src/components/inputs/checkbox-group.tsx` → `src/patterns/shells/checkbox-group.tsx`. 내부 `Checkbox` 는 이미 `inputs/toggles` atomic 사용 중. 자체 `ColorSwatch` styled (10px square) 제거 + 기존 `data-display/color-swatch` ($size="sm" $shape="square") 사용. 시각 미세 (10 → 12px). |
| `FormGroup` → patterns | `src/components/inputs/form-section.tsx` 에서 `FormGroup` 만 추출 → `src/patterns/shells/form-group.tsx`. `FieldRow`, `FormField` 는 form-section.tsx 에 atomic 으로 잔류. |
| 외부 import 갱신 | `gallery-filter-panel.tsx`, `interaction-utils-lab.stories.tsx` 의 `FormGroup`/`DateRangeField` import 경로를 patterns 로 변경. |

검증: typecheck OK, 179 tests OK.

## B. Tooltip 위치 버그 — createPortal 적용

사용자 지적: "Popover나 Tooltip 뜨는 것도 이상한 위치에 뜨고 있는데. 이것도 검토 좀 해주고."

### 조사 결과

- **Tooltip** (`components/overlays/tooltip.tsx`): Bubble 이 Wrap 안쪽에 inline 렌더링 + `position: fixed`. 조상에 `transform`/`filter`/`perspective`/`will-change` 가 있으면 CSS 스펙상 그 조상이 컨테이닝 블록이 된다 → Bubble 이 viewport 좌표가 아닌 transform 좌표계로 이동.
- **PopoverTriggerField** (`components/inputs/popover-trigger-field.tsx`): `createPortal(document.body)` 사용 — 영향 없음.
- **FloatingPanelField** (`components/inputs/floating-panel-field.tsx`): `createPortal(document.body)` 사용 — 영향 없음.

### 수정

Tooltip Bubble 을 `createPortal(document.body)` 로 이동. mount/unmount 도 hover 시점으로 변경 (이전: 항상 마운트 + opacity 토글 → portal 이면 hidden bubble 이 body 에 잔존).

## C. 보류 / R11 후보

사용자 지적 "여전히 분리할 수 있다거나 Patterns로 옮겨야 할게 많은 것 같은데" 에 대한 R10 범위 외:

- `inputs/date-picker.tsx` — DatePickerField (atomic OK) 와 DatePicker (calendar 시각 contract) 가 한 파일. DateRangeField 가 patterns 이동했으니 추가 평가 필요.
- `inputs/mention-textarea.tsx` — textarea + 트리거 dropdown 조합. composition 후보.
- `inputs/dropdown-select.tsx` — PopoverTriggerField + 옵션 목록 조합. composition 후보.

## D. audit 메타 — 누락 카테고리 패턴

R7~R9 까지 "더 이상 없다" 결론 → 매번 사용자가 누락 찾아냄. 공통 패턴:

| Round | 누락 원인 |
|---|---|
| R8 ChipGroup | "도메인 wrapper" 로 분류해 split 검토 안 함 |
| R9 DatasetTaskTag | "도메인 의미 강한 component" 로 분류해 atomic 추출 안 함 |
| R10 DateRangeField/CheckboxGroup/FormGroup | `inputs/` 영역을 "atomic primitive 들" 로 묶어 composition 후보 점검 안 함 |

→ **다음 audit 시 모든 분류 결과를 "atomic 인가 / composition 인가" 한 번 더 강제 재평가**. 도메인 / wrapper / generic 같은 다른 분류로 묶어도 그 안에서 composition 후보가 나올 수 있음.

## R10 실행 결과

| 항목 | 결과 |
|---|---|
| `SyncStatusChip` patterns/shells 이동 | components/feedback 에서 patterns/shells 로 이동 (도메인 wrapper). `SyncState` external import 4 파일 갱신. R8/R9 패턴 반복 (audit "도메인 component" 재평가). |
| `DateRangeField` patterns/shells 이동 | DatePickerField × 2 단순 조합. atomic 없음. |
| `CheckboxGroup` patterns/shells 이동 | bordered scrollable + Header + ItemRow + Checkbox 조합. 자체 `ColorSwatch` 중복 styled 제거 → 기존 component 사용 ($size="sm" $shape="square"). |
| `FormGroup` patterns/shells 추출 | `form-section.tsx` 의 FormGroup 만 `patterns/shells/form-group.tsx` 로 추출. FieldRow / FormField 는 atomic 으로 components/inputs 잔류. |
| `ImageViewer` stories 보강 | components 유지 + `stories/assets` 의 실제 이미지로 zoom / pan / overlay 사용 예시 story 1 개 추가 (`Patterns/Data Display/ImageViewer > RealImages`). |
| `Tooltip` portal 적용 | `Bubble` 을 `createPortal(document.body)` 로 렌더. `position: fixed` 의 containing-block 버그 (transform 조상 시 viewport 좌표 깨짐) 픽스. open state 끌어올려 hover 시점에만 마운트 — 잔존 hidden bubble 제거. |

검증: typecheck OK, 179 tests OK.
