import React from 'react'
import styled from 'styled-components'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Text } from '../../primitives'
import { ImageGridCell } from './image-grid-cell'
import type { ImageGridProps } from './image-grid'

const SCROLL_STYLE = {
  height: '100%',
  overflowY: 'auto' as const,
  minWidth: 0,
  position: 'relative' as const,
}

const INNER_BASE_STYLE = { position: 'relative' as const, width: '100%' }

const LOAD_MORE_STYLE = { textAlign: 'center' as const, padding: 'var(--ig-space-5)' }

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
    measureElement: (el) => el.getBoundingClientRect().height,
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
    <div ref={parentRef} style={SCROLL_STYLE}>
      <div style={{ ...INNER_BASE_STYLE, height: totalHeight }}>
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const start = virtualRow.index * columns
          const rowItems = items.slice(start, start + columns)
          return (
            <RowWrap
              key={virtualRow.key}
              ref={virtualizer.measureElement}
              data-index={virtualRow.index}
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
      </div>
      {isLoadingMore ? <Text as="div" tone="muted" size="var(--ig-font-size-xs)" style={LOAD_MORE_STYLE}>Loading…</Text> : null}
    </div>
  )
}
