import React from 'react'
import styled from 'styled-components'

const Bar = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ig-space-3);
  flex-wrap: wrap;
`

const ClearBtn = styled.button`
  border: none;
  background: none;
  color: var(--ig-color-text-muted);
  font-size: var(--ig-font-size-xs);
  cursor: pointer;
  text-decoration: underline;
  white-space: nowrap;
  &:hover { color: var(--ig-color-text-primary); }
`

export interface FilterBarLayoutProps {
  onClear?: () => void
  clearLabel?: string
  children: React.ReactNode
  className?: string
}

export function FilterBarLayout({ onClear, clearLabel = 'Clear filters', children, className }: FilterBarLayoutProps) {
  return (
    <Bar className={className}>
      {children}
      {onClear && <ClearBtn type="button" onClick={onClear}>{clearLabel}</ClearBtn>}
    </Bar>
  )
}
