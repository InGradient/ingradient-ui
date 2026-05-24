import React from 'react'
import styled from 'styled-components'
import { SelectableGridCell } from '../../components/data-display/selectable-grid-cell'
import { classifySelectionAction, type GridSelectionAction } from '../../components/data-display/use-grid-selection'

const Media = styled.div`
  position: relative;
  aspect-ratio: 1 / 1;
  background: linear-gradient(
      135deg,
      var(--ig-color-image-card-gradient-a) 0%,
      var(--ig-color-image-card-gradient-b) 100%
    ),
    var(--ig-color-surface-interactive);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`

const OverlayLayer = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  > * {
    pointer-events: auto;
  }
`

const TopRightLayer = styled.div`
  position: absolute;
  top: var(--ig-space-3);
  right: var(--ig-space-3);
  display: flex;
  gap: var(--ig-space-2);
`

const Footer = styled.div`
  padding: var(--ig-space-4) var(--ig-space-5);
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-2);
  min-width: 0;
`

export interface ImageGridCellProps<T extends { id: string }> {
  item: T
  index: number
  selected: boolean
  thumbnailUrl: string
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
      <Media>
        <img src={thumbnailUrl} alt="" />
        {overlay ? <OverlayLayer>{overlay}</OverlayLayer> : null}
        {topRight ? <TopRightLayer>{topRight}</TopRightLayer> : null}
      </Media>
      {footer ? <Footer>{footer}</Footer> : null}
    </SelectableGridCell>
  )
}
