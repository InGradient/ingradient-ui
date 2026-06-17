import React from 'react'
import { MenuItem } from '../../components/overlays/menu-item'
import { FilterPopoverTrigger } from '../../components/inputs/filter-popover-trigger'

const OPTION_LIST_STYLE = {
  listStyle: 'none' as const,
  margin: 0,
  padding: 0,
  display: 'flex' as const,
  flexDirection: 'column' as const,
  gap: 'var(--ig-space-2px)',
}

export interface SortOption {
  value: string
  label: string
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
      panelMinWidth={200}
      panel={
        <ul role="listbox" aria-label="Sort options" style={OPTION_LIST_STYLE}>
          {options.map((opt) => (
            <li key={opt.value}>
              <MenuItem
                role="option"
                aria-selected={opt.value === value}
                active={opt.value === value}
                onClick={() => onChange(opt.value)}
              >
                {opt.label}
              </MenuItem>
            </li>
          ))}
        </ul>
      }
    />
  )
}
