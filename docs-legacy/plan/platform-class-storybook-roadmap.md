# Platform Class 페이지 — storybook 재현 로드맵

> 기반: [platform-class-page-spec.md](./platform-class-page-spec.md). 매 phase 마다 spec 의 해당 섹션 ✅ 확인.

## 원칙

1. 모든 UI 부품은 **ingradient-ui 의 정식 pattern / component** 으로 추가 — platform 이 그대로 import 해서 hook 만 연결하면 동일 화면.
2. 각 신규 pattern 은 **200줄 미만** + `*.stories.tsx` 동반 (cross-cutting 정책).
3. Storybook 의 ClassManage story 는 **얇은 orchestrator** — UI 본체는 모두 ui 의 pattern. mock state 는 `useClassManageScene` hook.
4. 매 phase 끝에 typecheck + build + playwright probe 통과 필수.

## Phase 의존 관계

```
Phase 1 (List sidebar)
   └→ Phase 2 (Center panel — chips + grid)
        └→ Phase 3 (Info sidebar — name/color/desc)
             └→ Phase 4 (Reference image section + bbox nav)
                  └→ Phase 5 (Lightbox)
                       └→ Phase 6 (Context menu + AddClassDialog + Delete confirm + Mapping select)
                            └→ Phase 7 (Page orchestrator + scenarios 모두 통합)
                                 └→ Phase 8 (Polish + design fidelity audit)
```

각 phase 결과물 = ingradient-ui 의 신규 pattern 들 + 해당 story 들 + Catalog story 처럼 풍부한 scenario 시나리오.

---

## Phase 1 — ClassListSidebar [S]

**목적**: 좌측 280px 사이드바 — 클래스 리스트 + selected border-left + image_count.

### 1-1. 신규 ingradient-ui pattern
- `src/patterns/shells/class-list-sidebar.tsx` — ClassListSidebar
  - props: `classes: Array<{ id, name, color, image_count? }>`, `selectedId`, `loading`, `onSelectClass`, `onAddClass`
  - 내부: SidebarHeader (+Add class button) + ul ClassList + 각 row (`class-list-row.tsx`)
- `src/patterns/shells/class-list-row.tsx` — ClassListRow
  - props: `id`, `name`, `color`, `count?`, `selected?`, `onClick`
  - 시각: ColorSwatch md square + name (ellipsis) + count (오른쪽). selected 시 bg `rgba(77,136,255,0.1)` + border-left 3px accent
- 각 *.stories.tsx 동반

### 1-2. 새 토큰
- `--ig-color-class-list-selected-bg` — `rgba(77, 136, 255, 0.1)` (이미 `--ig-color-blue-tint-10` 비슷) — 기존 토큰 재사용 가능하면 skip

### 1-3. 검증
- 신규 pattern 2개의 story 모두 정상 렌더 (default / loading / many / long-name / selected)

---

## Phase 2 — ClassImagesPanel (chips + grid) [M]

**목적**: 가운데 패널 — Dataset chip 행 + ImageGrid + 빈 상태 + sequence/group representative.

### 2-1. 신규 ingradient-ui pattern
- `src/patterns/shells/dataset-filter-chip-row.tsx` — DatasetFilterChipRow
  - props: `label='Dataset'`, `loading?`, `datasets: Array<{ id, name, image_count }>`, `activeIds: Set<string>`, `onToggle(id)`, `emptyText?='No linked datasets'`
  - 시각: pill chip + ChipCount, active border accent / bg blue-tint-18
- `src/patterns/shells/class-images-panel.tsx` — ClassImagesPanel
  - props: `selectedClassId?`, `chipsRow?: ReactNode`, `loading?`, `imagesEmpty?`, `gridSlot?: ReactNode`, `noSelectionText`, `noImagesText`
  - 시각: column flex. selectedClassId 없으면 EmptyState 만, 있으면 chipsRow + gridSlot

### 2-2. 신규 utility
- `src/utils/sequence-representative.ts` — `buildSequenceRepresentativeItems`, `getGroupKey` 의 ui-side 버전 (platform 동일 알고리즘)
  - platform 의 [classes.utils.ts](../../workspace/projects/ingradient-platform/frontend/features/classes/classes.utils.ts) 와 동일
  - utils 가 너무 무거우면 story-side 로 보내고 ui 는 representative array 만 받아도 됨

