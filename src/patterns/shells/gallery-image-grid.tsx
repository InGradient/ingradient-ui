import type { DragEvent, MouseEvent, ReactNode } from 'react'
import styled from 'styled-components'
import { Grid } from '../../primitives'
import { GalleryImageCard, type GalleryImageCardImage } from './gallery-image-card'
import { HoverPreview } from './hover-preview'

const GridWrap = styled.div`
  box-sizing: border-box;
  min-height: 100%;
  padding: var(--ig-space-7);
  position: relative;
`

export interface GalleryImageGridProps<T extends GalleryImageCardImage> {
  items: T[]
  selectedIds?: Set<string>
  columns?: string
  minItemWidth?: number
  gap?: number
  padded?: boolean
  hoverItemId?: string | null
  showName?: boolean
  showKebab?: boolean
  onSelect?: (item: T, event: MouseEvent) => void
  onOpen?: (item: T) => void
  onOpenMenu?: (item: T, anchor: HTMLElement) => void
  onContextMenu?: (item: T, event: MouseEvent) => void
  onDragStart?: (item: T, event: DragEvent) => void
  renderOverlay?: (item: T) => ReactNode
  renderTopRight?: (item: T) => ReactNode
  renderHoverPreview?: (item: T) => ReactNode
}

const DEFAULT_MIN_ITEM_WIDTH = 140
const DEFAULT_GAP = 12

export function GalleryImageGrid<T extends GalleryImageCardImage>({
  items,
  selectedIds,
  columns,
  minItemWidth = DEFAULT_MIN_ITEM_WIDTH,
  gap = DEFAULT_GAP,
  padded = false,
  hoverItemId = null,
  showName,
  showKebab,
  onSelect,
  onOpen,
  onOpenMenu,
  onContextMenu,
  onDragStart,
  renderOverlay,
  renderTopRight,
  renderHoverPreview,
}: GalleryImageGridProps<T>) {
  const gridColumns = columns ?? `repeat(auto-fill, ${minItemWidth}px)`
  const grid = (
    <Grid columns={gridColumns} gap={gap}>
      {items.map((item) => {
        const card = (
          <GalleryImageCard
            key={item.id}
            image={item}
            selected={selectedIds?.has(item.id)}
            showName={showName}
            showKebab={showKebab}
            onSelect={(_, event) => onSelect?.(item, event)}
            onOpen={() => onOpen?.(item)}
            onOpenMenu={(_, anchor) => onOpenMenu?.(item, anchor)}
            onContextMenu={(_, event) => onContextMenu?.(item, event)}
            onDragStart={(_, event) => onDragStart?.(item, event)}
            renderOverlay={renderOverlay ? () => renderOverlay(item) : undefined}
            renderTopRight={renderTopRight ? () => renderTopRight(item) : undefined}
          />
        )
        const preview = renderHoverPreview?.(item)
        if (hoverItemId === item.id && preview) {
          return (
            <HoverPreview key={item.id} preview={preview} delay={0} scale={1.06}>
              {card}
            </HoverPreview>
          )
        }
        return card
      })}
    </Grid>
  )
  return padded ? <GridWrap>{grid}</GridWrap> : grid
}
