# Platform Class 페이지 — 완전 spec

> 목표 — `ingradient-platform` 의 **Class 페이지** (`/p/:projectId/classes`) 를 storybook 에 1:1 시각 / 상호작용 재현. 이 문서는 platform 의 모든 시각 요소 / 상태 / 인터랙션을 픽셀 단위로 기록 — storybook 화면이 platform 과 동일한지 비교할 때 기준.

명명 — 페이지 URL 은 **`classes`** (s 포함). storybook story title 은 `Pages/Platform/0.0.1/ClassManage` 유지 (기존). 본 문서에선 줄여서 **Class 페이지** 로 표기.

---

## 1. 페이지 entry & route

- 라우트: `/p/:projectId/classes` ([frontend/app/ProtectedAppShell.tsx](../../workspace/projects/ingradient-platform/frontend/app/ProtectedAppShell.tsx))
- 페이지 컴포넌트: [frontend/pages/ClassManagePage.tsx](../../workspace/projects/ingradient-platform/frontend/pages/ClassManagePage.tsx) (147 lines)
- 사이드 nav 의 "Classes" 항목 → 활성화

## 2. 페이지 레이아웃

```
┌─────────────────────────────────────────────────────────────────┐
│ TopBar: Title "Class" · Subtitle · 우측 프로젝트명              │
├──────────┬──────────────────────────────────┬───────────────────┤
│          │                                  │                   │
│  Class   │         Class Images Panel       │  Class Info       │
│  List    │                                  │  Sidebar          │
│  Sidebar │         (Dataset chips +         │                   │
│          │          Image grid)             │  (Name, Color,    │
│  (280px) │         (flex 1)                 │   Desc, Ref img,  │
│          │                                  │   Mapping, Del)   │
│          │                                  │                   │
│          │                                  │  (300px)          │
└──────────┴──────────────────────────────────┴───────────────────┘
                          (Overlays: AddClassDialog / Lightbox / ImageContextMenu)
```

- 외부 wrapper: `AppShell` (ui pattern)
- TopBar height: ui `PageHeader` 기본 (72px 추정)
- BodyRow: flex row, gap 18px, overflow hidden
- 모바일 (`media.md` breakpoint) → 컬럼 stack, 각 패널 max-height 260px, body overflow-y: auto

## 3. TopBar — header

[ClassManagePage.tsx:70-77]

| 요소 | 값 |
|---|---|
| Title | "Class" (PageTitle) |
| Subtitle | "Review project classes, linked datasets, reference images, and mapping settings in a consistent panel layout." |
| 우측 | `<HeaderProjectName>{currentProject.name}</HeaderProjectName>` — font-size 18px, weight 700, color secondary, right-align, flex-shrink 0 |

스타일: [classes.styles.ts:30-36](../../workspace/projects/ingradient-platform/frontend/components/classes/classes.styles.ts).

## 4. 좌측 — ClassListSidebar

[ClassListSidebar.tsx](../../workspace/projects/ingradient-platform/frontend/components/classes/ClassListSidebar.tsx) + [ClassListSidebar.styles.ts](../../workspace/projects/ingradient-platform/frontend/components/classes/ClassListSidebar.styles.ts)

### 4-1. 컨테이너
- `Sidebar`: ui `Panel` (aside), width **280px**, flex-shrink 0, column layout
- 모바일: width 100%, max-height 260px

### 4-2. SidebarHeader
- padding `16px 16px 12px`, border-bottom subtle, flex-shrink 0
- 내부: `<Button variant="accent">+ Add class</Button>` (1개) — 클릭 시 `setIsAddClassOpen(true)`

### 4-3. ClassList
- ul, list-style none, margin 0, padding `8px 0`, overflow-y auto, flex 1
- isLoading 시: `<Loading style={{ padding: 14 }}>Loading…</Loading>` (ClassList 자리 대체)

