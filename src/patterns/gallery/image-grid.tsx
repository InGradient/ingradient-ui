import React from 'react'
import styled from 'styled-components'
import { ImageGridCell } from './image-grid-cell'
import type { GridSelectionAction } from '../../components/data-display/use-grid-selection'
import { GridContainer } from '../../components/data-display/grid-container'

const Sentinel = styled.div`
  grid-column: 1 / -1;
  height: 1px;
`

const LoadMoreHint = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: var(--ig-space-5);
  color: var(--ig-color-text-muted);
  font-size: var(--ig-font-size-xs);
`

export interface ImageGridLayout {
  minWidth?: number
  columns?: number
  gap?: number
}

export interface ImageGridProps<T extends { id: string }> {
  items: T[]
  getThumbnailUrl: (item: T) => string
  layout?: ImageGridLayout
  onItemClick?: (item: T, index: number, event: React.MouseEvent) => void
  onItemDoubleClick?: (item: T, index: number, event: React.MouseEvent) => void
  selectedIds?: Set<string>
  onSelectionChange?: (action: GridSelectionAction, id: string, index: number) => void
  onDragStart?: (item: T, index: number, event: React.DragEvent) => void
  onContextMenu?: (item: T, index: number, event: React.MouseEvent) => void
  onCellMouseEnter?: (item: T, index: number, event: React.MouseEvent) => void
  onCellMouseLeave?: (item: T, index: number) => void
  highlightedId?: string | null
  renderCellOverlay?: (item: T, index: number) => React.ReactNode
  renderCellFooter?: (item: T, index: number) => React.ReactNode
  renderCellTopRight?: (item: T, index: number) => React.ReactNode
  hasMore?: boolean
  onLoadMore?: () => void
  isLoadingMore?: boolean
}

const EMPTY_SELECTION: Set<string> = new Set()

export function ImageGrid<T extends { id: string }>(props: ImageGridProps<T>) {
  const {
    items,
    getThumbnailUrl,
    layout,
    onItemClick,
    onItemDoubleClick,
    selectedIds = EMPTY_SELECTION,
    onSelectionChange,
    onDragStart,
    onContextMenu,
    onCellMouseEnter,
    onCellMouseLeave,
    highlightedId = null,
    renderCellOverlay,
    renderCellFooter,
    renderCellTopRight,
    hasMore = false,
    onLoadMore,
    isLoadingMore = false,
  } = props

  const sentinelRef = React.useRef<HTMLDivElement | null>(null)
  const rootRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    if (!highlightedId || !rootRef.current) return
    const cell = rootRef.current.querySelector(`[data-grid-id="${CSS.escape(highlightedId)}"]`)
    if (cell) (cell as Element).scrollIntoView({ block: 'center', behavior: 'instant' as ScrollBehavior })
  }, [highlightedId])

  React.useEffect(() => {
    if (!hasMore || !onLoadMore) return
    const node = sentinelRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onLoadMore()
      },
      { rootMargin: '200px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [hasMore, onLoadMore])

  return (
    <GridContainer
      ref={rootRef}
      minWidth={layout?.minWidth ?? 180}
      columns={layout?.columns}
      gap={layout?.gap ?? 6}
    >
      {items.map((item, index) => (
        <ImageGridCell
          key={item.id}
          item={item}
          index={index}
          selected={selectedIds.has(item.id)}
          thumbnailUrl={getThumbnailUrl(item)}
          onItemClick={onItemClick}
          onItemDoubleClick={onItemDoubleClick}
          onSelectionChange={onSelectionChange}
          onDragStart={onDragStart}
          onContextMenu={onContextMenu}
          onCellMouseEnter={onCellMouseEnter}
          onCellMouseLeave={onCellMouseLeave}
          renderCellOverlay={renderCellOverlay}
          renderCellFooter={renderCellFooter}
          renderCellTopRight={renderCellTopRight}
        />
      ))}
      {hasMore ? <Sentinel ref={sentinelRef} aria-hidden /> : null}
      {isLoadingMore ? <LoadMoreHint>Loading…</LoadMoreHint> : null}
    </GridContainer>
  )
}