### 2-3. 검증
- DatasetFilterChipRow story (loading / empty / 3 chips / 8 chips with overflow)
- ClassImagesPanel story (no-selection / chips-only / chips + grid / loading-grid / empty-grid)
- ImageGrid + AnnotationOverlay 가 cell 안에서 정상 렌더링됨

---

## Phase 3 — ClassInfoSidebarPanel base (name / color / desc) [M]

**목적**: 우측 300px 패널의 기본 3 섹션.

### 3-1. 신규 ingradient-ui pattern
- `src/patterns/shells/class-info-sidebar.tsx` — ClassInfoSidebar
  - props: `selectedClass: ClassItem`, `onUpdateClass(patch)`, `onRandomizeColor`, `onDelete` (deletion 은 phase 6 에서 confirm flow 연결), `mappingSlot?: ReactNode`, `referenceImageSlot?: ReactNode`
  - 시각: aside width 300px, overflow-y auto, 6 sections (name/color/desc + 슬롯 referenceImageSlot + slot mappingSlot + danger)
- `src/patterns/shells/class-info-section.tsx` — ClassInfoSection (개별 섹션, title + children) — 재사용
- `src/patterns/shells/color-input-row.tsx` — ColorInputRow
  - props: `value: string`, `onChange(hex)`, `onRandomize`
  - 시각: native color input (40x40, border, radius 8) + RandomColorButton + hex label
- `class-info-sidebar.stories.tsx` — 단독 story (referenceImageSlot / mappingSlot 은 placeholder)

### 3-2. 검증
- ColorInputRow story (값 변경 / random / hex 표시)
- ClassInfoSidebar story (모든 섹션 placeholder 로 채워서)

---

## Phase 4 — Reference image section + BboxNav [M]

**목적**: 우측의 Reference image 섹션 — drop zone + preview + bbox navigation + status.

### 4-1. 신규 ingradient-ui pattern
- `src/patterns/shells/reference-image-drop-zone.tsx` — ReferenceImageDropZone
  - props: `imageUrl?`, `dragging?`, `pending?`, `errorMessage?`, `hintText?`, `emptyText?`, `onDragOver/Enter/Leave/Drop` (또는 통합 callbacks)
  - 시각: spec 6-2-D 와 동일 — padding/border/min-height 가 hasImage / dragging 에 따라 변경
- `src/patterns/shells/bbox-navigation.tsx` — BboxNavigation
  - props: `total: number`, `index: number`, `onChange(idx)`
  - 시각: ‹ + "N / total" + ›, disabled state
- `src/patterns/shells/reference-image-section.tsx` — ReferenceImageSection (composed)
  - props: `imageUrl?`, `dragging`, `pending`, `errorMessage`, `candidates: BboxCandidate[]`, `onApply(imageId, bboxIndex?)`, `onSetDragOver(v)`
  - 내부에서 ReferenceImageDropZone + BboxNavigation 사용

### 4-2. 검증
- 3개 pattern stories (default / dragging / with-image / multi-bbox / pending / error)

---

## Phase 5 — ClassPageLightbox [M]

**목적**: 이미지 확대 lightbox — backdrop + SVG annotation overlay + pattern tabs.

### 5-1. 신규 ingradient-ui pattern
- `src/patterns/shells/class-lightbox.tsx` — ClassLightbox
  - props: `open`, `item: LightboxItem`, `imageUrl`, `siblings: LightboxItem[]`, `selectedClassId?`, `classIdToColor`, `loadedSize?`, `onClose`, `onSelectSibling(item)`, `onImageLoad(width, height)`
  - 내부:
    - LightboxBackdrop (fixed inset 0, dark bg, click → close)
    - LightboxPanel (centered, click stop propagation)
    - PatternTabs (siblings ≥ 2 일 때만)
    - LightboxFrame (aspect ratio 계산)
    - LightboxImage + LightboxOverlay (SVG with filtered bboxes / points)
    - LightboxClose (top-right "×")
- 분리: pattern-tabs.tsx 따로 → 다른 곳에서도 재사용 가능

### 5-2. 신규 utility
- `src/utils/format-pattern-tab.ts` — `formatPatternTab(item, index)` — `x_phase_N_of_M` → "X (N+1)/M", `solid` → "Solid", 등

