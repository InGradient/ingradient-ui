import { useCallback, useLayoutEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { ResizableColumnsLayout, type ResizableColumn } from '@ingradient/ui/components'
import { SurfaceDepthProvider } from '@ingradient/ui/primitives'
import { layoutSizeNumbers, popupSizeNumbers } from '@ingradient/ui/tokens'
import {
  AppShell, AppHeader, PanelsRow, LeftPanel, CenterPanel, RightPanelContainer,
  CapturingBlocker,
} from './MainLayoutView.styles'
import type { MainLayoutViewProps } from './types'

/** Collapsed side panels stay as a usable rail (status dots, class chips), not width 0. */
const COLLAPSED_RAIL = 'calc(var(--ig-control-height-xl) + var(--ig-spacing-8))'
/** Column widths persist like Platform Class Management. */
const COLUMN_STORAGE_KEY = 'ig-edge-workspace-columns'

/**
 * Panels render their own collapsed view (`data-ig-collapsed-panel`). The layout reads it
 * from the DOM so existing consumers keep working without passing collapse state.
 */
function useCollapsedPanel(ref: RefObject<HTMLElement>, side: 'left' | 'right'): boolean {
  const [collapsed, setCollapsed] = useState(false)
  useLayoutEffect(() => {
    const node = ref.current
    if (!node) return
    const check = () => setCollapsed(node.querySelector(`[data-ig-collapsed-panel="${side}"]`) !== null)
    check()
    const observer = new MutationObserver(check)
    observer.observe(node, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-ig-collapsed-panel'] })
    return () => observer.disconnect()
  }, [ref, side])
  return collapsed
}

function MainLayoutViewContent(props: MainLayoutViewProps): JSX.Element {
  const { topBar, leftPanel, centerContent, rightPanel, isCapturing } = props
  const panelsRef = useRef<HTMLDivElement>(null)
  const centerRef = useRef<HTMLDivElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)
  const leftCollapsed = useCollapsedPanel(leftRef, 'left')
  const rightCollapsed = useCollapsedPanel(rightRef, 'right')
  useLayoutEffect(() => {
    leftRef.current?.toggleAttribute('inert', isCapturing)
    rightRef.current?.toggleAttribute('inert', isCapturing)
  }, [isCapturing])
  // Same side-panel geometry as Platform Catalog and Class Management: 320px, 220–480px.
  const columns = useMemo<ResizableColumn[]>(() => {
    const side = {
      width: layoutSizeNumbers.sidePanel,
      resizable: true,
      minWidth: layoutSizeNumbers.sidePanelMin,
      maxWidth: layoutSizeNumbers.sidePanelMax,
      collapsedWidth: COLLAPSED_RAIL,
    }
    return [
      { ...side, collapsed: leftCollapsed },
      { width: 'auto', minWidth: popupSizeNumbers['3xlNarrow'] },
      { ...side, collapsed: rightCollapsed },
    ]
  }, [leftCollapsed, rightCollapsed])
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
        <ResizableColumnsLayout storageKey={COLUMN_STORAGE_KEY} columns={columns}>
          <LeftPanel ref={leftRef}>{leftPanel}</LeftPanel>
          <CenterPanel ref={centerRef}>{centerContent}</CenterPanel>
          <RightPanelContainer ref={rightRef}>{rightPanel}</RightPanelContainer>
        </ResizableColumnsLayout>
      </PanelsRow>
      {isCapturing && <CapturingBlocker aria-hidden />}
    </AppShell>
  )
}

/**
 * Edge uses the same surface rules as Platform: a rounded surface inside another rounded
 * surface is always less rounded than its parent (DESIGN.draft.md §5).
 */
export function MainLayoutView(props: MainLayoutViewProps) {
  return (
    <SurfaceDepthProvider>
      <MainLayoutViewContent {...props} />
    </SurfaceDepthProvider>
  )
}
