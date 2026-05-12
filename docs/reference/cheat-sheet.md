# @ingradient/ui Cheat Sheet

새 UI 를 짤 때 *어떤 것이 이미 있는지* 한눈에 보기 위한 단일 참조 페이지. 직접 styled 를 정의하기 전에 여기서 먼저 확인.

---

## Import paths

```ts
import { ... } from '@ingradient/ui/components'  // 모든 컴포넌트 + hooks
import { ... } from '@ingradient/ui/patterns'    // 페이지/쉘/레이아웃 패턴
import { ... } from '@ingradient/ui/tokens'      // 디자인 토큰 (TS 변수)
import '@ingradient/ui/tokens.css'               // CSS 변수 (--ig-*)
import { ... } from '@ingradient/ui/primitives'  // surfaceCard / surfacePanel / appShell 등 CSS recipe
```

> `@ingradient/ui/components` 가 `@ingradient/ui/hooks` 도 re-export. 별도 import 불필요.

---

## Components

### Inputs ([Storybook: Components/Inputs](../../storybook-static))

| 컴포넌트 | 용도 | 핵심 props |
|---|---|---|
| **`Button`** | 표준 버튼 | `variant: 'solid' \| 'secondary' \| 'accent'`, `size: 'sm' \| 'md' \| 'lg'`, `tone: 'default' \| 'danger'`, `leadingIcon`, `trailingIcon` |
| **`IconButton`** | 아이콘 전용 버튼 (정사각형) | `variant`, `size`, `tone`. aria-label 필수 |
| **`TextField`** | text 입력 (forwardRef) | `size: 'sm' \| 'md' \| 'lg'`, standard `<input>` props |
| **`PasswordField`** | 비밀번호 입력 (forwardRef) | TextFieldProps |
| **`TextareaField`** | textarea (styled.textarea) | standard `<textarea>` props |
| **`SearchField`** | 검색 입력 + clear button | `onClear`, standard input props |
| **`NumberField`** | 숫자 입력 (±증감 버튼) | `value`, `onChange`, `min`, `max`, `step` |
| **`MentionTextarea`** | @멘션 자동완성 textarea | `value`, `onChange`, `candidates`, `onSubmit`, `placeholder` |
| **`SelectField`** | 단일 선택 dropdown (portal 메뉴) | `value`, `onChange`, `<option>` children, `disabled` |
| **`DropdownSelect`** | options 배열 기반 dropdown | `value`, `options: DropdownOption[]`, `onChange`, `disabled` |
| **`Checkbox`** | 체크박스 (forwardRef) | `checked`, `onChange`, `indeterminate`, `disabled` |
| **`Radio`** | 라디오 | `name`, `value`, `checked`, `onChange` |
| **`Switch`** | 토글 스위치 | `checked`, `onChange` |
| **`CheckboxGroup`** | 체크박스 그룹 | `items: CheckboxGroupItem[]`, `value: string[]`, `onChange` |
| **`RadioCardGroup`** | 라디오 카드 그룹 (큰 선택 카드) | `options: RadioCardGroupOption[]`, `value`, `onChange` |
| **`ModeSwitcher`** | 2~N 모드 토글 (예: list / grid) | `options: ModeSwitcherOption[]`, `value`, `onChange`, `size` |
| **`DatePickerField`** | 날짜 선택 input | `value`, `onChange`, `min`, `max` |
| **`FileInput`** | hidden file input + 트리거 버튼 | `accept`, `multiple`, `onFiles`, children |
| **`UploadDropzone`** | drag-drop + click 업로드 영역 | `accept`, `multiple`, `onFiles`, `disabled`, children. disabled = stripe pattern + opacity 0.6 |
| **`CopyButton`** | 클립보드 복사 버튼 (성공 피드백) | `value`, `label?` |
| **`SearchResultRow`** | 검색 결과 행 (primary/secondary/action) | `primary`, `secondary?`, `actionLabel`, button HTML attrs |
| **`FilterBarLayout`** | 필터 인풋 가로 정렬 + Clear filters | `onClear?`, `clearLabel?`, children |
| **`FormGroup`** | 폼 섹션 (title + description + body) | `title`, `description?`, children |
| **`FieldRow`** | 라벨 + 인풋 + hint 한 줄 | `label`, `htmlFor`, `hint?`, children |

> *Disabled 시 모든 controlField 기반 인풋은 opacity 0.5 + dashed border + surface-muted 배경.*