### 5-3. 검증
- ClassLightbox story — single image / sequence with tabs / many bboxes / no annotations / no class selected

---

## Phase 6 — 작은 overlays: AddClass / ImageContextMenu / Delete confirm / Mapping [S-M]

**목적**: 나머지 모달·메뉴.

### 6-1. 신규 ingradient-ui pattern
- `src/patterns/shells/add-class-dialog.tsx` — AddClassDialog (DialogShell 기반)
  - props: `open`, `name`, `onChangeName`, `onClose`, `onConfirm`
  - 시각: spec 7-1
- `src/patterns/shells/image-context-menu.tsx` — ImageContextMenu (general — image 에 대한 1-item 메뉴)
  - props: `position: {top, left} | null`, `items: Array<{label, onClick, disabled?}>`, `onClose`
  - 내부: createPortal(document.body)
  - useClickOutside 자동 처리
- `src/patterns/shells/model-mapping-select.tsx` — ModelMappingSelect (COCO mapping 셀렉트 + 힌트)
  - props: `value?`, `options: string[]`, `onChange(value)`, `enabled?`, `disabledHint?`, `enabledHint?`
  - 시각: SelectField + MappingHint

### 6-2. 신규 mock 데이터
- `stories/fixtures/platform/0.0.1/coco-class-names.ts` — COCO 80 class 이름 mock (platform 의 [constants/cocoClasses.ts](../../workspace/projects/ingradient-platform/frontend/constants/cocoClasses.ts) 동일)

### 6-3. Delete confirm
- 기존 `useConfirm` + `ConfirmDialog` 재사용 — 별도 pattern 추가 X
- spec 6-2-F 의 dynamic description (`This class has labels on ${N} image(s).`) 만 story 에서 처리

### 6-4. 검증
- 4개 신규 pattern stories
- delete-confirm 시나리오 (storybook 에서 confirm dialog 가 떠 있는 상태)

---

## Phase 7 — Page orchestrator + scenarios [M]

**목적**: 모든 부품을 ClassManage story 에 wire — Catalog story 와 동일한 구조.

### 7-1. 신규 / 수정 파일
- `stories/pages/platform/0.0.1/class/use-class-manage-scene.ts` (신규) — useCatalogScene 등가 hook
  - state: selectedClassId, activeDatasetIds, isAddClassOpen, addClassName, isReferenceDragOver, imageContextMenu, enlargedImageIndex, pendingDeleteClassId 등
  - 각 toggle handler + scenario 변경 시 reset
- `stories/fixtures/platform/0.0.1/class-classes.ts` (신규) — MockClass + 10+ 실제 like 클래스 (이름 / 색 / image_count / description / reference_image_url / 일부 긴 이름)
- `stories/fixtures/platform/0.0.1/class-datasets.ts` (신규) — MockClassDataset + 클래스별 linked datasets
- `stories/fixtures/platform/0.0.1/class-images.ts` (신규) — MockClassImage + bboxes / points / sequence 정보
- `stories/fixtures/platform/0.0.1/class-scenarios.ts` (덮어쓰기) — 20+ scenario:
  - default, empty, loading, error, permission-denied, no-project
  - long-text, many-items (현 fixture 의 6 개 + 확장)
  - **no-class-selected**, **class-selected-no-images**, **class-with-images**, **class-with-grouped-images**
  - **drag-over-reference**, **reference-image-set**, **bbox-nav-multi**
  - **lightbox-open**, **lightbox-with-pattern-tabs**
  - **context-menu-open**, **add-class-modal-open**, **delete-confirm-open**
  - **mapping-coco-active**, **mapping-disabled**
- `stories/pages/platform/0.0.1/ClassManage.stories.tsx` (rewrite, 얇은 orchestrator)

### 7-2. 검증
- 모든 신규 story export (20+) 정상 렌더
- 핵심 인터랙션 작동: 클래스 선택, dataset chip toggle, lightbox open/close, drag-over reference

---

## Phase 8 — Polish + design fidelity audit [S]

**목적**: Phase 1~7 구현 후 platform 실제 화면과 좌우 비교 → 차이 항목 fix.

