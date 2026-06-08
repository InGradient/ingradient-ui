import React from 'react'
import styled, { css } from 'styled-components'
import { ColorSwatch } from '../../components/data-display/color-swatch'
import {
  SelectableListItem,
  type SelectableListItemProps,
} from '../../components/data-display/selectable-list-item'
import { IconButton } from '../../components/inputs/icon-button'
import { KebabIcon } from '../../components/icons/catalog-icons'

const ClassSelectableListItem = (props: Omit<SelectableListItemProps, 'as' | 'variant'>) => (
  <SelectableListItem as="li" variant="flat" {...props} />
)

const Item = styled(ClassSelectableListItem)<{ $menuOpen: boolean }>`
  min-height: calc((var(--ig-space-3) * 2) + var(--ig-space-12));
  ${(p) =>
    p.$menuOpen &&
    css`
      && {
        background: var(--ig-color-blue-tint-12);
        box-shadow: inset -2px 0 0 var(--ig-color-accent);
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Count = styled.span`
  flex-shrink: 0;
  font-size: var(--ig-font-size-sm);
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
  const menuButtonRef = React.useRef<HTMLButtonElement>(null)
  return (
    <Item
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
            ref={menuButtonRef}
            aria-label={`Open menu for ${name}`}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            $active={menuOpen}
            onClick={(event) => {
              event.stopPropagation()
              if (menuButtonRef.current) onOpenMenu(id, menuButtonRef.current)
            }}
          >
            <KebabIcon size={18} />
          </MenuButton>
        ) : null}
      </Wrap>
    </Item>
  )
}
