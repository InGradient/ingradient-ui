---
title: Phase 14.2 — Images modal labeling 중복 chrome 정리 + 재설계
purpose: ImagesView modal 안 BBoxCanvasView 사용 시 chrome (header buttons / hint / toolbar) 가 두 컴포넌트에서 동시에 렌더되어 중복 — modal 이 chrome 소유, BBoxCanvas 는 canvas only 로 재설계
audience: ingradient-ui contributor
date: 2026-05-21
status: draft
related:
  - ./edge-pages-phase-7-spec.md
  - ./edge-pages-phase-14-1-spec.md
---

# Phase 14.2 — Images modal labeling 중복 chrome 정리

> Phase 14.1 에서 ImagesView 의 modal layout 을 정확 재현하고 BBoxCanvasView 를 modal canvas 로 사용했더니, BBoxCanvasView 가 가진 자체 chrome 과 modal 의 chrome 이 동시에 보이는 **중복** 발생. 본 phase 가 정리.

---

## 1. 현재 중복 (사용자 확인)

`WorkspaceImagesModalLabeling` 시나리오에서 보이는 중복:

| 영역 | ImagesView modal | BBoxCanvasView | 결과 |
|---|---|---|---|
| 상단 | `ModalCloseBtn` (close) | `AnnotationToggleBtn` (Eye/EyeOff) + `FullscreenBtn` (Maximize/Minimize) | 2줄 — modal header 1줄 + canvas 우상단 floating 1줄 |
| 힌트 | `ModalHint` | `HintOverlay` | 2개 동일한 "drag to draw a bbox" |
| 하단 | `ModalBBoxToolbar` (Cursor/BBox 토글) | `Toolbar` (Save / Skip / BBoxCount / Reset) | 2줄 — 도구 버튼 + skip/save 버튼 |

---

## 2. 책임 재정의

### 2.1 결정 — modal 이 chrome 소유

`BBoxCanvasView` 가 modal 안에 들어갈 때는 **canvas + bboxes + handles + drawing preview 만** 렌더. chrome (toggle / fullscreen / hint / toolbar / close) 는 **ImagesView modal 이 완전 소유**.

### 2.2 modal chrome 재설계

```
┌─ ModalHeader ────────────────────────────────────────────────┐
│  Eye    Fullscreen          Filename               Close      │
└──────────────────────────────────────────────────────────────┘
┌─ ModalBBoxCanvasWrap ────────────────────────────────────────┐
│                                                              │
│        [ Canvas + bboxes + handles ]                         │
│                                                              │
└──────────────────────────────────────────────────────────────┘
   Hint (single line)
┌─ ModalBBoxToolbar ───────────────────────────────────────────┐
│  Cursor   BBox                                  · X bbox     │
└──────────────────────────────────────────────────────────────┘
```

- 상단: `Eye | Fullscreen | ⠀ filename ⠀ | Close` — 한 줄
- 캔버스: BBoxCanvasView 가 canvas 만 그림 (자체 chrome 모두 숨김)
- 힌트: 한 줄 ModalHint
- 하단: `Cursor | BBox | spacer | bbox count` — 한 줄

---

## 3. 변경 사항

### 3.1 `packages/edge-pages/src/labeling/types.ts`

`BBoxCanvasViewProps` 에 새 prop 추가:

```ts
export interface BBoxCanvasViewProps {
  // ... 기존 ...
  /** floatingOverlays 의 AnnotationToggleBtn + FullscreenBtn 숨김. modal 안에서 사용 시 true. */
  hideOverlayControls?: boolean
  /** annotations 표시 여부 — 외부에서 제어 (modal 의 Eye 버튼이 controlled). undefined 면 view 안 state. */
  annotationsVisible?: boolean
  onAnnotationsVisibleChange?: (visible: boolean) => void
}
```

### 3.2 `packages/edge-pages/src/labeling/BBoxCanvasView.tsx`

```tsx
{!hideOverlayControls && (
  <>
    <AnnotationToggleBtn ... />
    <FullscreenBtn ... />
  </>
)}
```

`annotationsVisible` controlled / uncontrolled 처리.

### 3.3 `packages/edge-pages/src/images/types.ts`

`ImagesViewProps` 에 modal Eye/Fullscreen 관련 props 추가:

```ts
modalAnnotationsVisible: boolean
onSetModalAnnotationsVisible: (v: boolean) => void
modalIsFullscreen: boolean
onToggleModalFullscreen: () => void

labels: {
  ...
  modal: {
    ...
    showAnnotations: string
    hideAnnotations: string
    enterFullscreen: string
    exitFullscreen: string
    bboxCount: (n: number) => string  // "3 bbox"
  }
}

modalBboxCount: number  // toolbar 의 bbox count 표시
```