### 8-1. 후보 fixes (Catalog 때 사례 참고)
- 색 / padding / border-radius 의 픽셀 차이
- chip / pill 모양 (위 spec 5-3)
- 그리드 minWidth / gap (140 → 120, gap 4)
- 우측 reference drop zone 의 dragging 색 (`rgba(77,136,255,0.7)` border)
- SVG annotation 의 stroke / fill opacity 정확치
- Lightbox 의 frame radius / shadow
- 모바일 (`media.md` 미만): 컬럼 stack + max-height 260

### 8-2. 신규 토큰
- 필요 시 `--ig-color-class-list-selected-bg`, `--ig-color-reference-zone-dragging-bg/border` 추가 — 단, 기존 토큰으로 충분하면 skip

### 8-3. 검증
- 핵심 시나리오 6개 playwright probe + 수동 좌우 비교

---

## Cross-cutting: 매 phase 마다

1. **Typecheck** — `npx tsc --noEmit -p tsconfig.json`
2. **Build** — `npm run build:storybook`
3. **Probe** — playwright 으로 신규 story id 모두 root 렌더 + console error 0
4. **Barrel update** — `src/patterns/index.ts` export 추가
5. **README/CHANGELOG** — phase 단위 짧은 변경 메모 (선택)

각 commit 메시지 한국어, `feat:` / `refactor:` 접두사.

---

## 신규 file 누적 추정

### Patterns (ingradient-ui)
- Phase 1: class-list-sidebar, class-list-row (2)
- Phase 2: dataset-filter-chip-row, class-images-panel (2)
- Phase 3: class-info-sidebar, class-info-section, color-input-row (3)
- Phase 4: reference-image-drop-zone, bbox-navigation, reference-image-section (3)
- Phase 5: class-lightbox, pattern-tabs (2)
- Phase 6: add-class-dialog, image-context-menu, model-mapping-select (3)

**합계: 15 신규 patterns** + 각 .stories.tsx (총 30 신규 파일)

### Utilities (ingradient-ui)
- sequence-representative.ts (Phase 2 — 또는 story-only 로 옮기면 skip)
- format-pattern-tab.ts (Phase 5)

### Fixtures (storybook)
- class-classes.ts, class-datasets.ts, class-images.ts, coco-class-names.ts, class-scenarios.ts (rewrite) — 5 파일

### Story side
- use-class-manage-scene.ts (Phase 7)
- ClassManage.stories.tsx (rewrite, Phase 7)

---

## Mock 데이터 규모 추정

- **classes**: 10-12 클래스 (다양한 색, 일부 긴 이름, 일부 description 있음, 일부 reference_image_url 있음)
- **datasets per class**: 1-4 datasets, 각 image_count 50-500
- **images per scenario**: 8-24 이미지 (sequence 그룹 일부, 일부 bbox/points 포함)
- **COCO classes**: 80 (mock 데이터로 진짜 80 names 전부)

---

## Gaps — 추후 platform 마이그레이션 시 작업

storybook 에서 mock 으로 처리한 부분 = platform 에서 실제 연결 필요:
- `useClasses()` API 연동 (CRUD)
- `useClassPageData` 의 27개 출력 모두 연결
- API: `useClassDetail`, `useClassImages` query
- `setReferenceImageMutation` (POST + invalidate)
- Real-time class color update 의 invalidation
- Permission gate (useAuth)
- 모바일 nav 통합

ingradient-ui 에 들어가지 않는 platform 전용:
- `use-class-page-*` hook 의 비즈니스 로직 — platform 유지
- `classes.utils.ts` 의 필터링 함수 — platform 유지 (또는 ui utility 로 일부 이전)
- COCO class 상수 (platform 의 `constants/cocoClasses.ts` 와 storybook fixture 가 같은 데이터)

---

## 시나리오 채택 우선순위 (rate-limited)

만약 시간이 부족해서 모든 scenario 못 만들면, **priority 1** 부터:

**Priority 1** (반드시 필요): default, empty, loading, permission-denied, class-with-images, no-class-selected, long-text, many-items
**Priority 2** (시각 검증): drag-over-reference, lightbox-open, context-menu-open, add-class-modal-open, delete-confirm-open
**Priority 3** (edge cases): error, no-project, class-with-grouped-images, bbox-nav-multi, lightbox-with-pattern-tabs, mapping-coco-active, mapping-disabled, reference-image-set

---

## 변경 이력

- 2026-05-14: 초안 (Joon Ho Lee)
