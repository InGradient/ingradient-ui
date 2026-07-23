import React from 'react'
import { MenuItem } from '../../components/overlays/menu-item'
import { FilterPopoverTrigger } from '../../components/inputs/filter-popover-trigger'
import { popupSizeNumbers } from '../../tokens/core'

const OPTION_LIST_STYLE = {
  display: 'flex' as const,
  flexDirection: 'column' as const,
  gap: 'var(--ig-space-2px)',
}

export interface SortOption {
  value: string
  label: string
}

export interface SortOptionListProps {
  options: SortOption[]
  value: string
  onChange: (value: string) => void
  ariaLabel?: string
}

export function SortOptionList({
  options,
  value,
  onChange,
  ariaLabel = 'Sort options',
}: SortOptionListProps) {
  return (
    <div role="listbox" aria-label={ariaLabel} style={OPTION_LIST_STYLE}>
      {options.map((opt) => (
        <MenuItem
          key={opt.value}
          role="option"
          aria-selected={opt.value === value}
          active={opt.value === value}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </MenuItem>
      ))}
    </div>
  )
}

export interface SortPopoverTriggerProps {
  label?: React.ReactNode
  icon?: React.ReactNode
  iconOnly?: boolean
  options: SortOption[]
  value: string
  onChange: (value: string) => void
  defaultOpen?: boolean
  className?: string
}

export function SortPopoverTrigger({
  label, icon, iconOnly, options, value, onChange, defaultOpen, className,
}: SortPopoverTriggerProps) {
  const current = options.find((o) => o.value === value)
  return (
    <FilterPopoverTrigger
      className={className}
      icon={icon}
      iconOnly={iconOnly}
      label={label ?? (iconOnly ? 'Sort' : `Sort: ${current?.label ?? '—'}`)}
      defaultOpen={defaultOpen}
      panelMinWidth={popupSizeNumbers.listMin}
      panel={<SortOptionList options={options} value={value} onChange={onChange} />}
    />
  )
}