### 3.4 `packages/edge-pages/src/images/ImagesView.tsx`

ModalHeader 재구성:
```tsx
<ModalHeader>
  <ModalHeaderLeft>
    <ModalHeaderIconBtn $active={modalAnnotationsVisible} onClick={...}>
      {modalAnnotationsVisible ? <Eye /> : <EyeOff />}
    </ModalHeaderIconBtn>
    <ModalHeaderIconBtn onClick={onToggleModalFullscreen}>
      {modalIsFullscreen ? <Minimize2 /> : <Maximize2 />}
    </ModalHeaderIconBtn>
  </ModalHeaderLeft>
  <ModalHeaderCenter>
    <ModalFilename>{modalActiveImage.label}</ModalFilename>
  </ModalHeaderCenter>
  <ModalCloseBtn ... />
</ModalHeader>
```

(기존 `ModalHeaderSpacer` 40w 를 `ModalHeaderLeft` 로 교체 — 양쪽 width 균형 위해 inline style 로 결정)

ModalBBoxToolbar 에 bbox count 추가:
```tsx
<ModalBBoxToolbar>
  <ModalBBoxToolbarBtn $active={modalEditMode === 'cursor'} ...>
    <MousePointer2 />
  </ModalBBoxToolbarBtn>
  <ModalBBoxToolbarBtn $active={modalEditMode === 'bbox'} ...>
    <Square />
  </ModalBBoxToolbarBtn>
  <ModalToolbarSpacer />
  <ModalBboxCount>{labels.modal.bboxCount(modalBboxCount)}</ModalBboxCount>
</ModalBBoxToolbar>
```

### 3.5 `packages/edge-pages/src/images/ImagesView.styles.ts`

신규 styled 추가:
```ts
export const ModalHeaderLeft = styled.div`
  display: flex;
  gap: 8px;
  width: 92px; /* width 균형 (Close 40 + 좌측 2 buttons 보다 약간 넓게) */
  flex-shrink: 0;
