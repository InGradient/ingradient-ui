import React from 'react'
import styled from 'styled-components'
import { SyncStatusChip, type SyncState } from '../../components/feedback/sync-status-chip'
import { GroupCountBadge } from '../../components/feedback/group-count-badge'
import { MediaOverlay } from '../../components/feedback/media-overlay'
import { KebabIcon } from '../../components/icons/catalog-icons'

const Card = styled.div<{ $selected: boolean }>`
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  background: var(--ig-color-surface-muted);
  border: 2px solid transparent;
  border-radius: var(--ig-radius-md);
  overflow: hidden;
  cursor: pointer;
  transition: border-color var(--ig-motion-fast), box-shadow var(--ig-motion-fast);
  box-shadow: none;
  &:hover {
    border-color: ${(p) => (p.$selected ? 'transparent' : 'var(--ig-color-image-card-hover-border)')};
  }
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border: 2px solid ${(p) => (p.$selected ? 'var(--ig-color-accent)' : 'transparent')};
    border-radius: inherit;
    pointer-events: none;
    z-index: 4;
  }
`

const Thumb = styled.img<{ $archived: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  filter: ${(p) => (p.$archived ? 'grayscale(1)' : 'none')};
`

const TopRight = styled.div`
  position: absolute;
  top: var(--ig-space-2);
  right: var(--ig-space-2);
  display: flex;
  align-items: center;
  gap: var(--ig-space-1);
  z-index: 2;
`

const OverlayLayer = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  > * {
    pointer-events: auto;
  }
`

const TopLeft = styled.div`
  position: absolute;
  top: var(--ig-space-2);
  left: var(--ig-space-2);
  display: flex;
  align-items: center;
  z-index: 2;
`

const OptionButton = styled.button`
  width: 18px;
  height: 18px;
  padding: 0;
  border: none;
  border-radius: 6px;
  background: var(--ig-color-image-option-bg);
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  transition: background var(--ig-motion-fast);
  &:hover {
    background: var(--ig-color-image-option-bg-hover);
  }
`

const Footer = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: var(--ig-space-3);
  background: linear-gradient(to top, rgba(0, 0, 0, 0.55), transparent);
  color: #ffffff;
  font-size: var(--ig-font-size-xs);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  pointer-events: none;
`

export interface GalleryImageCardImage {
  id: string
  name: string
  thumb_url: string
  sync_state?: SyncState
  archived?: boolean
  processing?: boolean
  group_count?: number
}

export interface GalleryImageCardProps {
  image: GalleryImageCardImage
  selected?: boolean
  showName?: boolean
  showKebab?: boolean
  onSelect?: (id: string, e: React.MouseEvent) => void
  onOpen?: (id: string) => void
  onOpenMenu?: (id: string, anchor: HTMLElement) => void
  onContextMenu?: (image: GalleryImageCardImage, event: React.MouseEvent) => void
  onDragStart?: (image: GalleryImageCardImage, event: React.DragEvent) => void
  renderOverlay?: (image: GalleryImageCardImage) => React.ReactNode
  renderTopRight?: (image: GalleryImageCardImage) => React.ReactNode
}

export function GalleryImageCard({
  image, selected = false, showName = false, showKebab = true,
  onSelect, onOpen, onOpenMenu, onContextMenu, onDragStart, renderOverlay, renderTopRight,
}: GalleryImageCardProps) {
  const menuBtnRef = React.useRef<HTMLButtonElement>(null)
  const groupCount = image.group_count ?? 0
  const overlay = renderOverlay?.(image)
  const topRight = renderTopRight?.(image)
  return (
    <Card
      $selected={selected}
      draggable={!!onDragStart}
      onClick={(e) => (e.metaKey || e.ctrlKey || e.shiftKey ? onSelect?.(image.id, e) : onOpen?.(image.id))}
      onContextMenu={(e) => onContextMenu?.(image, e)}
      onDragStart={onDragStart ? (e) => onDragStart(image, e) : undefined}
      data-image-id={image.id}
      data-sync-chip-hover-scope="true"
    >
      <Thumb src={image.thumb_url} alt={image.name} loading="lazy" $archived={Boolean(image.archived)} />
      {overlay ? <OverlayLayer>{overlay}</OverlayLayer> : null}
      <TopRight>
        {topRight}
        {image.sync_state ? (
          <SyncStatusChip
            state={image.sync_state}
            variant="opaque"
            showDot={false}
            collapseUntilHover
          />
        ) : null}
        {showKebab ? (
          <OptionButton
            ref={menuBtnRef}
            aria-label={`Open menu for ${image.name}`}
            onClick={(e) => {
              e.stopPropagation()
              if (menuBtnRef.current) onOpenMenu?.(image.id, menuBtnRef.current)
            }}
          >
            <KebabIcon size={14} />
          </OptionButton>
        ) : null}
      </TopRight>
      {groupCount > 1 ? <TopLeft><GroupCountBadge count={groupCount} /></TopLeft> : null}
      {showName ? <Footer title={image.name}>{image.name}</Footer> : null}
      {image.archived ? <MediaOverlay variant="archived" /> : null}
      {image.processing ? <MediaOverlay variant="processing" /> : null}
    </Card>
  )
}
