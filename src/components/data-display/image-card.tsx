import React, { type ReactNode } from 'react'
import styled from 'styled-components'
import { Text } from '../../primitives'
import { iconSizeNumbers } from '../../tokens/core'
import { GroupCountBadge } from '../feedback/group-count-badge'
import { MediaOverlay } from '../feedback/media-overlay'
import { KebabIcon } from '../icons/catalog-icons'

const OptionButton = styled.button`
  pointer-events: auto;
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

const Card = styled.div<{ $interactive: boolean; $selected: boolean }>`
  position: relative;
  width: 100%;
  aspect-ratio: var(--ig-aspect-landscape);
  background: var(--ig-color-surface-muted);
  border: var(--ig-border-2px) solid transparent;
  border-radius: var(--ig-radius-md);
  overflow: hidden;
  cursor: ${(p) => (p.$interactive ? 'pointer' : 'default')};
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
`

const PrimaryAction = styled.button`
  position: absolute;
  inset: 0;
  z-index: var(--ig-z-base);
  width: 100%;
  height: 100%;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;

  &:focus-visible {
    outline: var(--ig-border-2px) solid var(--ig-color-accent-ring);
    outline-offset: var(--ig-space-neg-2px);
  }
`

const TopRightControls = styled.div`
  position: absolute;
  top: var(--ig-space-2);
  right: var(--ig-space-2);
  z-index: var(--ig-z-raised);
  display: inline-flex;
  gap: var(--ig-space-1);
  pointer-events: none;

  & :is(button, a, input, select, textarea, [role='button'], [tabindex]) {
    pointer-events: auto;
  }
`

const THUMB_STYLE = {
  width: '100%',
  height: '100%',
  objectFit: 'cover' as const,
  display: 'block' as const,
}

const GROUP_SLOT_STYLE = {
  position: 'absolute' as const,
  top: 'var(--ig-space-2)',
  left: 'var(--ig-space-2)',
  display: 'flex' as const,
  alignItems: 'center' as const,
  pointerEvents: 'none' as const,
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
  const interactive = Boolean(onOpen || onSelect)
  const primaryActionLabel = onOpen ? `Open image ${image.name}` : `Select image ${image.name}`

  const handlePrimaryAction = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey) {
      onSelect?.(image.id, event)
      return
    }
    if (onOpen) onOpen(image.id)
    else onSelect?.(image.id, event)
  }

  return (
    <Card
      $interactive={interactive}
      $selected={selected}
      data-image-id={image.id}
      data-state-chip-hover-scope="true"
    >
      <img
        src={image.thumb_url}
        alt={image.name}
        aria-hidden={interactive || undefined}
        loading="lazy"
        style={{ ...THUMB_STYLE, filter: image.archived ? 'grayscale(1)' : undefined }}
      />
      {interactive ? (
        <PrimaryAction
          type="button"
          aria-label={primaryActionLabel}
          aria-pressed={!onOpen && onSelect ? selected : undefined}
          onClick={handlePrimaryAction}
        />
      ) : null}
      <TopRightControls>
        {topRightSlot}
        {showKebab && onOpenMenu ? (
          <OptionButton
            ref={menuBtnRef}
            aria-label={`Open menu for ${image.name}`}
            onClick={() => {
              if (menuBtnRef.current) onOpenMenu?.(image.id, menuBtnRef.current)
            }}
          >
            <KebabIcon size={iconSizeNumbers.sm} />
          </OptionButton>
        ) : null}
      </TopRightControls>
      {groupCount > 1 ? <div style={GROUP_SLOT_STYLE}><GroupCountBadge count={groupCount} /></div> : null}
      {showName ? <Text as="div" size="var(--ig-font-size-xs)" title={image.name} style={FOOTER_STYLE}>{image.name}</Text> : null}
      {image.archived ? <MediaOverlay variant="archived" /> : null}
      {image.processing ? <MediaOverlay variant="processing" /> : null}
    </Card>
  )
}
