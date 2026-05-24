import React from 'react'
import styled from 'styled-components'
import { Checkbox } from '../../components/inputs/toggles'

const Bar = styled.div`
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid var(--ig-color-border-subtle);
  background: var(--ig-color-surface-header);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  position: relative;
`

const ProgressTrack = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: transparent;
`

const ProgressFill = styled.div<{ $pct: number }>`
  height: 100%;
  width: ${(p) => Math.min(100, Math.max(0, p.$pct))}%;
  background: var(--ig-color-accent);
  transition: width var(--ig-motion-normal);
`

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ig-space-3);
  min-height: 72px;
  padding: var(--ig-space-7);
`

const SelectionRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ig-space-3);
  padding: var(--ig-space-3) var(--ig-space-7);
  border-top: 1px solid var(--ig-color-border-subtle);
`

const SelectionRowActive = styled(SelectionRow)`
  background: var(--ig-color-accent-soft-surface);
`

const Spacer = styled.div`
  flex: 1;
`

const Count = styled.span`
  font-size: var(--ig-font-size-sm);
  color: var(--ig-color-text-secondary);
`

const SelectAllLink = styled.button`
  background: none;
  border: none;
  color: var(--ig-color-accent);
  font-size: var(--ig-font-size-sm);
  cursor: pointer;
  padding: 0;
  &:hover {
    text-decoration: underline;
  }
`

export interface GalleryToolbarProps {
  leftStart?: React.ReactNode
  search?: React.ReactNode
  filters?: React.ReactNode
  viewMode?: React.ReactNode
  actions?: React.ReactNode
  leftOfSelectionCount?: React.ReactNode
  itemLabel?: string
  selectionCount?: number
  totalCount?: number
  loadedCount?: number
  allSelected?: boolean
  selectionActions?: React.ReactNode
  uploadProgress?: number
  onToggleSelectAll?: (checked: boolean) => void
  onSelectAllVisible?: () => void
}

export function GalleryToolbar({
  leftStart, search, filters, viewMode, actions,
  leftOfSelectionCount, itemLabel = 'image',
  selectionCount = 0, totalCount, loadedCount, allSelected,
  selectionActions, uploadProgress,
  onToggleSelectAll, onSelectAllVisible,
}: GalleryToolbarProps) {
  const hasSelection = selectionCount > 0
  const indeterminate = hasSelection && loadedCount !== undefined && selectionCount < loadedCount
  const hiddenCount = totalCount !== undefined && loadedCount !== undefined ? totalCount - loadedCount : 0

  const selectionBar = (
    <>
      {leftOfSelectionCount}
      <Checkbox
        checked={allSelected ?? hasSelection}
        indeterminate={indeterminate}
        onChange={(e) => onToggleSelectAll?.(e.target.checked)}
        aria-label="Select all images"
      />
      <Count>
        {hasSelection
          ? `${selectionCount}${typeof totalCount === 'number' ? ` of ${totalCount}` : ''} ${itemLabel}${selectionCount === 1 ? '' : 's'} selected`
          : `${totalCount ?? 0} ${itemLabel}${(totalCount ?? 0) === 1 ? '' : 's'}`}
      </Count>
      {hiddenCount > 0 && totalCount ? (
        <SelectAllLink type="button" onClick={onSelectAllVisible}>Select all {totalCount}</SelectAllLink>
      ) : null}
      {hasSelection ? selectionActions : null}
      <Spacer />
      {viewMode}
    </>
  )

  const Selection = hasSelection ? SelectionRowActive : SelectionRow

  return (
    <Bar data-ig-component="GalleryToolbar" data-ig-layer="patterns">
      {typeof uploadProgress === 'number' && uploadProgress > 0 && uploadProgress < 100 ? (
        <ProgressTrack>
          <ProgressFill $pct={uploadProgress} aria-label={`Upload progress ${uploadProgress}%`} />
        </ProgressTrack>
      ) : null}
      <Row>
        {leftStart}
        {search}
        {filters}
        <Spacer />
        {actions}
      </Row>
      <Selection>{selectionBar}</Selection>
    </Bar>
  )
}