### Feedback ([Storybook: Components/Feedback](../../storybook-static))

| 컴포넌트 | 용도 | 핵심 props |
|---|---|---|
| **`Alert`** | 박스형 알림 | `$tone: 'info' \| 'success' \| 'warning' \| 'danger'` |
| **`InlineMessage`** | 인라인 한 줄 메시지 (Alert 변형) | `$tone` |
| **`Badge`** | 작은 라벨 (pill) | `$tone: 'neutral' \| 'accent' \| 'success' \| 'warning' \| 'danger'` |
| **`Chip`** | Badge + border (구별감) | Badge props |
| **`Avatar`** | 원형 아바타 (이미지 또는 initials) | `src?`, `alt?`, `initials?`, `size?` |
| **`StatusPill`** | 상태 표시 pill (`tone` shorthand) | `tone: 'success' \| 'warning' \| 'danger' \| 'info' \| ...` |
| **`Spinner`** | 로딩 스피너 | `size: 'sm' \| 'md' \| 'lg' \| number`, `tone: 'accent' \| 'white' \| ...` |
| **`Skeleton`** | 로딩 스켈레톤 | `$height?` |
| **`ProgressBar`** | 진행률 막대 (0–100). 진행 중 시 대각선 shimmer animation 자동 | `value: number` |
| **`NotificationBadge`** | 알림 개수 점/숫자 (top-right 배치) | `count?`, children |
| **`EmptyState`** | 빈 상태 카드 | `icon?`, `title`, `description?`, `action?` |
| **`SelectionActionBar`** | 선택 항목 액션바 (floating) | `count`, `actions`, `onClear`. *현재 한계*: checkbox / indeterminate / loading spinner / "select all entire" slot 미지원 — platform-style gallery selection bar 에는 prop 확장 필요 |
| **`StepIndicator`** | 단계 진행 표시 | `items: StepItem[]` (`status: 'pending'/'running'/'done'/'error'`) |
| **`SmallText`** | 작은 보조 텍스트 | `<span>` |
| **`LoadingState` / `ErrorState` / `EmptyStateText`** | 인라인 상태 메시지 (block) | children |
| **`ToastProvider` / `useToast`** | 토스트 알림 | provider + hook. `useToast().push({ tone, message, action? })` |
| **`ErrorBoundary` / `DefaultErrorFallback`** | React error boundary | `fallback?`, `onError?` |

### Navigation ([Storybook: Components/Navigation](../../storybook-static))

| 컴포넌트 | 용도 | 핵심 props |
|---|---|---|
| **`Tabs`** | 가로 탭 | `items: TabsItem[]`, `value`, `onChange` |
| **`TabsNav`** | Tabs 의 styled.div 만 (커스텀 조립용) | — |
| **`VerticalTabs`** | 세로 탭 (Settings 같은 사이드 nav) | `items: VerticalTabsItem[]`, `value`, `onChange`, `radius` |
| **`Breadcrumbs`** | 빵부스러기 | `items`, `onNavigate?` |
| **`Pagination`** | 페이지네이션 | `page`, `pageCount`, `onChange` |
| **`Stepper`** | 단계 nav (StepIndicator 와 차이: 클릭 가능) | `steps`, `current`, `onStepClick?` |

### Overlays ([Storybook: Components/Overlays](../../storybook-static))

| 컴포넌트 | 용도 | 핵심 props |
|---|---|---|
| **`DialogShell`** | 표준 모달 (header/body/actions slot) | `title`, `onClose`, `width?`, `actions?`, children |
| **`ConfirmDialog`** | 확인 다이얼로그 (Yes/No) | `title`, `description?`, `danger?`, `onConfirm`, `onClose` |
| **`useConfirm` / `ConfirmProvider`** | imperative confirm — `await confirm({ title, danger? })` | provider + hook |
| **`SettingsDialog`** | DialogShell + VerticalTabs preconfigured | `title`, `tabs`, `value`, `onChange`, children |
| **`DialogCloseButton`** | 우상단 X 닫기 버튼 | `onClick` |
| **`MenuPopover`** | 드롭다운 메뉴 컨테이너 (positioning) | `anchorRef`, `open`, `onClose`, children |
| **`Tooltip`** | 호버 툴팁 | `content`, `gap?`, children |
| **`HoverCard`** | 호버 시 큰 카드 (PopoverCard 변형) | children |
| **`FilterPopover` / `FilterPopoverSection`** | 필터 팝오버 | `title?`, `actions?`, children |
| **`ContextMenuList` / `ContextMenuButton` / `ContextMenuSub` / `ContextMenuSubItem` / `ContextMenuItem` / `ContextMenuBackdrop`** | 우클릭 컨텍스트 메뉴 building blocks | x/y 위치, danger / color variants |
| **`ModalBackdrop` / `ModalCard` / `ModalHeader` / `ModalTitle` / `ModalActions` / `CompactModalCard`** | DialogShell 안 쓰는 커스텀 모달 raw primitives | — |
| **`Drawer`** | 사이드 슬라이드 패널 | `$side: 'left' \| 'right'` |
| **`PopoverCard` / `Menu` / `TooltipBubble`** | 팝오버 raw building blocks | — |

