# UI 계층 위반 전수 검토 보고서

> 검토일: 2026-06-25
> 방법: pages 패키지(`platform-pages` + `edge-pages`) 전 파일(.tsx/.ts, stories/test 제외)을 grep 아닌 **Read 전수(line-coverage)** 로 10개 영역 분할 검토.
> 기준: `ui-refactoring-rule.md` (특히 0. 작업 위치 우선순위, 2. 의존성 방향, 8. 디자인 토큰).
> 핵심: pages 안에 **독립적으로 재구현된 UI 부품**을 찾아 `primitives`/`components`/`patterns`로 내리거나 카탈로그 부품으로 교체.

## 위반 강도 정의
- **강(STRONG)**: 카탈로그에 이미 있는 부품(Button/Badge/Card/Table/Progress/Dialog/RadioCard/DropZone 등)을 pages가 raw styled로 재구현 → 즉시 교체.
- **중(MEDIUM)**: 카탈로그엔 없지만 도메인 무관 일반 재사용 UI를 pages에서 만듦 → 부품으로 승격(내림/올림).
- **약(WEAK)**: 토큰 미사용(raw px/hex), 유니코드 아이콘, 한 곳만 쓰는 작은 styled.
- 진행상황: 10개 영역 중 ▣ 완료 / ▢ 대기

---

## 진행 현황
- ▣ A. platform/catalog (gallery 포함) — 30파일
- ▣ B. platform/class-manage + create-project + image-detail — 24파일
- ▣ C. platform/dashboard (widgets 포함) — 30파일
- ▣ D. platform/settings-modal edge-tab+project+devices — 30파일
- ▣ E. platform/settings-modal 나머지 — 27파일
- ▣ F. edge/capture + labeling + labeling-panel — 25파일
- ▣ G. edge/chrome + app-shell + workspace + system — 31파일
- ▣ H. edge/images + statics — 17파일
- ▣ I. edge/connection + dataset-modals + dataset-select — 43파일
- ▣ J. edge/log + login + license + settings — 35파일

**전수 검토 완료: 10/10 영역, pages 패키지 294개 대상 파일 line-coverage.**

