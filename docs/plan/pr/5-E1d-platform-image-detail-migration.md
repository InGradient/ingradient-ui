---
title: PR-E1d — platform image-detail-modal 3-Pattern 마이그
date: 2026-05-11
parent: docs/plan/pr/5-E1-image-detail-shell.md
scope: ingradient-platform
status: planning — 사용자 review 대기
---

# PR-E1d — platform image-detail-modal 마이그

## 1. 목적

PR-E1 phased plan 의 *Phase 2*. ui Phase 1 에서 추출한 3 Pattern (PR-E1c MediaDialogShell, PR-E1b AnnotationToolbar + CanvasCoordReadout, PR-E1a LabelingCanvas + useCanvasMouse) 를 platform image-detail-modal 에 적용.

## 2. 마이그 매핑

### 2.1 Shell layout — MediaDialogShell 사용

[image-detail-modal.tsx:583-763](frontend/components/gallery/image-detail/image-detail-modal.tsx#L583-L763) 의 JSX 구조:

```tsx
// 이전
<Overlay>
  <Backdrop onClick={handleBackdropClick} />
  <ImageDetailContextMenu ... />
  <ModalContent onClick onContextMenu onTouchStart onTouchEnd>
    <MainArea>
      <ImageDetailToolbar ... />
      <ImageDetailCanvas ... />
    </MainArea>
    <ImageDetailSidePanel ... />  {/* includes ClassSidebarResizer + ClassSidebar */}
    <ImageDetailDialogs ... />
  </ModalContent>
</Overlay>

// 이후
<MediaDialogShell
  onClose={onClose}
  onContextMenu={openContextMenu}
  onTouchStart={handleTouchStart}
  onTouchEnd={handleTouchEnd}
  sidebarWidth={classSidebarWidth}
  onSidebarResize={handleSidebarResizerMouseDown}
  main={<>
    <AnnotationToolbar ... />   {/* + CanvasCoordReadout */}
    <ImageDetailCanvas ... />    {/* 내부에서 LabelingCanvas 사용 */}
  </>}
  sidebar={<ImageDetailSidePanel ... />}  {/* resizer 는 MediaDialogShell 가 처리 — Panel 에선 제거 */}
  overlay={<ImageDetailContextMenu ... />}
  extras={<ImageDetailDialogs ... />}
/>
```

**효과**:
- [image-detail-modal.styles.layout.ts:4-46](frontend/components/gallery/image-detail/image-detail-modal.styles.layout.ts#L4-L46): `Overlay`/`Backdrop`/`ModalContent`/`MainArea` 제거 (-44줄)
- [image-detail-modal.styles.sidebar.ts:4-32](frontend/components/gallery/image-detail/image-detail-modal.styles.sidebar.ts#L4-L32): `ClassSidebarResizer` 제거 (-9줄). `ClassSidebar` 의 `border-left` / `background` / `flex-shrink: 0` 도 MediaDialogShell 의 sidebar slot wrapper 가 처리 — 단순 wrapper 로 슬림화 (-15줄)
- 합 **약 -68줄** layout/sidebar styles

### 2.2 Toolbar — AnnotationToolbar + CanvasCoordReadout 사용

[ImageDetailToolbar.tsx](frontend/components/gallery/image-detail/ImageDetailToolbar.tsx) (175줄) → 약 90~100줄

**현재 구조** (2 영역):
- TopRightGroup (absolute top-right): zoom out / zoom in / close — 3 버튼
- ModalToolbar (absolute bottom): CoordReadout + 4 mode + 3 history + delete + mobile-info

**마이그 후**:
- TopRightGroup: 그대로 유지 (다른 위치라 AnnotationToolbar 와 충돌. 별도 sub-PR 거리)
  - 또는 platform 자체 styled 유지 + AnnotationToolbar 의 trailing slot 으로 흡수 가능
- ModalToolbar → AnnotationToolbar placement='bottom' 사용
  - mode actions (cursor/bbox/point/classification) 각각 platform 자체 아이콘 (CursorIcon/BboxIcon 등 image-detail-modal.icons.tsx)
  - history actions (undo/redo/reset) + delete (danger)
  - mobile-info → trailing slot
  - CoordReadout (현재 `<CoordReadout>` styled) → `<CanvasCoordReadout>` 컴포넌트로. 단 platform 의 위치는 *toolbar 안 leading* 이었음. 새 위치는 *toolbar 밖, canvas 아래 sibling*. UX 변화 spot-check 필요

**효과**:
- ImageDetailToolbar 줄수 -75줄
- [image-detail-modal.styles.layout.ts:54-117](frontend/components/gallery/image-detail/image-detail-modal.styles.layout.ts#L54-L117): `ModalToolbar` / `CoordReadout` / `IconBtn` / `DangerIconBtn` / `TopRightGroup` / `CloseBtn` 중 ModalToolbar/CoordReadout/IconBtn/DangerIconBtn 제거 (-50줄). TopRightGroup + CloseBtn 유지

### 2.3 Canvas — LabelingCanvas + useCanvasMouse 사용

[ImageDetailCanvas.tsx](frontend/components/gallery/image-detail/ImageDetailCanvas.tsx) (298줄) → 약 130~150줄

**현재**:
- ImageDetailCanvas 가 ImageWrap + ZoomWrap + ImageAreaWrap + ModalImg + DrawingLayer + BboxLayer (capture) + crosshair + 마우스 합성 로직 + group nav PatternTabBar 직접 렌더

**마이그 후**:
- LabelingCanvas 가 Wrap + ZoomWrap + ImageAreaWrap + img + DrawingLayer + capture 모두 흡수
- useCanvasMouse hook 으로 마우스 합성 + cursor 결정 통합
- group nav PatternTabBar 는 `floatingOverlays` slot 으로 전달
- HiResLoadingPill 은 `floatingOverlays` slot
- ArchivedOverlay 는 `underlays` slot

**효과**:
- ImageDetailCanvas 줄수 -160줄 (마우스 합성 + hit-test + cursor 분기 + layout JSX 가 ui 로 이전)
- [image-detail-modal.styles.layout.ts:119-159](frontend/components/gallery/image-detail/image-detail-modal.styles.layout.ts#L119-L159): `ImageAndTabsCol` / `ImageWrap` / `PatternTabBar` / `PatternTabBtn` 중 ImageAndTabsCol/ImageWrap 제거 (-30줄). PatternTabBar/PatternTabBtn 유지 (group nav 자산)
- [image-detail-modal.styles.canvas.ts](frontend/components/gallery/image-detail/image-detail-modal.styles.canvas.ts) (189줄): `ZoomWrap` / `ImageAreaWrap` / `ModalImg` / `BboxLayer` / `ModalImageLoading` / `HiResLoadingPill` 중 앞 4개 제거 (-80줄). ModalImageLoading/HiResLoadingPill 유지 (floatingOverlays slot 안 사용)

## 3. 변경 파일 list

| 파일 | 변경 | 줄수 변화 |
|---|---|---|
| [image-detail-modal.tsx](frontend/components/gallery/image-detail/image-detail-modal.tsx) | JSX 재배치 + AnnotationToolbar/LabelingCanvas import | 765 → 약 680 (-85) |
| [ImageDetailToolbar.tsx](frontend/components/gallery/image-detail/ImageDetailToolbar.tsx) | AnnotationToolbar + CanvasCoordReadout 사용 | 175 → 약 100 (-75) |
| [ImageDetailCanvas.tsx](frontend/components/gallery/image-detail/ImageDetailCanvas.tsx) | LabelingCanvas + useCanvasMouse 사용 | 298 → 약 140 (-160) |
| [image-detail-modal.styles.layout.ts](frontend/components/gallery/image-detail/image-detail-modal.styles.layout.ts) | layout primitives 제거 | 159 → 약 35 (-124) |
| [image-detail-modal.styles.sidebar.ts](frontend/components/gallery/image-detail/image-detail-modal.styles.sidebar.ts) | resizer 제거 + ClassSidebar 슬림 | 197 → 약 175 (-22) |
| [image-detail-modal.styles.canvas.ts](frontend/components/gallery/image-detail/image-detail-modal.styles.canvas.ts) | canvas primitives 제거 | 189 → 약 110 (-79) |
| [use-image-detail-sidebar-state.ts](frontend/features/gallery/image-detail/use-image-detail-sidebar-state.ts) | handleSidebarResizerMouseDown 그대로 유지 (MediaDialogShell 가 호출) | 74 → 동일 |
| `image-detail-modal.utils.ts` | 동일 | 51 |
| 기타 sub-component / hooks | 동일 | - |

**합 추정**: **-545줄 platform** (Phase 1 plan 의 -645 추정에 가까움)

## 4. 마이그 sub-step 분할

큰 PR 이라 두 가지 진행 옵션:

### 4.1 옵션 A — 단일 PR (E1d 1개)

장점: 한 번에 마이그 완료. 시각 회귀 검증을 *완성된 상태* 에서 1번
단점: 단일 PR scope 큼 (~10 파일, ~550줄 변화). 검증 부담 큼. 회귀 시 어느 단계 문제인지 분리 어려움

### 4.2 옵션 B — 3 sub-PR (E1d-1/E1d-2/E1d-3)

- **PR-E1d-1**: Shell layout 만 마이그 (MediaDialogShell)
- **PR-E1d-2**: Toolbar 만 마이그 (AnnotationToolbar + CanvasCoordReadout)
- **PR-E1d-3**: Canvas 마이그 (LabelingCanvas + useCanvasMouse)

장점: 단계별 검증. 회귀 시 분리 명확
단점: 3번 검증 / 중간 상태 (예: shell 만 마이그 + 안쪽은 기존 ImageDetailCanvas) 가 어색할 수 있음

→ **옵션 B 추천** — risk 분산 + 단계별 사용자 시각 spot-check 가능

## 5. 위험

### 5.1 시각 회귀

- 95vw / 100vh-80 정확 매핑 (MediaDialogShell default 와 일치)
- mobile 100vw / 100dvh — MediaDialogShell media.md 분기 동작
- 사이드바 resize drag 동작 (handleSidebarResizerMouseDown 그대로)
- TopRightGroup (현재 platform-only) 와 AnnotationToolbar 의 trailing slot 충돌 가능 — 검증 필요
- CoordReadout 위치 변화 (toolbar 안 leading → toolbar 위 canvas 아래) — UX 검토 spot-check 필요

### 5.2 기능 회귀

- 키보드 navigation (좌/우 / Esc): MediaDialogShell 가 Esc 처리하나? — *현재 안 함*. caller 가 별도 keyup 리스너 필요. ImageDetailModal 의 onClose 가 onKeyDown(Escape) 으로도 호출되도록 확인
- group 이미지 swipe (mobile) — onTouchStart/End forward 통해 동작
- context menu 우클릭 — onContextMenu forward
- 사이드바 mobile show/hide — ImageDetailSidePanel 자체에서 처리, MediaDialogShell 영향 0
- delete dialog — extras slot 안 sibling 으로 표시
- LabelingCanvas 가 image group nav UI 슬롯 노출 — floatingOverlays 안 PatternTabBar 가 z-index 적정
- useCanvasMouse hit-test — 현재 platform 의 12px padding 동일 default

### 5.3 새 회귀 거리

- LabelingCanvas 가 `imageAspect` controlled — caller (platform) 가 setImageAspectFromLoad 로 업데이트 중 (기존 동작 유지)
- ZoomWrap 의 will-change 제거 (PR fix 10306c7) — 시각 회귀 spot-check 필요. zoom 시 label crisp 유지

## 6. 검증 절차

각 sub-PR 마다:
1. ui rebuild (변경 없음, 단 sync 확인)
2. platform typecheck
3. platform dev server → 갤러리 이미지 클릭 → modal 정상 동작
   - keyboard: 좌/우 nav / Esc 닫기
   - sidebar resize drag
   - mobile sidebar toggle (responsive)
   - context menu 우클릭
   - delete dialog 트리거
   - group images swipe (mobile)
   - zoom in/out (휠 + 버튼)
   - bbox/point/classification 모드 토글
   - 라벨 클래스 변경 (PR-E1a 의 patten — 선택된 bbox 만)
4. 시각 spot-check: 양 mode (dark / light)

## 7. 다음 단계

사용자 옵션 A/B 선택 후:
- 옵션 A: 단일 PR sub-plan 으로 진행
- 옵션 B 추천: PR-E1d-1 sub-plan 부터 작성 → 구현
