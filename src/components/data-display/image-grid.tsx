import React from 'react'
import styled from 'styled-components'
import { surfacePanel } from '../../primitives'

const ImageGridRoot = styled.div<{ $minItemWidth: number }>`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(${(p) => `${p.$minItemWidth}px`}, 1fr));
  gap: var(--ig-space-6);
`

const ImageGridCard = styled.button<{ $selected: boolean }>`
  ${surfacePanel}
  width: 100%;
  padding: 0;
  border-radius: var(--ig-radius-2xl);
  overflow: hidden;
  cursor: pointer;
  text-align: left;
  border-color: ${(p) => (p.$selected ? 'var(--ig-color-image-card-selected-border)' : 'var(--ig-color-border-subtle)')};
  box-shadow: ${(p) => (p.$selected ? '0 0 0 2px var(--ig-color-image-card-selected-ring), var(--ig-shadow-panel)' : 'var(--ig-shadow-panel)')};
  transition: transform var(--ig-motion-fast), border-color var(--ig-motion-fast), box-shadow var(--ig-motion-fast), background-color var(--ig-motion-fast);

  &:hover {
    transform: translateY(-1px);
    border-color: var(--ig-color-image-card-hover-border);
  }
`

const ImageGridMedia = styled.div`
  position: relative;
  aspect-ratio: 1 / 1;
  background: linear-gradient(135deg, var(--ig-color-image-card-gradient-a) 0%, var(--ig-color-image-card-gradient-b) 100%), var(--ig-color-surface-interactive);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`

const ImageGridMeta = styled.div`
  padding: var(--ig-space-6);
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-2);
`

const ImageGridTitle = styled.div`
  font-size: var(--ig-font-size-md);
  font-weight: 700;
  color: var(--ig-color-text-primary);
`

const ImageGridDescription = styled.div`
  font-size: var(--ig-font-size-xs);
  line-height: 1.5;
  color: var(--ig-color-text-muted);
`

const ImageGridBadgeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--ig-space-3);
`

export function ImageGrid<T extends { id?: string | number }>({
  items,
  getImageSrc,
  getTitle,
  getDescription,
  getMeta,
  minItemWidth = 180,
  selectedIds = [],
  onItemClick,
}: {
  items: T[]
  getImageSrc: (item: T) => string
  getTitle?: (item: T) => React.ReactNode
  getDescription?: (item: T) => React.ReactNode
  getMeta?: (item: T) => React.ReactNode
  minItemWidth?: number
  selectedIds?: Array<string | number>
  onItemClick?: (item: T) => void
}) {
  const selectedSet = React.useMemo(() => new Set(selectedIds), [selectedIds])

  return (
    <ImageGridRoot $minItemWidth={minItemWidth}>
      {items.map((item, index) => {
        const key = item.id ?? index
        const title = getTitle?.(item)
        const description = getDescription?.(item)
        const meta = getMeta?.(item)
        return (
          <ImageGridCard key={key} type="button" $selected={selectedSet.has(key)} onClick={() => onItemClick?.(item)}>
            <ImageGridMedia>
              <img src={getImageSrc(item)} alt={typeof title === 'string' ? title : 'Image item'} />
            </ImageGridMedia>
            <ImageGridMeta>
              {title ? <ImageGridTitle>{title}</ImageGridTitle> : null}
              {description ? <ImageGridDescription>{description}</ImageGridDescription> : null}
              {meta ? <ImageGridBadgeRow>{meta}</ImageGridBadgeRow> : null}
            </ImageGridMeta>
          </ImageGridCard>
        )
      })}
    </ImageGridRoot>
  )
}
