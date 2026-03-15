import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import type { ImageItem } from './types'

// --- styled: 화면 너비에 따라 열 개수 자동, 셀은 균등 분배 (Google Photos 스타일) ---
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 8px;
  padding: 8px 0;
`
const Cell = styled.div<{ $selected?: boolean; $highlighted?: boolean; $showCaption?: boolean }>`
  position: relative;
  min-height: 0;
  border: 2px solid ${(p) => (p.$selected ? 'var(--portal-accent)' : 'rgba(255, 255, 255, 0.1)')};
  border-radius: 10px;
  overflow: visible;
  cursor: pointer;
  background: rgba(9, 13, 18, 0.88);
  box-shadow: ${(p) =>
    p.$highlighted
      ? '0 0 0 1px rgba(255, 191, 92, 0.95), 0 0 0 5px rgba(255, 191, 92, 0.2)'
      : '0 8px 24px rgba(0, 0, 0, 0.18)'};
  &:hover {
    border-color: var(--portal-accent);
  }
  ${(p) =>
    !p.$showCaption
      ? 'aspect-ratio: 1;'
      : `
  display: flex;
  flex-direction: column;
  `}
`
const CellImagePart = styled.div`
  aspect-ratio: 1;
  width: 100%;
  min-height: 0;
  position: relative;
  overflow: hidden;
  border-radius: 4px;
`
const STACK_OFFSET_PX = 1
const STACK_PEEK_PX = 3

const StackWrap = styled.div`
  position: absolute;
  inset: 0;
  overflow: visible;
  border-radius: inherit;
  pointer-events: none;
`
const StackLayer = styled.div<{ $offsetPx: number; $zIndex: number; $isBack: boolean; $isFront: boolean }>`
  position: absolute;
  z-index: ${(p) => p.$zIndex};
  transform: translate(${(p) => p.$offsetPx}px, ${(p) => p.$offsetPx}px);
  border-radius: 6px;
  overflow: hidden;
  background: rgba(9, 13, 18, 0.94);
  display: flex;
  flex-direction: column;
  box-shadow: ${(p) =>
    p.$isBack
      ? '0 2px 8px rgba(0,0,0,0.45), 0 4px 12px rgba(0,0,0,0.25)'
      : '0 1px 4px rgba(0,0,0,0.2)'};
  border: ${(p) => (p.$isBack ? '1px solid rgba(0,0,0,0.3)' : 'none')};
  pointer-events: none;
  /* Front layer is slightly inset so back layers peek out on right and bottom */
  ${(p) =>
    p.$isFront
      ? `top: 0; left: 0; right: ${STACK_PEEK_PX}px; bottom: ${STACK_PEEK_PX}px;`
      : 'inset: 0;'}
`
const StackLayerImagePart = styled.div`
  width: 100%;
  flex: 1;
  min-height: 0;
  overflow: hidden;
`
const StackLayerImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`
const StackLayerCaption = styled.div`
  padding: 4px 6px;
  font-size: 11px;
  color: var(--portal-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background: rgba(9, 13, 18, 0.94);
  line-height: 1.2;
  flex-shrink: 0;
`
const StackSizer = styled.div<{ $hasCaption: boolean }>`
  aspect-ratio: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  pointer-events: none;
  visibility: hidden;
  & > div:first-child {
    flex: 1;
    min-height: 0;
  }
  & > div:last-child {
    height: ${(p) => (p.$hasCaption ? '24px' : '0')};
    flex-shrink: 0;
  }
`
const CellCaption = styled.div`
  padding: 4px 6px;
  font-size: 11px;
  color: var(--portal-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background: rgba(9, 13, 18, 0.94);
  line-height: 1.2;
`
const Thumb = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`
const Sentinel = styled.div`
  height: 1px;
  grid-column: 1 / -1;
`
const LoadMoreRow = styled.div`
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px;
  color: var(--portal-text-muted);
  font-size: 14px;
