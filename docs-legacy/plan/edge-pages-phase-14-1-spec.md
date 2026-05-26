---
title: Phase 14.1 — ImagesView modal layout 정확 재현
purpose: ImagesView 의 image-detail modal 이 edge 실제 동작 (CenterPanel 안 absolute overlay + 둥근 모서리 + ModalBBoxToolbar + ImageViewer 분기) 과 일치하도록 view 보강 + storybook 시나리오 정확 재현
audience: ingradient-ui contributor
date: 2026-05-20
status: draft
related:
  - ./edge-pages-phase-7-spec.md
  - ./edge-pages-phase-14-spec.md
  - ./edge-pages-usage.md
---

# Phase 14.1 — ImagesView modal layout 정확 재현

> Phase 7 (ImagesView 추출) 에서 `modalLabelingContent` 를 단순 slot 으로 받았고, Phase 14 의 storybook 시나리오 `WorkspaceImagesModalLabeling` 이 `position: fixed` 박스로 모달을 그렸음. 사용자 확인 결과 **실제 edge 의 modal 동작과 layout 이 다름** — 본 phase 가 정확히 재현.

---

## 1. 현재 상태와 문제

### 1.1 현재 (Phase 7 + Phase 14)

- `ImagesView` props: `modalGroup` / `modalIdx` / `modalImageSrc` / `modalLabelingContent` (slot) — modal 전체를 caller 가 ReactNode 로 전달
- storybook 시나리오: `position: fixed; inset: 0; rgba(0,0,0,0.92)` + 92% × 92% inner 박스 + close 버튼 + filename header + BBoxCanvasScene

### 1.2 edge 의 실제 modal (확인 결과)

`ingradient-edge/src/frontend/components/capture/ImagesView.tsx` line 1066-1205 + `ImagesView.styles.ts` line 125-234:

```css
ModalOverlay {
  position: absolute;        /* ← fixed 아님 */
  inset: 0;
  background: rgba(0, 0, 0, 0.92);
  z-index: 100;
  border-radius: inherit;    /* 부모 CenterPanel 의 20px 라운드 따라감 */
}
ModalInner {
  flex column, padding: 10/12/14, gap: 8;
}
ModalHeader {
  row: [ModalHeaderSpacer 40w | ModalHeaderCenter filename | ModalCloseBtn 40w]
}
ModalBBoxCanvasWrap {
  flex: 1; (BBoxCanvas 의 컨테이너)
}
ModalHint { 작은 안내 텍스트 }
ModalBBoxToolbar {
  background: rgba(0,0,0,0.55);
  border-radius: 0 0 12px 12px;
  cursor / bbox 토글 버튼 2개
}
```

`ImagesWrapper` 는 `position: relative` — `ModalOverlay` 의 absolute reference.

### 1.3 차이점 4가지

| 항목 | 현재 (잘못) | edge 실제 |
|---|---|---|
| position | `fixed` (viewport 전체) | `absolute` (ImagesView 영역만) |
| border-radius | 12px 평면 | `inherit` (부모 panel 의 둥근 모서리) |
| 모달 toolbar | 없음 (또는 BBoxCanvas 자체 toolbar) | 하단 `ModalBBoxToolbar` (cursor / bbox 토글) |
| 비편집 모드 | 없음 | `<ImageViewer>` (`@ingradient/ui/components`) 사용 |

결과: 현재는 **viewport 전체** 가 검게 덮이는데, edge 는 **CenterPanel 안 영역만** 검게 — 사이드패널 (LogPanel / RightPanel) + chrome (TitleBar / TopBar / BottomBar) 은 그대로 보임. 둥근 모서리도 그대로 유지.

---

## 2. 해결 방향

### 2.1 책임 이동 — slot → view 내부

현재 caller 가 모달 전체를 만들어 slot 으로 전달 → caller 가 잘못 만들기 쉬움 (Phase 14 가 증거).

**ImagesView 가 modal 의 layout (Overlay/Inner/Header/Toolbar) 을 직접 책임**. caller 는 다음만 결정:
- modal 열림 여부 (`modalGroup` non-null)
- 활성 이미지 src + filename
- canvas 또는 ImageViewer 선택 (props 로)
- toolbar mode (`modalEditMode` + setter)
- close / navigation handler

### 2.2 props 시그니처 변경

