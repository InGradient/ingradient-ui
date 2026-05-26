import styled from 'styled-components'
import { Inline, Text } from '../../primitives'
import { ColorSwatch } from './color-swatch'

const Item = styled.li<{ $selected?: boolean }>`
  padding: var(--ig-space-4) var(--ig-space-6);
  cursor: pointer;
  list-style: none;
  background: ${(p) => (p.$selected ? 'var(--ig-color-accent-soft-surface)' : 'transparent')};
  border-left: 3px solid ${(p) => (p.$selected ? 'var(--ig-color-accent)' : 'transparent')};
  transition: background-color var(--ig-motion-fast);
  &:hover {
    background: var(--ig-color-white-04);
  }
`

const NAME_STYLE = { flex: 1, minWidth: 0, whiteSpace: 'nowrap' as const, overflow: 'hidden' as const, textOverflow: 'ellipsis' as const }
const COUNT_STYLE = { flexShrink: 0 }
const WRAP_STYLE = { position: 'relative' as const, width: '100%', minWidth: 0 }

export interface LabeledSwatchRowProps {
  id: string
  label: string
  color: string
  count?: number
  selected?: boolean
  onClick?: (id: string) => void
}

/**
 * Color swatch + label + optional count 의 selectable list item.
 * Selected 상태에서 accent border-left + accent-soft-surface 배경.
 * Class / category / tag 등 색 매핑된 항목 리스트에 generic.
 */
export function LabeledSwatchRow({ id, label, color, count, selected, onClick }: LabeledSwatchRowProps) {
  return (
    <Item
      data-id={id}
      $selected={selected}
      onClick={() => onClick?.(id)}
      role="option"
      aria-selected={selected}
    >
      <Inline gap={4} style={WRAP_STYLE}>
        <ColorSwatch $color={color} $size="md" $shape="square" />
        <Text size="14px" title={label} style={NAME_STYLE}>{label}</Text>
        {typeof count === 'number' ? <Text size="12px" tone="soft" style={COUNT_STYLE}>{count.toLocaleString()}</Text> : null}
      </Inline>
    </Item>
  )
}
