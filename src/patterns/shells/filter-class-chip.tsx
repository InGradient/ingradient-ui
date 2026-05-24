import React from 'react'
import styled from 'styled-components'
import { Checkbox } from '../../components/inputs/toggles'

const Chip = styled.label<{ $checked: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: var(--ig-space-2);
  padding: var(--ig-space-1) var(--ig-space-2);
  border-radius: var(--ig-radius-2xs);
  background: ${(p) => (p.$checked ? 'var(--ig-color-accent-soft-surface)' : 'transparent')};
  cursor: pointer;
  user-select: none;
  &:hover {
    background: var(--ig-color-surface-interactive-hover);
  }
`

const ColorSwatch = styled.span<{ $color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${(p) => p.$color};
  flex-shrink: 0;
`

const Label = styled.span`
  font-size: var(--ig-font-size-sm);
  color: var(--ig-color-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export interface FilterClassChipProps {
  checked: boolean
  label: React.ReactNode
  color?: string
  onChange: (checked: boolean) => void
  className?: string
}

export function FilterClassChip({ checked, label, color, onChange, className }: FilterClassChipProps) {
  return (
    <Chip $checked={checked} className={className}>
      <Checkbox
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        aria-label={typeof label === 'string' ? label : undefined}
      />
      {color ? <ColorSwatch $color={color} /> : null}
      <Label>{label}</Label>
    </Chip>
  )
}
