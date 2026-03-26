import React from 'react'
import styled from 'styled-components'

const Bar = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ig-space-4);
  padding: var(--ig-space-3) var(--ig-space-5);
  background: var(--ig-color-surface-elevated);
  border: 1px solid var(--ig-color-border-subtle);
  border-radius: var(--ig-radius-md);
  font-size: var(--ig-font-size-sm);
  color: var(--ig-color-text-primary);
`

const Count = styled.span`
  font-weight: 600;
  white-space: nowrap;
`

const ClearBtn = styled.button`
  border: none;
  background: none;
  color: var(--ig-color-text-muted);
  font-size: var(--ig-font-size-xs);
  cursor: pointer;
  text-decoration: underline;
  &:hover { color: var(--ig-color-text-primary); }
`

const SelectAllBtn = styled(ClearBtn)``

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
      <ClearBtn type="button" onClick={onClearSelection}>Clear</ClearBtn>
      {onSelectAll && (
        <SelectAllBtn type="button" onClick={onSelectAll}>{selectAllLabel}</SelectAllBtn>
      )}
      <Spacer />
      {actions && <Actions>{actions}</Actions>}
    </Bar>
  )
}
