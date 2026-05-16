import styled from 'styled-components'
import { ColorSwatch } from '../../components/data-display/color-swatch'

const Item = styled.li<{ $selected?: boolean }>`
  padding: 10px 14px;
  cursor: pointer;
  list-style: none;
  background: ${(p) => (p.$selected ? 'rgba(77, 136, 255, 0.1)' : 'transparent')};
  border-left: 3px solid ${(p) => (p.$selected ? 'var(--ig-color-accent)' : 'transparent')};
  transition: background-color var(--ig-motion-fast);
  &:hover {
    background: var(--ig-color-white-04);
  }
`

const Wrap = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`

const Name = styled.span`
  flex: 1;
  min-width: 0;
  font-size: 14px;
  color: var(--ig-color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Count = styled.span`
  flex-shrink: 0;
  font-size: 12px;
  color: var(--ig-color-text-soft);
`

export interface ClassListRowProps {
  id: string
  name: string
  color: string
  count?: number
  selected?: boolean
  onClick?: (id: string) => void
}

export function ClassListRow({ id, name, color, count, selected, onClick }: ClassListRowProps) {
  return (
    <Item
      data-class-id={id}
      $selected={selected}
      onClick={() => onClick?.(id)}
      role="option"
      aria-selected={selected}
    >
      <Wrap>
        <ColorSwatch $color={color} $size="md" $shape="square" />
        <Name title={name}>{name}</Name>
        {typeof count === 'number' ? <Count>{count.toLocaleString()}</Count> : null}
      </Wrap>
    </Item>
  )
}