`
const GridSpinner = styled.span`
  display: inline-block;
  width: 24px;
  height: 24px;
  border: 2px solid rgba(255, 255, 255, 0.12);
  border-top-color: var(--portal-accent);
  border-radius: 50%;
  animation: gridSpin 0.7s linear infinite;
  flex-shrink: 0;
  @keyframes gridSpin {
    to { transform: rotate(360deg); }
  }
`

const HoverPreviewWrap = styled.div.attrs<{
  $left: number
  $top: number
  $width: number
  $height: number
}>((p) => ({
  style: {
    left: `${p?.$left ?? 0}px`,
    top: `${p?.$top ?? 0}px`,
    width: `${p?.$width ?? 0}px`,
    height: `${p?.$height ?? 0}px`,
  },
}))`
  position: fixed;
  z-index: 100;
  pointer-events: none;
  border-radius: 8px;
  overflow: hidden;
  background: rgba(8, 12, 18, 0.96);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
  border: 1px solid var(--portal-border);
  display: flex;
  align-items: center;
  justify-content: center;
`
const HoverPreviewImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.06);
`

// --- VirtualizedImageGrid ---
const CellHoverOverlay = styled.div<{ $visible?: boolean }>`
  position: absolute;
  inset: 0;
  padding: 4px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  z-index: 2;
  pointer-events: none;
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  transition: opacity 0.15s ease;
`
const CellInner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  &:hover ${CellHoverOverlay} {
    opacity: 1;
  }
`
const CellOverlayLeft = styled.div`
  pointer-events: auto;
  display: flex;
  align-items: center;
  justify-content: center;
`
const CellOverlayRight = styled.div`
  pointer-events: auto;
`
const CellPersistentFooter = styled.div`
  position: absolute;
  right: 4px;
  bottom: 4px;
  z-index: 4;
  display: flex;
  align-items: center;
  gap: 4px;
  pointer-events: none;
`
const CellPersistentTopRight = styled.div`
  position: absolute;
  top: 4px;
  right: 4px;
  z-index: 4;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  gap: 4px;
  pointer-events: none;
`
const CellProcessingOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
  pointer-events: none;
`
const GridCellSpinner = styled.span`
  display: inline-block;
  width: 28px;
  height: 28px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: gridCellSpin 0.7s linear infinite;
  @keyframes gridCellSpin {
    to { transform: rotate(360deg); }
  }
`
const CellCheckbox = styled.input.attrs({ type: 'checkbox' })`
  width: 18px;
  height: 18px;
  margin: 0;
  cursor: pointer;
  accent-color: var(--portal-accent);
`

export interface VirtualizedImageGridProps {
  items: ImageItem[]
  selectedIds: Set<string>
  highlightedImageId?: string | null
  onSelectionChange: (action: 'toggle' | 'range' | 'single', id: string, rangeStartId?: string) => void
  onLoadMore: () => void
  hasMore: boolean
  isLoading: boolean
  lastSelectedIndexRef: React.MutableRefObject<number | null>
  onImageDoubleClick?: (item: ImageItem) => void
  thumbOverrideMap?: Record<string, string>
  /** When false, hover-to-enlarge preview is disabled. Default true. */
  enableHoverPreview?: boolean
  /** When true, single click opens edit modal; use Ctrl+click to select. Default false. */
  singleClickToEdit?: boolean
  /** Optional overlay rendered top-right on each cell (e.g. option button). */
  renderCellOverlay?: (item: ImageItem, index: number) => React.ReactNode
  /** Optional always-visible footer rendered at bottom-right on each cell. */
  renderCellFooter?: (item: ImageItem, index: number) => React.ReactNode
  /** Optional always-visible content rendered at top-right on each cell. */
  renderCellPersistentTopRight?: (item: ImageItem, index: number) => React.ReactNode
  /** Optional context menu (right-click) on each cell. */
  onCellContextMenu?: (item: ImageItem, index: number, e: React.MouseEvent) => void
  /** When true, always show selection/option overlay (e.g. when in selection mode). */
  alwaysShowOverlay?: boolean
  /** Image IDs currently being processed (e.g. batch AI detection). Shows spinner overlay on those cells. */
  processingIds?: Set<string>
  /** When true, show file name below each thumbnail in the grid. */
  showFilenameBelow?: boolean
  /** When provided and returns > 1, the cell shows a stacked appearance (max 5 layers). */
  groupCount?: (item: ImageItem) => number
  /** Called when a cell drag starts. Use this to initiate image drag-and-drop between components. */
  onCellDragStart?: (item: ImageItem, selectedIds: Set<string>, e: React.DragEvent<HTMLDivElement>) => void
}

