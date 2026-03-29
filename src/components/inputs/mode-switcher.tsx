import React from 'react'
import styled from 'styled-components'

const Row = styled.div<{ $size: 'sm' | 'md' }>`
  display: inline-flex;
  border: 1px solid var(--ig-color-border-subtle);
  border-radius: var(--ig-radius-md);
  overflow: hidden;
  background: var(--ig-color-surface-muted);
`

const OptionBtn = styled.button<{ $active: boolean; $size: 'sm' | 'md' }>`
  display: inline-flex;
  align-items: center;
  gap: var(--ig-space-2);
  padding: ${(p) => (p.$size === 'sm' ? 'var(--ig-space-1) var(--ig-space-3)' : 'var(--ig-space-2) var(--ig-space-4)')};
  border: none;
  background: ${(p) => (p.$active ? 'var(--ig-color-accent-soft)' : 'transparent')};
  color: ${(p) => (p.$active ? 'var(--ig-color-text-primary)' : 'var(--ig-color-text-muted)')};
  font-size: ${(p) => (p.$size === 'sm' ? 'var(--ig-font-size-2xs)' : 'var(--ig-font-size-xs)')};
  font-weight: ${(p) => (p.$active ? 600 : 400)};
  cursor: pointer;
  white-space: nowrap;
  transition: background var(--ig-motion-fast), color var(--ig-motion-fast);
  &:hover:not(:disabled) {
    background: ${(p) => (p.$active ? 'var(--ig-color-accent-soft)' : 'var(--ig-color-surface-interactive)')};
  }
`

export interface ModeSwitcherOption {
  value: string
  label: string
  icon?: React.ReactNode
}

export interface ModeSwitcherProps {
  options: ModeSwitcherOption[]
  value: string
  onChange: (value: string) => void
  size?: 'sm' | 'md'
  className?: string
}

export function ModeSwitcher({ options, value, onChange, size = 'md', className }: ModeSwitcherProps) {
  return (
    <Row $size={size} className={className} role="radiogroup">
      {options.map((opt) => (
        <OptionBtn
          key={opt.value}
          type="button"
          role="radio"
          aria-checked={opt.value === value}
          $active={opt.value === value}
          $size={size}
          onClick={() => onChange(opt.value)}
        >
          {opt.icon}
          {opt.label}
        </OptionBtn>
      ))}
    </Row>
  )
}
