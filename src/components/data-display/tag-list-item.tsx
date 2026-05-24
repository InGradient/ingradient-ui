import React, { forwardRef } from 'react'
import styled from 'styled-components'
import { ColorSwatch } from './color-swatch'

const ItemBtn = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: var(--ig-space-3);
  width: 100%;
  padding: var(--ig-space-2) var(--ig-space-3);
  border: none;
  border-radius: var(--ig-radius-xs);
  background: ${(p) => (p.$active ? 'var(--ig-color-surface-interactive)' : 'transparent')};
  color: ${(p) => (p.$active ? 'var(--ig-color-text-primary)' : 'var(--ig-color-text-muted)')};
  font-size: var(--ig-font-size-sm);
  text-align: left;
  cursor: pointer;
  transition: background var(--ig-motion-fast);
  &:hover { background: var(--ig-color-surface-interactive); }
`

const Label = styled.span`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const Count = styled.span`
  font-size: var(--ig-font-size-2xs);
  color: var(--ig-color-text-soft);
`

export interface TagListItemProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  color: string
  label: React.ReactNode
  active?: boolean
  count?: number
}

export const TagListItem = forwardRef<HTMLButtonElement, TagListItemProps>(
  ({ color, label, active = false, count, type, ...rest }, ref) => (
    <ItemBtn ref={ref} type={type ?? 'button'} $active={active} {...rest}>
      <ColorSwatch $color={color} $size="sm" />
      <Label>{label}</Label>
      {count != null && <Count>{count}</Count>}
    </ItemBtn>
  ),
)
TagListItem.displayName = 'TagListItem'
