---
title: Catalog Image Detail — Platform vs Storybook 시각/기능 차이
purpose: ingradient-platform 의 ImageDetailModal 과 @ingradient/platform-pages 의 GalleryDetailModal+ImageDetailViewer 사이의 UI/UX gap 을 정리. 향후 view 보강 또는 platform 마이그레이션 전략 결정용
audience: ingradient-ui contributor / ingradient-platform frontend developer
date: 2026-05-15
status: gap-analysis
related:
  - ./platform-pages-package-plan.md
  - ./platform-pages-usage.md
---

# Catalog Image Detail — Platform vs Storybook Gap Analysis

5 view 추출 과정에서 발견된 가장 큰 시각/기능 차이는 **Catalog 의 이미지 detail modal**. storybook 측은 추출 spec §7 의 slot 패턴 (`detailContent: ReactNode`) 으로 처리해서 view 자체는 얇은 wrapper. 반면 ingradient-platform 의 `ImageDetailModal` 은 **본격 라벨링 에디터** 수준의 큰 모듈.

본 문서는 두 구현을 픽셀/기능 단위로 대조한다.

---

## 1. 한 줄 요약

| | Storybook (`ImageDetailViewer`) | Platform (`ImageDetailModal`) |
|---|---|---|
| 성격 | **읽기 전용 inspector** | **라벨링 에디터** |
| 줄 수 | 1 file, 131 줄 | 20+ files, 메인 file 만 400 줄 |
| 의존 hook | 0 | 18+ feature hook (annotations, history, viewport, selection-tools, comments, classification, drawing-objects, …) |
| editing | ❌ | ✅ bbox/point/classification 모드 |

추출된 view (`packages/platform-pages/src/catalog/CatalogOverlays.tsx`) 는 `GalleryDetailModal` shell + `detailContent` slot 만 가지고, 안의 컨텐츠는 caller (storybook 또는 platform) 가 직접 제공한다. storybook 은 `ImageDetailViewer` (단순 viewer) 를 slot 에 넣지만 platform 은 자체 `ImageDetailModal` (편집기) 을 통째 사용 — 즉 **view 의 detail 부분은 두 consumer 가 완전히 다른 위젯을 띄움**.

---

## 2. Shell — 다른 pattern

### Storybook
- `GalleryDetailModal` (in `@ingradient/ui/patterns`)
- 단순 modal: backdrop + card + close button + children slot

### Platform
- `MediaDialogShell` (in `@ingradient/ui/patterns`, 다른 pattern)
- main / sidebar / overlay / extras 4-region 레이아웃
- 리사이즈 가능 sidebar / mobile toggle / context menu overlay / extras (dialogs)

**Gap**: shell pattern 자체가 다름. `GalleryDetailModal` 은 inspector 용, `MediaDialogShell` 은 editor 용. ingradient-ui 에 둘 다 존재하지만 catalog view 는 전자만 사용.

---

## 3. 이미지 렌더링

| 영역 | Storybook | Platform |
|---|---|---|
| 이미지 소스 | 단일 `thumb_url` | progressive: thumb → preview → original (zoom 에 따라 swap) |
| Loading state | 없음 | `isImageLoading` + `isHiResLoading` 두 단계 |
| Hook | none | `useProgressiveImageSource` (zoom 기반 해상도 선택) |
| Zoom / Pan | 없음 | `useZoomPan` (max 20x) + mouse drag + wheel + touch pinch |
| Touch | 없음 | `useImageDetailViewport` 의 swipe / pinch |
| Aspect ratio | image 자체 비율 사용 | `useImageDetailContainerMetrics` 로 container 사이즈 동기화 |

**Gap**: storybook 의 viewer 는 정적 thumbnail. platform 은 zoom/pan + progressive loading 까지 갖춘 본격 인터랙티브 viewer.

---

## 4. Annotation 편집

