import React from 'react'
import styled from 'styled-components'
import { useVirtualizer } from '@tanstack/react-virtual'
import { ImageGridCell } from './image-grid-cell'
import type { ImageGridProps } from './image-grid'

const Scroll = styled.div`
  height: 100%;
  overflow-y: auto;
  min-width: 0;
  position: relative;
`

const Inner = styled.div<{ $totalHeight: number }>`
  height: ${(p) => `${p.$totalHeight}px`};
  position: relative;
  width: 100%;
`

const RowWrap = styled.div<{ $top: number; $columns: number; $gap: number }>`
  position: absolute;
  top: ${(p) => `${p.$top}px`};
  left: 0;
  width: 100%;
  display: grid;
  grid-template-columns: ${(p) => `repeat(${p.$columns}, minmax(0, 1fr))`};
  gap: ${(p) => `var(--ig-space-${p.$gap})`};
  padding: 0 var(--ig-space-1);
`

const LoadMoreHint = styled.div`
  text-align: center;
  padding: var(--ig-space-5);
  color: var(--ig-color-text-muted);
  font-size: var(--ig-font-size-xs);
`

export interface VirtualizedImageGridProps<T extends { id: string }> extends ImageGridProps<T> {
  /** TanStack 의 row 추정 높이 (cell aspect-ratio + footer + gap). default 240 */
  estimatedItemHeight?: number
  /** TanStack overscan rows. default 3 */
  overscan?: number
  /** 고정 column 수. default 4 (TanStack row-based 가상화 한계 — auto-fit 안 됨) */
  columns?: number
}

const EMPTY_SELECTION: Set<string> = new Set()

export function VirtualizedImageGrid<T extends { id: string }>(props: VirtualizedImageGridProps<T>) {
  const {
    items,
    getThumbnailUrl,
    columns = 4,
    estimatedItemHeight = 240,
    overscan = 3,
    layout,
    onItemClick,
    onItemDoubleClick,
    selectedIds = EMPTY_SELECTION,
    onSelectionChange,
    onDragStart,
    onContextMenu,
    onCellMouseEnter,
    onCellMouseLeave,
    renderCellOverlay,
    renderCellFooter,
    renderCellTopRight,
    hasMore = false,
    onLoadMore,
    isLoadingMore = false,
  } = props

  const parentRef = React.useRef<HTMLDivElement | null>(null)

  const rowCount = Math.ceil(items.length / columns)

  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimatedItemHeight,
    overscan,
  })

  React.useEffect(() => {
    if (!hasMore || !onLoadMore) return
    const virtualRows = virtualizer.getVirtualItems()
    const last = virtualRows[virtualRows.length - 1]
    if (last && last.index >= rowCount - 2) onLoadMore()
  }, [virtualizer, hasMore, onLoadMore, rowCount, items.length])

  const totalHeight = virtualizer.getTotalSize()
  const gap = layout?.gap ?? 6

  return (
    <Scroll ref={parentRef}>
      <Inner $totalHeight={totalHeight}>
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const start = virtualRow.index * columns
          const rowItems = items.slice(start, start + columns)
          return (
            <RowWrap
              key={virtualRow.key}
              $top={virtualRow.start}
              $columns={columns}
              $gap={gap}
            >
              {rowItems.map((item, idx) => (
                <ImageGridCell
                  key={item.id}
                  item={item}
                  index={start + idx}
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
            </RowWrap>
          )
        })}
      </Inner>
      {isLoadingMore ? <LoadMoreHint>Loading…</LoadMoreHint> : null}
    </Scroll>
  )
}
