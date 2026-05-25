import React from 'react'
import styled from 'styled-components'
import { SyncStatusChip, type SyncState } from './sync-status-chip'
import { GroupCountBadge } from '../../components/feedback/group-count-badge'
import { MediaOverlay } from '../../components/feedback/media-overlay'
import { IconButton } from '../../components/inputs/icon-button'
import { KebabIcon } from '../../components/icons/catalog-icons'

const Card = styled.div<{ $selected: boolean }>`
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  background: var(--ig-color-surface-muted);
  border: 2px solid ${(p) => (p.$selected ? 'var(--ig-color-image-card-selected-border)' : 'transparent')};
  border-radius: var(--ig-radius-md);
  overflow: hidden;
  cursor: pointer;
  transition: border-color var(--ig-motion-fast), box-shadow var(--ig-motion-fast);
  box-shadow: ${(p) => (p.$selected ? '0 0 0 3px var(--ig-color-image-card-selected-ring)' : 'none')};
  &:hover {
    border-color: ${(p) => (p.$selected ? 'var(--ig-color-image-card-selected-border)' : 'var(--ig-color-image-card-hover-border)')};
  }
`

const Thumb = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
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

const GroupSlot = styled.div`
  position: absolute;
  top: var(--ig-space-2);
  right: var(--ig-space-2);
  transform: translate(12px, -10px);
  z-index: 3;
`


const Footer = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: var(--ig-space-3);
  background: linear-gradient(to top, rgba(0, 0, 0, 0.55), transparent);
  color: var(--ig-color-on-accent);
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
}

export function GalleryImageCard({
  image, selected = false, showName = false, showKebab = true,
  onSelect, onOpen, onOpenMenu,
}: GalleryImageCardProps) {
  const menuBtnRef = React.useRef<HTMLButtonElement>(null)
  const groupCount = image.group_count ?? 0
  return (
    <Card
      $selected={selected}
      onClick={(e) => (e.metaKey || e.ctrlKey || e.shiftKey ? onSelect?.(image.id, e) : onOpen?.(image.id))}
      data-image-id={image.id}
    >
      <Thumb src={image.thumb_url} alt={image.name} loading="lazy" />
      <TopRight>
        {image.sync_state ? <SyncStatusChip state={image.sync_state} variant="opaque" showDot={false} /> : null}
        {showKebab ? (
          <IconButton
            variant="accent"
            size="sm"
            ref={menuBtnRef}
            aria-label={`Open menu for ${image.name}`}
            onClick={(e) => {
              e.stopPropagation()
              if (menuBtnRef.current) onOpenMenu?.(image.id, menuBtnRef.current)
            }}
          >
            <KebabIcon size={14} />
          </IconButton>
        ) : null}
      </TopRight>
      {groupCount > 1 ? <GroupSlot><GroupCountBadge count={groupCount} /></GroupSlot> : null}
      {showName ? <Footer title={image.name}>{image.name}</Footer> : null}
      {image.archived ? <MediaOverlay variant="archived" /> : null}
      {image.processing ? <MediaOverlay variant="processing" /> : null}
    </Card>
  )
}
