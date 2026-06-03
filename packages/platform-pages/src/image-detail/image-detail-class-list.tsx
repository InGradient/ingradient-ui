import styled from 'styled-components'
import { Stack, Text } from '@ingradient/ui/primitives'
import { ColorSwatch } from '@ingradient/ui/components'

const Row = styled.button<{ $selected?: boolean; $classified?: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  gap: var(--ig-space-3);
  padding: var(--ig-space-3) var(--ig-space-4);
  border-radius: var(--ig-radius-md);
  border: var(--ig-border-1px) solid
    ${(p) =>
      p.$selected || p.$classified
        ? 'var(--ig-color-blue-tint-38)'
        : 'var(--ig-color-slate-gray-tint-16)'};
  background: ${(p) =>
    p.$selected || p.$classified
      ? 'var(--ig-color-accent-soft-surface-hover)'
      : 'var(--ig-color-slate-gray-tint-12)'};
  cursor: pointer;
  text-align: left;
  &:hover {
    background: ${(p) =>
      p.$selected || p.$classified
        ? 'var(--ig-color-active-bg)'
        : 'var(--ig-color-slate-gray-tint-18)'};
  }
`

const NameText = styled.span<{ $active?: boolean }>`
  flex: 1;
  min-width: 0;
  font-size: var(--ig-font-size-sm);
  color: ${(p) => (p.$active ? 'var(--ig-color-text-secondary)' : 'var(--ig-color-text-muted)')};
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const EMPTY_STYLE = { padding: 'var(--ig-space-2)' }

export interface ImageDetailClassListClass {
  id: string
  name: string
  color: string
}

export interface ImageDetailClassListProps {
  classes: ImageDetailClassListClass[]
  /** Single-selection class (cursor / bbox / point mode). */
  selectedClassId?: string | null
  /** Multi-selection classified set (classification mode). */
  classifiedClassIds?: string[]
  onSelectClass?: (id: string) => void
  /** Hover preview hook — receives class + the row element for positioning. */
  onHoverClass?: (cls: ImageDetailClassListClass, anchor: HTMLElement) => void
  onHoverLeave?: (cls: ImageDetailClassListClass) => void
  emptyText?: string
  className?: string
}

/**
 * Image detail sidebar 의 class 목록 (row-based).
 * platform 의 `ImageDetailClassList` 와 동일 시각 (ColorSwatch + name +
 * selected/classified 강조).
 */
export function ImageDetailClassList({
  classes,
  selectedClassId,
  classifiedClassIds,
  onSelectClass,
  onHoverClass,
  onHoverLeave,
  emptyText = 'No connected classes for this dataset.',
  className,
}: ImageDetailClassListProps) {
  if (classes.length === 0) {
    return <Text as="p" size="var(--ig-font-size-xs)" tone="muted" style={EMPTY_STYLE}>{emptyText}</Text>
  }
  const classifiedSet = new Set(classifiedClassIds ?? [])
  return (
    <Stack gap={1} className={className}>
      {classes.map((cls) => {
        const isSelected = selectedClassId === cls.id
        const isClassified = classifiedSet.has(cls.id)
        const isActive = isSelected || isClassified
        return (
          <Row
            key={cls.id}
            type="button"
            $selected={isSelected}
            $classified={isClassified}
            onMouseEnter={(event) => onHoverClass?.(cls, event.currentTarget)}
            onMouseLeave={() => onHoverLeave?.(cls)}
            onFocus={(event) => onHoverClass?.(cls, event.currentTarget)}
            onBlur={() => onHoverLeave?.(cls)}
            onClick={() => onSelectClass?.(cls.id)}
          >
            <ColorSwatch $color={cls.color} $size="md" $shape="square" />
            <NameText $active={isActive} title={cls.name}>
              {cls.name}
            </NameText>
          </Row>
        )
      })}
    </Stack>
  )
}
