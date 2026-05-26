---
title: PR-E1c — MediaDialogShell Pattern 신규 (image-detail-modal 용)
date: 2026-05-11
parent: docs/plan/pr/5-E1-image-detail-shell.md
scope: ingradient-ui
status: planning — 사용자 review 대기
---

# PR-E1c — MediaDialogShell Pattern

## 1. 목적

PR-E1 phased plan 의 *Phase 1 (ui 추출)* 첫 PR. platform image-detail-modal 의 layout 영역을 ui Pattern 으로 추출. **platform 변경 0** — 본 PR scope.

## 2. 기존 DialogShell 와 구별

ui 에 이미 [DialogShell](src/components/overlays/dialog-shell.tsx) 이 있음. 단 *form-like* 용도 (title + content + actions 푸터). image-detail 의 요구와 안 맞음:

| 측면 | 기존 DialogShell | image-detail 요구 |
|---|---|---|
| 타이틀 | 필수 ReactNode | 없음 (toolbar 가 상단) |
| width | min(720px, 100%) | 95vw |
| height | optional | calc(100vh - 80px) |
| 사이드바 | 없음 | 우측 resize 가능 |
| backdrop | flex center | 동일 (단 위치 sticky) |
| 컨텐츠 | description + children + actions | 자유 layout (toolbar + canvas + sidebar) |

→ 별도 Pattern `MediaDialogShell` 신규. 기존 DialogShell 은 유지 (PR-E11/E12 AddDatasetModal/ExportModal 에서 사용 가능).

## 3. API 설계

```tsx
export interface MediaDialogShellProps {
  /** Backdrop 클릭 시 호출 (보통 close). null/undefined 면 backdrop click 무시. */
  onClose?: () => void
  /** 메인 영역 — 보통 <Toolbar /> + <Canvas /> 같은 column layout */
  main: React.ReactNode
  /** 우측 사이드바 (optional). 없으면 main 만 전체 너비 */
  sidebar?: React.ReactNode
  /** 사이드바 width 픽셀. caller 가 resize state 관리. default 320 */
  sidebarWidth?: number
  /** 사이드바 resize handle mousedown — caller 가 width 계산 + state set */
  onSidebarResize?: (event: React.MouseEvent<HTMLDivElement>) => void
  /** Content box width override (default 95vw, mobile 100vw) */
  width?: string
  /** Content box height override (default calc(100vh - 80px), mobile 100dvh) */
  height?: string
  /** Absolute layer 자식 (ContextMenu 등) — ModalContent sibling 으로 렌더 */
  overlay?: React.ReactNode
  /** Dialogs / Confirmations sibling — ModalContent 외부 동일 z-layer */
  extras?: React.ReactNode
  /** 추가 핸들러 forward (touch swipe, context menu 등) */
  onContextMenu?: (event: React.MouseEvent<HTMLDivElement>) => void
  onTouchStart?: (event: React.TouchEvent<HTMLDivElement>) => void
  onTouchEnd?: (event: React.TouchEvent<HTMLDivElement>) => void
  className?: string
}
```

## 4. 구조

```tsx
<Overlay>                          // position: fixed, inset: 0, z: var(--ig-z-modal)
  <Backdrop onClick={onClose} />   // dim layer
  {overlay}                         // absolute layer (ContextMenu)
  <ModalContent
    onClick={(e) => e.stopPropagation()}   // backdrop 차단
    onContextMenu={onContextMenu}
    onTouchStart={onTouchStart}
    onTouchEnd={onTouchEnd}
  >
    <MainArea>{main}</MainArea>
    {sidebar ? (
      <SidePanelWrap style={{ width: sidebarWidth }}>
        {onSidebarResize ? <Resizer onMouseDown={onSidebarResize} /> : null}
        {sidebar}
      </SidePanelWrap>
    ) : null}
  </ModalContent>
  {extras}
</Overlay>
```

## 5. styled

[image-detail-modal.styles.layout.ts](frontend/components/gallery/image-detail/image-detail-modal.styles.layout.ts) 의 layout primitive 흡수:
- Overlay → `MediaDialogOverlay`
- Backdrop → `MediaDialogBackdrop`
- ModalContent → `MediaDialogContent` (default 95vw / calc(100vh - 80px), mobile 100vw / 100dvh)
- MainArea → 그대로 유지 (column flex, flex:1)
- ClassSidebarResizer → `MediaDialogResizer`
- 그 외 (TopRightGroup / CloseBtn / ImageWrap / ZoomWrap / PatternTabBar / ModalToolbar / IconBtn) 는 *content styles* — 본 PR scope 밖 (platform 유지)

## 6. 파일 분할

| 파일 | 줄수 |
|---|---|
| `src/patterns/shells/media-dialog-shell.tsx` | ~80 |
| `src/patterns/shells/media-dialog-shell.styles.ts` | ~80 |
| `stories/patterns/media-dialog-shell.stories.tsx` | ~150 (variants: with/without sidebar + custom size + overlay/extras) |
| `src/patterns/index.ts` | export 추가 |

## 7. Storybook variants

- **Review**: 기본 형태 (95vw / 100vh-80, sidebar 320, simple mock toolbar+canvas+sidebar 컨텐츠)
- **Without sidebar**: main 만 전체 너비
- **Custom size**: width="80vw" height="80vh"
- **Resizable sidebar**: 실제 resize 동작 (storybook 안 state 관리)
- **With overlay (ContextMenu mock)**: absolute layer 표시 확인
- **With extras (Dialogs mock)**: 외부 layer 표시
- **Mobile**: 윈도우 크기 변경 시 100vw / 100dvh

## 8. 영향 분석

**ui 추가**:
- 본체 + styles + stories ~ 310줄 분산

**platform 변경**: 0 (본 PR). PR-E1d 에서 platform 이 MediaDialogShell 사용 시작

**기존 DialogShell**: 유지. PR-E11/E12 가 활용

## 9. 검증 절차

1. typecheck `npx tsc --noEmit`
2. ui storybook (양 mode):
   - 모든 variants 렌더 정상
   - resize drag 동작 (Resizable sidebar story)
   - backdrop click → onClose 호출
   - overlay/extras 가 z-layer 적절
   - 양 mode a11y "error" 위반 없음
3. storybook tests pass

## 10. 위험

- 낮음. ui 신규 Pattern + 기존 caller 0
- 명명 conflict 회피 (DialogShell vs MediaDialogShell) — 명확한 prefix 로 구분

## 11. 후속

- PR-E1b (AnnotationToolbar) — 다음 sub-PR
- PR-E1a (LabelingCanvas) — 가장 복잡
- PR-E1d (platform 마이그) — Phase 2
