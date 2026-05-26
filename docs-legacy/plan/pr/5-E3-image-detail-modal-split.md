---
title: PR-E3 — platform image-detail-modal.tsx split (818 → < 300)
date: 2026-05-11
parent: docs/plan/phase-5-components-audit.md
scope: ingradient-platform
status: planning — 사용자 review 대기
---

# PR-E3 — image-detail-modal split

## 1. 목적

[image-detail-modal.tsx](frontend/components/gallery/image-detail/image-detail-modal.tsx) (818줄) 가 CLAUDE.md governance 의 200-line limit 을 *4배* 위반. PR-E1d 마이그 후에도 남은 inline state + effects + memo derivations 를 기존 `useImageDetail*` hook 패턴으로 추출하여 본체를 ~300줄로 감축.

본 PR 은 **순수 refactor** — 동작 변경 없음. 기존에 inline 으로 호출되던 hook/effect 가 *별도 파일의 hook* 으로 이동만 함.

## 2. 현재 구조 분석

818줄 breakdown:

| 영역 | 줄수 | 내용 |
|---|---|---|
| 1-120 | 120 | imports / constants / types / Props interface |
| 121-151 | 31 | function signature + destructure |
| 152-209 | 58 | inline state (mode, bboxes, points, classes, undo/redo, zoom/pan, ...) |
| 213-262 | 50 | 기존 hooks (sidebarState, comments, deleteDialog) call |
| 254-263 | 10 | useImageDeleteDialog |
| 262-292 | 31 | wrapRef + containerSize state + ResizeObserver + imageAspect + renderedWidthAtZoom1 |
| 293-301 | 9 | useProgressiveImageSource |
| 302-322 | 21 | classificationTargetImageIds + classificationAssignedClassIds |
| 323-325 | 3 | pushState callback |
| 326-365 | 40 | useImageDetailSelectionTools call |
| 366-376 | 11 | updateGroupImageIndex callback |
| 378-399 | 22 | annotation reset effect |
| 401-407 | 7 | selection clear effect on image change |
| 409-411 | 3 | zoomPan reset effect |
| 413-424 | 12 | tool shortcut keydown effect |
| 426-428 | 3 | imageLoading reset effect |
| 430-438 | 9 | classificationByImageId initialization effect |
| 440-447 | 8 | groupImageIndex initialization effect |
| 449-451 | 3 | onGroupImageIndexChange effect |
| 453-465 | 13 | patternTabBar wheel effect |
| 470-500 | 31 | drawingCanvasObjects useMemo |
| 504-514 | 11 | handleDrawingObjectsChange callback |
| 515-547 | 33 | useImageDetailHistory call |
| 548-557 | 10 | useDrawingCanvas call |
| 559-575 | 17 | useCanvasMouse call |
| 576-590 | 15 | useImageDetailViewport call |
| 592-605 | 14 | coordText useMemo |
| 607-644 | 38 | contextMenuNode JSX |
| 646-729 | 84 | mainNode JSX (toolbar + canvas) |
| 731-784 | 54 | sidebarNode JSX |
| 786-800 | 15 | dialogsNode JSX |
| 802-817 | 16 | final return (MediaDialogShell) |

→ JSX 노드 4 개 (147줄) + state/hooks/effects (470 + 200줄) + signature (151줄) = 818

## 3. 추출 거리

기존 `features/gallery/image-detail/use-image-detail-*.ts` 패턴 따른다.

### 3.1 `useImageDetailContainerMetrics` (신규, ~25줄)

`wrapRef` + `containerSize` state + ResizeObserver effect + `imageAspect` derivation + `renderedWidthAtZoom1` derivation 통합.

```ts
function useImageDetailContainerMetrics(currentImage: ImageItem, imageAspectFromLoad: number)
  → { wrapRef, containerSize, imageAspect, renderedWidthAtZoom1 }
```

본체 절약: **-31줄**

### 3.2 `useImageDetailClassification` (신규, ~30줄)

`classificationByImageId` state + 초기화 effect + `classificationTargetImageIds` memo + `classificationAssignedClassIds` memo.

```ts
function useImageDetailClassification({
  hasGroup, groupImages, currentImage, image,
}) → { classificationByImageId, setClassificationByImageId, classificationTargetImageIds, classificationAssignedClassIds }
```

본체 절약: **-30줄** (state + 21줄 memo + 9줄 effect)

### 3.3 `useImageDetailGroupNav` (신규, ~45줄)

`groupImageIndex` state + `updateGroupImageIndex` callback + 3개 effect (init / onChange notify / patternTabBar wheel) + `patternTabBarRef`.

```ts
function useImageDetailGroupNav({
  hasGroup, groupImages, image, initialGroupImageIndex, onGroupImageIndexChange,
}) → { groupImageIndex, updateGroupImageIndex, patternTabBarRef }
```

본체 절약: **-35줄**

### 3.4 `useImageDetailAnnotations` (신규, ~40줄)

`bboxes` / `points` / `classes` / `selectedClassId` state + `annotationUndoRedo` + `pushState` + annotation reset effect (groupAnnotations 처리 + initial reset).

```ts
function useImageDetailAnnotations({
  image, hasGroup, groupImages, groupImageIndex, groupAnnotations,
  initialBboxes, initialPoints, initialClasses,
}) → {
  bboxes, setBboxes, points, setPoints,
  classes, setClasses, selectedClassId, setSelectedClassId,
  annotationUndoRedo, pushState,
}
```