| 영역 | Storybook | Platform |
|---|---|---|
| Mode | 없음 (display only) | `cursor / bbox / point / classification` 4 mode |
| Mode 전환 | — | `useImageDetailToolShortcuts` (키보드 shortcut) |
| Drawing canvas | `AnnotationViewer` (read-only) | `useDrawingCanvas` + `useCanvasMouse` (interactive) |
| Bbox edit | ❌ | 드로잉 / 이동 / 리사이즈 / class 할당 / 삭제 |
| Point edit | ❌ | 드로잉 / 드래그 / class 할당 / 삭제 |
| Undo/Redo | ❌ | `useImageDetailHistory` (annotation undo redo stack) |
| Reset | ❌ | 한 번에 reset |
| Selection | ❌ | `selectedBboxIndex / selectedPointIndex` + 우측 sidebar 동기화 |
| 좌표 readout | ❌ | `useImageDetailCoordText` (실시간 cursor 좌표 표시) |

**Gap**: 가장 큰 영역. storybook 의 detail viewer 는 annotation 을 **보여주기만** 함. platform 은 **편집 가능** — 본질적으로 다른 도구.

---

## 5. Class 처리

| 영역 | Storybook | Platform |
|---|---|---|
| 표시 | `ImageClassTags` (tag chip 리스트) | `ImageDetailClassList` (full sidebar with selection state, hover preview) |
| Hover preview | ❌ | `ClassPreview` floating panel (`hoveredClassPreview`) |
| Class 할당 | ❌ | `assignClassToSelection` — 선택 bbox/point 에 class 할당 |
| Classification toggle | ❌ | `useImageDetailClassification` — image-level classification |
| Class filter | ❌ | `enabledClassIds` prop (현재 dataset 에 연결된 class 만) |
| Selected class | ❌ | `selectedClassId` (다음 그릴 annotation 의 class) |

**Gap**: storybook 은 tag chips, platform 은 sidebar 전체에 걸친 class 도구.

---

## 6. Comments

| 영역 | Storybook | Platform |
|---|---|---|
| 표시 | `CommentsPanel` (read + reply input) | `ImageDetailComments` (full CRUD) |
| Edit comment | ❌ | inline edit + save / cancel |
| Delete comment | ❌ | archive dialog 통한 삭제 |
| Mention | basic mention 표시 | `mentionCandidates` 기반 autocomplete + render |
| Error / retry | ❌ | `commentError` + `retryLastAction` |
| Saving state | ❌ | `isCommentSaving` |
| User filter | ❌ | `selectedUsers` (필터링) + `hoveredUser` (hover highlight) |

**Gap**: 양쪽 모두 comment 패턴 있지만 platform 의 것이 훨씬 풍부.

---

## 7. Group / Sequence navigation

| 영역 | Storybook | Platform |
|---|---|---|
| Group 지원 | `siblings: ClassImage[]` prop, 다음/이전 단순 click | `useImageDetailGroupNav` (pattern tab bar + ref) |
| 키보드 nav | ❌ | swipe + arrow keys |
| Group image swap | ❌ | currentImage swap with separate annotations per image |

**Gap**: storybook 의 sibling 은 같은 sequence 의 이미지 목록만 단순 노출. platform 은 sequence 내 이미지마다 annotation 따로 관리.

---

## 8. Info panel (이미지 메타)

| 영역 | Storybook | Platform |
|---|---|---|
| 위치 | 우측 column 안의 한 section | 좌측 sidebar 상단 collapsible panel |
| 표시 | 6 row flat grid (size / dataset / sequence / pattern / uploaded / sync) | 2 collapsible section (Details / Camera Parameters) |
| Camera params | ❌ | `ImageDetailCameraParameters` 별도 sub-panel (EXIF / 광원 설정 등) |
| Toggle 기억 | ❌ | `infoDetailsOpen` + `infoCameraParamsOpen` (sidebar state hook) |

**Gap**: storybook 은 always-visible flat list, platform 은 fold/unfold + camera params 추가 영역.