```ts
export interface ImagesViewProps {
  // ... 기존 props ...

  // ─ Modal 관련 (변경) ─
  modalOpen: boolean                                  // = modalGroup !== null
  modalActiveImage: ImageItem | null
  modalImageSrc: string | null
  modalEditMode: 'cursor' | 'bbox'

  /** BBoxCanvas (편집 가능) 또는 ImageViewer (편집 불가). View 가 ModalBBoxCanvasWrap 안에 mount. */
  modalCanvasContent?: ReactNode
  /** 편집 모드일 때 ModalHint 텍스트. null/undefined 이면 hint 숨김. */
  modalHintText?: string | null
  /** ModalBBoxToolbar 표시 여부 (편집 가능 시에만 true) */
  showModalToolbar: boolean

  // 모달 액션
  onCloseModal: () => void
  onSetModalEditMode: (mode: 'cursor' | 'bbox') => void
  onModalSwipeNavigate?: (delta: number) => void      // ±1 (touch swipe)

  // ─ 제거되는 prop ─
  // modalLabelingContent — 이제 modalCanvasContent + view 내부 layout 으로 대체
  // modalGroup, modalIdx — modalOpen + modalActiveImage 로 단순화
}
```

### 2.3 ImagesView 의 내부 modal JSX (추가)

```tsx
{modalOpen && modalActiveImage && (
  <ModalOverlay onClick={onCloseModal} onTouchStart={...} onTouchEnd={...}>
    <ModalInner onClick={(e) => e.stopPropagation()}>
      <ModalHeader>
        <ModalHeaderSpacer />
        <ModalHeaderCenter>
          <ModalFilename title={modalActiveImage.label}>
            {modalActiveImage.label}
          </ModalFilename>
        </ModalHeaderCenter>
        <ModalCloseBtn onClick={onCloseModal}>
          <X size={18} />
        </ModalCloseBtn>
      </ModalHeader>
      <ModalBBoxCanvasWrap>
        {modalCanvasContent}
      </ModalBBoxCanvasWrap>
      {modalHintText && <ModalHint>{modalHintText}</ModalHint>}
      {showModalToolbar && (
        <ModalBBoxToolbar>
          <ModalBBoxToolbarBtn
            $active={modalEditMode === 'cursor'}
            onClick={() => onSetModalEditMode('cursor')}
            title={labels.modal.cursorMode}
          >
            <MousePointer2 size={16} />
          </ModalBBoxToolbarBtn>
          <ModalBBoxToolbarBtn
            $active={modalEditMode === 'bbox'}
            onClick={() => onSetModalEditMode('bbox')}
            title={labels.modal.bboxMode}
          >
            <Square size={16} />
          </ModalBBoxToolbarBtn>
        </ModalBBoxToolbar>
      )}
    </ModalInner>
  </ModalOverlay>
)}
```

### 2.4 ImagesView labels 보강

```ts
export interface ImagesViewLabels {
  // ... 기존 ...
  modal: {
    cursorMode: string                                // 'topbar.cursor' / 'Cursor mode'
    bboxMode: string                                  // 'images.drawBbox' / 'Draw bbox'
    hintDraw: string                                  // 'bbox.hintDraw'
    hintNoClass: string                               // 'bbox.hintNoClass'
    hintSelect: string                                // 'bbox.hintSelect'
    close: string                                     // 'modal close' (accessibility)
  }
}
```

### 2.5 `@ingradient/ui` 활용

edge 의 비편집 모달은 `<ImageViewer src={...} alt={...} zoomOptions={{ maxZoom: 8 }} />` 사용. ImagesView 가 직접 import 하지 않고 caller 가 `modalCanvasContent` slot 에 `<ImageViewer ...>` 넘기는 방식.

storybook 의 helper 에서 시연:
```tsx
import { ImageViewer } from '@ingradient/ui/components'

// 편집 가능 (object_detection + (isLocal || online))
modalCanvasContent={<BBoxCanvasView ... hideActions hideHint />}

// 비편집 (다른 사용자 라벨 또는 read-only)
modalCanvasContent={<ImageViewer src={modalImageSrc} alt={...} zoomOptions={{ maxZoom: 8 }} />}
```

---

## 3. 변경 파일

### 3.1 수정 (4 file)

#### `packages/edge-pages/src/images/types.ts`
- `ImagesViewProps`: modal 관련 props 재정의 (§2.2)
- `ImagesViewLabels.modal: { cursorMode, bboxMode, hintDraw, hintNoClass, hintSelect, close }`

#### `packages/edge-pages/src/images/ImagesView.tsx`
- modal JSX 추가 (§2.3)
- `modalLabelingContent` prop 제거 → `modalCanvasContent` + view 내부 layout

#### `stories/pages/edge/0.0.1/AppShell.stories.tsx`
- `ImagesDetailModal` helper 컴포넌트 삭제 (이제 view 내부)
- `ImagesContent` 의 props 시그니처 변경 — modalCanvasContent / modalEditMode 등 전달
- `WorkspaceImagesModalLabeling` scenario 가 BBoxCanvas 와 ImageViewer 두 가지 모두 보여주는 sub-scenario 로 (편집 가능 / 불가)

