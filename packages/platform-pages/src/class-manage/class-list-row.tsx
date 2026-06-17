import React from 'react'
import styled, { css } from 'styled-components'
import { ColorSwatch, IconButton, KebabIcon, SelectableListItem } from '@ingradient/ui/components'
import { iconSizeNumbers } from '@ingradient/ui'

const Item = styled(SelectableListItem)<{ $menuOpen: boolean }>`
  min-height: calc((var(--ig-space-3) * 2) + var(--ig-space-12));
  ${(p) =>
    p.$menuOpen &&
    css`
      && {
        background: var(--ig-color-blue-tint-12);
        box-shadow: inset -2px 0 0 var(--ig-color-accent);
      }
      &&:hover:not(:disabled) {
        background: var(--ig-color-blue-tint-14);
      }
    `}
`

const Wrap = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto auto;
  align-items: center;
  gap: var(--ig-space-3);
  min-width: 0;
`

const Name = styled.span`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--ig-color-text-primary);
  font-size: var(--ig-font-size-md);
`

const Count = styled.span`
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-text-soft);
`

const MenuButton = styled(IconButton).attrs({
  variant: 'secondary' as const,
  size: 'sm' as const,
})<{ $active: boolean }>`
  && {
    border-color: ${(p) => (p.$active ? 'var(--ig-color-accent-border-strong)' : 'transparent')};
    background: ${(p) => (p.$active ? 'var(--ig-color-blue-tint-18)' : 'transparent')};
    color: ${(p) => (p.$active ? 'var(--ig-color-accent)' : 'var(--ig-color-text-muted)')};
  }
  &&:hover:not(:disabled) {
    border-color: ${(p) => (p.$active ? 'var(--ig-color-accent-border-strong)' : 'var(--ig-color-border-subtle)')};
    background: ${(p) =>
      p.$active ? 'var(--ig-color-accent-soft-surface-hover)' : 'var(--ig-color-surface-interactive-hover)'};
    color: var(--ig-color-text-primary);
  }
`

export interface ClassListRowProps {
  id: string
  name: string
  color: string
  count?: number
  selected?: boolean
  menuOpen?: boolean
  onClick?: (id: string) => void
  onOpenMenu?: (id: string, anchor: HTMLElement) => void
}

export function ClassListRow({
  id, name, color, count, selected, menuOpen = false, onClick, onOpenMenu,
}: ClassListRowProps) {
  const menuBtnRef = React.useRef<HTMLButtonElement>(null)
  return (
    <Item
      as="li"
      variant="flat"
      data-class-id={id}
      selected={selected}
      $menuOpen={menuOpen}
      onClick={() => onClick?.(id)}
      role="option"
      aria-selected={selected}
    >
      <Wrap>
        <ColorSwatch $color={color} $size="md" $shape="circle" />
        <Name title={name}>{name}</Name>
        {typeof count === 'number' ? <Count>{count.toLocaleString()}</Count> : null}
        {onOpenMenu ? (
          <MenuButton
            ref={menuBtnRef}
            aria-label={`Open menu for ${name}`}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            $active={menuOpen}
            onClick={(event) => {
              event.stopPropagation()
              if (menuBtnRef.current) onOpenMenu(id, menuBtnRef.current)
            }}
          >
            <KebabIcon size={iconSizeNumbers.lg} />
          </MenuButton>
        ) : null}
      </Wrap>
    </Item>
  )
}
