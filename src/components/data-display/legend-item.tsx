import React from 'react'
import styled from 'styled-components'
import { ColorSwatch } from './color-swatch'

const Item = styled.div`
  display: inline-flex;
  align-items: center;
  gap: var(--ig-space-3);
  color: var(--ig-color-text-secondary);
  font-size: var(--ig-font-size-xs);
`

export interface LegendItemProps {
  color: string
  label: React.ReactNode
  className?: string
}

export function LegendItem({ color, label, className }: LegendItemProps) {
  return (
    <Item className={className}>
      <ColorSwatch $color={color} $size="sm" />
      <span>{label}</span>
    </Item>
  )
}