### 4-4. ClassListItem (각 클래스 row)
- padding `10px 14px`, cursor pointer
- selected (`$selected`): background `rgba(77, 136, 255, 0.1)` (10% blue tint) + **border-left 3px solid accent**
- 미선택: border-left 3px transparent (gap 유지)
- hover: background `var(--ig-color-white-04)`

내부 (`ClassListItemWrap`, flex row, gap 10px, min-width 0):
| 요소 | 값 |
|---|---|
| ColorSwatch | size="md", shape="square", color=item.color |
| ClassListName | flex 1, font-size 14px, text ellipsis, title attr |
| ClassListCount | flex-shrink 0, font-size 12px, color text-soft, `item.image_count` (선택 시 표시) |

## 5. 가운데 — ClassImagesPanel

[ClassImagesPanel.tsx](../../workspace/projects/ingradient-platform/frontend/components/classes/ClassImagesPanel.tsx) + [.styles.ts](../../workspace/projects/ingradient-platform/frontend/components/classes/ClassImagesPanel.styles.ts)

### 5-1. 컨테이너
- `Main`: ui `Panel` (main), flex 1, min-width/min-height 0, column

### 5-2. Empty state — 클래스 미선택
- `selectedClassId === null` → `<EmptyRight>Select a class to see linked datasets and images.</EmptyRight>` (전체 panel 채움)

### 5-3. ChipsRow — 데이터셋 필터
[ClassImagesPanel.tsx:88-105]
- padding `12px 20px`, border-bottom strong, flex wrap, gap 8px, items center
- 좌측 라벨: `<ChipsRowLabel>Dataset</ChipsRowLabel>` — font-size 12px, weight 600, text-soft, uppercase, letter-spacing 0.04em, margin-right 4px
- 로딩 중: `<Loading style={{ padding: 0 }}>Loading datasets…</Loading>`
- 데이터셋 없음: `<NoDatasetsHint>No linked datasets</NoDatasetsHint>` (font-size 13px, text-soft)
- 데이터셋 있을 시: chip 들 렌더

각 Chip ([Chip styled](../../workspace/projects/ingradient-platform/frontend/components/classes/ClassImagesPanel.styles.ts:33-48)):
- padding `6px 12px`, font-size 13px, border-radius 999px (pill)
- active: border accent, bg `var(--ig-color-blue-tint-18)`, color accent-soft
- 미 active: border subtle, bg transparent, color text-muted
- hover: border accent, color text-primary
- 내부: `{dataset.name}` + `<ChipCount>{dataset.image_count}</ChipCount>` (font-size 11px, text-soft, margin-left 2px)
- 클릭: `onToggleDataset(dataset.id)` — active 토글
- isActive 로직: `activeDatasetIds.size === 0 || activeDatasetIds.has(dataset.id)` (size 0 일 땐 모두 active)

### 5-4. 이미지 그리드
[ClassImagesPanel.tsx:109-139]
- imagesLoading 시: `<Loading>Loading images…</Loading>`
- displayItems.length === 0 시: `<EmptyRight>No images with this class in the selected datasets.</EmptyRight>`
- 그 외: ui `<ImageGrid>` 사용

ImageGrid props:
- `items`: displayItems (그룹 / sequence 모드에서 representative 만)
- `getThumbnailUrl`: `(img) => normalizeAssetUrl(img.thumb_url) ?? img.thumb_url ?? ''`
- `layout`: `{ minWidth: 120, gap: 4 }`
- `onItemClick(img, idx)`: `onOpenImage(idx)` → lightbox 열림
- `onDragStart(img, idx, event)`: dataTransfer `text/plain` = img.id, effectAllowed copy
- `onContextMenu(img, idx, event)`: preventDefault + onOpenContextMenu(img.id, event.clientY, event.clientX)
- `renderCellOverlay(img)`: ui `<AnnotationOverlay>` — bboxes, points, selectedClassId, getColor(classId), imageWidth, imageHeight, fillOpacity 0.22, emphasize
- `renderCellTopRight(img)`: `count > 1 ? <Badge $tone="neutral">{count}</Badge> : null` — group count

