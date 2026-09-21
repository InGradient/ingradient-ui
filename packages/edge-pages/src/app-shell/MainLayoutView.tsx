import { useCallback, useLayoutEffect, useRef } from 'react'
import {
  AppShell, AppHeader, PanelsRow, LeftPanel, CenterPanel, RightPanelContainer,
  CapturingBlocker,
} from './MainLayoutView.styles'
import type { MainLayoutViewProps } from './types'

export function MainLayoutView(props: MainLayoutViewProps): JSX.Element {
  const { topBar, leftPanel, centerContent, rightPanel, isCapturing } = props
  const panelsRef = useRef<HTMLDivElement>(null)
  const centerRef = useRef<HTMLDivElement>(null)
  const pointerFocusRef = useRef(false)
  const revealWorkspace = useCallback(() => {
    const panels = panelsRef.current
    const center = centerRef.current
    if (!panels || !center || panels.scrollWidth <= panels.clientWidth) return
    const active = document.activeElement
    if (panels.contains(active) && !center.contains(active)) return
    // Reveal the whole center, including when keyboard focus returns from a side
    // panel. Pointer activation must not move its target between down and up.
    panels.scrollLeft += center.getBoundingClientRect().left - panels.getBoundingClientRect().left
      - parseFloat(getComputedStyle(panels).paddingLeft || '0')
  }, [])
  useLayoutEffect(() => {
    const panels = panelsRef.current
    if (!panels) return
    revealWorkspace()
    const observer = new ResizeObserver(revealWorkspace)
    observer.observe(panels)
    const restoreAfterFullscreen = () => {
      if (!document.fullscreenElement) revealWorkspace()
    }
    document.addEventListener('fullscreenchange', restoreAfterFullscreen)
    return () => {
      observer.disconnect()
      document.removeEventListener('fullscreenchange', restoreAfterFullscreen)
    }
  }, [revealWorkspace])
  return (
    <AppShell>
      <AppHeader ref={(node) => node?.toggleAttribute('inert', isCapturing)}>{topBar}</AppHeader>
      {/* A named non-landmark scroll group preserves child landmarks. Scrolling
          stays keyboard-accessible during capture; actionable children stay inert. */}
      <PanelsRow ref={panelsRef} role="group" aria-label="Workspace panels" tabIndex={0}
        onPointerDownCapture={() => { pointerFocusRef.current = true }}
        onPointerUpCapture={() => { pointerFocusRef.current = false }}
        onPointerCancelCapture={() => { pointerFocusRef.current = false }}
        onFocusCapture={(event) => {
          // Moving a pointer-focused control between down/up would swallow its
          // click (notably fullscreen after visiting a side panel at 768px).
          if (pointerFocusRef.current) { pointerFocusRef.current = false; return }
          if (centerRef.current?.contains(event.target)) revealWorkspace()
          else if (event.target !== event.currentTarget) {
            // Native focus scrolling can leave a side-panel action partly clipped.
            event.target.scrollIntoView({ block: 'nearest', inline: 'nearest' })
          }
        }}>
        <LeftPanel ref={(node) => node?.toggleAttribute('inert', isCapturing)}>{leftPanel}</LeftPanel>
        <CenterPanel ref={centerRef}>{centerContent}</CenterPanel>
        <RightPanelContainer ref={(node) => node?.toggleAttribute('inert', isCapturing)}>{rightPanel}</RightPanelContainer>
      </PanelsRow>
      {isCapturing && <CapturingBlocker aria-hidden />}
    </AppShell>
  )
}