`

export const ModalHeaderIconBtn = styled.button<{ $active?: boolean }>`
  flex-shrink: 0;
  width: 40px; height: 40px;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: var(--ig-radius-xs);
  background: ${(p) => (p.$active ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.5)')};
  color: white;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  &:hover { background: var(--ig-color-white-12); }
`

export const ModalToolbarSpacer = styled.div`
  flex: 1;
`

export const ModalBboxCount = styled.div`
  color: rgba(255,255,255,0.7);
  font-size: var(--ig-font-size-xs);
  padding: 0 8px;
`
```

### 3.6 storybook 갱신

`AppShell.stories.tsx`:
- `IMAGES_LABELS.modal` 에 `showAnnotations` / `hideAnnotations` / `enterFullscreen` / `exitFullscreen` / `bboxCount` 추가
- `BBoxCanvasScene` 에 `hideOverlayControls={true}` 항상 전달 (modal 안에서만 쓰므로) — 또는 별도 prop
- `ImagesContent` 에 새 props 채움 (annotations visible / fullscreen / bbox count)

`LabelingWorkspaceLayout` scenario (Workspace labeling — 모달 아님) 은 BBoxCanvasView 의 자체 chrome 그대로 사용 → `hideOverlayControls` 안 전달 (false default).

---

## 4. 책임 매트릭스

| chrome 요소 | Workspace labeling (모달 X) | Images modal (모달 O) |
|---|---|---|
| Save/Skip/Retry/Reset toolbar | BBoxCanvasView 자체 | 없음 (모달 = 편집만, 저장은 navigate 시) |
| Hint | BBoxCanvasView 의 HintOverlay | ImagesView modal 의 ModalHint |
| Annotations toggle (Eye) | BBoxCanvasView 의 AnnotationToggleBtn | ImagesView modal 의 ModalHeaderIconBtn |
| Fullscreen | BBoxCanvasView 의 FullscreenBtn | ImagesView modal 의 ModalHeaderIconBtn |
| Cursor/BBox 모드 토글 | BBoxCanvasView 의 editMode prop (외부) | ImagesView modal 의 ModalBBoxToolbar |
| BBox count | BBoxCanvasView 의 Toolbar 안 | ImagesView modal 의 ModalBBoxToolbar |
| Close | (없음 — 별도 닫기 없음) | ImagesView modal 의 ModalCloseBtn |

---

## 5. 실행 순서

1. `labeling/types.ts` — `hideOverlayControls`, `annotationsVisible`, `onAnnotationsVisibleChange` 추가
2. `labeling/BBoxCanvasView.tsx` — `hideOverlayControls` 분기 + controlled annotations 지원
3. `images/types.ts` — modal 관련 props + labels 추가
4. `images/ImagesView.styles.ts` — `ModalHeaderLeft` / `ModalHeaderIconBtn` / `ModalToolbarSpacer` / `ModalBboxCount` 신규 styled
5. `images/ImagesView.tsx` — ModalHeader / ModalBBoxToolbar 재구성
6. `stories/.../AppShell.stories.tsx` — labels 확장, ImagesContent props 채우기, BBoxCanvasScene 에 `hideOverlayControls` 추가
7. typecheck + build + storybook build
8. 시각 확인 — WorkspaceImagesModalLabeling 단일 줄 chrome

---

## 6. 검증

| # | 확인 | 기대 |
|---|---|---|
| 1 | typecheck | 0 error |
| 2 | edge-pages build | exit 0 |
| 3 | storybook build | exit 0 |
| 4 | 시각 — WorkspaceImagesModalLabeling | (1) 상단 단일 줄: Eye+Fullscreen 좌측 / 파일명 중앙 / Close 우측 (2) 힌트 단일 줄 (3) 하단 단일 줄: Cursor/BBox 좌측 / bbox count 우측 (4) BBoxCanvas 의 자체 chrome (Eye/Fullscreen/Hint/Toolbar) 보이지 않음 |
| 5 | 시각 — WorkspaceLabelingActive | BBoxCanvas 의 자체 chrome (Save/Skip/Reset toolbar + Eye + Fullscreen + Hint) 정상 표시 — 모달 아니므로 그대로 |
| 6 | 시각 — WorkspaceImagesModalReadOnly | 상단 Eye/Fullscreen 표시 / 하단 toolbar 숨김 (showModalToolbar=false) / hint 숨김 / canvas 에 bbox 표시 |

---

## 7. 리스크

### 7.1 controlled annotations 동작

기존 BBoxCanvasView 는 `annotationsVisible` 을 내부 state 로 관리. controlled prop 추가 시 기존 사용처 (Workspace labeling) 에선 prop 안 전달 → 기존 동작 유지. 모달에선 controlled.

### 7.2 fullscreen API

`useFullscreen` 은 BBoxCanvasView 안에서 사용. 모달이 fullscreen 처리하려면 `wrapRef` 가 modal 전체를 가리켜야. 모달 fullscreen target 결정:
- 옵션 A: `ModalInner` 전체를 fullscreen → BBoxCanvasView 의 자체 fullscreen 비활성, 모달이 직접 처리
- 옵션 B: BBoxCanvasView 가 fullscreen 처리 유지하되 외부 toggle button 으로 트리거

**결정**: A — 모달이 직접 처리. 모달 전체가 fullscreen 으로 가는게 자연스러움 (canvas 만 fullscreen 보단). `useFullscreen` 을 ImagesView 안에서 사용.

### 7.3 bbox count 전달 경로

BBoxCanvasView 의 bbox 상태는 view 내부 state. modal toolbar 에 count 표시하려면 외부로 노출 필요 → 기존 `onBboxesChange` callback 으로 container 가 count 받음. ImagesView container (caller) 가 `modalBboxCount` props 로 전달.

storybook 에선 `BBoxCanvasScene` 안 useState 로 추적 → callback 으로 부모 (ImagesContent) 에 전달.

### 7.4 width 균형

ModalHeaderLeft (Eye+Fullscreen 2 btn = 88px + gap) vs ModalCloseBtn (40px) — 좌우 비대칭. 가독성 위해 `ModalHeaderLeft` 의 width 를 `40px * 2 + gap` 로 고정, Close 우측은 좌측 정렬 보정 위해 spacer 추가 또는 기본 정렬. 시각 검증 후 조정.

---

## 8. 종료 후 상태

- Modal 안 BBoxCanvasView 는 "canvas only" — chrome 없음
- Modal 이 단일 줄 chrome (상단 / 힌트 / 하단) 소유
- Workspace labeling (모달 X) 은 기존 그대로 동작
- 사용자가 본 중복 3가지 (상단 / 힌트 / 하단) 모두 해소

---

## 9. 다음 액션

1. 본 spec ok
2. 실행 (§5 의 8 step)
3. 검증 (§6 의 6 step)
