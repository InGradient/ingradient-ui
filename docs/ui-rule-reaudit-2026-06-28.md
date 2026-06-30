# UI 규칙 재검토 (2026-06-28) — line-coverage 전수

방법: ui-refactoring-rule.md §"UI 규칙 검토 방법"대로 12개 audit agent 병렬, **약 580개 .ts/.tsx 파일을 grep 아닌 Read로 한 줄씩** 검토.
범위: 라이브러리 `src/`(primitives/components/patterns/tokens, 293) + `packages/edge-pages`(149) + `packages/platform-pages`(142).

> **최종 상태(2026-06-29 갱신):** 아래 §P0/§P1/§P2는 **원본 audit 발견 기록**이다. 모든 항목은 §"✅ ..." 섹션에서 처리됐거나 §"🟢 의도적 keeper"에 사유와 함께 정리됨 — **미결(어느 쪽에도 없는) 항목 없음**. production raw px/em/색 = 0(셔터링 keeper 제외), 재발방지 lint(#2/#7/#8/#9)+addon-a11y(#10) 가동, 신설/변경 컴포넌트 상태 스토리(#11) 추가 완료.

## 종합 결론
**아키텍처의 hard 계약은 건강함**: 의존성 방향(#2) 역참조 0, store/API/localStorage 직접 의존(#7) 0(라이브러리 resizable 2건 제외), pages의 lucide 직접 import 0, 유니코드 글리프 아이콘 0. 직전 세션의 lucide registry화·glyph·토큰화·props/callback 규율이 유지됨.

**잔여는 두 축에 집중**:
1. **#1/#0 라이브러리 부품 재구현** — 특히 `packages/edge-pages`에 styled.button 아이콘/액션 버튼, inline 카드표면, 로컬 ProgressBar가 다수. (직전 Card/Button/EmptyText 마이그레이션이 platform·settings 위주였고 edge 전반엔 미전파.)
2. **#8 raw-px / #10 a11y** — 라이브러리에 raw px(주로 default param·dynamic interpolation)와 a11y 공백(focus-visible/aria/keyboard nav), pages에 padding shorthand 안 raw px.

---

## P0 — 이번 세션 작업의 미완/회귀 (최우선)
직전 세션이 한 #2(fontSize)/#4(Card)/#5(EmptyText) 작업이 일부 파일에서 누락됨:
- **dashboard 위젯 Card 미전파**: `dashboard/widgets/per-dataset-distribution-widget.tsx:8`, `source-breakdown-widget.tsx:8`, `analysis-section.styles.ts:15` — `Card = styled(SectionPanel)` inline 카드표면. → 라이브러리 `Card`(flat/border/tone)로. (#4 작업이 by-person 위젯만 했고 이 3개 누락)
- **analysis-section Empty 미전파**: `dashboard/analysis-section.styles.ts:68` `Empty = styled.p` → `EmptyText`. (이전에 "변형이라 유지"로 뒀으나 동일 패턴, 전환 가능)
- **dead iconSizeNumbers import 3건**: `dashboard-overview-panel.tsx:1`, `analysis-data-collection-widget.tsx:2`, `analysis-timeline-widget.tsx:1`, `settings-modal/project/project-member-row.tsx:1` — #2 fontSize 정리 후 남은 미사용 import. → 제거.
- **edge 로컬 EmptyText 회귀**: `edge-pages/settings/tabs/logs-content-shell.tsx:19` `EmptyText = styled.div` — 라이브러리에 EmptyText 승격했는데 로컬 재정의. → 라이브러리 것 import.

## P1 — 명확한 신규 위반
### 라이브러리 a11y (강)
- `src/components/navigation/tabs.tsx:64` #10 강 — 수평 Tabs에 role/tablist/aria-selected/키보드/focus-visible 전무 (vertical-tabs엔 있음).
- `src/components/overlays/tooltip.tsx:48` #10 강 — hover 전용, focus/blur·aria-describedby 없음(키보드/SR 접근 불가).
- `src/components/overlays/dialog-shell.tsx:51` #10 중 — aria-labelledby·focus-trap 없음. ContextMenu류 arrow-key nav 없음.

### 라이브러리 런타임 버그 (#8/기능)
- `src/patterns/gallery/image-grid.tsx:82` — IntersectionObserver `rootMargin`에 `var(--ig-popup-list-min)` 전달(CSS var 해석 불가, 런타임 무효). → px 문자열.
- `src/components/inputs/dropdown-shared.tsx:64` — `transform`이 작은따옴표라 `${rotations.*}` 미보간(chevron 회전 적용 안 됨). → 백틱.

### pages 로컬 ProgressBar 재구현 (강)
- `edge-pages/dataset-modals/ExportModalView.styles.ts:3`, `edge-pages/connection/ConnectionTabView.styles.ts:138`, `platform-pages/catalog/gallery/gallery-toolbar.tsx:24` → 라이브러리 `ProgressBar`.

### platform 부품 재구현 (강)
- `catalog/gallery/gallery-export-dialog.styles.ts:16` + `create-project/CreateProjectView.styles.ts:157` → `RadioCardGroup`.
- `create-project/CreateProjectView.styles.ts:107` → `DropZone`.
- `image-detail/image-detail-class-list.tsx:5` → `SelectableListItem`.
- `catalog/CatalogView.styles.ts:55` DangerDimButton → `Button tone="danger"`.

### edge styled.button 아이콘/액션 버튼 → Button/IconButton (강, 다수·systemic)
images(5), labeling/BBoxCanvasView(5, 2개는 dead), dataset-select(header RefreshBtn/IconBtn, AddDatasetBtn), capture(fullscreen/slider 토글 3+), log(FilterActionButton/OpenImageButton), license(CopyBtn), workspace(ConfirmButton), chrome(AccountBtn) 등. → 대부분 `IconButton`/`Button` 교체. (CopyBtn은 Electron 콜백 보존 필요 — 직전 세션 판단대로 유지 가능)

### edge inline 카드표면 → Card (중, 다수)
license/login Card, statics SummaryCard/Panel/DurationCard, system StatCard, labeling-panel CommentItem, connection NicStatus/Guide/DiagnoseClassification, capture MetricCard/QualityCard, settings UpdateSection Wrap 등.

### Alert 재구현 (중)
- `settings-modal/storage/storage-analytics-tab.tsx:6` ERROR_WRAP + `storage-recommendations-list.tsx:8` Item + edge `DeflectometryTuningControlsView.styles Warning` → 라이브러리 `Alert`.

## P2 — systemic 잔여 (낮은 우선순위, lint 대상)
- **#8 raw-px**: padding shorthand 안 raw px(`var(--ig-space-x) 16px`)가 edge styles 전반(ConnectionTabView, SetupPanel, Images, Statics, capture)·platform inline style의 `minWidth:N`/`letterSpacing:'0.04em'` 다수. default param raw px(라이브러리 chart/resizable/dropdown-layout).
- **#10 focus-visible/aria-current**: 라이브러리 navigation(pagination/stepper/mobile-nav), overlays menu-item/context-menu, inputs select/dropdown/chip-tabs 키보드 nav.
- **#8 라이브러리 잔여 hex/raw**: primitives/recipes/controls.ts:99 select-arrow hex, typography text.tsx:45 raw 400, toggles 1.5px, date-range 38px, motion 0.22s.
- **#3 도메인 누수**: utils/format-pattern-tab.ts(도메인 로직), data-display image-card-* 토큰을 generic 컴포넌트(aspect-ratio-image/video-player/selectable-grid-cell)가 사용, patterns/add-dataset-modal 하드코딩 TASK_OPTIONS.
- **#4/#7 라이브러리**: resizable-columns-layout/resizable-panel가 localStorage 직접 접근.
- **token hygiene(#9)**: core/colors·layout에 도메인 토큰 누수, fastEase/bgCanvasAlt/icon xsPlus dead 토큰, z-index 충돌.

## ✅ 수정 진행 현황 (브랜치 refactor/ui-rule-reaudit-fixes)
- **P0**: image-grid IntersectionObserver var() 런타임버그, dropdown-shared chevron 회전 버그, dead iconSizeNumbers import 4건.
- **라이브러리 a11y 강**: Tabs role/키보드/focus-visible, Tooltip 포커스/aria-describedby.
- **ProgressBar #0.2 확장**(indeterminate/tone/progressbar-role) → ExportModal 전환 + dead 제거.
- **platform 재구현**: SelectableListItem(image-detail-class-list), Button danger(CatalogView Delete), RadioCardGroup(gallery-export 4그룹), DropZone(create-project), TextField, Alert(storage ×2).
- **edge 재구현 대량**: styled.button→IconButton/MenuIconButton/Button(images/labeling/dataset-select/log/capture/chrome 등), inline 카드→Card(statics/system/license/login/labeling-panel/connection/capture), Warning→Alert, DeviceCard/HistoryEntry/AccountItem→SelectableListItem. styled.button 잔존 3개는 keeper(셔터·disclosure 헤더 2).
- 검증: lib 빌드 클린, 양 패키지 per-package tsc 통과.

## ✅ P2 후속 — 전면 완료 (main 반영)
- **#10 키보드 a11y 전면**: SelectField/DropdownSelect(aria-activedescendant roving), ChipTabs, MobileNav drawer(Esc/포커스/복원), Dialog focus-trap+aria-labelledby, **ContextMenuWithSubmenus 풀 화살표 nav**(메인 ↑↓/Home/End/→열기/Enter, submenu ↑↓/←닫고 부모복귀/Enter, 열릴 때 첫 항목 포커스), menu/context-menu focus-visible, pagination/stepper aria-current, auto-save aria-live, skeleton aria-hidden, ProgressBar role.
- **#3 도메인 토큰 누수**: generic media image-card-gradient → 중립 media-placeholder, selectable-grid-cell → accent/blue-tint. dead selected-* 토큰 제거.
- **#8 raw 디자인 값 production 0건**: space 스케일 비표준 매핑 발견(space-7=16px, popup-md=320px, popup-lg-plus=440px 등) → padding/gap/margin·letterSpacing(em·px)·minWidth/width·Card padding prop·styled CSS letter-spacing·gridline calc 1px·잔여 2px 전부 토큰화. "토큰 없음"이라던 값 재검증 → 대부분 기존 토큰 존재(놓침), 진짜 없던 건 **신설**(`--ig-shadow-toast`, `breakpoints.mdWide=860`). box-shadow custom→shadow 토큰(popover/toast), media 860px→media.mdWide, radius fallback 제거, inset -2px/1px→border 토큰.
- 검증: lib 빌드 클린, tokens.css 재생성, 양 패키지 tsc 통과. **production raw px/em = 0**(주석·토큰명·0px·100% 제외), raw 색 = 셔터링 keeper만.
- **#11 상태 스토리**: 신설/변경 컴포넌트 Storybook 상태 스토리 추가 — Card(elevation/flat/border/tone/radius·padding), MenuIconButton($active/disabled), EmptyText(default/short/long), ProgressBar(indeterminate/tone). storybook 빌드·인덱스 등록 확인.
- **재발방지 lint (규칙 문서 §검토방법)**: eslint.config.js에 #2 의존성방향·#7 store/API·#9 prop명(eslint built-in no-restricted-imports/syntax; stories/tests #2 예외), `.stylelintrc.json`+`lint:style`로 packages #8 raw px/hex 차단. #10 a11y는 Storybook addon-a11y(runtime axe)로 커버. (eslint-plugin-import/jsx-a11y는 eslint10 peer 미지원이라 built-in/Storybook으로 대체)
- **잔여 라이브러리/회귀 정리 (문서 self-review 후속)**: logs-content-shell 로컬 EmptyText(회귀) → 라이브러리 EmptyText, toggles 1.5px → 신설 `--ig-border-1_5px` 토큰, vertical-tabs motion 0.22s/0.16s → `--ig-motion-normal/fast`, add-dataset-modal 하드코딩 TASK_OPTIONS → `taskOptions` prop(기본값 유지·비파괴, 규칙 #3/#5).

## 🟢 의도적 keeper — 깨는 변경/구조/테마 위험으로 유지 (규칙 위반 아님으로 판단)
- **#4/#7 resizable localStorage**: 규칙 #7 대상은 app store/API/DB/SDK. resizable은 UI 레이아웃 선호(컬럼 너비) 영속화 — 표준 브라우저 Web API, storageKey 미지정 시 graceful degrade. breaking API 변경(소비자 재구현 부담) 대비 유지.
- **#3 format-pattern-tab**: chip-tabs(라이브러리 pattern-tab UI 기능)의 colocated helper. 의도적 도메인-bound 부품, 분리 시 chip-tabs API breaking.
- **core sync-chip-*/tag-* 도메인 토큰, dead 토큰(bgCanvasAlt 등)**: edge 등 사용 중이거나 satisfies 가드 위험 + 저가치 → 유지.
- **dashboard `Card = styled(SectionPanel)` (per-dataset/source-breakdown/analysis-section)**: 라이브러리 SectionPanel **컴포넌트를 확장**한 것(규칙 #0.1 준수 — raw 재구현 아님). 라이브러리 Card 로 바꾸면 surface-panel→raised·shadow-panel→floating 변경만 생기고 컴포넌트 재사용 이득 없음 → 유지. (by-person 위젯은 Table wrapper라 구조가 달라 Card 사용)
- **controls.ts select 화살표 hex(`%2398A2B3`)**: `background-image: url("data:image/svg+xml,...")` 인코딩 SVG 안 stroke 색. data-URI background-image는 CSS var()/currentColor 미적용 → 토큰화하려면 pseudo-element mask 리팩터 필요(저가치/레이아웃 위험). 유지.
- **카메라 셔터 on-accent 흰 링**(rgba 255 — 테마 토큰화 시 light 역전), **dataset-select RecentCard/DatasetCard**(선택 카드, 구조 상이), **create-project OptionCard**(RadioCard label string-only 제약), **disclosure 헤더 2(statics/advanced)**: 시각/구조/테마 사유로 유지.

## 의도적 keeper (over-flag 주의 — 고치지 말 것)
camera 셔터 흰링 rgba, SyncChip/StatChip(bg 없는 status 텍스트), LogDetailTable(mono key-value), TOKEN_BOX accent box, chartColors 숫자 색상, recharts innerRadius/outerRadius 숫자 props, var(--ig-font-mono, fallback), TitleBar 창 컨트롤 버튼(full-height/danger), CaptureButton 셔터(특수 대형 라운드).
  - ~~join-codes/invitations Empty 변형~~ → 3차 pass에서 라이브러리 `EmptyText`로 마이그레이션(top-margin은 inline style로 보존). 더이상 keeper 아님.

## 3차 pass — 전 코드베이스 line-by-line 재감사 (2026-06-30)
규칙문서 §"검토 방법"대로 라이브러리 src/ 6영역 + packages 전 디렉토리를 Read 전수(grep 아님). 강 0건. 발견·수정 항목:

**라이브러리 src/ (commit 69f5042)**
- #8 raw→토큰(var() 유효 자리): table 36px→control-height-md·monospace→font-mono, status-dot box-shadow 2px→space-2px, context-menu separator 1px→border-1px, calendars opacity 0.38/0.3→**신규 opacity-dim-soft/dim 토큰**, sidebar-shell 18px→space-8, navigation 320px→popup-md, chart-card/container 260→**dead token chartHeights.lg 연결**, prop default(avatar/textarea/checkbox-group/sort-popover)→토큰 number
- #9: effectsScale blur 비단조(lg=10<md=16) → 1/8/10/12/14/16 **단조 재정렬**, 전 소비처 px 보존 재매핑(src 6 + packages 2)
- #10 a11y: toggles(Checkbox/Radio/Switch) focus-visible 링, breadcrumbs aria-current, tabs/vertical-tabs roving tabindex, mobile-nav Tab focus-trap+aria-current, filter-popover aria-haspopup=dialog, mention-textarea combobox semantics

**packages (commit 4d45069, 7335ba5)**
- #8: gallery-toolbar minHeight 72→layout-sidebar-header, ScanSection marginRight 3→space-3px, CatalogRightSidebar/dashboard-widget gap 2→space-2px, DraggableAnalysisWidgetGrid 0.16s ease→motion-fast-ease(×3), reference-image/project-settings lineHeight 1.5→relaxed·marginTop -2→space-neg-2px, RightPanelComment opacity 0.6→opacity-muted
- #8 기능결함: ConnectionTabView `var(--ig-space-1Plus)`(존재X, gap/padding 무효화) → `1-plus`, raw .15s→motion-swift·font-weight 600/400→토큰
- #10: ExportHistory 인라인편집 span에 role=button/tabIndex/onKeyDown
- #0: invitations/join-codes 로컬 Empty styled.p → 라이브러리 EmptyText

**오탐 정정**: icon-sizes `xsPlus`는 dead token 아님(packages/edge-pages TitleBar/BottomBar 소비 중) → 유지.
**keeper 재확인**: mobile-dropdown 55vh(vh 토큰 없음), CaptureView rgba(255 0.25/0.5)(정확 토큰 없음), svg-shape-label sans-serif·controls 화살표 hex(constrained), canvas/gesture 숫자(JS-API).
**게이트**: eslint 0 errors, stylelint(packages) exit 0, tsup ESM 양 패키지 success(잔존 DTS 에러 2건은 본 작업 외 기존 TableColumn 제네릭 이슈).

## 4차 — 결정론적 전수 스캔 + 11규칙 기계검증 (2026-06-30)
eyeball/agent 정독이 매 pass 일부를 놓치는 한계를 인정하고, **기계적 판정 가능 규칙은 결정론적 추출**로 전환.

**#8 결정론적 스캔 (commit 71fa03a)** — 39,237 라인 전체에서 raw px/hex/rgba/em/rem/duration/style객체 맨숫자/단위없는(line-height·opacity·font-weight) 값을 전수 추출(var()·주석·토큰정의 제외). agent가 놓쳤던 6건 발견·수정: DeflectometryPreview transition 0.15s×3→motion-swift, LabelingChartsView 범례 dot(width 8→space-3·borderRadius 999→radius-pill·lineHeight 1.6→line-height-loose), LogPanelView minHeight 32→control-height-sm. 교차검증(hsl·vh/vw·var폴백·${x}px default)까지 별도 grep → 추가 위반 0. **#8 다중 교차검증으로 완전 마감.**

**11규칙 기계검증 (독립 grep, lint config 불신)**:
| 규칙 | 방법 | 결과 |
|---|---|---|
| #2 의존성 방향 | 역방향 import grep | 위반 0 |
| #3/#7 store·API·SDK·fetch | import/호출 grep | 위반 0 (resizable localStorage=keeper) |
| #8 디자인 토큰 | 결정론적 스캔 | 위반 0 |
| #9 prop 이름 | 금지명 grep | 위반 0 |
| #0/#1/#5/#10 | 판단(정독 pass) | 발견분 수정 완료, 완전성은 #8 수준 미보장 |
| #11 Storybook | 파일 전수 | **20개 공개 컴포넌트 전용 story 신규 작성 (commit f4c4502)** |

**#11 마감 (commit f4c4502)**: story 없던 공개 컴포넌트 20개에 상태 story 추가 — StatusDot/StateChip/TooltipCard/ErrorBoundary/TwoColumnDialog/SearchableList/LegendItem/ActionChip/SelectableGridCell/TagListItem/KeyValueRow/GridContainer/CodeBlock/ToolbarShell/ColorEditorPlane/ColorEditorPopover/SidebarShell/MediaDialogShell/Navigation/LabelingCanvas. eslint 0 + tsc 0. 잔여 11개는 상태 story 대상 아님(hook use-confirm, 내부 빌딩블록 button-root/dropdown-shared/input-adornment/floating-panel-field/popover-trigger-field, 아이콘 레지스트리 catalog-icons, render-prop chart-responsive, 이미 데모됨 comment-thread, 구조 레이아웃 layouts/page-shell).
