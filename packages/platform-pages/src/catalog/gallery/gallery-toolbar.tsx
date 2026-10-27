import styled from 'styled-components'
import React from 'react'
import { Box, Inline, Stack, Text } from '@ingradient/ui/primitives'
import { Checkbox, ProgressBar } from '@ingradient/ui/components'
import { TextButton } from '@ingradient/ui/components'

const BarBox = styled(Stack)`
  border-bottom: var(--ig-border-1px) solid var(--ig-catalog-divider-color, var(--ig-color-border-subtle));
  background: var(--ig-color-surface-header);
  backdrop-filter: var(--ig-blur-md);
  -webkit-backdrop-filter: var(--ig-blur-md);
  position: relative;
`

const UploadProgressBox = styled(ProgressBar)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
`

const RowBox = styled(Inline)`
  min-height: var(--ig-layout-sidebar-header);
  padding: var(--ig-spacing-16);
`

const SELECTION_ROW_STYLE = {
  padding: 'var(--ig-spacing-8) var(--ig-spacing-16)',
  borderTop: 'var(--ig-border-1px) solid var(--ig-catalog-divider-color, var(--ig-color-border-subtle))',
}

const SELECTION_ROW_ACTIVE_STYLE = {
  ...SELECTION_ROW_STYLE,
  background: 'var(--ig-color-accent-soft-surface)',
}

const SpacerBox = styled(Box)`
  flex: 1;
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
      <Text as="span" size="var(--ig-text-body-sm)" tone="secondary">
        {hasSelection
          ? `${selectionCount}${typeof totalCount === 'number' ? ` of ${totalCount}` : ''} ${itemLabel}${selectionCount === 1 ? '' : 's'} selected`
          : `${totalCount ?? 0} ${itemLabel}${(totalCount ?? 0) === 1 ? '' : 's'}`}
      </Text>
      {hiddenCount > 0 && totalCount ? (
        <TextButton tone="accent" size="sm" onClick={onSelectAllVisible}>Select all {totalCount}</TextButton>
      ) : null}
      {hasSelection ? selectionActions : null}
      <SpacerBox />
      {viewMode}
    </>
  )

  return (
    <BarBox gap="var(--ig-space-0)" data-ig-component="GalleryToolbar" data-ig-layer="patterns">
      {typeof uploadProgress === 'number' && uploadProgress > 0 && uploadProgress < 100 ? (
        <UploadProgressBox
          value={uploadProgress}
          size="sm"
          ariaLabel={`Upload progress ${uploadProgress}%`}
        />
      ) : null}
      <RowBox gap="var(--ig-spacing-8)" wrap="nowrap">
        {leftStart}
        {search}
        {filters}
        <SpacerBox />
        {actions}
      </RowBox>
      <Inline gap="var(--ig-spacing-8)" wrap="nowrap" style={hasSelection ? SELECTION_ROW_ACTIVE_STYLE : SELECTION_ROW_STYLE}>{selectionBar}</Inline>
    </BarBox>
  )
}
