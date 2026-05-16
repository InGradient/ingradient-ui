import React from 'react'
import styled from 'styled-components'
import { FilterPopoverTrigger } from './filter-popover-trigger'

const OptionList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const Option = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: var(--ig-space-2);
  padding: var(--ig-space-2) var(--ig-space-3);
  border: none;
  background: ${(p) => (p.$active ? 'var(--ig-color-blue-tint-14)' : 'transparent')};
  color: ${(p) => (p.$active ? 'var(--ig-color-accent)' : 'var(--ig-color-text-primary)')};
  font-size: var(--ig-font-size-sm);
  text-align: left;
  cursor: pointer;
  border-radius: var(--ig-radius-sm);
  &:hover:not(:disabled) {
    background: var(--ig-color-surface-interactive-hover);
  }
`

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
        <OptionList role="listbox" aria-label="Sort options">
          {options.map((opt) => (
            <li key={opt.value}>
              <Option
                type="button"
                role="option"
                aria-selected={opt.value === value}
                $active={opt.value === value}
                onClick={() => onChange(opt.value)}
              >
                {opt.label}
              </Option>
            </li>
          ))}
        </OptionList>
      }
    />
  )
}
