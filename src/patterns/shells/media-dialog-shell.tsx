import React from 'react'
import {
  MediaDialogBackdrop,
  MediaDialogContent,
  MediaDialogMain,
  MediaDialogOverlay,
  MediaDialogResizer,
  MediaDialogSidebar,
  MediaDialogTopRight,
} from './media-dialog-shell.styles'

export interface MediaDialogShellProps {
  /** Backdrop 클릭 시 호출. 없으면 backdrop click 이 무시됩니다. */
  onClose?: () => void
  /** 메인 영역 — 보통 toolbar + canvas 같은 column layout. */
  main: React.ReactNode
  /** 우측 사이드바 (optional). 없으면 main 만 전체 너비. */
  sidebar?: React.ReactNode
  /** 사이드바 width 픽셀. caller 가 resize state 관리. default 320 */
  sidebarWidth?: number
  /** 사이드바 resize handle mousedown — caller 가 width 계산 + state set. */
  onSidebarResize?: (event: React.MouseEvent<HTMLDivElement>) => void
  /** Content box width override (default 95vw, mobile 100vw). */
  width?: string
  /** Content box height override (default calc(100vh - 80px), mobile 100dvh). */
  height?: string
  /** Absolute layer 자식 (ContextMenu 등) — ModalContent sibling 으로 렌더. */
  overlay?: React.ReactNode
  /** Dialogs / Confirmations sibling — Overlay 외 동일 z-layer. */
  extras?: React.ReactNode
  /** Content box 기준 오른쪽 상단 floating controls. */
  topRight?: React.ReactNode
  /** 추가 핸들러 forward (touch swipe, context menu 등). */
  onContextMenu?: (event: React.MouseEvent<HTMLDivElement>) => void
  onTouchStart?: (event: React.TouchEvent<HTMLDivElement>) => void
  onTouchEnd?: (event: React.TouchEvent<HTMLDivElement>) => void
  /** 추가 className 을 Content 박스에 부여. */
  className?: string
  /** ARIA dialog label */
  ariaLabel?: string
  /** Outer container position. `'fixed'` (default) covers the viewport — production
   *  modal usage. `'absolute'` confines the shell to the nearest positioned ancestor
   *  — Storybook in-card demos, or Workspace-relative embedded usage. */
  positioning?: 'fixed' | 'absolute'
}

const DEFAULT_SIDEBAR_WIDTH = 320

export function MediaDialogShell({
  onClose,
  main,
  sidebar,
  sidebarWidth = DEFAULT_SIDEBAR_WIDTH,
  onSidebarResize,
  width,
  height,
  overlay,
  extras,
  topRight,
  onContextMenu,
  onTouchStart,
  onTouchEnd,
  className,
  ariaLabel,
  positioning = 'fixed',
}: MediaDialogShellProps) {
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return
    onClose?.()
  }

  return (
    <MediaDialogOverlay role="dialog" aria-modal="true" aria-label={ariaLabel} $positioning={positioning}>
      <MediaDialogBackdrop onClick={handleBackdropClick} aria-hidden />
      {overlay}
      <MediaDialogContent
        $width={width}
        $height={height}
        className={className}
        onClick={(event) => event.stopPropagation()}
        onContextMenu={onContextMenu}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {topRight ? <MediaDialogTopRight>{topRight}</MediaDialogTopRight> : null}
        <MediaDialogMain>{main}</MediaDialogMain>
        {sidebar ? (
          <>
            {onSidebarResize ? (
              <MediaDialogResizer onMouseDown={onSidebarResize} aria-hidden />
            ) : null}
            <MediaDialogSidebar $width={sidebarWidth}>{sidebar}</MediaDialogSidebar>
          </>
        ) : null}
      </MediaDialogContent>
      {extras}
    </MediaDialogOverlay>
  )
}
