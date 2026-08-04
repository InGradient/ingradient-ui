import React from 'react'
import styled from 'styled-components'
import { ColorSwatch, MenuIconButton as MenuButton, KebabIcon, SelectableListItem } from '@ingradient/ui/components'
import { iconSizeNumbers } from '@ingradient/ui'

const ITEM_STYLE = { minHeight: 'calc((var(--ig-space-3) * 2) + var(--ig-space-12))' }
const MENU_OPEN_STYLE = {
  ...ITEM_STYLE,
  background: 'var(--ig-color-blue-tint-12)',
  boxShadow: 'inset calc(-1 * var(--ig-border-2px)) 0 0 var(--ig-color-accent)',
}

const Row = styled.li`
  position: relative;
  min-width: 0;
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

const MenuSlot = styled.span`
  width: var(--ig-control-height-sm);
  height: var(--ig-control-height-sm);
`

const RowMenuButton = styled(MenuButton)`
  position: absolute;
  right: var(--ig-space-7);
  top: 50%;
  z-index: 1;
  transform: translateY(-50%);
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
    <Row>
      <SelectableListItem
        variant="flat"
        data-class-id={id}
        selected={selected}
        style={menuOpen ? MENU_OPEN_STYLE : ITEM_STYLE}
        onClick={() => onClick?.(id)}
        aria-current={selected ? 'true' : undefined}
      >
        <Wrap>
          <ColorSwatch $color={color} $size="md" $shape="circle" />
          <Name title={name}>{name}</Name>
          {typeof count === 'number' ? <Count>{count.toLocaleString()}</Count> : null}
          {onOpenMenu ? <MenuSlot aria-hidden="true" /> : null}
        </Wrap>
      </SelectableListItem>
      {onOpenMenu ? (
        <RowMenuButton
          ref={menuButtonRef}
          aria-label={`Open menu for ${name}`}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          $active={menuOpen}
          onClick={() => {
            if (menuButtonRef.current) onOpenMenu(id, menuButtonRef.current)
          }}
        >
          <KebabIcon size={iconSizeNumbers.lg} />
        </RowMenuButton>
      ) : null}
    </Row>
  )
}