본체 절약: **-40줄**

### 3.5 `useImageDetailToolShortcuts` (신규, ~15줄)

tool shortcut keydown effect (b/c/p).

```ts
function useImageDetailToolShortcuts(setMode: (m: Mode) => void)
```

본체 절약: **-12줄**

### 3.6 `useImageDetailDrawingObjects` (신규, ~50줄)

`drawingCanvasMode` derivation + `drawingCanvasObjects` useMemo + `handleDrawingObjectsChange` callback.

```ts
function useImageDetailDrawingObjects({
  mode, selectedClassId, bboxes, points, selectedUsers, hoveredUser,
  getColorForClassId, getNameForClassId, setBboxes, setPoints,
}) → { drawingCanvasMode, drawingCanvasObjects, handleDrawingObjectsChange }
```

본체 절약: **-42줄**

### 3.7 `useImageDetailCoordText` (신규, ~20줄)

`coordText` useMemo.

```ts
function useImageDetailCoordText({
  selectedBboxIndex, selectedPointIndex, bboxes, points, liveNorm, zoom,
}) → string
```

본체 절약: **-14줄**

### 3.8 본체 selection / sidebar / viewport 등은 이미 분리됨

`useImageDetailSidebarState` / `useImageDetailComments` / `useImageDeleteDialog` / `useImageDetailSelectionTools` / `useImageDetailHistory` / `useImageDetailViewport` 는 유지 — call 만 본체에 남는다.

## 4. 변경 파일

| 파일 | 변경 | 줄수 |
|---|---|---|
| `image-detail-modal.tsx` | 7 hook 추출 후 wiring + JSX 만 | 818 → 약 **290** (-528) |
| `features/gallery/image-detail/use-image-detail-container-metrics.ts` | 신규 | +30 |
| `features/gallery/image-detail/use-image-detail-classification.ts` | 신규 | +40 |
| `features/gallery/image-detail/use-image-detail-group-nav.ts` | 신규 | +55 |
| `features/gallery/image-detail/use-image-detail-annotations.ts` | 신규 | +50 |
| `features/gallery/image-detail/use-image-detail-tool-shortcuts.ts` | 신규 | +20 |
| `features/gallery/image-detail/use-image-detail-drawing-objects.ts` | 신규 | +60 |
| `features/gallery/image-detail/use-image-detail-coord-text.ts` | 신규 | +25 |

각 신규 hook 파일 *모두 200줄 미만*, 단일 책임.

순 변화: image-detail-modal.tsx 약 -530줄, 신규 hooks 합 약 +280줄. 총 -250줄 (단 hook 안에서 wrapper boilerplate 가 더 늘어남).

## 5. 추출 순서 (PR 안 commit 단위 권장)

1. **commit 1** — `useImageDetailToolShortcuts` (가장 단순) + `useImageDetailCoordText` — 위험 0
2. **commit 2** — `useImageDetailContainerMetrics` — wrapRef 책임 이동 검증
3. **commit 3** — `useImageDetailClassification` — classification state move
4. **commit 4** — `useImageDetailGroupNav` — group nav state move (patternTabBarRef 책임 이동)
5. **commit 5** — `useImageDetailAnnotations` — bboxes/points/classes/undo/redo state move
6. **commit 6** — `useImageDetailDrawingObjects` — drawing canvas objects derivation move

각 commit 후 `npx tsc --noEmit` 통과 보장. 한 PR 안 6 commit 또는 단일 squash.

## 6. 위험

- **낮음~중간**. 순수 refactor — 외부 동작 변경 없음.
- **중요**: hook 간 dependency 순서 (예: `useImageDetailGroupNav` → `useImageDetailAnnotations` 가 `groupImageIndex` 받음). 추출 순서 5번에서 명확히.
- **state lifting**: 일부 setter 가 multiple hook 에 전달 (예: `setBboxes` → `useImageDetailAnnotations` 가 owner, `useImageDetailDrawingObjects` 와 `useImageDetailSelectionTools` 가 consumer). 명확한 owner-consumer 패턴.
- **patternTabBarRef** 와 **wrapRef** 가 hook 안 owned ref 로 이동 — caller 가 JSX 에서 forward 사용. ref 가 hook return 으로 노출되어야 함.
- **eslint react-hooks/exhaustive-deps** 의 disable 코멘트 (annotation reset effect) 유지.

## 7. 검증 절차

1. 각 commit 후 `cd frontend && npx tsc --noEmit` pass
2. 마지막 `npm run dev` → 갤러리 이미지 모달:
   - 모달 open / close
   - bbox 그리기 + 선택 + class assign + 이동 + resize + 삭제
   - point 그리기 + class assign + 삭제
   - classification mode + class toggle (single / group images)
   - zoom (휠 + 버튼) + pan (zoom>1 cursor mode 빈공간 드래그)
   - undo / redo (Ctrl+Z / Ctrl+Shift+Z)
   - tool shortcut (b / c / p)
   - context menu (우클릭 → class submenu / delete)
   - group image swipe (touch) + 좌우 nav + pattern tab wheel
   - 사이드바 resize + mobile 토글
   - comment add / edit / delete + mention
   - delete image dialog
   - hi-res progressive load (zoom > 1)

## 8. 후속

본 PR 후 image-detail-modal.tsx 약 290줄 → governance 만족.

- PR-E4 edge BBoxCanvas split (725줄) 가 다음 후보
- 또는 PR-E14 platform top-level modals audit