---

## 9. Context menu

| 영역 | Storybook | Platform |
|---|---|---|
| 우클릭 | ❌ (없음) | `ImageDetailContextMenu` — 위치 + sub-menu |
| 메뉴 항목 | ❌ | Assign class (sub-menu with class list) / Delete annotation / Archive image |
| Class sub-menu | ❌ | `contextMenuClassSubOpen` + hover preview |
| Timer-based close | ❌ | `contextMenuSubCloseTimerRef` (sub-menu hover delay) |

**Gap**: platform 은 우클릭 워크플로우 전체 있음. storybook 은 없음.

---

## 10. Sidebar 크기 / Mobile

| 영역 | Storybook | Platform |
|---|---|---|
| Sidebar 너비 | 320px 고정 (CSS `grid-template-columns: 1fr 320px`) | `classSidebarWidth` resizable + persisted in `useImageDetailSidebarState` |
| Resizer | ❌ | `handleSidebarResizerMouseDown` + drag |
| Mobile toggle | ❌ | `mobileSidebarVisible` + backdrop overlay |
| Mobile breakpoint | ❌ | CSS `@media` 로 sidebar 가 overlay 로 전환 |

**Gap**: platform 의 sidebar 는 인터랙티브. storybook 은 정적.

---

## 11. Dialog / Confirm 액션

| 영역 | Storybook | Platform |
|---|---|---|
| Delete image dialog | ❌ | `useImageDeleteDialog` + `ImageDetailDialogs` 의 confirm UI |
| Archive comment dialog | ❌ | `archiveCommentTarget` confirm dialog |
| Error / loading state | ❌ | `deleteImageError`, `isDeletingImage` 등 |

**Gap**: storybook 은 destructive action 자체 없음 (display only).

---

## 12. Hooks 개수

| | Storybook | Platform |
|---|---|---|
| Mock state hook | 1 (`useCatalogScene`) | — |
| Feature hook | 0 | **18+**: `useZoomPan`, `useDrawingCanvas`, `useCanvasMouse`, `useImageDetailGroupNav`, `useImageDetailAnnotations`, `useImageDetailSidebarState`, `useImageDetailComments`, `useImageDeleteDialog`, `useImageDetailHistory`, `useImageDetailViewport`, `useImageDetailToolShortcuts`, `useImageDetailCoordText`, `useImageDetailContainerMetrics`, `useImageDetailClassification`, `useImageDetailSelectionTools`, `useImageDetailDrawingObjects`, `useProgressiveImageSource`, `useAuth` |

**Gap**: platform 은 detail modal 하나에 18+ feature hook. storybook 은 0. 모든 인터랙티브 동작이 사라진 셈.

---

## 12.7. 시각 통일 3차 — Toolbar + ClassList (2026-05-15)

추가 발견: 도구 선택 toolbar 와 sidebar 의 class 목록 디자인이 여전히 다름. 추가 통일.

### 변경

| 영역 | Before | After |
|---|---|---|
| Canvas 아래 | (없음) | `AnnotationToolbar` (cursor / bbox / point / classification + undo/redo/reset/delete) |
| Class section | `ImageClassTags` (inline chip) | `ImageDetailClassList` (row + ColorSwatch + 선택 강조 + classified 강조) |

### 신규 pattern

- `ImageDetailClassList` ([src/patterns/shells/image-detail-class-list.tsx](../../src/patterns/shells/image-detail-class-list.tsx)) — 117 줄. platform 의 `ImageDetailClassList` 와 시각 동일 (border / 8px radius / blue-tint 강조 / margin-bottom row 간격).

### 기존 pattern 재사용

- `AnnotationToolbar` 는 이미 ui pattern. platform 의 `ImageDetailToolbar` 도 이걸 사용. storybook 도 동일 wire-up (모드 4종 + 액션 4종 + separator).

### Storybook 측 변경