### 커버리지 검증 (transcript 객관 대조 — 자가신고 아님)
- pages 대상 파일 총 **294개** (platform-pages 144 + edge-pages 150, stories/test 제외).
- agent 실행 기록(subagents/*.jsonl)에서 **실제 `Read` 도구 호출의 file_path를 전부 추출**해 294개 대상과 `comm`으로 대조.
- 결과: **294개 중 293개가 transcript에 Read 기록 존재**(객관 확인). 유일하게 빠졌던 `edge-pages/src/index.ts`는 검토자가 직접 Read하여 마감.
- 두 루트 배럴(`platform-pages/src/index.ts`, `edge-pages/src/index.ts`)은 순수 `export * from` — UI 없음, 위반 없음.
- 영역 E의 organization/general 6개 파일은 agent 자가보고 수치가 모호하여 검토자가 추가로 직접 재확인(우수 사례 + Empty styled.p 반복만 발견).
- **결론: 294/294 전부 Read 확인 완료(객관 검증).** 단 — "읽힘"은 확정이나, 각 파일의 위반 판정(분석)은 대부분 agent 판단이며 검토자 직접 재검은 8개 파일에 한함.

---

## A. platform-pages/catalog (gallery 포함)

- **[강]** `catalog/CatalogView.styles.ts:55-71` — `DangerDimButton`(styled.button)로 danger 버튼 재구현. → `Button tone="danger" size="sm"` 또는 `IconButton`. (같은 파일 toolbar는 이미 Button 사용 → 일관성 깨짐)
- **[강]** `catalog/export-progress-modal.tsx:7-20,80-84` — `PROGRESS_TRACK_STYLE`+`ProgressFill`로 진행률 바 재구현. → feedback `Progress`/`SegmentedProgressBar`.
- **[강]** `catalog/gallery/gallery-export-dialog.styles.ts:69-92` (사용 `gallery-export-progress-dialog.tsx:76-78`) — `ExportProgressTrack`+`ExportProgressFill` 진행률 바 재구현(+ raw hex `#78d6ff` 그라데이션). → `Progress`.
- **[강]** `catalog/gallery/gallery-toolbar.tsx:15-29,99-102` — `PROGRESS_TRACK_STYLE`+`ProgressFill` 진행률 바 **세 번째** 중복 재구현. → `Progress`.
- **[강]** `catalog/gallery/gallery-export-dialog.styles.ts:16-34` (사용 `gallery-export-config-dialog.tsx:85-196`) — `ExportOption`+`ExportOptionRadio`+Body/Title/Hint로 라디오 카드 재구현. → `RadioCardGroup`. (형제 `drag-drop-decide-modal.tsx`,`upload-quality-modal.tsx`는 이미 RadioCardGroup 사용 → 명백한 중복)
- **[중]** `catalog/gallery/gallery-export-dialog.styles.ts:53-67` (사용 `gallery-export-config-dialog.tsx:187`) — `ExportRegexInput`(styled.input) 텍스트 입력칸 재구현. → inputs `TextFields`/`SearchField`.
- **[중]** `catalog/gallery/gallery-export-dialog.styles.ts:3-14,99-117` — `ExportSection`/`ExportSectionLabel`/`ExportErrorText`/`DialogRow`. → danger박스는 `Alert`, 섹션/행은 `FormSection`/`SettingsRow`/`SettingsSection`.
- **[중]** `catalog/CatalogRightSidebar.tsx:13-50` — `MemberPoolList`(Avatar+이름+role+remove 행)를 로컬 조립. → data-display `UserPoolList`.
- **[중]** `catalog/dataset-list-item.tsx:33-49` + `catalog/gallery/gallery-images-table.tsx:27-43` — 동일한 `MenuButton = styled(IconButton).attrs(...)` (active 토글 케밥) 두 파일 복붙. → `IconButton`에 active variant 추가해 승격.
- **[약]** `catalog/gallery/gallery-detail-modal.tsx:3,142-146` — `import {X} from 'lucide-react'` 직접 + `sidebarWidth=320` raw px. → 등록된 close 아이콘 + popup 토큰.
- **[약]** `catalog/gallery/gallery-export-dialog.styles.ts:15,81` 등 — raw `440px`, raw hex `#78d6ff`, `opacity:0.55/0.45` 하드코딩. → 토큰.
- **[약]** `catalog/gallery/gallery-toolbar.tsx:31` / `gallery-detail-modal.tsx:124` — `minHeight:72`, `sidebarWidth=320` raw px. → 토큰.
- **[약]** `catalog/CatalogToolbarRow.tsx:73` — SearchField `style={{maxWidth:220}}` raw px. → 토큰.
- OK: `dataset-task-tag.tsx`, `sync-status-chip.tsx`(Tag/StateChip 래핑), 나머지 dialog/panel은 부품 위 레이아웃 조립으로 적절.

---

## B. platform-pages/class-manage + create-project + image-detail

- **[강]** `class-manage/class-list-sidebar.tsx:47-62` — `CollapseButton`(raw button) 아이콘 버튼. → `IconButton variant="secondary" size="sm"` (같은 페이지 `ClassManageBody.tsx:109`은 이미 IconButton 사용).
- **[중]** `class-manage/class-list-sidebar.tsx:8-80` — 패널 틀(`Sidebar`/`Header`/`Title`/`HeaderActions`)+`Placeholder`(빈/로딩) raw styled. `$flush` 패널 표면이 ClassInfoSidebar/ClassListSidebar/SelectableGridPanel 3곳 중복. → 틀은 `SidePanelLayout`/`DetailPanelSidebar`, Placeholder는 `EmptyState`/`Spinner`, `$flush`표면은 primitive `Surface`로 승격.
- **[강]** `create-project/CreateProjectView.styles.ts:107-134` (사용 `sections.tsx:170-187`) — `Dropzone`(dashed+active+hover/disabled)+숨김 FileInput 재구현. → `DropZone`/`UploadDropzone`/`FileInput`. (`class-manage/reference-image-drop-zone.tsx`는 이미 DropZone 사용 → 패키지 내 중복)
- **[강]** `create-project/CreateProjectView.styles.ts:157-190` (사용 `sections.tsx:115-132`) — `OptionCard`(accent 테두리+inset shadow+선택토글, aria-pressed) 라디오 카드 재구현. → `RadioCardGroup`.
- **[중]** `create-project/CreateProjectView.styles.ts:52-91` — `Section`/`SectionHeader`/`SectionTitle`/`SectionDescription`/`SectionBody`/`FieldsBody` 섹션 카드. → `SettingsSection`/`FormSection`/`InfoSection`.
- **[약]** `create-project/CreateProjectView.styles.ts:136-146` — `FileList`/`FileItem` 파일 목록 raw ul/li. → `TagListItem`/`KeyValueRow` 재사용 여지.
- **[강]** `image-detail/image-detail-class-list.tsx:5-41,91-106` — `Row`(raw button, 선택/classified 강조)+`NameText` selectable row 재구현. → `SelectableListItem`/`OptionRow` (같은 패키지 `class-list-row.tsx`는 이미 SelectableListItem 사용).
- **[약]** `image-detail/image-detail-class-list.tsx:13-29` — `blue-tint-38`,`slate-gray-tint-16/12/18` raw 색 스케일 직접 보간. → 의미 토큰(`accent-border`,`surface-interactive`).
- **[약]** `image-detail/comments-panel.tsx:18-24` — `ERROR_BOX_STYLE` 인라인 에러박스. → `Alert tone="danger"`.
- **[약]** `image-detail/image-detail-info-panel.tsx:91-99` — 토글 화살표 `▾/▸` 유니코드 하드코딩. → 등록 chevron 아이콘.
- **[약]** `class-manage/ClassManageImageGrid.tsx:50` — `<Badge>4</Badge>` 매직 리터럴. → 실제 데이터.
- **[약]** `class-manage/reference-image-section.tsx:9-16,56,68,74-75` — `PREVIEW_STYLE` 인라인 img 스타일 + raw 숫자. → `AspectRatioImage`/`ImageCard`+토큰.

---

## C. platform-pages/dashboard (widgets 포함)

- **[강]** `dashboard/analysis-section.styles.ts:73-90` — `styled.table` 일반 데이터 테이블 재구현(worker activity). → `Table`. (동일 표가 widgets 3곳에 추가 중복)
- **[강]** `dashboard/widgets/analysis-labeling-by-person-widget.tsx:14-33` — `PersonTable=styled.table` 재구현. → `Table`.
- **[강]** `dashboard/widgets/per-dataset-distribution-widget.tsx:21-32` — `Table=styled.table` 재구현. → `Table`.
- **[강]** `dashboard/widgets/source-breakdown-widget.tsx:21-32` — `Table=styled.table` 재구현. → `Table`. (위 4개 표는 사실상 동일 컴포넌트)
- **[강]** `dashboard/widgets/source-breakdown-widget.tsx:35-40` — `CHIP_STYLE` inline으로 source 라벨 칩 재구현(+raw `2px`). → `Chip`/`Tag`/`Badge`.
- **[중]** `dashboard/dashboard-widget.tsx:5-43` — `DashboardWidget`(title+subtitle+actions+body 슬롯 일반 카드 틀). → `Card` 또는 patterns(`StatCard`/`ChartContainer` 계층)로 승격.
- **[중]** `dashboard/distribution-heatmap.tsx:7-87` — generic row×column heatmap(작성자 주석이 "도메인 무관"이라 명시). → components(data-display) 또는 patterns/charts 신규 부품으로 승격.
- **[중]** `dashboard/dashboard-stats-header.tsx` 전체 — label/value 행 반복 generic 통계 헤더. → `KeyValueRow`/`InfoRow`.
- **[약]** `dashboard/analysis-widget-shell.tsx:37-43` — `box-shadow:0 0 0 1px` raw `1px`. → `--ig-border-1px`.
- **[약]** `dashboard/dashboard-customize-popover.tsx:11` — `min(320px,...)` raw px. → `--ig-popup-*`.
- **[약]** `dashboard/DraggableAnalysisWidgetGrid.styles.ts:116,47-53` — raw `16px`/`0.16s`/box-shadow px. → space/motion/shadow 토큰.
- **[약]** `dashboard/EdgeAnalyticsSection.tsx:66-73` 외 — 차트 `innerRadius/outerRadius/paddingAngle` 매직넘버. → 상수/토큰화.
- OK: DashboardView/header/overview/widget-grid/layout-dashboard/DraggableAnalysisWidgetGrid는 페이지 전용 레이아웃으로 적절. 부품(Button/DateRangePicker/Spinner/Checkbox/StatCard/PageHeader/IconButton/DragHandle) 정상 사용.

---

## D. platform-pages/settings-modal (edge-tab + project + devices)

- **[강]** `settings-modal/devices/devices-table.tsx:12-37,111-152` — `styled.table` 데이터 테이블 재구현(.mono/.muted/.actions/.empty 변형). → `Table` (형제 `ExportHistory.tsx`는 이미 `UiTable` columns/render API 사용). 빈 셀은 `EmptyState`.
- **[강]** `settings-modal/edge-tab/DeflectometryPreview.styles.ts:16-34` (사용 `DeflectometryPreview.tsx:50-63`) — `styled.button<{$active}>` pill 탭(role=tablist/tab, aria-selected) 재구현. → `ChipTabs`/`Chip`(선택형)/`Tabs`.
- **[강/중]** `settings-modal/project/permission-matrix.tsx:27-63,141-178` — sticky 헤더/2단 컬럼헤더/sticky row-label `styled.table` 재구현. 주석에 "generic matrix(권한/옵션/기능 row×col)"라 명시 → 도메인 무관. → `Table` 흡수 또는 components/patterns로 승격.
- **[약]** `settings-modal/project/project-members-list.tsx:15-18` + `project-member-invite.tsx:6-9` + `devices/devices-license-section.tsx:7-10` — `Placeholder`(styled.p 빈/로딩 텍스트) 3파일 중복 정의. → `EmptyState` (같은 edge-tab의 `EdgeTabView`/`ExportHistory`는 이미 EmptyState 사용).
- **[약]** `settings-modal/edge-tab/edge.styles.ts:114-141,150-161` — `ReportBox/ReportGrid/ReportStat`(숫자+라벨 4분할 카드), `Progress*` raw styled. → `StatCard`+`Progress`(페이지 전용 조합 성격도 있어 약).
- **[약]** `settings-modal/devices/devices-forms.tsx:24-25` — `WIDTH_160_STYLE`/`WIDTH_200_STYLE` raw px. → `popupSizeNumbers`/space 토큰.
- **[약]** `settings-modal/edge-tab/DeflectometryPreview.styles.ts:18` + `.tsx:5-6` — raw `10px`, `PREVIEW_WIDTH=360`/`PREVIEW_HEIGHT=220` raw px. → 토큰.
- **[약]** `settings-modal/project/project-member-row.tsx:27-28` + `project-resolution-card.tsx:11` + `project-settings-form.tsx:40` + `permission-matrix.tsx:111` — raw px minWidth(`100`/`180`/`200`/`120`), `fontSize: iconSizeNumbers.xs`(아이콘 토큰 오용). → space/popup/font 토큰.
- OK: `device-status-badge.tsx`/`ProjectTypeTag`(Badge 래퍼), `device-detail-dialog.tsx`, `EdgeTabView`, `WorkOptionsTabUI/ExportTabUI/ImportTabUI`(부품 조합), `edge.styles.ts`의 Alert/InlineMessage/StatusPill 확장.

---

## E. platform-pages/settings-modal (account/general/organization/storage/tabs)

- **[강]** `settings-modal/storage/storage-stats-table.tsx:13-39,58-93` — `styled.table` + 컬럼 인터페이스 재발명. → `Table<T>+TableColumn<T>` (형제 invitations/join-codes/org-members는 이미 Table 사용 → 일관성 깨짐). footer/numeric 정렬 부족 시 Table에 prop 추가.
- **[중]** `settings-modal/storage/storage-overview.tsx:4-9,38-44` — `CARD_STYLE` 인라인 + Box로 "라벨+큰 숫자+보조텍스트" 통계 카드 조립. → `Card` 또는 `StatCard` 승격.
- **[중]** `settings-modal/storage/storage-stats-table.tsx:6-11` + `storage-overview.tsx:4-9` — 동일 카드 표면(surface-raised+border-strong+radius+padding) `CARD_STYLE` 중복 정의. → `Card`/primitive `Surface` raised variant.
- **[중]** `settings-modal/storage/storage-recommendations-list.tsx:7-16,34-40` — `styled.li` tone(info/warn) 배경+`::before` 아이콘(⚠/ⓘ glyph) 알림 항목 재구현. → `Alert`(같은 모달이 이미 `$tone` 사용)/`StateChip`.
- **[약]** `settings-modal/SettingsModalView.styles.ts:137-147` — `ExpandToggle`(styled.button) 텍스트 링크 버튼. → `TextButton`.
- **[약]** `settings-modal/storage/storage-analytics-tab.tsx:6-12,54-62` — `ERROR_WRAP_STYLE`/`ERROR_TEXT_STYLE` 인라인 에러박스. → `Alert tone="danger"`.
- **[약]** `settings-modal/account/delete-account-dialog.tsx:14-19,98-103` — `SOLO_CARD_STYLE` 인라인 danger 카드. → `Card`/`Alert tone="danger"`.
- **[약]** `settings-modal/storage/storage-analytics-tab.tsx:76~101` — `<Text as="h4" uppercase letterSpacing="0.5px">` 제목 7회 반복 + raw px letterSpacing. → `--ig-letter-spacing-*` + `CollapsibleSectionHeader`/`InfoSection`.
- **[약]** `storage-overview.tsx:39`/`account/settings-account-tab.tsx:8`/`delete-account-dialog.tsx:21,60`/`organization/join-codes-section.tsx:9` — raw px minWidth(`240`/`260`), `letterSpacing="1px"` 산재. → 토큰.
- **[약]** (검토자 직접 확인) `organization/invitations-section.tsx:11` + `invitations-tab.tsx:13` + `org-members-tab.tsx:10` + `org-settings-tab.tsx:8` + `storage`/`join-codes-section.tsx:11` — `Empty`/`Placeholder = styled.p`(빈/로딩 상태 텍스트)를 **5개 파일이 각각 재정의**. 토큰(`stateTitleText`/`stateCenteredLayout`)은 지키나 `EmptyState` 미사용. → `EmptyState`로 통일.
- **[약]** (검토자 직접 확인) `general/settings-general-tab.tsx:7` `SELECT_WRAP_STYLE={minWidth:160}` raw px + `Hint=styled.p`. → 토큰 + `Text`.
- OK: SettingsModalView/각 Tab/admin은 부품 위임. invitations/join-codes/org-members/org-settings/general 본체는 Table/Button/TextField/SelectField/OptionRow/DialogShell/SettingsSection 정상 사용(우수 사례).

---

## F. edge-pages/capture + labeling + labeling-panel

- **[강]** `capture/CaptureReviewFullscreen.styles.ts:52-76` (사용 `.tsx:27-29`) — `CaptureReviewSkipBtn`/`CaptureReviewSaveBtn`(secondary/primary) raw button 재구현. → `Button` (같은 패키지 `SetupPanelView`는 이미 Button 사용 → 불일치).
- **[강]** `capture/CaptureReviewFullscreen.styles.ts:15-32` + `CaptureView.styles.ts:105-118,341-358` + `labeling/BBoxCanvasView.styles.ts:120-137` — 정사각 아이콘 버튼(overlay-dim+hover) **4곳 중복** 재구현. → `IconButton`(overlay variant 추가).
- **[강]** `capture/DeflectometryTuningControlsView.styles.ts:9-19` — keyframes spinner 재구현. → `Spinner` (같은 패키지 CaptureView는 ui Spinner re-export → 불일치).
- **[강]** `capture/DeflectometryTuningControlsView.styles.ts:77-106` — raw `input[range]`(Slider) + raw `<select>`(Select) 재구현. → `SelectField`/`DropdownSelect`(select), 슬라이더는 신규 primitive 승격.
- **[강]** `capture/DeflectometryTuningControlsView.styles.ts:108-121` — raw `input[checkbox]`+label 체크박스 행. → `Toggles`(Checkbox).
- **[강]** `capture/DeflectometryTuningControlsView.styles.ts:134-160` — `$primary/$active/$danger` variant 범용 버튼 재구현. → `Button`.
- **[강]** `labeling/BBoxCanvasView.styles.ts:38-56,168-214` — `IconBtn`/`HeaderIconBtn`/`ModeToggleBtn`(variant 아이콘 버튼) 3종 재구현. → `IconButton`+`ModeSwitcher`.
- **[강]** `labeling-panel/RightPanelView.styles.ts:53-77` — `PatternButton`/`RoiPrimaryButton` raw button + **raw rgba** `rgba(59,130,246,0.18)`/`rgba(96,165,250,0.85)`(59,60줄). → `Button`(accent)+ChipTabs/ModeSwitcher, 색 토큰화.
- **[중]** `capture/CaptureView.styles.ts:44-49,65-87` — `MetricCard`/`SetupBlockingCard` raw 카드 틀. → `Card`/primitive `Surface`.
- **[중]** `capture/CaptureView.styles.ts:120-131` — `OverlayPopover`(surface/blur/shadow/border 팝오버 틀) raw. → overlays `Popovers`/`FloatingOverlay`.
- **[중]** `capture/CaptureView.styles.ts:324-339` — `CapturingBadge` 알약형 배지 raw. → `Badge`/`StateChip`.
- **[중]** `capture/DeflectometryTuningControlsView.styles.ts:175-183` — `Warning` info/warn 알림 박스 + **raw rgba** `rgba(255,180,60,0.14/0.35)`(180-182줄). → `Alert`, 색 토큰화.
- **[중]** `capture/DeflectometryTuningControlsView.styles.ts:29-53` — `CollapsibleHeader`/`SectionTitle`(collapsible 섹션 헤더 button) 재구현. → `CollapsibleSectionHeader`.
- **[중]** `capture/DeflectometryTuningControlsView.styles.ts:220-238` — `QualityStatus`(색 dot+상태 라벨 칩) raw. → `StateChip`/`Status`.
- **[중]** `labeling-panel/RightPanelCommentSection.tsx:7-37` — 댓글 목록/아이템/메타/Empty .tsx 인라인 styled 재구현. → `CommentThread`(patterns/comment), Empty는 `EmptyState`(같은 파일 RightPanelView는 이미 EmptyState 사용 → 불일치).
- **[약]** `capture/SetupPanelView.styles.ts:57-66` + `.tsx:8-23` — `PatternButton` 토글 버튼 + **raw rgba** `rgba(96,165,250,0.85)`/`rgba(59,130,246,0.18)`(58,59줄), `Accordion`을 .tsx 안 styled.details 인라인 정의. → ModeSwitcher/ChipTabs+토큰, CollapsibleSectionHeader.
- **[약]** `capture/SequencePatternPanelView.styles.ts:11-34,44-60` — `Segment`/`SegmentBtn` 세그먼트 토글 + `Item` 선택 리스트. → `ModeSwitcher`/`ChipTabs`+`SelectableListItem`(RightPanelView는 이미 사용 → 불일치).
- **[약]** `labeling/BBoxCanvasView.styles.ts:96-103` — `PixelSwatch` 색상 스와치 raw. → `ColorSwatch`(RightPanelView는 이미 사용 → 불일치).
- 공통: capture/labeling-panel 양쪽에서 동일 raw rgba(`59,130,246`/`96,165,250`/`255,180,60`)가 중복 → **색 토큰을 primitive로 내려야 함**.

---

## G. edge-pages/chrome + app-shell + workspace + system

- **[강]** `chrome/AccountMenuView.styles.ts:35-46` (사용 `.tsx:39-49`) — `AccountDropdown`(absolute+surface-raised+shadow+z-dropdown)+`AccountMenuItem`/`AccountMenuDanger`+수동 `useClickOutside`로 드롭다운 메뉴 재구현. → overlays `ContextMenu`+`MenuItem`/`Popovers`.
- **[강]** `chrome/AccountMenuView.styles.ts:3-23`(AccountBtn) + `TopBarView.styles.ts:52-70`(IconBtn) + `TitleBarView.styles.ts:50-72`(Btn) + `TopBarView.styles.ts:78-96`(BackBtn) — hover/active 버튼·아이콘버튼 **4곳 반복** 재구현. → `Button`/`IconButton`/`TextButton`.
- **[강]** `chrome/AccountMenuView.styles.ts:117-128`(ModalCancelBtn) + `workspace/WorkspaceView.styles.ts:34-49`(ConfirmButton, `$danger`) — 다이얼로그 액션 버튼 raw 재구현(+raw rgba `239,68,68,0.35`). → `Button`(secondary/accent, danger tone).
- **[강]** `workspace/WorkspaceView.styles.ts:76-83` — `SavingSpinner`(keyframes spin) 재구현. → `Spinner` (같은 패키지 BottomBarView/EdgeAppShellView는 이미 Spinner 사용 → 불일치).
- **[강]** `system/SystemMonitorMonitorTabView.tsx:15-34` — `StatCard`/`StatLabel`/`StatValue`(라벨+큰 수치) 동명 로컬 재구현. → patterns `StatCard`.
- **[중]** `chrome/BottomBarView.styles.ts:35-58` — `SyncChip`/`StatChip`(status→색 분기 칩). → `StateChip`/`Chip`.
- **[중]** `chrome/TopBarView.styles.ts:36-50` — `StatusDot`(connected/connecting/disconnected 색+ring). → `Status`/`StateChip` dot.
- **[중]** `chrome/TopBarView.styles.ts:98-121` — `BreadcrumbWrap/Project/Sep/Dataset`(project/dataset `/` 브레드크럼) raw span. → navigation `Breadcrumbs`.
- **[중]** `system/SystemMonitorCleanupTabView.tsx:5-15`(Row/Label/Value) + Monitor Empty + AccountMenu ModalEmptyText — 정보행/빈상태 중복. → `InfoRow`/`KeyValueRow`+`EmptyState`.
- **[약]** `app-shell/MainLayoutView.styles.ts:32` — `padding: var(--ig-space-4) 14px 10px` raw px. → space 토큰.
- **[약]** `chrome/TitleBarView.styles.ts:64-71` — close hover/active `rgba(196,43,28,0.9/1)` raw. → danger 토큰.
- **[약]** `workspace/WorkspaceView.styles.ts:27,30,38` — `18px`/box-shadow px/`rgba(239,68,68,0.35)` raw. → space/shadow/danger 토큰.
- OK: EdgeAppShellView/MainLayoutView/WorkspaceShell/SystemMonitorModalView(TwoColumnDialog+Tabs)는 페이지 전용 레이아웃·부품 조합으로 적절. (MainLayoutView 3-패널은 향후 `ResizableColumnsLayout` 검토 여지.)

---

## H. edge-pages/images + statics

- **[강]** `images/ImagesView.styles.ts:161-174` (사용 `.tsx:182-189`) — `ModalCloseBtn`(raw button X) 재구현. → overlays `DialogCloseButton`.
- **[강]** `images/ImagesView.styles.ts:298-311,145-159` (사용 `.tsx:162-178,197-212`) — `ModalHeaderIconBtn`/`ModalBBoxToolbarBtn`(`$active` 토글) 재구현. → `IconButton`(active).
- **[강]** `images/ImagesView.styles.ts:10-17` (사용 `EdgeImagesGridView.tsx:112`) — `GroupBadge`(카운트 뱃지) raw. → `Badge`/`GroupCountBadge`.
- **[강]** `images/ImagesView.styles.ts:237-242` (사용 `.tsx:62-67`) — `SelectAllCheckbox`(raw input checkbox). → `Toggles`(Checkbox).
- **[강]** `statics/SessionChartsView.styles.ts:28-47` (사용 `.tsx:103-124`) — `Table`/`Th`/`Td` raw 테이블 재구현. → data-display `Table`.
- **[중]** `images/ImagesView.styles.ts:226-235` — `ModalOverlay`+`ModalInner`(backdrop+중앙+click-close) raw. → overlays `FloatingOverlay`/`DialogShell`/`ModalPrimitives` 또는 `ImageViewer`.
- **[중]** `images/ImagesView.styles.ts:63-81` — `ImagesFilterButton`(`$active` 필터 트리거) raw. → `IconButton`/`FilterPopoverTrigger`.
- **[중]** `images/ImagesView.styles.ts:29-58` — `GroupDeleteBtn`(원형 아이콘 삭제, hover scale) raw. → `IconButton`(danger/pill).
- **[중]** `images/ImagesView.styles.ts:254-261,283-289` — `SyncDot`/`SyncSummary`(색 상태 dot). → `Status`/`StateChip`. (SyncStateIcon spin은 OK)
- **[중]** `statics/SessionChartsView.styles.ts:9-26` + `StaticsView.styles.ts:43-48,68-74` — `DurationCard`/`SummaryCard`/`Panel`(라벨+값 카드 틀) 반복. → `Card`/`StatCard`.
- **[중]** `statics/LabelingChartsView.tsx:18-67` + `SessionChartsView.tsx:24-40` — `TrendTooltip`/`AvgSizeTooltip`/`MsTooltip`(recharts 커스텀 툴팁) inline 3곳 중복. → charts `ChartTooltip`/`TooltipCard`.
- **[중]** `statics/StaticsView.styles.ts:83-102` (사용 `.tsx:53-61`) — `SectionHeader`/`SectionContent`(chevron collapsible 헤더 button) 재구현. → `CollapsibleSectionHeader`.
- **[약]** `statics/StaticsView.styles.ts:25-29` — `Title`(styled.h2)/`Subtitle`/`PanelTitle`/`DurationLabel/Value` raw 타이포. → primitives `Heading`/`Text`.
- **[약]** `images/ImagesView.styles.ts:139,222,248,304` + `.tsx:62-111` inline — raw px(`12px`/`14px`/`16px`)+inline style 다수. → space 토큰.
- **[약]** `images/ImagesView.styles.ts:43,256` — box-shadow `rgba(0,0,0,0.28)`, `border-radius:50%` raw. → shadow 토큰/`--ig-radius-pill`.
- **[약]** `statics/*.tsx` — `innerRadius={44} outerRadius={72}`, `width:8`, `gap:12`, `borderRadius:999`, box-shadow rgba 등 매직넘버 다수. → 토큰/상수.

---

## I. edge-pages/connection + dataset-modals + dataset-select

- **[강]** `dataset-select/dot-menu.styles.ts:1-58` (사용 `DatasetCardView.tsx:45-72`) — `DotsBtn`+`DotMenuOverlay`(fixed)+`DotMenuWrap`(absolute panel+shadow)+`DotMenuItem` 컨텍스트 메뉴 일습 재구현(+raw `rgba(0,0,0,0.4)`). → overlays `ContextMenu`+`MenuItem`, 트리거 `IconButton`.
- **[강]** `dataset-select/styles/header.styles.ts:71-114` (사용 `DatasetSelectHeader.tsx:62-77`) — `RefreshBtn`/`IconBtn`(정사각 아이콘 버튼) 2종 중복 재구현. → `IconButton`.
- **[강]** `dataset-select/styles/header.styles.ts:33-67` — `ModeTag`/`RoleBadge`(tone별 색 뱃지). → `Badge`/`StateChip` (ConnectSection은 이미 `Badge $tone` 사용 → 불일치).
- **[강]** `dataset-select/dataset-card.styles.ts:74-90,153-161,168-177` — `EdgeDatasetTaskTag`/`RecentBadge`/`MoreChip`(색 라벨/카운트 뱃지). → `Badge`/`Chip`/`Tag`/`GroupCountBadge`.
- **[강]** `dataset-select/dataset-card.styles.ts:123-151` + `class-chips.tsx:8-25` — `ClassChip`+`ClassChipDot`+`ClassChipName`(색점+라벨 칩, raw alpha 보간 `${color}22`). → `LegendItem`/`ColorChip`/`ColorSwatch`.
- **[강]** `dataset-modals/ExportModalView.styles.ts:3-25` (사용 `.tsx:55-61`) — `ProgressBarTrack`+`ProgressBarFill`(keyframes, done/error) 진행바 재구현. → `Progress`/`SegmentedProgressBar`.
- **[강]** `connection/sections/NicStatusCardView.tsx:5-30` — `Card`/`Row`/`Label`/`Value`/`ErrorList`(label↔value 정보 카드) 재구현(주석에 "InfoRow로 이동" 선례 존재). → `InfoRow`/`KeyValueRow`+`InfoSection`.
- **[중]** `connection/sections/ConnectionGuidePanelView.tsx:6-89` — GuideCard/Header/Summary* 패널 한 벌 로컬 재정의. **`ConnectionTabView.styles.ts:19-45`와 동일 구조 양쪽 중복**(드리프트 위험). → 단일 surface 패널+`InfoRow`/`StatCard`.
- **[중]** `connection/sections/DiagnoseClassificationCardView.tsx:4-11` — ok/warn 색 메시지 카드. → `Alert`(success/warning)/`StateChip`.
- **[중]** `connection/sections/ConnectSectionView.tsx:7-22` + `DiagnosticsSectionView.tsx:7-18` — 아이콘+toned 상태 메시지 여러 섹션 중복. → `Alert`/`StateChip`/`Status`.
- **[중]** `dataset-select/styles/header.styles.ts:116-136` — `StatusItem`/`StatusDot`(연결 상태 색점, raw `box-shadow:0 0 0 2px`). → `Status`/`StateChip`.
- **[중]** `dataset-select/dataset-grid.styles.ts:55-74`(AddDatasetBtn dashed)+`40-53`(ProjectTypeTag pill, raw `rgba(77,136,255,0.34)`). → `Button`/`TextButton`+`Tag`/`Badge`.
- **[중]** `connection/sections/AdvancedSectionView.tsx:7-19` — `Header`(chevron collapsible 토글). → `CollapsibleSectionHeader`.
- **[중]** `dataset-select/dataset-card.styles.ts:4-49` — `RecentCard`/`DatasetCard`(선택/recent 카드 버튼 컨테이너). → `Card`/`SelectableGridCell`/`SelectableListItem`.
- **[약/삭제]** `connection/ForceIpDialogView.styles.ts:1-79` — **죽은 코드**: `ForceIpDialogView.tsx`에서 전혀 import 안 됨(tsx는 TextField/inline 사용). → 파일 삭제.
- **[약]** `dataset-select/styles/page.styles.ts:35-40` — `Spinner`라는 이름의 styled.div가 실제론 텍스트 컨테이너 → 카탈로그 `Spinner` 이름 가림. → 실제 `Spinner`+텍스트/`Skeleton`.
- **[약]** `dataset-modals/AddDatasetModalView.tsx:6-16` + `ExportModalView.tsx:6-27` — `FIELD_LABEL_STYLE`/`FIELD_STYLE` 반복 인라인. → `FormSection`/`SettingsRow`/`InfoRow`.
- **[약]** `connection/ConnectionTabView.styles.ts` — raw px/hex 다수(`10px`/`14px`/`200px`/`5px`/`6px`, `rgba(34,197,94,0.08)`, `'JetBrains Mono'`, `font-weight ?600:400`). → 토큰. (이 파일이 위 강/중 styled 원본)
- OK: ForceIpDialogView.tsx/AddDatasetModalView.tsx/ExportModalView.tsx 본체/DatasetSelectView/CreateProjectFormView는 DialogShell/Button/TextField/RadioCardGroup/CheckboxGroup/EmptyState 정상 사용.

---

## J. edge-pages/log + login + license + settings

- **[강]** `license/LicenseView.styles.ts:99-161` — `CopyBtn`/`SubmitBtn`(raw button)+`Input`(raw input) 재구현. → `Button`+`CopyButton`+`TextField` (login은 이미 TextField/PasswordField/Checkbox 사용 → 불일치).
- **[강]** `login/LoginView.styles.ts:103-124` — `Btn`(primary/secondary/ghost variant 보간) 재구현. → `Button`(variant)+`TextButton`(ghost).
- **[강]** `log/LogPanelView.styles.ts:26-101` — `FilterActionButton`(트리거)+`FilterPopover`(absolute+shadow+섹션 일체) 재구현. → `IconButton`/`FilterPopoverTrigger`+`FilterPopover`/`Popovers`/`FilterSection`.
- **[강]** `log/LogDetailTableView.tsx:4-27` — `Table`/`Th`/`Td`(raw key-value 표) 재구현. → `Table` 또는 `KeyValueRow`/`InfoRow`.
- **[강]** `settings/tabs/BackendLogsContentView.tsx:7-27` + `FrontendLogsContentView.tsx:7-25` — `LogList`/`LogRow`/`Timestamp`/`LevelBadge`/`EmptyText`를 **두 파일 복붙 수준 중복** 재구현. → `Badge`/`StateChip`+`EmptyState`+공통 로그리스트 컴포넌트 승격.
- **[중]** `login/LoginView.styles.ts:151-183` (사용 `.tsx:77-85`) — `AccountList`/`AccountItem`(name+email 2줄 선택 카드). → `SelectableListItem`/`OptionRow`.
- **[중]** `login/LoginView.styles.ts:184-194` — `ModeTag`(online/offline 색 뱃지, raw `7px`). → `Badge`/`StateChip`/`Status`.
- **[중]** `log/LogPanelView.styles.ts:110-140` — `LogItem`/`LogTime`/`LogMessage`(type별 배경 로그 행). → `SelectableListItem`/`OptionRow`+`StateChip`.
- **[중]** `log/LogPanelView.styles.ts:142-156,187-192` — `DetailPanel`(고정 사이드 패널)+`DetailPlaceholder`(빈 상태). → `DetailPanelSidebar`/`SidePanelLayout`+`EmptyState`.
- **[중]** `log/LogPanelView.tsx:155-159` + `styles.ts:171-178` — `ImageModalOverlay`/`ImageModalImg`(createPortal 이미지 확대 모달). → `ImageViewer`/`HoverPreview`/`ModalPrimitives`.
- **[중]** `settings/UpdateSectionView.tsx:6-18` + `AboutTabView.tsx:22-30` + `DataTabView.tsx:6-14` — `Row`/`Label`/`Value` key-value 행 3파일 중복. → `KeyValueRow`/`InfoRow`/`SettingsRow`.
- **[중]** `settings/tabs/AboutTabView.tsx:5-11` + `CameraParamsTabView`/`DataTabView`/`FieldTestTabView`/`UpdateSectionView` — `Section`/`SectionTitle` 골격 여러 탭 반복. → `SettingsSection`/`CollapsibleSectionHeader`/`InfoSection`.
- **[중]** `settings/tabs/AboutTabView.tsx:32-41` + `DataTabView.tsx:15-22` + `CameraParamsTabView` — monospace+`user-select:all` 코드/경로 박스 중복. → code 표시 component 승격 + `CopyButton`.
- **[약]** `settings/tabs/CameraParamsTabView.tsx:40` + `ServerTabView.tsx:34` — `placeholder` 문자열 하드코딩(labels 미경유). → labels로 이동.
- **[약]** `settings/tabs` 다수 — inline style 남발(`marginTop`/`fontSize`/`color`), `'Courier New'`/`monospace` 폰트 하드코딩. → `Box`/`Text` prop + mono 폰트 토큰.
- **[약]** `license/LicenseView.styles.ts:84,92` + `log` mono — raw `12px`, `'Courier New'`/`monospace` 폰트. → space/mono 토큰.
- OK: CameraSettingsDialogView(TwoColumnDialog/VerticalTabs), UnifiedLogsTabView(ModeSwitcher), ServerTabView(FieldRow/RadioCardGroup/TextField/Button), types/index/log-filters는 정상.

---

# 검토자 직접 라인 재검증 로그 (agent 결과 교차검증)

> 사용자 요청으로 10개 영역 294파일을 검토자(메인)가 **직접 한 줄씩 재검토**하며 agent 결과의 오탐(거짓양성)/누락(거짓음성)을 교차검증. 영역별로 갱신.

### ▣ A. catalog — 30/30 직접 재검토 완료
- **오탐 0건**: agent가 강/중으로 적은 모든 항목(DangerDimButton, ProgressFill 3중복, ExportOption 라디오카드, ExportRegexInput, ExportErrorText, MemberPoolList, MenuButton 2파일 중복, lucide X import, raw `#78d6ff`/`440px`/`maxWidth:220`/`minHeight:72`/`sidebarWidth:320`) 실제 코드에서 전부 확인됨.
- **경미한 정정**: agent가 적은 `opacity:0.45`는 미존재(실제 `0.55`만).
- **추가 누락(약)**: `dataset-list-panel.tsx:11 Placeholder=styled.div`(stateTitleText/stateCenteredLayout 토큰 사용) — EmptyState 후보. `CatalogBody.tsx:18 EmptyStateWrap`/`LoadingText`는 EmptyState/Spinner를 감싸는 레이아웃 wrapper라 정당(위반 아님).
- 정상 확인(부품 올바른 사용): CatalogOverlays/CatalogDesktopView/CatalogMobileView/CatalogGridView/CatalogView/gallery-filter-panel/gallery-image-menu/gallery-dataset-transfer-dialog/dataset-task-tag/sync-status-chip/upload-quality-modal/drag-drop-decide-modal/gallery-delete-dialog. types.ts/overlay-types.ts/index.ts×2 = 순수 타입·배럴.

### ▣ B. class-manage + create-project + image-detail — 24/24 직접 재검토 완료
- **오탐 0건**: agent 강/중/약 항목(class-list-sidebar CollapseButton+panel+Placeholder, CreateProjectView.styles Dropzone+OptionCard+Section/FieldsBody+FileList, image-detail-class-list Row+raw tint scale, ClassManageImageGrid `<Badge>4</Badge>` 매직리터럴, comments-panel ERROR_BOX_STYLE, image-detail-info-panel `▾/▸` 유니코드, reference-image-section PREVIEW_STYLE+`marginTop:-2`) 전부 실제 확인.
- **추가 누락 발견(중요)**: `class-list-row.tsx:40-49`에도 **동일 `MenuButton = styled(IconButton).attrs` active 토글 중복** → A영역에서 2파일이라 한 것이 실제 **3파일**(dataset-list-item, gallery-images-table, class-list-row). 승격 시 3곳 모두 교체.
- **추가 누락(약)**: `comments-panel.tsx:3 import {Archive,Pencil} from 'lucide-react'` — lucide 직접 import(아이콘 계층 우회, gallery-detail-modal의 X와 동종). `image-detail-info-panel.tsx:72`/`CatalogRightSidebar.tsx:39` 등 `letterSpacing="0.04em"/"0.05em"` raw 값 산재.
- 정상 확인: ClassManageBody(Alert/EmptyState/FilterChipRow/IconButton/ResizableColumnsLayout), class-lightbox(ChipTabs/ImageInspectorCanvas), reference-image-drop-zone(DropZone — 우수사례), model-mapping-select(SelectField), ClassManageOverlays(ConfirmDialog/ContextMenu/ImageContextMenu/TextInputDialog), CreateProjectView(BrandLogo/Alert/Button), comments-panel 본체(CollapsibleSectionHeader/CommentThread/CommentItem/MentionTextarea). class-info-sidebar는 SidePanelLayout 확장(정당). types/index = 순수.

---

### ▣ C. dashboard (widgets 포함) — 30/30 직접 재검토 완료
- **오탐 0건**: styled.table **4중복**(analysis-section.styles `Table`, PersonTable, per-dataset `Table`, source-breakdown `Table` — 거의 동일), source-breakdown `CHIP_STYLE`+raw`2px`, dashboard-widget(surfaceCard generic 카드), distribution-heatmap(작성자 주석 "도메인 무관 generic"), dashboard-stats-header(key-value), analysis-widget-shell `box-shadow 1px`, dashboard-customize-popover `320px`, DraggableGrid.styles `16px/0.16s/box-shadow px`, EdgeAnalytics 차트 radius — 전부 확인.
- **추가 누락(약)**: ① `analysis-section.styles.ts:37-57` StatRow/StatLabel/StatValue도 key-value 행(EdgeAnalytics/Deflectometry 양쪽 사용) → InfoRow/KeyValueRow. ② lucide 직접 import 3번째: `analysis-widget-shell.tsx:3 Download`. ③ **`fontSize: iconSizeNumbers.xs` 폰트 오용 체계적 패턴**: dashboard-overview-panel:33, analysis-data-collection-widget:27, analysis-timeline-widget:29 (+ D영역 project-member-row) → font-size 토큰으로. ④ Placeholder styled.p(dashboard-overview-panel) EmptyState 후보.
- 정상 확인: DashboardView/DashboardView.styles(AppShell)/DraggableAnalysisWidgetGrid(dnd 로직+DragHandle)/widget-grid/layout-dashboard(StatCard 우수)/dashboard-header(PageHeader)/소형위젯 5개(PieChartCard/BarChartCard/LineChartCard). types/edge-analytics-types/index/widgets-index/use-widget-drag-layout/widget-layout = 로직·타입.

### ▣ D. settings-modal edge-tab+project+devices — 29/29 직접 재검토 완료
- **오탐 0건**: devices-table `styled.table`(.mono/.muted/.actions/.empty), DeflectometryPreview `Badge=styled.button` pill탭(role=tablist)+raw`10px`+`PREVIEW_WIDTH=360`, permission-matrix generic `StyledTable`(주석 "generic matrix"), edge.styles `ReportStat`(ImportTabUI에서 사용), project-member-row `minWidth:100`+`fontSize:iconSizeNumbers.xs`, project-resolution-card `minWidth:180`, project-settings-form `minWidth:200`, devices-forms `WIDTH_160/200`, Placeholder×3(project-members-list/member-invite/devices-license-section) — 전부 확인.
- **추가 누락(약)**: ① 인라인 카드표면(`CARD_STYLE`/`FORM_BOX_STYLE`/`TOKEN_BOX_STYLE` = surface-raised+border+radius)이 project-resolution-card/devices-forms/devices-license-section에 반복 → **systemic 카드표면 패턴**(storage영역과 동일, primitive Surface/Card로). ② `device-detail-dialog.tsx:37 Grid gap="10px 16px"` raw px + label-value 그리드, `devices-license-section INFO_GRID_STYLE` label-value 그리드 → InfoRow/KeyValueRow. ③ `ExportHistory.tsx:69` `✎` 유니코드 글리프+clickable span(접근성). ④ `DeflectometryPreview.styles.ts:27 transition 0.15s` raw duration. ⑤ project-settings-form/member-invite/delete-project-section 등 `letterSpacing="0.04em"` raw 반복.
- 정상 확인: WorkOptionsTabUI/ExportTabUI/ImportTabUI/DeflectometryOptions/QualityFields(부품 조합), EdgeTabView(Tabs/EmptyState), ExportHistory(**UiTable 우수사례**), devices-tab(SettingsSection), project-permission-matrix(generic wrapper), device-status-badge(Badge 래퍼), edge.styles ErrorHint/WarningBox/StatusPill/NumberInput(정당한 styled() 확장). edge-types/index = 타입·배럴.

### ▣ E. settings-modal 나머지(account/org/general/storage/tabs/admin) — 30/30 직접 재검토 완료
- **오탐 0건**: storage-stats-table `styled.table`+컬럼 인터페이스 재발명+CARD_STYLE, storage-overview CARD_STYLE 통계카드, storage-recommendations-list `Item=styled.li`(info/warn bg+`⚠/ⓘ` ::before glyph), storage-analytics-tab ERROR_WRAP/ERROR_TEXT inline+`letterSpacing="0.5px"`×7, SettingsModalView.styles `ExpandToggle=styled.button`+`Placeholder`, delete-account-dialog SOLO_CARD inline+`minWidth:260`, settings-account-tab `minWidth:240`, organization `Empty`/`Placeholder` styled.p ×5 — 전부 확인.
- **추가**: 없음(이미 갭 마감 시 org/general 6개 직접 확인 + 위 systemic 패턴에 포함).
- 정상 확인: SettingsModalView(DialogCloseButton/ModalBackdrop), password-change-dialog(DialogShell/PasswordField/Alert), settings-account-tab(SettingsSection/Alert), invitations-section/join-codes-section/org-members-tab/org-settings-tab(Table/Button/OptionRow/DialogShell — 우수사례), AccountTab/AdminTab/ProjectTab/GeneralTab/EdgeTab/AdminMembers/AdminStorage/AdminDevices/AdminOrganization(위임), SettingsModalView.styles의 Modal/Header/Title/Main/TabsList(정당한 styled() 확장). types = 순수.

> **platform-pages(A~E) 144파일 직접 라인 재검토 완료. agent 오탐 0건. 누락은 모두 약(weak): lucide 직접 import 3건(gallery-detail-modal X, comments-panel Archive/Pencil, analysis-widget-shell Download), `fontSize: iconSizeNumbers.xs` 폰트 오용 4건, 인라인 카드표면(CARD_STYLE류) systemic, Placeholder/Empty styled.p EmptyState 후보 다수, `letterSpacing="0.04em/0.5px"` raw 산재, MenuButton styled(IconButton) 3파일 중복, 유니코드 글리프(▾/▸/✎/⚠/ⓘ). agent가 강/중으로 표시한 부품 재구현은 100% 실제 확인.**

### ▣ F. edge-pages capture+labeling+labeling-panel — 25/25 직접 재검토 완료
- **오탐 0건**: CaptureReview Skip/Save/FullscreenBtn, DeflectometryTuning Spinner(keyframes)/Slider/Select/CheckRow/Btn/Warning/QualityStatus/CollapsibleHeader, BBoxCanvas IconBtn/HeaderIconBtn/ModeToggleBtn/FullscreenBtn/PixelSwatch, RightPanelView PatternButton/RoiPrimaryButton, SetupPanelView PatternButton+Accordion(styled.details in tsx), SequencePattern Segment/Item/Empty, CaptureView MetricCard/SetupBlockingCard/OverlayHeader/OverlayPopover/CapturingBadge/CapturePreviewFullscreenBtn, RightPanelCommentSection 댓글 UI — 전부 확인. raw rgba `255,180,60`/`59,130,246`/`96,165,250` 확인.
- **추가 누락(중요/systemic)**: ① **`lucide-react` 직접 import가 edge-pages 전반에 광범위** — CaptureView/DeflectometryTuning/SetupPanelView/CaptureReviewFullscreen/BBoxCanvasView/RightPanelView/RightPanelCommentSection. 아이콘 계층(registry) 대신 third-party 직접 의존(규칙 7 위반 성격). 별도 systemic 항목으로 격상. ② `CaptureView.tsx:86` raw `<button>`(reconnect) → Button. ③ CaptureView.styles CapturingBadge `rgba(0,0,0,0.4)`, CaptureButton `rgba(255,255,255,0.25/0.5)` raw rgba. ④ SetupPanelView.styles raw `16px/14px` padding.
- 정상 확인: SetupPanelView(Button/Switch/FieldGroup/FieldHint/SectionTitle/NumberField — 부분 마이그레이션 우수), BBoxCanvasView(LabelingCanvas/useDrawingCanvas), RightPanelView(SelectableListItem/ColorSwatch/EmptyState/SearchField), CaptureView Spinner ui re-export. helpers(colormap/pattern/canvas)/use-fullscreen/types = 로직.

### ▣ G. edge-pages chrome+app-shell+workspace+system — 31/31 직접 재검토 완료
- **오탐 0건**: AccountMenu AccountBtn/AccountDropdown/MenuItem/Danger/ModalCancelBtn/HistoryEntry/ModalEmptyText+수동 useClickOutside, TopBar IconBtn/BackBtn/StatusDot/Breadcrumb*, BottomBar SyncChip/StatChip, TitleBar Btn(raw rgba `196,43,28`), Workspace ConfirmButton(raw rgba `239,68,68`)/SavingSpinner(keyframes)/CapturingStatusPill(`18px`/box-shadow px/`radius-md,8px` fallback), SystemMonitor StatCard/StatLabel/StatValue+Row/Label/Value — 전부 확인.
- **추가 누락**: ① **lucide 직접 import G 전반**(UserCircle/RefreshCw/Settings/ChevronLeft/HardDrive/Cpu/Activity/Wifi/Minus/Maximize2/X/AlertTriangle) — systemic. ② BottomBarView `RightSection=styled.button`(clickable) → Button/IconButton. ③ MainLayoutView.styles `PanelsRow padding ... 14px 10px` raw px.
- 정상 확인: EdgeAppShellView/MainLayoutView/WorkspaceShell/WorkspaceLabelingShell/CapturingPill(shell 조합·위임), SystemMonitorModalView(TwoColumnDialog/Tabs), SystemMonitorCleanupTabView(Button/Checkbox/Spinner), bottom-bar-helpers(로직). TitleBar 창버튼은 Electron 전용(page-justified)이나 raw rgba+IconButton 후보. types/index = 순수.

### ▣ H. edge-pages images+statics — 17/17 직접 재검토 완료
- **오탐 0건**: ImagesView GroupBadge/GroupDeleteBtn/ImagesFilterButton/ModalBBoxToolbarBtn/ModalCloseBtn/ModalHeaderIconBtn/SelectAllCheckbox/ModalOverlay/ModalInner/SyncDot, SessionCharts Table/Th/Td+DurationCard, Statics Title/Subtitle/SummaryCard/Panel/SectionHeader, LabelingCharts/SessionCharts/MsTooltip inline 툴팁 — 전부 확인.
- **교차확인**: `EdgeImagesGridView.tsx:112 <GroupBadge>{badgeCount}</GroupBadge>`는 실제 데이터 사용 → **platform `class-manage/ClassManageImageGrid.tsx:49 <Badge>4</Badge>` 리터럴이 진짜 버그임 확증**(edge는 올바르게 badgeCount).
- **추가 누락(약)**: GroupDeleteBtn `rgba(0,0,0,0.28)`, LabelingCharts/SessionCharts `boxShadow rgba(0,0,0,0.35)`+`fontSize:iconSizeNumbers.xs`+`width:8`/`borderRadius:999`/`gap:12`/`padding:'24px 0'` 매직넘버, ImagesView.styles raw `12px/14px/16px` 다수. lucide 직접 import 계속.
- 정상 확인: ImagesView(ConfirmDialog/EmptyState/Button/FilterPopover/FilterPopoverSection/DropdownSelect/DatePickerField), EdgeImagesGridView(VirtualizedImageGrid/AnnotationOverlay), CameraChartsView/ImageChartsView(BarChartCard/PieChartCard/LineChartCard). ImagesView.styles 주석에 ImageCell/VirtualScroll/FilterPopover 등 ui 마이그레이션 흔적(우수). helpers/types = 로직.

### ▣ I. edge-pages connection+dataset-modals+dataset-select — 42/42 직접 재검토 완료
- **오탐 0건**: dot-menu 전체(raw rgba `0,0,0,0.4`), header RefreshBtn/IconBtn/ModeTag/RoleBadge/StatusDot, dataset-card RecentCard/DatasetCard/EdgeDatasetTaskTag/ClassChip(raw alpha `${color}22/44`)/RecentBadge/MoreChip, dataset-grid AddDatasetBtn/ProjectTypeTag(raw rgba `77,136,255,0.34`), page.styles `Spinner`(텍스트 컨테이너=이름가림), ConnectionTabView.styles GuideCard/DeviceCard/ProgressBar/'JetBrains Mono', NicStatusCard Card/Row/Label/Value, ConnectionGuidePanelView(ConnectionTabView.styles와 중복), ConnectSection/Diagnostics/DiagnoseClassification toned 메시지, AdvancedSection Header(collapsible), ExportModalView ProgressBar(keyframes) — 전부 확인.
- **죽은코드 grep 확정**: `grep -rn ForceIpDialogView.styles` → 어디서도 import 안 됨. ForceIpDialogView.tsx는 inline 스타일 사용 → `ForceIpDialogView.styles.ts` **삭제 안전(객관 확인)**.
- **추가 누락(약)**: ScanSectionView raw `marginRight:3`, AddDatasetModalView.styles raw `14px`, ConnectionTabView.styles raw px/hex 다수(`10px`/`5px`/`6px`/`14px`/`'JetBrains Mono'`/`rgba(34,197,94,0.08)`/`font-weight ?600:400`). lucide 직접 import 계속.
- 정상 확인: AddDatasetModalView(DialogShell/CheckboxGroup/RadioCardGroup/TextField — 우수), ExportModalView/ForceIpDialogView 본체(DialogShell/Button/TextField), ScanSectionView(Badge/Button/Spinner/SectionTitle/EmptyState/DeviceCard), AutoSetup/NicControl/ProfileStatus(FlatSection+Button/Spinner), DatasetSelectView(ConfirmDialog), CreateProjectFormView(EmptyState), ConnectionTabView(순수 조합). FlatSection/surfacePanel/surfaceRaised는 정당한 recipe. types/index = 순수.

### ▣ J. edge-pages log+login+license+settings — 35/35 직접 재검토 완료
- **오탐 0건**: License CopyBtn/Input/SubmitBtn/FingerprintText('Courier New'), Login Btn/AccountItem/ModeTag, LogPanel FilterActionButton/FilterPopover/LogItem/DetailPanel/ImageModal/DetailPlaceholder, LogDetailTable Table/Th/Td('Courier New'), Backend/FrontendLogs LogList/LogRow/LevelBadge/EmptyText(**거의 동일 복붙 중복** 확정), AboutTab InfoRowWrap/FingerprintBox, UpdateSection/DataTab Row/Label/Value/PathBox, ServerTab/CameraParams placeholder 하드코딩 — 전부 확인.
- **추가(약)**: SettingsIconBtn(license/login 동일 아이콘버튼 중복) → IconButton, 'Courier New'/'JetBrains Mono' 폰트 하드코딩 systemic(license/log/settings/connection 전반), 코드박스(FingerprintBox/PathBox/LogBox user-select:all 'Courier New') 반복.
- 정상 확인: LoginView(Checkbox/TextField/PasswordField), LicenseView 본체, LogPanelView(Switch/DatePickerField/DropdownSelect+ImageModalOverlay=ModalBackdrop re-export), Backend/FrontendLogs(SearchField/DropdownSelect/Button), UpdateSection/FieldTest(ProgressBar 정상), ServerTab(FieldRow/RadioCardGroup/FieldGroup/TextField), UnifiedLogsTabView(ModeSwitcher), CameraSettingsDialogView(TwoColumnDialog/VerticalTabs). log-filters/types = 로직.

---

# 🔧 수정 진행 현황 (브랜치 refactor/ui-layer-violations)

> 영역별 검증(타입체크) + 커밋. 사용자 WIP 6파일은 미접촉. lucide는 정식 의존성이라 보류.

## ✅ 완료 (10 커밋, 모두 양 패키지 타입체크 통과, WIP 6파일 미접촉)
- **① 토큰 / ④ 죽은코드**: ForceIpDialogView.styles.ts 삭제; mono 폰트→`var(--ig-font-mono)`(8); rgba(77,136,255,0.34)→blue-tint-34.
- **② 부품 교체**:
  - keyframes Spinner→`Spinner`; 로컬 Empty/Placeholder→`EmptyState`(~13); styled.button→`Button`; 아이콘버튼→`IconButton`; raw select→`SelectField`/checkbox→`Checkbox`; 모달닫기→`DialogCloseButton`; ghost/ExpandToggle→`TextButton`.
  - **styled.table→`Table`** (dashboard×4/devices/storage/statics worker — 셀 Badge/Button/Chip render 보존, 빈상태 EmptyState).
  - **Progress 바 재구현→`ProgressBar`** (catalog export-progress 2건).
  - **색 status 배지→`Badge $tone`/`Tag $bg/$color`** (edge dataset-select/login: ModeTag/RoleBadge/RecentBadge/MoreChip/EdgeDatasetTaskTag).
  - **license CopyBtn은 부모 콜백 onCopyFingerprint 보존 위해 유지**(CopyButton 내부 클립보드라 동작 변경 회피).

## ✅ 추가 완료 (저위험 순서 진행)
- **#5 CollapsibleSectionHeader**: capture DeflectometryTuning → 카탈로그 `CollapsibleSectionHeader`. (statics SectionHeader는 큰 섹션제목이라 카탈로그 작은라벨로 바꾸면 시각후퇴 → 유지)
- **#6 글리프**: ExportHistory `✎`→lucide Pencil. **`▾/▸`는 카탈로그 CollapsibleSectionHeader 자체가 쓰는 표준이라 위반 아님(유지)**. storage-recommendations `⚠/ⓘ`는 ::before 임베드 + Alert 재구조화 필요 → 보류.
- **#9 코드박스 판정**: PathBox/FingerprintBox는 대응 카탈로그 부품이 **없음**(폰트는 이미 토큰화 완료) → 신규 부품화(③) 영역이라 swap 불가, 현 상태 유지.

- **③ 로그뷰 중복 제거**: Backend/Frontend LogsContentView 복붙 → 공유 `LogsContentShell` 추출.

## ✅ 규칙 #0(작업 위치 우선순위) 정렬 — 핵심
- **#0.1 기존 부품 사용**: 로컬 `Row/Label/Value`(space-between) → 카탈로그 **`KeyValueRow`**(레이아웃 일치). NicStatus/UpdateSection/SystemMonitorCleanup/DataTab/AboutTab 5파일.
- **#0.2 라이브러리에 부품 추가/승격**:
  - **`CodeBlock` 신규 추가**(src/components/data-display) — 코드/식별자 mono 박스. PathBox/FingerprintBox 전환.
  - **`DistributionHeatmap` 이동**(pages→components) — 작성자 주석 "도메인 무관 generic". 비파괴(platform-pages re-export), 스토리도 src/로.
  - **`PermissionMatrix` 이동**(pages→components) — "generic matrix". 도메인 wrapper(project-permission-matrix)는 그대로 두고 카탈로그 import. 비파괴 re-export.
- **#8 토큰화**: PatternButton tailwind blue rgba → `blue-tint` 토큰.

## ✅ 사용자 지시로 마무리한 항목
| 항목 | 처리 |
|---|---|
| **ContextMenu** (AccountMenu/dot-menu) | 사용자 WIP(ContextMenuWithSubmenus 토큰화) 커밋 후 → **둘 다 `ContextMenuWithSubmenus`로 교체**. dot-menu.styles.ts 삭제. **ContextMenu 재구현 0건** |
| **그림자 rgba** | `--ig-color-shadow-soft/medium/strong` **신규 토큰 추가**(dark/light 동일=시각변화 0) + CaptureView/ImagesView/LabelingCharts box-shadow 토큰화 |
| **연결상태 dot** | `StatusDot` 부품 추가(#0.2) + TopBar/header dedup |
| **generic table** | permission-matrix·heatmap **components로 이동 완료** |
| **창 컨트롤 아이콘** | lucide `Minus/Maximize2/Minimize2/X` → catalog-icons에 `Window{Minimize,Maximize,Restore,Close}Icon` registry 등록 + TitleBarView 교체 |
| **닫기버튼 빨강** | raw rgba(196,43,28) hover/active → `--ig-color-danger-bg-strong` (테마 인지 danger 빨강) |
| **lucide 직접 import (systemic #1)** | pages 28파일이 `lucide-react`에서 직접 import → catalog-icons에 48개 아이콘 **시맨틱 별칭 등록**(SettingsIcon/RefreshIcon/ExpandIcon 등) 후 전부 `@ingradient/ui/components` 경유로 교체. registry 우회 0건. 문자열 리터럴 오치환 3건(`'Camera'`/`'Download widget image'`/`'Archive comment'`) 검토 중 발견·복구. |

## ✅ reviewer systemic 항목 후속 처리
- **#1 lucide 직접 import** → 위 표대로 28파일 registry 경유 완료.
- **#2 fontSize에 iconSizeNumbers 오용** → `'var(--ig-font-size-xs)'`로 교체(차트 툴팁/버튼 inline 7곳).
- **#3 mono 폰트 하드코딩** → `var(--ig-font-mono)` 완료(0건 잔존).
- **#5 Placeholder/Empty styled.p** → 가벼운 빈-상태 텍스트 `EmptyText` 신규 부품(#0.2, stateTitleText+중앙정렬). 동일 패턴 4파일(org-members/invitations-tab/org-settings/dashboard-overview) 승격. (join-codes·invitations-section은 top-margin, analysis-section은 margin0 변형이라 page 유지 — 이미 stateTitleText recipe 재사용 중). 무거운 블록형 `EmptyState`는 시각 과대라 부적합.
- **#6 유니코드 글리프** → `▾/▸`(image-detail)→Chevron{Down,Right}Icon, `⚠`(Deflectometry warning)→AlertTriangleIcon(컨테이너 flex화), storage-recommendations `⚠/ⓘ` CSS ::before→JSX AlertTriangle/InfoIcon. 0건 잔존.
- **#7 MenuButton styled(IconButton) 중복 3파일** → `MenuIconButton` 신규 부품(#0.2) 승격. gallery-images-table·dataset-list-item·class-list-row 공유(class-list-row는 빠져있던 hover state 획득).

## ✅ #4 inline card surface — Card 부품 확장 후 swap (사용자 선택: option a)
- **`Card`에 prop 추가(#0.2)**: `flat`(box-shadow 제거), `border='strong'`(border-strong), `tone='danger'`(alert-danger bg/border). surface mixin 위에 override로 얹어 기존 elevation/radius/padding과 조합.
- **7파일 inline 카드 → `<Card>`**: storage-stats-table, storage-overview(Box 직접 교체), project-resolution-card·devices-license-section·devices-forms(×2)·delete-account-dialog(`<Stack gap>` 컨테이너는 Card 내부에 Stack 유지로 gap 보존), analysis-labeling-by-person-widget(elevation='panel'). danger 카드는 `tone='danger'`.
- **남긴 것(card 아님, #0.3)**: dataset-list-panel/selectable-grid-panel(방향성 border·flex·overflow 레이아웃 패널), class-info-sidebar(input), source-breakdown CHIP, TOKEN_BOX(accent border 강조 1회성). 전부 이미 토큰화됨.
- 검증: 양 패키지 per-package tsc 통과. (root tsc의 Table 제네릭 에러는 미접촉 파일에도 발생하는 기존 source-resolution 아티팩트로 무관.)

## 🟢 남음 — "둬도 됨"으로 합의된 page 전용 장식 (규칙 #0.3)
- white 셔터링 rgba(255,255,255,0.25/0.5) = 파란 accent 셔터버튼 위 on-accent 흰 스피너/링. 테마 인지 흰 토큰(white-24 등)은 light 모드에서 어두운 틴트로 뒤집혀 파란 버튼 위 역전됨 → 항상-흰 alpha 토큰을 신설하지 않는 한 raw 유지가 맞음(#0.3). (close 버튼 빨강은 위 표대로 danger 토큰화 완료)
- **SyncDot → 죽은코드라 제거**(정의·export됐으나 참조 0건, rule #4).
- **SyncChip/StatChip → 유지**: bg 없는 색 텍스트+아이콘 status 라벨, 이미 완전 토큰화. Badge/Tag는 bg가 있어 시각 불일치 → 대응 부품 없음.
- **LogDetailTable → 유지**: mono key-value 디테일 렌더러(텍스트 parse + 2열, 헤더없는 줄 colSpan fallback). 카탈로그 `Table`은 컬럼 기반 데이터그리드라 부적합. 완전 토큰화된 page 전용.

→ **규칙 #0 정렬 + 사용자 지시 항목 전부 완료.**
- **ContextMenu 재구현→`ContextMenu`/`MenuItem`**: chrome AccountMenu, dataset-select dot-menu (anchor/portal 위치 재구성 — 구조 변경).
- **③ 라이브러리 신규 부품화**: distribution-heatmap, permission-matrix(둘은 generic이라 유지 중), Backend/Frontend 로그 중복 → 공유 컴포넌트, 코드박스(FingerprintBox/PathBox), StatCard(컴팩트 타일), RadioCard 재구현(catalog export OptionCard — create-project는 WIP), CollapsibleSectionHeader 재구현(capture/statics/connection/settings), InfoRow(로컬 Row/Label/Value는 space-between이라 카탈로그 InfoRow의 left-align과 레이아웃 불일치 — 디자인 판단 필요), ClassChip→LegendItem(색점+라벨).
- **색 hue rgba**(59,130,246 / 96,165,250 / 255,180,60 / 196,43,28 / 0,0,0,* — 디자인 blue와 다른 base라 토큰화 시 색 변동), **bg없는 색텍스트칩**(SyncChip/StatChip), **색점**(StatusDot/SyncDot).
- **소소**: 유니코드 글리프(▾▸✎⚠ⓘ) / 잔여 raw px / 진행바 gallery-toolbar(얇은라인)·ExportModal(indeterminate).

---

# ✅ 검토자 직접 라인 재검토 — 최종 결론 (294/294 완료)

사용자 요청으로 **10개 영역 294개 파일 전부를 검토자(메인)가 직접 한 줄씩 재검토**한 결과:

## 1. agent 분석 신뢰도: 매우 높음
- **오탐(false positive) 0건**: agent가 강(STRONG)/중(MEDIUM)으로 표시한 부품 재구현(Button/Table/Progress/Badge/Checkbox/Select/ContextMenu/RadioCard/DialogCloseButton/CollapsibleSectionHeader/InfoRow/StatCard/EmptyState 등)은 **전부 실제 코드에서 확인됨**.
- agent가 OK로 판정한 파일도 검토자 재확인 결과 대부분 정확(부품 정상 사용/순수 타입·배럴/페이지 전용 레이아웃).
- 객관 확인: 죽은코드 `ForceIpDialogView.styles.ts`는 grep으로 import 0건 확정. 버그 `class-manage `<Badge>4</Badge>``는 edge의 `<GroupBadge>{badgeCount}</GroupBadge>` 대조로 확정.

## 2. 검토자가 추가 발견한 누락 (전부 약~중, systemic 패턴)
agent들이 산발적으로만 잡았으나 검토자가 **전 영역 공통 패턴**으로 확인한 것:
1. **`lucide-react` 직접 import (중)** — edge-pages 거의 전 화면 + platform 일부(gallery-detail-modal, comments-panel, analysis-widget-shell). 아이콘을 UI 라이브러리 registry 대신 third-party에서 직접 의존 → **규칙 7(외부 의존) 성격의 systemic 위반**. 별도 항목으로 격상 권장.
2. **`fontSize: iconSizeNumbers.xs` 폰트 오용 (약)** — dashboard×3, project-member-row, statics 툴팁 등. 아이콘 크기 토큰을 font-size에 전용.
3. **monospace 폰트 하드코딩 (약)** — `'Courier New'`/`'JetBrains Mono'`가 license/log/settings/connection 전반. → mono 폰트 토큰 필요.
4. **인라인 카드표면 (약)** — `CARD_STYLE`/`FORM_BOX_STYLE`(surface-raised+border+radius)가 storage/project/devices/dataset 등 다수 반복. → primitive `Surface`/`Card`.
5. **Placeholder/Empty styled.p (약)** — 빈/로딩 상태 텍스트를 수십 파일이 각자 재정의(토큰은 지킴). → `EmptyState`.
6. **유니코드 글리프 아이콘 (약)** — `▾`/`▸`/`✎`/`⚠`/`ⓘ`/`4` 하드코딩.
7. **MenuButton styled(IconButton) 중복 (중)** — agent가 2파일이라 한 것이 실제 **3파일**(dataset-list-item/gallery-images-table/class-list-row).
8. **raw rgba (약)** — agent가 잡은 것 외 `rgba(0,0,0,0.28/0.35/0.4)`/`rgba(255,255,255,…)`/`rgba(196,43,28,…)` 추가.

## 3. 결론
- **"한 줄 한 줄 다 봤는가"** → ✅ 294/294 검토자 직접 확인 완료.
- **agent 강/중 위반 목록** → ✅ 100% 실측 검증, 오탐 0.
- **추가된 것** → 위 8개 systemic 약~중 패턴(주로 lucide 직접 import, 폰트/토큰 하드코딩, Placeholder/카드표면 반복). 새로운 "강" 위반은 없었음 — 즉 **수정 대상의 큰 그림은 agent 단계에서 이미 정확히 잡혔고, 검토자 재검토는 systemic 약점만 보강**.
- 이제 문서가 수정 착수 가능한 수준으로 검증 완료됨.

---

# 종합 요약 및 수정 계획

## 통계 (위반 강도별)
- pages 전 영역에서 가장 빈번한 **강(즉시 교체)** 패턴 = 카탈로그 부품 재구현:
  1. **Button / IconButton 재구현** — 거의 모든 영역(catalog, capture, labeling, chrome, images, license, login, log, dataset-select, settings). 가장 광범위.
  2. **Table 재구현** (raw `styled.table`) — dashboard(4곳), settings/devices, settings/storage, statics, log. → `Table`로 통일.
  3. **Progress 바 재구현** — catalog(3곳 중복), dataset-modals. → `Progress`/`SegmentedProgressBar`.
  4. **Badge/Chip/Tag/StateChip 재구현** (상태·카운트·색 라벨) — dashboard, capture, chrome, images, dataset-select, login, settings.
  5. **ContextMenu/드롭다운 메뉴 재구현** — chrome(AccountMenu), dataset-select(dot-menu).
  6. **RadioCard 재구현** — catalog(export), create-project.
  7. **Checkbox/Select/Slider 재구현** — capture(Deflectometry), images.
  8. **CollapsibleSectionHeader 재구현** — capture, statics, connection, settings.
  9. **EmptyState / 정보행(InfoRow·KeyValueRow) 재구현** — 거의 모든 settings/log/system 영역.

## 권장 수정 순서 (의존성 안전 순)
1. **색 토큰 정리(primitive)**: 반복 raw rgba(`59,130,246`/`96,165,250`/`255,180,60`/`239,68,68`/`77,136,255`/`196,43,28`)와 mono 폰트(`'Courier New'`/`'JetBrains Mono'`)를 primitive 토큰으로 추가. → 이후 교체 작업이 토큰 참조 가능.
2. **강(STRONG) 교체 — 부품이 이미 존재**: Button/IconButton/Table/Progress/Badge/Checkbox/Select/ContextMenu/RadioCard/DialogCloseButton 직접 교체. 같은 패키지에 이미 부품 쓰는 형제 파일이 있어 패턴 복사로 안전.
3. **중(MEDIUM) 승격 — 신규 부품 필요**: distribution-heatmap, permission-matrix(generic matrix), StatCard 류, 로그 리스트, 코드 표시 박스, ClassChip(LegendItem) 등을 components/patterns로 신설 후 교체.
4. **죽은 코드 제거**: `connection/ForceIpDialogView.styles.ts` 삭제.
5. **약(WEAK) 토큰화**: raw px/hex/letterSpacing/inline style, 하드코딩 placeholder를 토큰/labels로.

## 재발 방지 (ui-refactoring-rule.md §UI 규칙 검토 방법)
- ESLint `no-restricted-syntax`로 pages 안 `styled.button`/`styled.table`/`styled.input[type=checkbox]` 직접 사용 차단 룰 추가 검토.
- Stylelint로 raw hex/rgba/px 차단(이미 룰 예시 문서화됨).
- 위 패턴은 발견 즉시 lint 룰화하여 다음 sprint 재발 방지.