### Data Display ([Storybook: Components/Data Display](../../storybook-static))

| 컴포넌트 | 용도 | 핵심 props |
|---|---|---|
| **`Table<T>`** | columns/rows API 데이터 테이블 (드래그 reorder 지원) | `columns: TableColumn<T>[]`, `rows`, `onRowClick?`, `draggable?`, `onReorder?` |
| **`ImageGrid<T>`** | 이미지 그리드 (가상화 X — 적은 항목) | `items`, `getThumbnailUrl`, `selectedIds`, `onSelectionChange`, `renderCellOverlay?`, `renderCellFooter?`, `renderCellTopRight?` |
| **`VirtualizedImageGrid<T>`** | TanStack row-virtualized 이미지 그리드 (1k+) | ImageGridProps + `columns`, `estimatedItemHeight`, `overscan`, `hasMore`, `onLoadMore` |
| **`ImageGridCell<T>`** | 그리드 내부 셀 (caller가 직접 조립 시) | item, index, thumbnailUrl, slots |
| **`SelectableListItem`** | 클릭 가능 리스트 행 (selected highlight) | `variant: 'card' \| 'flat'`, `selected`, `as: 'button' \| 'li'`, button HTML attrs |
| **`AssignmentRow`** | label + control 한 줄 (form summary) | `label`, `value`, children |
| **`InfoRow` / `InfoRowLabel` / `InfoRowValue`** | 2-column key-value readout | — |
| **`StatCard`** | 단일 통계 카드 (label + value) | `label`, `value`, `delta?`, `trend?` |
| **`ProgressBlock`** | label + 큰 ProgressBar + count text | `label`, `current`, `total` |
| **`PreviewCard`** | 큰 이미지 미리보기 카드 (호버) | `imageUrl`, `title?`, `meta?` |
| **`ColorSwatch`** | 색상 점/사각형 | `$color`, `$size: 'xs' \| 'sm' \| 'md'`, `$shape: 'circle' \| 'square'` |
| **`Chip` / `Badge`** (overlap with feedback) | — | — |
| **`ChipGroup`** | chip 배열 + 더보기 (`maxVisible`) | `items: ChipGroupItem[]`, `maxVisible?`, `onItemClick?`. *현재 한계*: chip item 에 state indicator dot / color swatch slot 없음 — class-filter chip 에는 slot 추가 필요 |
| **`TagList` / `TagListSearch`** | 태그 리스트 + 검색 패널 | `tags`, `candidates`, `onAdd`, `onRemove` |
| **`CommentThread` / `CommentItem` / `CommentInput`** | 댓글 스레드 building blocks | `author`, `timestamp`, `body`, `actions` (CommentItem) |
| **`KeyboardShortcutHint`** | `[Ctrl] + [K]` 같은 키 힌트 표시 | `keys: string[]`, `size?` |
| **`ResizablePanel`** | 드래그-resize 가능한 패널 | `defaultWidth`, `minWidth`, `maxWidth`, children |
| **`ImageViewer` / `ImageViewerToolbar`** | 단일 이미지 viewer (zoom/pan 기본) | `imageUrl`, `imageAspect`, slots |
| **`DrawingLayer`** | SVG 기반 bbox/point 렌더 (zoom-invariant stroke) | `objects`, `selectedId?`, `drawingPreview?`, `showLabels`, `showHandles`, `zoom?`, `containerWidth/Height` |
| **`AnnotationOverlay`** | DrawingLayer + 이미지 합성 (read-only / interactive) | `imageUrl`, `bboxes`, `points`, `selectedId?`, callbacks |
| **`SectionPanel`** | section 컨테이너 (surfacePanel + padding) | — |
| **`ActionBar`** | 아래 정렬 액션바 (justify-between) | — |

