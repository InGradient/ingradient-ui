---
title: PR-E1d-1 — platform image-detail-modal Shell 마이그
date: 2026-05-11
parent: docs/plan/pr/5-E1d-platform-image-detail-migration.md
scope: ingradient-platform
status: planning — 사용자 review 대기
---

# PR-E1d-1 — Shell 마이그

## 1. 목적

PR-E1d 의 첫 sub-step. **Shell layout 만** ui MediaDialogShell 사용으로 교체. Toolbar / Canvas 는 그대로 유지 — PR-E1d-2/3 가 후속.

## 2. 변경 매핑

### 2.1 image-detail-modal.tsx JSX 재배치

```tsx
// 이전
<Overlay>
  <Backdrop onClick={handleBackdropClick} aria-hidden />
  <ImageDetailContextMenu ... />
  <ModalContent onClick onContextMenu onTouchStart onTouchEnd>
    <MainArea>
      <ImageDetailToolbar ... />
      <ImageDetailCanvas ... />
    </MainArea>
    <ImageDetailSidePanel ... />
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
    <ImageDetailToolbar ... />
    <ImageDetailCanvas ... />
  </>}
  sidebar={<ImageDetailSidePanel ... />}  {/* resizer 는 panel 에서 제거 */}
  overlay={<ImageDetailContextMenu ... />}
  extras={<ImageDetailDialogs ... />}
  ariaLabel="Image detail"
/>
```

### 2.2 ImageDetailSidePanel 정리

[ImageDetailSidePanel.tsx:91](frontend/components/gallery/image-detail/ImageDetailSidePanel.tsx#L91) 의 `<ClassSidebarResizer onMouseDown={handleSidebarResizerMouseDown} />` 제거 — MediaDialogShell 의 `onSidebarResize` 가 처리.

`handleSidebarResizerMouseDown` prop 도 제거 (caller 가 MediaDialogShell 에 전달).

`<ClassSidebar $width={classSidebarWidth} $mobileVisible={mobileSidebarVisible}>` 도 단순화:
- $width 는 MediaDialogShell 의 sidebar slot wrapper 가 적용 → ClassSidebar 의 width 처리 제거
- 단 mobile 분기 (`$mobileVisible`) + mobile backdrop 은 platform-specific UX 라 유지 — 다만 위치는 sidebar slot 안

→ ClassSidebar 의 width 관련 styled 부분 제거 (-5줄), `<ClassSidebarResizer>` 노드 제거 (-1줄), `handleSidebarResizerMouseDown` prop 제거 (-1줄)

### 2.3 styled 파일 슬림

[image-detail-modal.styles.layout.ts](frontend/components/gallery/image-detail/image-detail-modal.styles.layout.ts):
- `Overlay` (12줄) 제거
- `Backdrop` (7줄) 제거
- `ModalContent` (24줄) 제거
- `MainArea` (7줄) 제거
- 그 외 ModalToolbar / CoordReadout / IconBtn / DangerIconBtn / TopRightGroup / CloseBtn / ImageAndTabsCol / ImageWrap / PatternTabBar / PatternTabBtn 유지 (PR-E1d-2/3 가 처리)

[image-detail-modal.styles.sidebar.ts](frontend/components/gallery/image-detail/image-detail-modal.styles.sidebar.ts):
- `ClassSidebarResizer` (10줄) 제거
- `ClassSidebar` 의 `width` 부분 + flex-shrink 제거 (-6줄). border-left / background / display flex column 등 인접 styled (panel 내부 layout) 유지

## 3. 변경 파일

| 파일 | 변경 | 줄수 |
|---|---|---|
| `image-detail-modal.tsx` | JSX 재배치 + MediaDialogShell import + Overlay/Backdrop/ModalContent/MainArea import 제거 | 765 → 약 705 (-60) |
| `ImageDetailSidePanel.tsx` | ClassSidebarResizer 제거 + handleSidebarResizerMouseDown prop 제거 | 120 → 약 110 (-10) |
| `image-detail-modal.styles.layout.ts` | Overlay/Backdrop/ModalContent/MainArea 제거 | 159 → 약 109 (-50) |
| `image-detail-modal.styles.sidebar.ts` | ClassSidebarResizer 제거 + ClassSidebar width 처리 제거 | 197 → 약 181 (-16) |

**합 추정**: **-136줄 platform**

## 4. backward compat 항목

- `handleBackdropClick` (image-detail-modal.tsx) 가 MediaDialogShell 의 `onClose` 로 매핑. 단 platform 의 handleBackdropClick 은 사이드바 open 상태 / mobile breakpoint 분기 로직 있을 수 있음 → MediaDialogShell 의 단순 onClose 와 정합 검토

확인 필요:
```ts
const handleBackdropClick = (event: React.MouseEvent) => {
  if (event.target === event.currentTarget) onClose()
}
```

→ MediaDialogShell 자체에서 동일 패턴 처리 (`event.target !== event.currentTarget` 차단) — 그대로 동작 예상

- TopRightGroup (현재 ImageDetailToolbar 안 absolute top-right) 가 MediaDialogShell 의 ContentBox 안에서 position 처리 — 본 PR scope (Shell 만) 이라 *ImageDetailToolbar 그대로 유지*. TopRightGroup 의 absolute 위치는 MainArea 안 → 정상 동작

## 5. 위험

- **시각 회귀**: 95vw / 100vh-80 / mobile 100vw 100dvh / border-radius — MediaDialogShell default 와 동일 (이미 platform 의 ModalContent 와 same 패턴으로 정합)
- **사이드바 resize**: handleSidebarResizerMouseDown 그대로 사용. MediaDialogShell 의 onSidebarResize prop 으로 전달
- **mobile sidebar toggle**: `<ClassSidebar $mobileVisible>` 의 media.md 분기 + 백드롭 처리는 panel 자체 유지. 단 MediaDialogShell 안에서도 정상 표시되는지 확인
- **z-index**: Overlay 가 1000 → MediaDialogShell 의 `var(--ig-z-modal)` 와 비교. 동일 또는 인접 — 확인

## 6. 검증 절차

1. ui 변경 없음 (PR-E1c 이미 반영됨)
2. platform `npx tsc --noEmit` (frontend/)
3. platform `npm run dev` → 갤러리 이미지 클릭
   - modal 정상 열림 / 95vw 정확
   - backdrop 클릭 / Esc 키로 닫기
   - 사이드바 resize drag
   - mobile breakpoint 사이드바 토글
   - 우클릭 context menu
   - delete dialog
   - group swipe (mobile)
   - 키보드 좌/우 이미지 nav
4. 시각 spot-check 양 mode (dark / light)

## 7. 후속

PR-E1d-1 완료 후:
- PR-E1d-2 sub-plan 작성 → 구현 (toolbar 마이그)
- PR-E1d-3 sub-plan 작성 → 구현 (canvas 마이그)
