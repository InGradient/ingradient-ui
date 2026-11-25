import type { MouseEvent } from 'react'
import { ChipTabs, ClosePanelIcon, IconButton, InfoIcon, Spinner, ZoomInIcon, ZoomOutIcon } from '@ingradient/ui/components'
import { LabelingCanvas } from '@ingradient/ui/patterns'
import { iconSizeNumbers } from '@ingradient/ui/tokens'
import { ImageDetailArchivedOverlay } from './image-detail-archived-overlay'
import { ImageDetailMainToolbar } from './image-detail-main-toolbar'
import { CoordReadout, GroupTabsFloat, HiResNotice, LoadingOverlay, MobileOnly, ZoomCloseGroup } from './ImageDetailMainView.styles'
import type { ImageDetailMainViewProps } from './image-detail-main.types'

const ICON_SIZE = iconSizeNumbers.lg

/** Keeps a button press from reaching the canvas mouse handlers behind it. */
const withoutBubbling = (action: () => void) => (event: MouseEvent) => {
  event.stopPropagation()
  action()
}

/**
 * Main area of the image detail modal: the labeling canvas with its zoom and close buttons,
 * loading and archived overlays, group tabs, coordinate readout, and toolbar.
 * Fills the modal's `main` slot. The app owns the image, annotations, zoom, and tool state.
 */
export function ImageDetailMainView({
  canvas, onZoomIn, onZoomOut, onClose, minZoom = 1, coordText,
  loading, hiResLoading, archived, toolbar, mobileInfo, group, viewSwitcherSlot,
}: ImageDetailMainViewProps) {
  return (
    <>
      <ZoomCloseGroup data-ig-component="ImageDetailMainView">
        {mobileInfo ? (
          <MobileOnly>
            <IconButton
              variant={mobileInfo.active ? 'solid' : 'secondary'}
              aria-label="Info & classes"
              title="Info & classes"
              aria-pressed={mobileInfo.active}
              onClick={withoutBubbling(mobileInfo.onToggle)}
            >
              <InfoIcon size={ICON_SIZE} />
            </IconButton>
          </MobileOnly>
        ) : null}
        <IconButton variant="secondary" aria-label="Zoom out" title="Zoom out" disabled={canvas.zoom <= minZoom} onClick={withoutBubbling(onZoomOut)}>
          <ZoomOutIcon size={ICON_SIZE} />
        </IconButton>
        <IconButton variant="secondary" aria-label="Zoom in" title="Zoom in" onClick={withoutBubbling(onZoomIn)}>
          <ZoomInIcon size={ICON_SIZE} />
        </IconButton>
        <IconButton variant="secondary" aria-label="Close" title="Close" onClick={withoutBubbling(onClose)}>
          <ClosePanelIcon size={ICON_SIZE} />
        </IconButton>
      </ZoomCloseGroup>
      <LabelingCanvas
        {...canvas}
        underlays={archived ? <ImageDetailArchivedOverlay /> : null}
        overlays={
          loading ? (
            <LoadingOverlay role="status" aria-label="Loading image"><Spinner tone="white" /></LoadingOverlay>
          ) : hiResLoading ? (
            <HiResNotice role="status"><Spinner size="sm" tone="white" /><span>Loading hi-res…</span></HiResNotice>
          ) : null
        }
        floatingOverlays={
          group ? (
            <GroupTabsFloat ref={group.tabBarRef}>
              <ChipTabs
                ariaLabel="Group images"
                items={group.items}
                currentId={group.currentId}
                onSelect={(item) => group.onSelect(item.id)}
              />
            </GroupTabsFloat>
          ) : viewSwitcherSlot
        }
      />
      <CoordReadout>{coordText}</CoordReadout>
      <ImageDetailMainToolbar {...toolbar} />
    </>
  )
}