### Charts ([Storybook: Components/Charts](../../storybook-static))

| 컴포넌트 | 용도 | 핵심 props |
|---|---|---|
| **`LineChartCard<T>`** | 선 차트 카드 (title + chart + legend + tooltip) | `title?`, `data`, `series`, `xKey`, `emptyMessage?` |
| **`BarChartCard<T>`** | 막대 차트 카드 | `title?`, `data`, `series`, `xKey`, `stack?` |
| **`PieChartCard`** | 파이 차트 카드 | `title?`, `data: PieSlice[]` |
| **`ChartContainer`** | chart wrapper (header + content + footer slots) | `title?`, `headerActions?`, `footer?`, children |
| **`ChartResponsive`** | recharts ResponsiveContainer 래퍼 | `aspect?`, `minHeight?` |
| **`ChartLegend` / `ChartTooltipContent`** | 차트 부속 building blocks | — |

### Icons ([Storybook: Components/Icons](../../storybook-static))

| 컴포넌트 | 용도 | 핵심 props |
|---|---|---|
| **`IconGallery`** | lucide 아이콘 검색 갤러리 (디자인 도구) | — |
| **icon registry** | lucide-react 직접 import 권장. ui 가 lucide 의존 | `import { Plus, X } from 'lucide-react'` |

---

## Patterns ([Storybook: Patterns](../../storybook-static))

### Page Shell (`@ingradient/ui/patterns`)

| 컴포넌트 | 용도 |
|---|---|
| **`AppShell`** | 앱 최상위 grid (sidebar + header + content) |
| **`PageHeader` / `PageHeaderRow` / `PageTitleBlock` / `PageTitle` / `PageSubtitle`** | 페이지 헤더 구성 |
| **`PageContent`** | 페이지 본문 컨테이너 (padding + scroll) |
| **`Panel` / `PanelHeader` / `PanelTitle` / `PanelHint`** | 카드형 panel (heading + content) |
| **`SectionTitle`** | h3 섹션 제목 (페이지 레벨) |
| **`Toolbar`** | 가로 toolbar (justify-between, padding) |
| **`FilterBar`** | Toolbar grid 변형 (filters + actions) |
| **`FormSection`** | Panel + padding 더 큰 form section |
| **`FieldGroup` / `FieldLabel` / `FieldHint`** | 폼 필드 grouping |

### Shells (`@ingradient/ui/patterns`)

| 패턴 | 용도 |
|---|---|
| **`SidebarShell`** | 좌측 navigation sidebar (collapse/expand) |
| **`SidebarNav` / `AppSidebar` / `SidebarSection` / `SidebarFooter` / `TopBar` / `MobileNavDrawer`** | navigation building blocks |
| **`MediaDialogShell`** | 큰 미디어 모달 (메인 + 사이드패널 + resizer) |
| **`SettingsShell`** | settings grid (left vertical tabs + right content) |
| **`SplitLayout` / `SplitPanelShell`** | 좌우 분할 레이아웃 |
| **`ListDetailLayout`** | list + detail 2-pane |
| **`DashboardGrid`** | 대시보드 카드 grid. *현재 한계*: `auto-fit minmax(260px, 1fr)` 고정 — `$count` 기반 1~3 컬럼 동적 행, drag handle slot, action icon slot 미지원 |
| **`InspectorLayout`** | 메인 + 우측 inspector |
| **`AnnotationToolbar`** | 라벨링 화면 toolbar (placement: top/bottom/left/right) |
| **`AnnotationToolbarAction`** type | toolbar action item shape |
| **`CanvasCoordReadout`** | 캔버스 좌표 readout 바 |
| **`LabelingCanvas`** | 이미지 + 줌/팬 + DrawingLayer 합성 (라벨링 화면 본체) |

---

## Hooks (`@ingradient/ui/components` 에서 re-export)