`stories/pages/platform/0.0.1/catalog/build-detail-content.tsx` 신규 helper 분리:
- `DetailMainMount` — `ImageInspectorCanvas` + 하단 `AnnotationToolbar`
- `DetailSidebarMount` — `ImageDetailSidebar` + `ImageDetailInfoPanel` + `ImageDetailClassList` (replaced ImageClassTags) + `CommentsPanel`
- 모드 / 클래스 selection 은 storybook 의 `useState` 로 로컬 관리 — 클릭 시 시각 토글만, 실제 mutation 없음

### 해소된 gap

- §4 (Annotation 편집) 의 **모드 버튼 시각 부분**: 4 mode toggle button + undo/redo/reset/delete 표시
- §5 (Class 처리) 의 **목록 디자인**: row + ColorSwatch + 선택 강조

### 남은 gap (편집 동작)

여전히 platform 전용:
- bbox/point 실제 drawing (스토리북에선 mode 만 visual)
- assign-to-selection (실제 annotation classId 변경)
- classification toggle (실제 image-level class assignment)
- undo/redo history
- delete image mutation

→ 모두 platform 의 18+ feature hook 의존. detail slot 에 platform 의 ImageDetailModal 직접 주입 (Option A) 권장 (§13).

### 검증

- typecheck EXIT=0
- build:package + build:storybook
- catalog probe 12/12 + 회귀 4 probe 26/26 통과

---

## 12.6. 시각 통일 2차 — Shell / Info / Sidebar 구조 통합 (2026-05-15)

본 gap 정리 직후 시각 통일 2차 작업. spec: [platform-pages-detail-modal-unification-spec.md](./platform-pages-detail-modal-unification-spec.md).

### 변경

| 영역 | Before | After |
|---|---|---|
| Shell | `GalleryDetailModal` (DialogShell 기반, 960px 중간 dialog) | `GalleryDetailModal` (MediaDialogShell 기반, 95vw 큰 dialog + 320px native sidebar) |
| Info | flat 6 row metadata | `ImageDetailInfoPanel` — "Image info" 타이틀 + 기본 3 row (File / Uploaded / Captured) + show/hide details collapsible + 13+ row 본문 |
| Sidebar | 2-col grid 안의 ImageDetailViewer body (metadata + classes + comments 한 column) | `ImageDetailSidebar` — Image info / Class / Comments / Labelers 4 section 분리 |
| API | `<GalleryDetailModal>{<ImageDetailViewer>}</GalleryDetailModal>` | `<GalleryDetailModal main={canvas} sidebar={ImageDetailSidebar} />` |
| CatalogView prop | `detailContent: ReactNode` | `detailContent: { main, sidebar }` |

### 신규 pattern

- `ImageDetailInfoPanel` ([src/patterns/shells/image-detail-info-panel.tsx](../../src/patterns/shells/image-detail-info-panel.tsx)) — 154 줄. platform 의 `ImageDetailInfoPanel.tsx` 를 ui pattern 으로 추출
- `ImageDetailSidebar` ([src/patterns/shells/image-detail-sidebar.tsx](../../src/patterns/shells/image-detail-sidebar.tsx)) — 70 줄. infoPanel + classSlot + commentsSlot + labelersSlot 묶음

### 변경 pattern

- `GalleryDetailModal` — DialogShell → MediaDialogShell, `main` + `sidebar` slot 추가. `children` backward compat.
- `CatalogView.types.detailContent` — `ReactNode` → `{ main?: ReactNode; sidebar?: ReactNode }`
- `CatalogOverlays` — detailContent.main/sidebar 를 GalleryDetailModal 의 새 slot 으로 전달

### 해소된 gap

- §2 (Shell): MediaDialogShell 로 통일 — platform 과 동일 shell pattern 사용
- §8 (Info panel): collapsible 동일 동작
- §10 (Sidebar): main/sidebar 분리 + resizable (320px default)