### 5-5. Group / Sequence representative 로직
[ClassImagesPanel.tsx:50-80]
- `buildSequenceRepresentativeItems(allItems)` → sequence_id 가 있는 이미지들을 그룹화, 첫 번째를 representative 로
- sequence 그룹이 없으면 (그리고 `isGroupMode && groupKeyRegex`) → `getGroupKey(name, regex)` 로 그룹 키 추출, 그룹화
- representative 선택: `groupRepresentativeRegex` 매칭 우선, 없으면 첫 번째
- displayItems = [ungrouped 들, representative 들]
- groupCounts: Map<repId, count>

## 6. 우측 — ClassInfoSidebarPanel

[ClassInfoSidebarPanel.tsx](../../workspace/projects/ingradient-platform/frontend/components/classes/ClassInfoSidebarPanel.tsx) + [.styles.ts](../../workspace/projects/ingradient-platform/frontend/components/classes/ClassInfoSidebarPanel.styles.ts)

조건: `selectedClass` 가 있을 때만 렌더됨.

### 6-1. 컨테이너
- `ClassInfoSidebar`: ui `Panel` (aside), width **300px**, flex-shrink 0, column
- `ClassInfoPanel`: flex 1, min-height 0, overflow-y auto, padding 16px, column gap 20px

### 6-2. 섹션 구조 (총 6 섹션)
각 InfoSection: `flex column gap 8px`. 각 섹션 타이틀 (`InfoSectionTitle`): margin 0, font-size 12px, weight 600, color text-muted, uppercase, letter-spacing 0.04em.

#### 6-2-A. Name
- `<InfoNameInput>` — ui `TextField size="sm"`, max-width 280px, border-radius 6px
- 값: `selectedClass.name`, onChange → `onUpdateClass(id, { name: value })`
- aria-label "Class name"

#### 6-2-B. Color
[ClassInfoSidebarPanel.tsx:77-88], styles [122-160]
- `InfoColorRow`: flex row, items center, gap 12px
- `InfoColorInput`: native `<input type="color">` — 40x40, padding 2px, border strong, border-radius 8px, bg surface-raised
- `RandomColorButton`: secondary size sm, padding 8px 12px, font-size 12px → 클릭 시 `updateClass(id, { color: randomClassColor() })`
- `InfoColorHex`: span, font-size 13px, text-muted, hex 값 표시 (예 `#ef4444`)

#### 6-2-C. Description
- `DescriptionTextarea`: ui `TextareaField`, min-height 72px, max-width 100%, font-size 13px, resize vertical
- 값: `selectedClass.description ?? ''`, placeholder "Class description (optional)", rows 3
- onChange → `onUpdateClass(id, { description: value || undefined })`

#### 6-2-D. Reference image
[ClassReferenceImageSection.tsx](../../workspace/projects/ingradient-platform/frontend/components/classes/ClassReferenceImageSection.tsx)

- 제목: "Reference image"
- 힌트 (`ReferenceImageHint`, font-size 12px, text-muted, line-height 1.5):
  > Drag a linked image here, or right-click a linked image and choose Add to Reference Image. Detection labels are cropped to the labeled region. Classification labels use the full image.