#### `stories/fixtures/edge/0.0.1/sample-images.ts`
- 변경 없음 (재사용)

### 3.2 신규 (0 file)

새 파일 없음 — modal 의 styled (`ModalOverlay` / `ModalInner` / `ModalHeader` / 등) 는 이미 `ImagesView.styles.ts` 에 존재. import 만 하면 됨.

---

## 4. 실행 순서

1. `types.ts` 수정 — modal props 재정의
2. `ImagesView.tsx` 수정 — modal JSX 추가, `modalLabelingContent` → `modalCanvasContent` + view 내부 layout
3. `AppShell.stories.tsx` 수정 — `ImagesDetailModal` 제거, `ImagesContent` props 갱신
4. typecheck + build + storybook build
5. 시각 검증 — WorkspaceImagesModalLabeling 가 ImagesView 영역만 검게 + 사이드패널 / chrome 그대로 보이는지

---

## 5. 검증

| # | 명령 / 확인 | 기대 |
|---|---|---|
| 1 | `npm run build --workspace packages/edge-pages` | exit 0 |
| 2 | `npx tsc --noEmit -p tsconfig.json` | 0 error |
| 3 | `npm run build:storybook` | exit 0 |
| 4 | grep — view 안 금지 import | 0 match |
| 5 | Storybook `WorkspaceImagesModalLabeling` 시각 확인 | (1) ImagesView 영역만 검은 backdrop, TitleBar/TopBar/LogPanel/RightPanel/BottomBar 그대로 보임 (2) CenterPanel 의 둥근 모서리 따라감 (3) 하단에 cursor/bbox toolbar 표시 |
| 6 | story 한 scenario 가 ImageViewer 분기 시연 | `WorkspaceImagesModalReadOnly` 추가 — ImageViewer 사용 모습 |

---

## 6. 성공 기준

- 검증 1~6 통과
- ImagesView 의 modal 이 view 내부에서 자체적으로 layout 처리 (caller 의 책임 축소)
- storybook 의 `WorkspaceImagesModalLabeling` 가 edge 의 실제 화면 (사이드패널 + chrome 유지 + ImagesView 영역만 modal overlay) 과 일치
- 비편집 모드용 `ImageViewer` 분기 시연 시나리오 추가

---

## 7. 리스크

### 7.1 backward-compat 깨짐

`modalLabelingContent` prop 제거 → 기존 caller 가 있다면 변경 필요. 현재 caller 는 storybook 뿐 (Phase 14 의 ImagesContent helper) — 함께 갱신하면 됨. ingradient-edge 측은 Phase 13 까지 아직 마이그레이션 안 됨이라 영향 없음.

### 7.2 view 안 visual-only state vs props

`modalEditMode` 를 view 안 state 로 둘지 (visual-only) props 로 lift 할지.

대응: props 로 lift — storybook 에서 scenario 별로 다른 mode 시연 가능 + 실제 edge 에서 외부 keyboard shortcut (`Square` / `MousePointer2`) 와 연동 필요할 때 유연. (edge 의 ImagesView 도 `modalEditMode` 를 state 로 가지므로 container 가 보관.)

### 7.3 touch swipe 핸들러

`onTouchStart` / `onTouchEnd` 로 위아래 swipe (40px 이상) navigation. view 안 처리 가능 (visual-only) — `onModalSwipeNavigate?: (delta: number) => void` callback 으로 caller 가 결정.

### 7.4 `ImageViewer` zoomOptions 의 prop shape

storybook 에서 사용 시 prop 시그니처 확인 필요. caller 가 알아서 처리하므로 view 영향 없음.

### 7.5 ModalBBoxCanvasWrap 의 `position: relative`

내부 BBoxCanvas 가 absolute overlay (SavingOverlay 등) 사용할 가능성 → ModalBBoxCanvasWrap 이 relative 라 OK (이미 styled 에 `position: relative`).

---

## 8. Rollback

`types.ts` / `ImagesView.tsx` / `AppShell.stories.tsx` 4 파일 git revert. 영향 범위: Phase 7 의 ImagesView 와 Phase 14 의 모달 scenario 만.

---

## 9. 종료 후 상태

- ImagesView 가 modal 의 layout (Overlay / Inner / Header / Toolbar / Hint) 을 자체 처리
- caller 는 canvas content + edit mode + close handler 만 결정
- storybook `WorkspaceImagesModalLabeling` 시나리오가 edge 의 실제 동작과 동일하게 표시
- 신규 `WorkspaceImagesModalReadOnly` 시나리오로 `ImageViewer` 분기도 시연

---

## 10. 다음 액션

1. 본 spec ok
2. 실행 (§4 의 5 step)
3. 검증 (§5 의 6 step)
