import React, { type ReactNode } from 'react'
import styled from 'styled-components'
import { Inline, Text } from '../../primitives'
import { iconSizeNumbers } from '../../tokens/core'
import { GroupCountBadge } from '../feedback/group-count-badge'
import { MediaOverlay } from '../feedback/media-overlay'
import { IconButton } from '../inputs/icon-button'
import { KebabIcon } from '../icons/catalog-icons'

const Card = styled.div<{ $selected: boolean }>`
  position: relative;
  width: 100%;
  aspect-ratio: var(--ig-aspect-landscape);
  background: var(--ig-color-surface-muted);
  border: var(--ig-border-2px) solid ${(p) => (p.$selected ? 'var(--ig-color-image-card-selected-border)' : 'transparent')};
  border-radius: var(--ig-radius-md);
  overflow: hidden;
  cursor: pointer;
  transition: border-color var(--ig-motion-fast), box-shadow var(--ig-motion-fast);
  box-shadow: ${(p) => (p.$selected ? '0 0 0 3px var(--ig-color-image-card-selected-ring)' : 'none')};
  &:hover {
    border-color: ${(p) => (p.$selected ? 'var(--ig-color-image-card-selected-border)' : 'var(--ig-color-image-card-hover-border)')};
  }
`

const THUMB_STYLE = {
  width: '100%',
  height: '100%',
  objectFit: 'cover' as const,
  display: 'block' as const,
}

const TOP_RIGHT_STYLE = {
  position: 'absolute' as const,
  top: 'var(--ig-space-2)',
  right: 'var(--ig-space-2)',
  zIndex: 'var(--ig-z-raised)' as unknown as number,
}

const GROUP_SLOT_STYLE = {
  position: 'absolute' as const,
  top: 'var(--ig-space-2)',
  right: 'var(--ig-space-2)',
  transform: 'translate(12px, -10px)',
  zIndex: 'var(--ig-z-capture)' as unknown as number,
}

const FOOTER_STYLE = {
  position: 'absolute' as const,
  left: 0,
  right: 0,
  bottom: 0,
  padding: 'var(--ig-space-3)',
  background: 'linear-gradient(to top, var(--ig-color-overlay-strong), transparent)',
  color: 'var(--ig-color-on-accent)',
  overflow: 'hidden' as const,
  textOverflow: 'ellipsis' as const,
  whiteSpace: 'nowrap' as const,
  pointerEvents: 'none' as const,
}

export interface ImageCardImage {
  id: string
  name: string
  thumb_url: string
  archived?: boolean
  processing?: boolean
  group_count?: number
}

export interface ImageCardProps {
  image: ImageCardImage
  selected?: boolean
  showName?: boolean
  showKebab?: boolean
  /** 우상단 슬롯 (kebab 좌측). sync 상태 칩 등을 외부 도메인에서 주입 */
  topRightSlot?: ReactNode
  onSelect?: (id: string, e: React.MouseEvent) => void
  onOpen?: (id: string) => void
  onOpenMenu?: (id: string, anchor: HTMLElement) => void
}

export function ImageCard({
  image, selected = false, showName = false, showKebab = true,
  topRightSlot,
  onSelect, onOpen, onOpenMenu,
}: ImageCardProps) {
  const menuBtnRef = React.useRef<HTMLButtonElement>(null)
  const groupCount = image.group_count ?? 0
  return (
    <Card
      $selected={selected}
      onClick={(e) => (e.metaKey || e.ctrlKey || e.shiftKey ? onSelect?.(image.id, e) : onOpen?.(image.id))}
      data-image-id={image.id}
    >
      <img src={image.thumb_url} alt={image.name} loading="lazy" style={THUMB_STYLE} />
      <Inline gap={1} style={TOP_RIGHT_STYLE}>
        {topRightSlot}
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
            <KebabIcon size={iconSizeNumbers.sm} />
          </IconButton>
        ) : null}
      </Inline>
      {groupCount > 1 ? <div style={GROUP_SLOT_STYLE}><GroupCountBadge count={groupCount} /></div> : null}
      {showName ? <Text as="div" size="var(--ig-font-size-xs)" title={image.name} style={FOOTER_STYLE}>{image.name}</Text> : null}
      {image.archived ? <MediaOverlay variant="archived" /> : null}
      {image.processing ? <MediaOverlay variant="processing" /> : null}
    </Card>
  )
}