- `ReferenceImageDropZone` ([styles:44-58]):
  - padding `10px` (이미지 있을 때) / `20px` (없을 때)
  - border 1px, `var(--ig-color-white-12)` (기본) / `rgba(77, 136, 255, 0.7)` (dragging)
  - border-radius 8px
  - background `var(--ig-color-surface-raised)` (기본) / `var(--ig-color-blue-tint-12)` (dragging)
  - min-height `180px` (이미지 없을 때) / `0` (있을 때)
  - flex center, transition 160ms

  이벤트:
  - `onDragOver`: preventDefault + `dropEffect = 'copy'` + `setIsReferenceDragOver(true)`
  - `onDragEnter`: setIsReferenceDragOver(true)
  - `onDragLeave`: relatedTarget 가 자기 자식이 아니면 setIsReferenceDragOver(false)
  - `onDrop`: dataTransfer 의 text/plain = imageId → `onApplyReferenceImage(imageId)`

  내부 (`ReferenceImageStack`, column gap 12px):
  - reference_image_url 있음: `<ReferenceImagePreview>` (width 100%, max-height 300px, border-radius 10px, border subtle, object-fit contain), src 에 `&_v={cacheBust}` query
  - 없음: `<ReferenceEmptyState><ReferenceImageText>No reference image yet.</ReferenceImageText></ReferenceEmptyState>`
  - bbox candidates ≥ 2 일 때: `<BboxNavigation>` — 좌/우 화살표 + "N / total"
  - pending 시: `<ReferenceImageStatus>Updating reference image…</ReferenceImageStatus>` (font-size 12px, color accent-soft, weight 600)
  - error 시: `<ReferenceImageStatus>{message}</ReferenceImageStatus>`

  BboxNavigation:
  - flex center, gap 8px, margin-top 6px
  - 좌측 `‹` button: disabled if index === 0
  - "N / total" 라벨: font-size 12px, text-muted
  - 우측 `›` button: disabled if index === total-1
  - 클릭 시 `setIndex(next)` + `onApply(candidate.imageId, candidate.bboxIndex)`

#### 6-2-E. Model mapping
[ClassInfoSidebarPanel.tsx:107-127]
- showCocoMapping === true (프로젝트에 OD 모델이 할당된 경우):
  - `MappingSelect` (ui SelectField, max-width 280px, padding `8px 12px`, font-size 13px, border-radius 6px)
  - 옵션: 첫 번째 `<option value="">— Not mapped —</option>`, 나머지는 `COCO_CLASS_NAMES.map(name => <option value={name}>{name}</option>)`
  - 값: `currentMapping?.object_detection ?? ''`
  - aria-label "Map to COCO class", title "Map this class to a COCO class"
  - onChange → `onHandleMappingChange('object_detection', value)`
  - 힌트: "Map this class to the detection model's class (COCO) for auto-labeling."
- showCocoMapping === false:
  - 힌트만 표시: "Assign an object detection model (e.g. YOLO) in AI Models → Assignments to map this class to a model class."

#### 6-2-F. Danger zone
[ClassInfoSidebarPanel.tsx:128-131]
- 제목 "Danger zone"
- `<DeleteClassBtn>` — ui Button variant="secondary" tone="danger", margin-top 8px, padding `8px 16px`, border-radius 6px
- 라벨: "Delete class"
- 클릭 → `useConfirm()` 호출:
  - title: "Delete this class?"
  - description: `image_count > 0` 이면 "This class has labels on {N} image(s).", 0 이면 undefined
  - danger: true
  - confirm 시 → `onDeleteClass(id)` + `setSelectedClassId(null)`

## 7. Overlays

[ClassPageOverlays.tsx](../../workspace/projects/ingradient-platform/frontend/components/classes/ClassPageOverlays.tsx) — Add / Lightbox / ImageContextMenu 통합.

### 7-1. AddClassDialog
[AddClassDialog.tsx](../../workspace/projects/ingradient-platform/frontend/components/classes/AddClassDialog.tsx)

- open === false → null
- ui `DialogShell` 사용 — title "Class name", width "360px"
- 내부: `<ModalInput type="text" placeholder="Enter class name" />` — auto-focus via inputRef
- actions: Cancel (secondary) + Add (accent, disabled if `!name.trim()`)
- onKeyDown: Enter → onConfirm, Escape → onClose

### 7-2. ClassPageLightbox
[ClassPageLightbox.tsx](../../workspace/projects/ingradient-platform/frontend/components/classes/ClassPageLightbox.tsx) (144 lines)

