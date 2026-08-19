import React, { type ReactNode } from 'react'
import styled from 'styled-components'
import { Inline, Text } from '../../primitives'
import { iconSizeNumbers } from '../../tokens/core'
import { GroupCountBadge } from '../feedback/group-count-badge'
import { MediaOverlay } from '../feedback/media-overlay'
import { KebabIcon } from '../icons/catalog-icons'

const OptionButton = styled.button`
  width: var(--ig-icon-lg);
  height: var(--ig-icon-lg);
  padding: 0;
  border: none;
  border-radius: var(--ig-radius-2xs);
  background: var(--ig-color-image-option-bg);
  color: var(--ig-color-on-accent);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background var(--ig-motion-fast);
  &:hover {
    background: var(--ig-color-image-option-bg-hover);
  }
`

const Card = styled.div<{ $selected: boolean }>`
  position: relative;
  width: 100%;
  aspect-ratio: var(--ig-aspect-landscape);
  background: var(--ig-color-surface-muted);
  border: var(--ig-border-2px) solid transparent;
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
    border: var(--ig-border-2px) solid ${(p) => (p.$selected ? 'var(--ig-color-accent)' : 'transparent')};
    border-radius: inherit;
    pointer-events: none;
    z-index: var(--ig-z-capture-high);
  }
  &:focus-visible {
    outline: var(--ig-border-2px) solid var(--ig-color-accent-ring);
    outline-offset: var(--ig-space-neg-2px);
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
  left: 'var(--ig-space-2)',
  display: 'flex' as const,
  alignItems: 'center' as const,
  zIndex: 'var(--ig-z-raised)' as unknown as number,
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
      role={onOpen || onSelect ? 'button' : undefined}
      tabIndex={onOpen || onSelect ? 0 : -1}
      aria-label={onOpen ? `Open image ${image.name}` : onSelect ? `Select image ${image.name}` : undefined}
      onClick={(e) => (e.metaKey || e.ctrlKey || e.shiftKey ? onSelect?.(image.id, e) : onOpen?.(image.id))}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          if (onOpen) onOpen(image.id)
          else if (onSelect) onSelect(image.id, e as unknown as React.MouseEvent)
        }
      }}
      data-image-id={image.id}
      data-state-chip-hover-scope="true"
    >
      <img
        src={image.thumb_url}
        alt={image.name}
        loading="lazy"
        style={{ ...THUMB_STYLE, filter: image.archived ? 'grayscale(1)' : undefined }}
      />
      <Inline gap={1} style={TOP_RIGHT_STYLE}>
        {topRightSlot}
        {showKebab ? (
          <OptionButton
            ref={menuBtnRef}
            aria-label={`Open menu for ${image.name}`}
            onClick={(e) => {
              e.stopPropagation()
              if (menuBtnRef.current) onOpenMenu?.(image.id, menuBtnRef.current)
            }}
          >
            <KebabIcon size={iconSizeNumbers.sm} />
          </OptionButton>
        ) : null}
      </Inline>
      {groupCount > 1 ? <div style={GROUP_SLOT_STYLE}><GroupCountBadge count={groupCount} /></div> : null}
      {showName ? <Text as="div" size="var(--ig-font-size-xs)" title={image.name} style={FOOTER_STYLE}>{image.name}</Text> : null}
      {image.archived ? <MediaOverlay variant="archived" /> : null}
      {image.processing ? <MediaOverlay variant="processing" /> : null}
    </Card>
  )
}