### 남은 gap (Phase 7 마이그레이션 시 platform 의 ImageDetailModal 직접 주입)

§4 (Annotation 편집), §5 (Class 처리 — assign-to-selection), §6 (Comments CRUD), §7 (Group nav), §9 (Context menu), §11 (Dialogs), §12 (Hooks 18+) — 모두 platform 전용 feature hook 의존이라 view 추출 불가. **detailContent slot 에 platform 의 ImageDetailModal 직접 주입** (Option A) 권장.

### 검증

- typecheck EXIT=0
- build:package + build:storybook
- catalog probe 12/12 + 4 회귀 probe 26/26 통과

---

## 12.5. 중요 정정 — `LabelingCanvas` 는 이미 공유 자산

본 비교 직후 발견: platform 의 `ImageDetailCanvasArea` 가 `LabelingCanvas` (in `@ingradient/ui/patterns`) **를 그대로 사용**. 즉 zoom/pan + drawing canvas + crosshair + capture layer 등 **canvas 영역 자체는 양쪽이 동일한 ui pattern 을 공유**. §3 의 "이미지 렌더링" 차이는 platform 이 LabelingCanvas 를 **풍부하게 wire** 하는 데서 비롯됨.

차이는 **wire-up 의 풍부함**:
- Platform 의 `ImageDetailCanvasArea` = `LabelingCanvas` + `useZoomPan` + `useDrawingCanvas` + `useCanvasMouse` + 18+ feature hook + floating UI
- Storybook 의 `ImageDetailViewer` (구버전) = `AnnotationViewer` (read-only 단순 overlay)

**조치 — Storybook 측을 LabelingCanvas 기반으로 통일**:

신규 pattern `ImageInspectorCanvas` ([src/patterns/shells/image-inspector-canvas.tsx](../../src/patterns/shells/image-inspector-canvas.tsx)) 추가:
- `LabelingCanvas` + `useZoomPan` + `useDrawingCanvas` (cursor mode) + `useCanvasMouse`
- props: `imageUrl`, `boxes` (AnnotationBoundingBox[]), `points`, `maxZoom`, `showLabels`
- **인터랙티브**: zoom (wheel), pan (drag at zoom > 1), 라벨 표시
- **편집 X**: cursor mode 만, mutation callback 없음

`stories/pages/platform/0.0.1/catalog/build-view-props.tsx` 의 `buildDetailContent` 가 `AnnotationViewer` 대신 `ImageInspectorCanvas` 호출. 이제 storybook 의 catalog detail modal 도 zoom/pan 가능.

→ §3 ("이미지 렌더링"), §4 ("Annotation 편집") 의 gap 중 **read-only zoom/pan 부분은 해소**. 편집 기능 (mode switch / undo-redo / classification 등) 은 platform 전용으로 유지 (§13 의 결론 그대로).

---

## 13. 영향 / 의미

### 13.1 view 의 detail 부분 = 본질적으로 추출 불가

`CatalogView` 가 `detailContent: ReactNode` slot 으로 받는 이유가 명확. detail modal 의 본체 (`ImageDetailModal` 컴포넌트) 는:
- 18+ feature hook 에 의존 (대부분 platform 의 store / API / auth 와 결합)
- annotation 편집의 상태 관리는 platform 의 mutation hook 과 강결합
- progressive image loading 은 platform 의 asset CDN 과 결합

→ **view 로 추출하더라도 platform 에서 빈 상태로 받기 어려움**. props surface 100+ 개로 폭발.

### 13.2 storybook 의 detail 은 "정적 스냅샷" 으로 의도된 것

storybook 의 목적은 **shell + 메타 정보 시각 검증**. 인터랙티브 편집은 storybook 의 mock 환경에서 의미 없음 (실제 mutation X). 따라서 `ImageDetailViewer` 는 의도적으로 read-only.

### 13.3 platform 마이그레이션 시 결정 사항