- open === false → null
- 구조:
  ```
  LightboxBackdrop (z-index 1000, dark backdrop, fixed inset 0, click → close)
    LightboxPanel (centered, click stop propagation)
      [PatternTabs] (sequenceSiblings.length > 1 시만, flex wrap, gap 4px, padding 8px 12px)
      LightboxFrame (aspect ratio from loadedSize or item.width/height)
        LightboxImage (object-fit contain, border-radius 12px, shadow, onLoad → updateLoadedImageSize)
        LightboxOverlay (SVG, viewBox "0 0 1 1", preserveAspectRatio none)
          [bbox rect 들] — filterBboxesForClass(item.bboxes, selectedClassId).map → rect x/y/w/h, fill 색=getAnnotationColor(classId), fillOpacity 0.22, stroke=색, strokeWidth 0.006
          [point circle 들] — filterPointsForClass.map → circle cx/cy r=0.012, fill=색, stroke text-primary, strokeWidth 0.004
        LightboxClose (top-right, circle, "×")
  ```

- PatternTabs:
  - sequenceSiblings.map → button
  - 각 button: padding `4px 10px`, radius 6px, font-size 12px
  - active (s.id === currentId): bg `rgba(77, 136, 255, 0.3)`, color text-primary
  - 미 active: bg white-08, color text-muted
  - 라벨: `formatPatternTab(item, index)` — `pattern_label` 가 `x_phase_N_of_M` 형식이면 "X (N+1)/M", "solid" → "Solid", "black" → "Black", 그 외 → name 또는 `#{index+1}`

- aspect 계산: loadedSize ?? item.width/height ?? 1

### 7-3. ImageContextMenu
[ImageContextMenu.tsx](../../workspace/projects/ingradient-platform/frontend/components/classes/ImageContextMenu.tsx)

- menu === null → null
- React `createPortal(..., document.body)` 로 body 에 portal
- `<ContextMenu $top $left>` (position fixed, z-index 1200, bg surface-raised, border, border-radius)
- 1개 아이템: `<ContextMenuItem disabled={pending}>{pending ? 'Adding…' : 'Add to Reference Image'}</ContextMenuItem>`
- 클릭 → `onApplyReferenceImage(menu.imageId)`
- 외부 클릭 / Escape → close (useClickOutside in ui state)

## 8. State management

### 8-1. useClassPageUiState
[use-class-page-ui-state.ts](../../workspace/projects/ingradient-platform/frontend/features/classes/use-class-page-ui-state.ts) (54 lines)

| field | type | 초기값 |
|---|---|---|
| `selectedClassId` | `string \| null` | null |
| `activeDatasetIds` | `Set<string>` | empty Set |
| `enlargedImageIndex` | `number \| null` | null |
| `loadedImageSizes` | `Record<string, {width, height}>` | {} |
| `isAddClassOpen` | `boolean` | false |
| `addClassName` | `string` | '' |
| `isReferenceDragOver` | `boolean` | false |
| `imageContextMenu` | `{imageId, top, left} \| null` | null |
| `addClassInputRef` | `RefObject<HTMLInputElement>` | useRef |
| `imageContextMenuRef` | `RefObject<HTMLDivElement>` | useRef + `useClickOutside` |

### 8-2. useClassPageData
[use-class-page-data.ts](../../workspace/projects/ingradient-platform/frontend/features/classes/use-class-page-data.ts) (265 lines) — 비즈니스 로직, storybook scope 밖. 다음 출력만 storybook 에서 mock 으로 처리:
- `selectedClass` (ClassItem)
- `detailLoading`, `imagesLoading`
- `classDetail` ({ datasets: [{id, name, image_count}] })
- `classImages` ({ items: [...] })
- `classIdToColor` (Record<id, color>)
- `isLightboxOpen`, `lightboxCurrentItem`, `lightboxCurrentUrl`, `sequenceSiblings`
- `referenceBboxCandidates`, `setReferenceImageMutation`, `currentMapping`, `showCocoMapping`
- `toggleDataset`, `applyReferenceImage`, `handleMappingChange`, `updateLoadedImageSize`

## 9. 데이터 모델

