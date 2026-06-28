# UI 규칙 재검토 (2026-06-28) — line-coverage 전수

방법: ui-refactoring-rule.md §"UI 규칙 검토 방법"대로 12개 audit agent 병렬, **약 580개 .ts/.tsx 파일을 grep 아닌 Read로 한 줄씩** 검토.
범위: 라이브러리 `src/`(primitives/components/patterns/tokens, 293) + `packages/edge-pages`(149) + `packages/platform-pages`(142).

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

## 🟡 남은 P2 (systemic — 규칙 문서 §"검토 방법"대로 lint 권장)
- **#8 raw-px**: padding shorthand 안 raw px(`var(--ig-space-x) 16px`)·inline `minWidth:N`·`letterSpacing:'0.04em'` 다수, 라이브러리 default-param raw px(chart/dropdown-layout/resizable). → stylelint `declaration-property-value-allowed-list`.
- **#10 a11y 추가**: dialog-shell focus-trap/aria-labelledby, context-menu/select/dropdown/chip-tabs 키보드 nav, navigation/menu-item focus-visible·aria-current. → jsx-a11y + 수동 a11y 패스.
- **token hygiene #9**: core/colors·layout 도메인 토큰 누수, fastEase/bgCanvasAlt/icon xsPlus dead 토큰, z-index 충돌.
- **#3 도메인 누수**: utils/format-pattern-tab, generic 컴포넌트의 image-card-* 토큰, patterns/add-dataset-modal 하드코딩.
- **#4/#7**: resizable-columns/panel localStorage 직접 접근.
- **dead code**: ConnectionTabView.styles 미사용 GuideCard/GigeDiagCard/DiagReportWrap/DiagDivider, dataset-select RecentCard/DatasetCard(선택카드 — SelectableListItem 후보), create-project OptionCard(RadioCard label string-only 제약으로 유지).

## 의도적 keeper (over-flag 주의 — 고치지 말 것)
camera 셔터 흰링 rgba, SyncChip/StatChip(bg 없는 status 텍스트), LogDetailTable(mono key-value), TOKEN_BOX accent box, chartColors 숫자 색상, recharts innerRadius/outerRadius 숫자 props, var(--ig-font-mono, fallback), TitleBar 창 컨트롤 버튼(full-height/danger), CaptureButton 셔터(특수 대형 라운드), join-codes/invitations Empty 변형(top-margin spacing).
