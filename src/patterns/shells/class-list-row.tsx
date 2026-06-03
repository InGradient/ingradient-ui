import styled from 'styled-components'
import { ColorSwatch } from '../../components/data-display/color-swatch'
import {
  SelectableListItem,
  type SelectableListItemProps,
} from '../../components/data-display/selectable-list-item'

const ClassSelectableListItem = (props: Omit<SelectableListItemProps, 'as' | 'variant'>) => (
  <SelectableListItem as="li" variant="flat" {...props} />
)

const Item = styled(ClassSelectableListItem)`
  min-height: calc((var(--ig-space-3) * 2) + var(--ig-space-12));
`

const Wrap = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
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
      selected={selected}
      onClick={() => onClick?.(id)}
      role="option"
      aria-selected={selected}
    >
      <Wrap>
        <ColorSwatch $color={color} $size="md" $shape="circle" />
        <Name title={name}>{name}</Name>
        {typeof count === 'number' ? <Count>{count.toLocaleString()}</Count> : null}
      </Wrap>
    </Item>
  )
}
