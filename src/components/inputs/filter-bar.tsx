import React from 'react'
import styled from 'styled-components'
import { TextButton } from './text-button'

const Bar = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ig-space-3);
  flex-wrap: wrap;
`

const ClearBtn = styled(TextButton)`
  white-space: nowrap;
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
      {onClear && <ClearBtn tone="muted" size="xs" onClick={onClear}>{clearLabel}</ClearBtn>}
    </Bar>
  )
}
