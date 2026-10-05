import React from 'react'
import styled from 'styled-components'
import { TextButton } from '../inputs/text-button'

const Bar = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ig-space-4);
  padding: var(--ig-space-3) var(--ig-space-5);
  background: var(--ig-color-surface-raised);
  border: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  border-radius: var(--ig-radius-md);
  font-size: var(--ig-font-size-sm);
  color: var(--ig-color-text-primary);
`

const Count = styled.span`
  font-weight: var(--ig-font-weight-semibold);
  white-space: nowrap;
`

const Spacer = styled.div`
  flex: 1;
`

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ig-space-3);
`

export interface SelectionActionBarProps {
  selectedCount: number
  totalCount?: number
  onClearSelection: () => void
  onSelectAll?: () => void
  selectAllLabel?: string
  actions?: React.ReactNode
  className?: string
}

export function SelectionActionBar({
  selectedCount, totalCount, onClearSelection, onSelectAll,
  selectAllLabel = 'Select all', actions, className,
}: SelectionActionBarProps) {
  if (selectedCount === 0) return null

  return (
    <Bar className={className} role="toolbar" aria-label="Selection actions">
      <Count>
        {selectedCount} selected{totalCount != null ? ` / ${totalCount}` : ''}
      </Count>
      <TextButton tone="muted" size="xs" underline="always" onClick={onClearSelection}>Clear</TextButton>
      {onSelectAll && (
        <TextButton tone="muted" size="xs" underline="always" onClick={onSelectAll}>{selectAllLabel}</TextButton>
      )}
      <Spacer />
      {actions && <Actions>{actions}</Actions>}
    </Bar>
  )
}