const HOVER_PREVIEW_MAX = 320
const HOVER_PREVIEW_DELAY_MS = 80

export function VirtualizedImageGrid({
  items,
  selectedIds,
  highlightedImageId = null,
  onSelectionChange,
  onLoadMore,
  hasMore,
  isLoading,
  lastSelectedIndexRef,
  onImageDoubleClick,
  thumbOverrideMap,
  enableHoverPreview = true,
  singleClickToEdit = false,
  renderCellOverlay,
  renderCellFooter,
  renderCellPersistentTopRight,
  onCellContextMenu,
  alwaysShowOverlay = false,
  processingIds,
  showFilenameBelow = false,
  groupCount,
  onCellDragStart,
}: VirtualizedImageGridProps) {
  const sentinelRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState<{
    item: ImageItem
    rect: { left: number; top: number; width: number; height: number }
  } | null>(null)
  const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const aspectByIdRef = useRef<Record<string, number>>({})
  const [aspectById, setAspectById] = useState<Record<string, number>>({})

  const handleCellMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, item: ImageItem) => {
      if (!enableHoverPreview) return
      if (leaveTimeoutRef.current) {
        clearTimeout(leaveTimeoutRef.current)
        leaveTimeoutRef.current = null
      }
      const rect = e.currentTarget.getBoundingClientRect()
      setHovered({ item, rect })
    },
    [enableHoverPreview]
  )
  const handleCellMouseLeave = useCallback(() => {
    leaveTimeoutRef.current = setTimeout(() => setHovered(null), HOVER_PREVIEW_DELAY_MS)
  }, [])

  useEffect(() => {
    return () => {
      if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current)
    }
  }, [])

  useEffect(() => {
    if (!hovered) return
    const id = hovered.item.id
    if (aspectByIdRef.current[id]) return
    const w = hovered.item.width ?? 0
    const h = hovered.item.height ?? 0
    if (w > 0 && h > 0) {
      const a = w / h
      aspectByIdRef.current[id] = a
      setAspectById((prev) => (prev[id] ? prev : { ...prev, [id]: a }))
      return
    }
    const src =
      thumbOverrideMap?.[id] ??
      hovered.item.thumb_bbox_url ??
      hovered.item.preview_url ??
      hovered.item.original_url ??
      hovered.item.thumb_url
    if (!src) return
    const img = new window.Image()
    img.onload = () => {
      const a =
        img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 1
      aspectByIdRef.current[id] = a
      setAspectById((prev) => (prev[id] ? prev : { ...prev, [id]: a }))
    }
    img.src = src
  }, [hovered, thumbOverrideMap])

  useEffect(() => {
    if (!hasMore || isLoading) return
    const el = sentinelRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onLoadMore()
      },
      { rootMargin: '200px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [hasMore, isLoading, onLoadMore])

  const handleClick = useCallback(
    (e: React.MouseEvent, item: ImageItem, index: number) => {
      e.preventDefault()
      if (singleClickToEdit && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
        onImageDoubleClick?.(item)
        return
      }
      const prevIndex = lastSelectedIndexRef.current
      lastSelectedIndexRef.current = index
      const action = e.ctrlKey || e.metaKey ? 'toggle' : e.shiftKey ? 'range' : 'single'
      const rangeStartId = e.shiftKey && prevIndex != null ? items[prevIndex]?.id : undefined
      onSelectionChange(action, item.id, rangeStartId)
    },
    [items, onSelectionChange, lastSelectedIndexRef, singleClickToEdit, onImageDoubleClick]
  )

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent, item: ImageItem) => {
      e.preventDefault()
      onImageDoubleClick?.(item)
    },
    [onImageDoubleClick]
  )

  const handleCellContextMenu = useCallback(
    (e: React.MouseEvent, item: ImageItem, index: number) => {
      if (onCellContextMenu) {
        e.preventDefault()
        onCellContextMenu(item, index, e)
      }
    },
    [onCellContextMenu]
  )

  const hoverPreviewSrc =
    hovered &&
    (thumbOverrideMap?.[hovered.item.id] ?? hovered.item.thumb_bbox_url ?? hovered.item.preview_url ?? hovered.item.original_url ?? hovered.item.thumb_url)
  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))
  const aspect =
    hovered != null
      ? (() => {
          const w = hovered.item.width ?? 0
          const h = hovered.item.height ?? 0
          if (w > 0 && h > 0) return w / h
          return aspectById[hovered.item.id] ?? 1
        })()
      : 1
  const previewW =
    hovered != null ? (aspect >= 1 ? HOVER_PREVIEW_MAX : HOVER_PREVIEW_MAX * aspect) : HOVER_PREVIEW_MAX
  const previewH =
    hovered != null ? (aspect >= 1 ? HOVER_PREVIEW_MAX / aspect : HOVER_PREVIEW_MAX) : HOVER_PREVIEW_MAX
  const centerX = hovered != null ? hovered.rect.left + hovered.rect.width / 2 : 0
  const centerY = hovered != null ? hovered.rect.top + hovered.rect.height / 2 : 0
  const margin = 8
  const previewLeft =
    hovered != null
      ? clamp(centerX - previewW / 2, margin, window.innerWidth - previewW - margin)
      : 0
  const previewTop =
    hovered != null
      ? clamp(centerY - previewH / 2, margin, window.innerHeight - previewH - margin)
      : 0

  return (
    <>
      <Grid>
        {items.map((item, index) => (
          <Cell
            key={item.id}
            $selected={selectedIds.has(item.id)}
            $highlighted={highlightedImageId === item.id}
            $showCaption={showFilenameBelow}
            onClick={(e) => handleClick(e, item, index)}
            onDoubleClick={(e) => handleDoubleClick(e, item)}
            onContextMenu={(e) => handleCellContextMenu(e, item, index)}
            onMouseEnter={(e) => handleCellMouseEnter(e, item)}
            onMouseLeave={handleCellMouseLeave}
            draggable={!!onCellDragStart}
            onDragStart={onCellDragStart ? (e) => onCellDragStart(item, selectedIds, e) : undefined}
          >
            {groupCount && groupCount(item) > 1 ? (
              <>
                <StackSizer $hasCaption={showFilenameBelow}>
                  <div />
                  <div />
                </StackSizer>
                <StackWrap>
                  {Array.from({ length: Math.min(groupCount(item), 5) }, (_, i) => {
                    const layers = Math.min(groupCount(item), 5)
                    const offsetPx = (layers - 1 - i) * STACK_OFFSET_PX
                    const src = thumbOverrideMap?.[item.id] ?? item.thumb_bbox_url ?? item.thumb_url
                    const fileName = item.name || item.id || '—'
                    const isFront = i === layers - 1
                    return (
                      <StackLayer
                        key={i}
                        $offsetPx={offsetPx}
                        $zIndex={i}
                        $isBack={offsetPx > 0}
                        $isFront={isFront}
                      >
                        <StackLayerImagePart>
                          {src ? (
                            <StackLayerImg src={src} alt="" loading="lazy" />
                          ) : (
                            <div style={{ width: '100%', height: '100%', background: '#333' }} />
                          )}
                        </StackLayerImagePart>
                        {showFilenameBelow && (
                          <StackLayerCaption title={fileName}>{fileName}</StackLayerCaption>
                        )}
                      </StackLayer>
                    )
                  })}
                </StackWrap>
                <CellImagePart style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10 }}>
                  <CellInner style={{ pointerEvents: 'none', background: 'transparent' }}>
                    <CellHoverOverlay $visible={alwaysShowOverlay} style={{ pointerEvents: 'auto' }}>
                      <CellOverlayLeft onClick={(e) => e.stopPropagation()}>
                        <CellCheckbox
                          checked={selectedIds.has(item.id)}
                          onChange={() => onSelectionChange('toggle', item.id)}
                          onClick={(e) => e.stopPropagation()}
                          aria-label={selectedIds.has(item.id) ? 'Deselect image' : 'Select image'}
                        />
                      </CellOverlayLeft>
                      {renderCellOverlay && (
                        <CellOverlayRight onClick={(e) => e.stopPropagation()}>
                          {renderCellOverlay(item, index)}
                        </CellOverlayRight>
                      )}
                    </CellHoverOverlay>
                    {renderCellFooter && (
                      <CellPersistentFooter>{renderCellFooter(item, index)}</CellPersistentFooter>
                    )}
                    {renderCellPersistentTopRight && (
                      <CellPersistentTopRight>{renderCellPersistentTopRight(item, index)}</CellPersistentTopRight>
                    )}
                  </CellInner>
                </CellImagePart>
                {processingIds?.has(item.id) && (
                  <CellProcessingOverlay aria-hidden>
                    <GridCellSpinner />
                  </CellProcessingOverlay>
                )}
              </>
            ) : (
              <>
                <CellImagePart>
                  <CellInner>
                    {item.thumb_url || item.thumb_bbox_url || thumbOverrideMap?.[item.id] ? (
                      <Thumb src={thumbOverrideMap?.[item.id] ?? item.thumb_bbox_url ?? item.thumb_url!} alt={item.name || item.id} loading="lazy" />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: '#333' }} />
                    )}
                    {processingIds?.has(item.id) && (
                      <CellProcessingOverlay aria-hidden>
                        <GridCellSpinner />
                      </CellProcessingOverlay>
                    )}
                    <CellHoverOverlay $visible={alwaysShowOverlay}>
                      <CellOverlayLeft onClick={(e) => e.stopPropagation()}>
                        <CellCheckbox
                          checked={selectedIds.has(item.id)}
                          onChange={() => onSelectionChange('toggle', item.id)}
                          onClick={(e) => e.stopPropagation()}
                          aria-label={selectedIds.has(item.id) ? 'Deselect image' : 'Select image'}
                        />
                      </CellOverlayLeft>
                      {renderCellOverlay && (
                        <CellOverlayRight onClick={(e) => e.stopPropagation()}>
                          {renderCellOverlay(item, index)}
                        </CellOverlayRight>
                      )}
                    </CellHoverOverlay>
                    {renderCellFooter && (
                      <CellPersistentFooter>{renderCellFooter(item, index)}</CellPersistentFooter>
                    )}
                    {renderCellPersistentTopRight && (
                      <CellPersistentTopRight>{renderCellPersistentTopRight(item, index)}</CellPersistentTopRight>
                    )}
                  </CellInner>
                </CellImagePart>
                {showFilenameBelow && (
                  <CellCaption title={item.name || item.id}>{item.name || item.id || '—'}</CellCaption>
                )}
              </>
            )}
          </Cell>
        ))}
        {hasMore && <Sentinel ref={sentinelRef} />}
        {hasMore && isLoading && (
          <LoadMoreRow aria-label="Loading more">
            <GridSpinner />
            <span>Loading more…</span>
          </LoadMoreRow>
        )}
      </Grid>
      {enableHoverPreview && hovered && hoverPreviewSrc && (
        <HoverPreviewWrap
          $left={previewLeft}
          $top={previewTop}
          $width={previewW}
          $height={previewH}
        >
          <HoverPreviewImg
            src={hoverPreviewSrc}
            alt={hovered.item.name || hovered.item.id}
          />
        </HoverPreviewWrap>
      )}
    </>
  )
}