### 9-1. ClassItem (platform 의 `types/gallery`)
```ts
{
  id: string
  name: string
  color: string                  // hex
  description?: string
  image_count?: number
  reference_image_url?: string | null
  reference_image_bbox_index?: number | null
  // i18n
  name_locale?: Record<string, string>
}
```

### 9-2. ClassDetail
```ts
{
  classId: string
  datasets: Array<{ id: string; name: string; image_count: number }>
}
```

### 9-3. ClassImage (그리드 아이템)
```ts
{
  id: string
  name?: string
  thumb_url?: string
  original_url?: string
  width?: number
  height?: number
  bboxes?: Array<{ x, y, w, h, classId }>     // 좌표는 0-1 normalized
  points?: Array<{ x, y, classId }>
  sequence_id?: string
  sequence_step?: number
  pattern_label?: string
}
```

## 10. 인터랙션 매트릭스

| 동작 | 위치 | 결과 |
|---|---|---|
| 클래스 row 클릭 | 좌측 | setSelectedClassId(id) → 가운데/우측 reflow |
| `+ Add class` 클릭 | 좌측 header | setIsAddClassOpen(true) |
| AddClassDialog 확인 | overlay | addClass(name) + close |
| Dataset chip 클릭 | 가운데 | toggleDataset(id) — Set 에 추가/제거 |
| 이미지 클릭 | 가운데 grid | setEnlargedImageIndex(idx) → lightbox open |
| 이미지 right-click | 가운데 grid | setImageContextMenu({imageId, top, left}) |
| 이미지 drag start | 가운데 grid | dataTransfer.setData('text/plain', img.id) |
| Drop on reference zone | 우측 | applyReferenceImage(imageId) |
| Context menu "Add to Reference" | overlay | applyReferenceImage + close menu |
| Color picker change | 우측 | updateClass(id, { color }) |
| Random color | 우측 | updateClass(id, { color: randomClassColor() }) |
| Description 편집 | 우측 | updateClass(id, { description }) |
| BboxNavigation 좌/우 | 우측 | applyReferenceImage(imageId, bboxIndex) |
| Mapping select 변경 | 우측 | handleMappingChange('object_detection', value) |
| Delete class | 우측 | useConfirm → removeClass + selectedClassId=null |
| Lightbox close (× or backdrop) | overlay | setEnlargedImageIndex(null) |
| Lightbox PatternTab 클릭 | overlay | setSelectedSibling(item) |

## 11. 모바일 (media.md 이하)

- BodyRow: flex-direction column, overflow-y auto
- ClassListSidebar / ClassInfoSidebar: width 100%, max-height 260px, flex-shrink 0
- ClassImagesPanel: flex 1 (이미지 영역 우선)
- 모바일 dataset selector / bottom toolbar 등은 **현재 platform 에 없음** (Catalog 와 다름)

## 12. 색상 / 토큰 inventory

이미 ui 에 있는 토큰:
- `--ig-color-accent`, `--ig-color-accent-soft`
- `--ig-color-blue-tint-12`, `--ig-color-blue-tint-18`
- `--ig-color-text-primary`, `--ig-color-text-secondary`, `--ig-color-text-muted`, `--ig-color-text-soft`
- `--ig-color-border-strong`, `--ig-color-border-subtle`
- `--ig-color-surface-raised`, `--ig-color-surface-panel`
- `--ig-color-white-04`, `--ig-color-white-08`, `--ig-color-white-12`

새로 필요한 토큰 — **없음** (모든 색이 기존 토큰만 사용).

## 13. 재사용 가능한 기존 자산 (ingradient-ui)

