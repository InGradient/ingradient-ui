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