Phase 7 (ingradient-platform 마이그레이션) 에서 다음 옵션 중 선택:

**옵션 A — 현재 platform 의 ImageDetailModal 유지**
- `CatalogView` 의 `detailContent` slot 에 `<ImageDetailModal />` 그대로 주입
- view extraction 의 효용 0 (이 부분만)
- 시각 일치 보장

**옵션 B — ImageDetailViewer 로 교체 (downgrade)**
- 편집 기능 다 사라짐 — Catalog 의 라벨링 워크플로우 깨짐
- 실용적 X

**옵션 C — ImageDetailModal 자체를 ingradient-ui 로 승격**
- 18+ feature hook 중 generic 한 부분 (`useZoomPan` 등은 이미 있음) + view-only 부분 분리
- annotation edit 의 mutation 부분만 callback 으로 외부 위임
- 큰 작업. 별도 phase 필요

권장: **옵션 A**. detail modal 부분은 platform 의 자체 컴포넌트로 유지. view 의 slot 패턴이 정확한 설계 — caller 가 풍부한 editor 또는 빈 inspector 둘 다 가능.

---

## 14. 시각 차이 요약 (스크린샷 없이)

| 시각 요소 | Storybook | Platform |
|---|---|---|
| Modal 배경 | 단색 backdrop | semi-transparent + blur |
| Modal width | 1200px 고정 | viewport 거의 채움 |
| 이미지 영역 | LeftCol (1fr) | main (가운데, large) |
| Sidebar 위치 | 우측 320px 고정 | 우측 resizable (240~480px) |
| Info 표시 | 6 row meta grid | collapsible Details + CameraParameters |
| Class 영역 | 우측 컬럼 안의 ImageClassTags | 우측 sidebar 전체 |
| Comment 영역 | 우측 컬럼 안의 작은 CommentsPanel | 우측 sidebar 하단 |
| Toolbar (mode/undo/zoom) | 없음 | 좌측 또는 상단 floating toolbar |
| 닫기 버튼 | 우상단 X | 우상단 X + ESC + backdrop click |

---

## 15. 추후 추가 작업 후보

본 문서는 gap 만 정리. 다음은 별도 phase 로 검토 가능:

### 15.1 ingradient-ui 측

- `MediaDialogShell` 의 사용처 정비 (Catalog 의 detail 도 이걸로 통일?)
- `ImageDetailViewer` 의 진화 — 일부 인터랙션 추가 (예: zoom/pan, info collapsible)
- `useZoomPan`, `useDrawingCanvas`, `useCanvasMouse` 같은 generic hook 의 storybook story 작성

### 15.2 platform 마이그레이션 (Phase 7)

- `CatalogPage` 의 detail modal 부분은 platform 의 `ImageDetailModal` 유지
- `CatalogView` 의 `detailContent` slot 에 `<ImageDetailModal {...props} />` 주입
- annotation / comment mutation hook 들은 platform 그대로

### 15.3 시각 통일 (선택)

storybook 의 inspector 와 platform 의 editor 는 본질적으로 다른 도구라 시각 통일 불필요. 단, 다음은 통일 권장:
- Modal shell 의 backdrop / blur / radius / border
- Sidebar 의 너비 / 분할선 색
- Info panel 의 row 간격 / typography

---

## 16. 결론

storybook 과 platform 의 image detail 은 **다른 용도의 컴포넌트**. storybook 의 `ImageDetailViewer` 는 의도적으로 inspector, platform 의 `ImageDetailModal` 은 editor.

`CatalogView` 의 `detailContent` slot 패턴이 이 차이를 자연스럽게 흡수 — caller 가 적절한 컴포넌트 주입. **view 의 detail 부분은 추가 추출 작업 불필요**.

Phase 7 마이그레이션 시 platform 의 `CatalogPage` 는 `detailContent={<ImageDetailModal {...props} />}` 로 view 사용. 두 컴포넌트는 분리 유지.
