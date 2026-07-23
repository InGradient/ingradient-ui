import React from 'react'
import { Stack } from '../../primitives'
import { SelectableGridCell } from '../../components/data-display/selectable-grid-cell'
import { AspectRatioImage } from '../../components/data-display/aspect-ratio-image'
import type { AspectRatio } from '../../components/data-display/aspect-ratio-image'
import { OverlayLayer } from '../../components/data-display/overlay-layer'
import { classifySelectionAction, type GridSelectionAction } from '../../components/data-display/use-grid-selection'

const TOP_RIGHT_STYLE = {
  position: 'absolute' as const,
  top: 'var(--ig-space-3)',
  right: 'var(--ig-space-3)',
  display: 'flex' as const,
  gap: 'var(--ig-space-2)',
}

const FOOTER_STYLE = {
  padding: 'var(--ig-space-4) var(--ig-space-5)',
  minWidth: 0,
}

export interface ImageGridCellProps<T extends { id: string }> {
  item: T
  index: number
  selected: boolean
  thumbnailUrl: string
  aspectRatio?: AspectRatio
  onItemClick?: (item: T, index: number, event: React.MouseEvent) => void
  onItemDoubleClick?: (item: T, index: number, event: React.MouseEvent) => void
  onSelectionChange?: (action: GridSelectionAction, id: string, index: number) => void
  onDragStart?: (item: T, index: number, event: React.DragEvent) => void
  onContextMenu?: (item: T, index: number, event: React.MouseEvent) => void
  onCellMouseEnter?: (item: T, index: number, event: React.MouseEvent) => void
  onCellMouseLeave?: (item: T, index: number) => void
  renderCellOverlay?: (item: T, index: number) => React.ReactNode
  renderCellFooter?: (item: T, index: number) => React.ReactNode
  renderCellTopRight?: (item: T, index: number) => React.ReactNode
}

export function ImageGridCell<T extends { id: string }>(props: ImageGridCellProps<T>) {
  const {
    item,
    index,
    selected,
    thumbnailUrl,
    aspectRatio,
    onItemClick,
    onItemDoubleClick,
    onSelectionChange,
    onDragStart,
    onContextMenu,
    onCellMouseEnter,
    onCellMouseLeave,
    renderCellOverlay,
    renderCellFooter,
    renderCellTopRight,
  } = props

  const handleClick = (event: React.MouseEvent) => {
    if (onSelectionChange) {
      onSelectionChange(classifySelectionAction(event), item.id, index)
    }
    onItemClick?.(item, index, event)
  }

  const overlay = renderCellOverlay?.(item, index)
  const topRight = renderCellTopRight?.(item, index)
  const footer = renderCellFooter?.(item, index)

  return (
    <SelectableGridCell
      selected={selected}
      data-grid-id={item.id}
      draggable={!!onDragStart}
      onClick={handleClick}
      onDoubleClick={(event) => onItemDoubleClick?.(item, index, event)}
      onDragStart={onDragStart ? (event) => onDragStart(item, index, event) : undefined}
      onContextMenu={onContextMenu ? (event) => onContextMenu(item, index, event) : undefined}
      onMouseEnter={onCellMouseEnter ? (event) => onCellMouseEnter(item, index, event) : undefined}
      onMouseLeave={onCellMouseLeave ? () => onCellMouseLeave(item, index) : undefined}
    >
      <AspectRatioImage src={thumbnailUrl} ratio={aspectRatio}>
        {overlay ? <OverlayLayer>{overlay}</OverlayLayer> : null}
        {topRight ? <div style={TOP_RIGHT_STYLE}>{topRight}</div> : null}
      </AspectRatioImage>
      {footer ? <Stack gap={2} style={FOOTER_STYLE}>{footer}</Stack> : null}
    </SelectableGridCell>
  )
}