| 자산 | 위치 | 사용처 |
|---|---|---|
| `ColorSwatch` | components | ClassListItem, Color section |
| `Button` | components | + Add class, Random, Delete |
| `TextField` | components | Name |
| `TextareaField` | components | Description |
| `SelectField` | components | Model mapping |
| `DialogShell` | components/overlays | AddClassDialog wrapper |
| `useConfirm` | components/overlays | Delete confirm |
| `ImageGrid` | components | 가운데 그리드 |
| `AnnotationOverlay` | components/data-display | 그리드 cell + lightbox |
| `Badge` | components/data-display | group count |
| `EmptyState` | components | 빈 상태 텍스트 |
| `Spinner` | components | 로딩 |
| `Panel`, `PageHeader`, `PageTitle`, `PageSubtitle`, `PageTitleBlock`, `PageHeaderRow`, `PageContent`, `AppShell` | patterns | 외부 레이아웃 |
| `LoadingState` | components | 로딩 텍스트 |

## 14. 현 storybook 상태 — Gap

[stories/pages/platform/0.0.1/ClassManage.stories.tsx](../../workspace/projects/ingradient-ui/stories/pages/platform/0.0.1/ClassManage.stories.tsx) — **217 lines, mock JSX 만**. 다음이 모두 빠짐:

| 영역 | 현 storybook | platform | 차이 |
|---|---|---|---|
| 3-열 레이아웃 | 2-열 (좌 nav + 본문) | 3-열 (ClassListSidebar / ClassImagesPanel / ClassInfoSidebar) | **전면 재구성** |
| ClassListSidebar | Stack 으로 흉내 | 280px aside + selected border-left + image_count | **신규 pattern** |
| ClassImagesPanel | 없음 | dataset chips + ImageGrid + AnnotationOverlay + group/sequence representative | **신규 pattern** |
| ClassInfoSidebarPanel | 간단한 form | 6 sections (name/color/desc/ref-img/mapping/delete) | **신규 pattern** |
| Reference image drop zone | 없음 | drop zone + preview + bbox nav + status | **신규 pattern** |
| AddClassDialog | 없음 (handoff 만 기록) | DialogShell + input + enter/esc | **신규 pattern** |
| ClassPageLightbox | 없음 | backdrop + frame + svg annotations + pattern tabs | **신규 pattern** |
| ImageContextMenu | 없음 | portal + 1-item menu | **신규 pattern** |
| useConfirm 삭제 confirm | 없음 | "Delete this class?" + 이미지 개수 | **dialog 시나리오** |
| Model mapping (COCO) | 없음 | select 320 옵션 | **신규 + COCO mock 데이터** |
| Group / sequence representative | 없음 | regex 기반 그룹 + badge count | **utils + mock 데이터** |

상호작용 빠짐: 선택 / 추가 / dataset chip toggle / context menu / drag-drop / lightbox / bbox nav / delete confirm.

기존 fixture ([class-scenarios.ts](../../workspace/projects/ingradient-ui/stories/fixtures/platform/0.0.1/class-scenarios.ts)): 4개 클래스 + 6 시나리오 — 너무 빈약. 모든 ClassDetail / ClassImages / 데이터셋 / annotation 모두 추가 필요.

## 15. Verification / 시각 비교 기준

각 phase 끝에:
1. `npx tsc --noEmit` 통과
2. `npm run build:storybook` 성공
3. playwright probe — 신규 story 모두 root 렌더 확인 + console error 0
4. 핵심 시나리오의 스크린샷을 platform 실제 화면과 좌우 비교 (수동):
   - default — 3-열 + 첫 클래스 선택 + ref image 있음
   - empty — 클래스 없음
   - many-classes (18+)
   - long-text — 긴 클래스 이름
   - permission-denied — alert
   - delete-confirm — confirm dialog
   - drag-over-reference — 드롭 zone 활성화
   - lightbox-open — annotation overlay 보임
   - context-menu-open — 우클릭 메뉴 보임
   - bbox-nav — 좌/우 화살표
   - mapping-coco — select 옵션

평가 기준: 색 / 간격 / 폰트 / chip 모양 / 보더 / drop zone 모양 / svg overlay 색·투명도 가 모두 platform 과 일치.

## 16. 변경 이력

- 2026-05-14: 초안 (Joon Ho Lee)