| Hook | 용도 |
|---|---|
| **`useZoomPan`** | 줌/팬 상태 + wheel/drag handlers (`{ minZoom, maxZoom, getBounds }`). returns `{ zoom, pan, handleWheel, startPan, movePan, endPan, ... }` |
| **`useDrawingCanvas`** | bbox/point 그리기 상태 + mouse bindings (`mode: 'rect' \| 'point' \| 'cursor'`). returns `{ selectedId, drawingPreview, cursor, bindings }` |
| **`useCanvasMouse`** | useZoomPan + useDrawingCanvas 합성 (middle-mouse pan + hit-test). 라벨링 캔버스 마우스 통합 |
| **`useSelection`** | 다중 선택 (toggle / range-extend / replace) | `selectedIds: Set`, `onSelect(action, id, index)` |
| **`useClipboard`** | 클립보드 복사 + 성공 피드백 타이머 | `{ copy, copied }` |
| **`useUndoRedo<T>`** | 일반 undo/redo stack | `{ state, setState, undo, redo, canUndo, canRedo, reset }` |
| **`useClickOutside`** | 외부 클릭 감지 → onClose |
| **`useConfirm`** | imperative confirm (overlays) — `await confirm({ title, danger? })` |
| **`useToast`** | 토스트 push — `useToast().push({ tone, message, action? })` |

---

## Tokens (`@ingradient/ui/tokens` 또는 CSS `--ig-*`)

자주 쓰는 CSS 변수 (`@ingradient/ui/tokens.css` import 후 사용):

| 카테고리 | 예시 변수 |
|---|---|
| **공간** | `--ig-space-1` ~ `--ig-space-12` (4px 단위 base) |
| **라디우스** | `--ig-radius-xs/sm/md/lg/xl/2xl/pill` |
| **색 — surface** | `--ig-color-bg-canvas`, `-surface-muted`, `-surface-panel`, `-surface-interactive`, `-surface-active`, `-surface-focus`, `-surface-raised` |
| **색 — text** | `--ig-color-text-primary`, `-secondary`, `-muted`, `-soft` |
| **색 — accent** | `--ig-color-accent`, `-accent-strong`, `-accent-soft`, `-accent-ring`, `-accent-soft-surface` |
| **색 — semantic** | `--ig-color-success`, `-warning`, `-danger`, `-info` |
| **색 — border** | `--ig-color-border-subtle`, `-border-strong` |
| **폰트** | `--ig-font-size-xs/sm/md/lg/xl/2xl`, `-font-weight-*` |
| **컨트롤 높이** | `--ig-control-height-sm/md/lg` |
| **그림자** | `--ig-shadow-focus-ring`, `-shadow-panel`, `-shadow-popover` |
| **모션** | `--ig-motion-fast` (~150ms) |
| **z-index** | `--ig-z-modal`, `-z-popover` |

---

## Primitives (`@ingradient/ui/primitives`)

CSS-in-JS recipes — styled 정의 안에서 `${recipe}` 로 mixin:

| Recipe | 용도 |
|---|---|
| **`surfaceCard`** | 카드 표면 (border + bg + shadow) |
| **`surfacePanel`** | 패널 표면 (subtle border) |
| **`appShell`** | 앱 최상위 grid layout |
| **`pageHeaderSurface`** | 페이지 헤더 background |
| **`pageContentLayout`** | 페이지 본문 padding + grid |
| **`controlField`** | 인풋 field 표준 스타일 (height/padding/border/disabled) |
| **`buttonPrimary` / `buttonSecondary` / `buttonAccent` / `buttonDanger` / `buttonDangerSecondary`** | 버튼 variant CSS blocks |

---

## 사용 우선순위 가이드

1. **먼저 `@ingradient/ui/components` 에서 찾기** — `Button`, `TextField`, `DialogShell` 등 표준
2. 없으면 **`@ingradient/ui/patterns`** — `Panel`, `SectionTitle`, `MediaDialogShell` 같은 페이지 조립
3. 그래도 없으면 **`@ingradient/ui/primitives`** + styled-components 로 *조립* — `${surfaceCard}` mixin 사용
4. raw styled 는 *마지막 수단* — 도메인 고유 패턴만

> **체크리스트**: 새 styled 작성 전 → 이 페이지 Ctrl+F 로 키워드 검색 (예: "dropdown", "modal", "select", "stripe", "progress"). 있으면 사용.

---

## 관련 문서

- [`README.md`](README.md) — reference 도입부
- [`foundations.md`](foundations.md) — 토큰 / 색 / 폰트 시스템
- [`getting-started.md`](getting-started.md) — 소비자 프로젝트 setup
- [`components/`](components/) — 컴포넌트별 상세 reference
- [`patterns/`](patterns/) — 패턴별 상세 reference
- [`recipes/`](recipes/) — 자주 쓰는 조합 레시피
- [Storybook](../../storybook-static) — live preview + props playground

마지막 업데이트: 2026-05-12. (platform Storybook 목업 gap 검증 결과 반영 — `SelectionActionBar`, `ChipGroup`, `DashboardGrid` 한계 명시)
