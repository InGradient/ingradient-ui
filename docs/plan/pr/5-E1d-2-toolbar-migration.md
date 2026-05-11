---
title: PR-E1d-2 — platform ImageDetailToolbar → ui AnnotationToolbar 마이그
date: 2026-05-11
parent: docs/plan/pr/5-E1d-platform-image-detail-migration.md
scope: ingradient-platform
status: planning — 사용자 review 대기
---

# PR-E1d-2 — Toolbar 마이그

## 1. 목적

PR-E1d 의 두 번째 sub-PR. platform 의 자체 [ImageDetailToolbar.tsx](frontend/components/gallery/image-detail/ImageDetailToolbar.tsx) (175줄, 2 영역: TopRightGroup + ModalToolbar) 를 ui `AnnotationToolbar` + `CanvasCoordReadout` 로 교체.

## 2. 마이그 매핑

### 2.1 ModalToolbar (absolute bottom 영역) → AnnotationToolbar

[ImageDetailToolbar.tsx:126-172](frontend/components/gallery/image-detail/ImageDetailToolbar.tsx#L126-L172):

| 현재 | 마이그 후 |
|---|---|
| `<CoordReadout>` (leading) | **toolbar 밖** — `<CanvasCoordReadout>` 별도 sibling, canvas 와 toolbar 사이 |
| Cursor mode `<IconBtn $active>` | `actions[]` 항목 `{ key: 'cursor', active: mode === 'cursor', onClick, icon: <CursorIcon /> }` |
| Bbox `<IconBtn>` (taskType 분기) | `actions[]` 항목 (taskType 조건 시 push) |
| Point `<IconBtn>` (taskType 분기) | 동일 |
| Classification `<IconBtn>` (taskType 분기) | 동일 |
| Undo `<IconBtn disabled>` | `actions[]` 항목 `{ disabled: !canUndo, ... }` |
| Redo | 동일 |
| Reset | 동일 |
| Delete `<DangerIconBtn>` | `actions[]` 항목 `{ danger: true, disabled: !hasDelete || isDeleting }` |
| Mobile-info `<IconBtn marginLeft: auto className="mobile-info-btn">` | `trailing` slot |

separator 시각 구분 — mode group 과 history group 사이에 `'separator'` 1개.

### 2.2 CoordReadout 위치 변경

**이전**: ImageDetailToolbar 안 leading (`CoordReadout` styled. flex 1 1 0%)
**이후**: ImageDetailCanvas 와 AnnotationToolbar 사이 sibling. `<CanvasCoordReadout>` 컴포넌트.

JSX 변화:
```tsx
// 이전 (mainNode)
<>
  <ImageDetailToolbar ... />          {/* TopRightGroup + ModalToolbar */}
  <ImageDetailCanvas ... />
</>

// 이후
<>
  <TopRightFloatingControls ... />    {/* 분리 — 기존 platform 자체 styled */}
  <ImageDetailCanvas ... />            {/* PR-E1d-3 에서 LabelingCanvas 로 */}
  <CanvasCoordReadout>{coordText}</CanvasCoordReadout>
  <AnnotationToolbar ... />
</>
```

### 2.3 TopRightGroup (absolute 우상단) — 분리 유지

[ImageDetailToolbar.tsx:107-125](frontend/components/gallery/image-detail/ImageDetailToolbar.tsx#L107-L125) 의 `TopRightGroup` (zoom out / zoom in / close) 은 AnnotationToolbar 와 위치 다름. **platform-side 분리 유지**.

옵션:
- **A 추천**: `TopRightFloatingControls.tsx` 같은 별도 작은 컴포넌트로 추출. `IconBtn` 등 styled 는 platform 유지. caller (image-detail-modal.tsx) 가 ImageDetailCanvas 위에 sibling 으로 배치.
- B: 새 컴포넌트 만들지 않고 inline JSX 로 처리.

→ 옵션 A — `TopRightFloatingControls.tsx` 추출. 약 50줄 (3 버튼 + props 타입).

## 3. coord text 계산 — 누구 책임?

[ImageDetailToolbar.tsx:51-71](frontend/components/gallery/image-detail/ImageDetailToolbar.tsx#L51-L71) 의 `renderCoordText` 함수가 selectedBbox/Point/cursor 조합으로 text 생성.

마이그 후: **image-detail-modal.tsx 또는 별도 hook 에서 계산**. CanvasCoordReadout 은 단순 text slot.

→ 작은 helper 함수로 추출 (`features/gallery/image-detail/coord-text.ts`) 또는 ImageDetailToolbar.tsx → ImageDetailToolbarHelpers.ts 같이 분리 가능. 또는 modal.tsx 안 inline `useMemo`.

가장 단순: modal.tsx 안 inline.

## 4. 변경 파일

| 파일 | 변경 |
|---|---|
| `ImageDetailToolbar.tsx` | 175줄 → 약 90줄. AnnotationToolbar 사용 + actions array 구성 + TopRightFloatingControls 분리 호출 |
| (신규) `TopRightFloatingControls.tsx` | TopRightGroup + 3 buttons. 약 50줄 |
| `image-detail-modal.tsx` | mainNode JSX: TopRightFloatingControls 호출 + CanvasCoordReadout 추가 |
| `image-detail-modal.styles.layout.ts` | `ModalToolbar` / `CoordReadout` / `IconBtn` / `DangerIconBtn` 제거 (-50줄). `TopRightGroup` / `CloseBtn` 유지 (TopRightFloatingControls 가 사용) |

**합 추정**: 약 **-100줄 platform** (toolbar 영역만)

## 5. ImageDetailToolbar Props 변경

기존 props 그대로 받지만 내부 구현이 AnnotationToolbar 호출로. ZoomInIcon/ZoomOutIcon/CloseIcon 은 TopRightFloatingControls 로 이동.

CoordReadout 관련 props (`selectedBboxIndex / selectedPointIndex / bboxes / points / liveNorm`) 는 coordText 계산용 — toolbar 가 받지 않고 modal.tsx 가 직접 계산 후 CanvasCoordReadout 에 전달. → ImageDetailToolbar.props 축소.

## 6. 영향 분석

**시각 변화**:
- CoordReadout 위치: toolbar 안 leading → canvas 아래 (toolbar 위) 별도 row
- Toolbar 배경/padding/색: AnnotationToolbar default (rgba(0,0,0,0.55) inline) vs 기존 ModalToolbar (rgba(0,0,0,0.6) absolute) — 비슷하지만 *position 차이* (absolute → inline). canvas 가 toolbar 영역만큼 줄어듦 — 의도된 변화 (이미지가 toolbar 와 안 겹침)
- TopRightGroup: 동일 위치 (platform 유지)

**기능 변화**: 0 (mode toggle / history / delete 모두 actions 로 표현 가능)

## 7. 검증 절차

1. ui rebuild + platform symlink (자동 반영)
2. platform typecheck
3. platform dev server → 이미지 모달 열기
   - 모든 mode 토글 (cursor / bbox / point / classification — taskType 별)
   - undo / redo / reset
   - delete
   - mobile-info 버튼 (responsive)
   - coordReadout 갱신 (cursor 이동 / selected bbox)
   - zoom in/out / close (TopRightFloatingControls)
4. 시각 spot-check 양 mode

## 8. 위험

- 중간. toolbar 위치가 absolute → inline 으로 변화. canvas 영역이 toolbar 만큼 줄어 — 이미지 표시 영역 미세 변화 (이전: 이미지가 toolbar 아래까지 표시 + padding-bottom: 64px 로 가림 / 이후: 이미지 toolbar 위에서 끝)
- AnnotationToolbar 의 inline placement 가 ModalContent 의 column flex 안 마지막 자식으로 배치 — main 영역 height 가 자동 조정됨
- ImageWrap 의 `padding-bottom: 64px` 더 이상 필요 없을 수 있음 — 검증 후 정리

## 9. 다음

PR-E1d-2 완료 후 PR-E1d-3 (Canvas 마이그) sub-plan 작성 → 구현.
