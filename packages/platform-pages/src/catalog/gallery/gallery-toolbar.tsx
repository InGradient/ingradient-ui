import React from 'react'
import styled from 'styled-components'
import { Box, Inline, Stack, Text } from '@ingradient/ui/primitives'
import { Checkbox } from '@ingradient/ui/components'
import { TextButton } from '@ingradient/ui/components'

const BAR_STYLE = {
  borderBottom: 'var(--ig-border-1px) solid var(--ig-color-border-subtle)',
  background: 'var(--ig-color-surface-header)',
  backdropFilter: 'var(--ig-blur-xl)',
  WebkitBackdropFilter: 'var(--ig-blur-xl)',
  position: 'relative' as const,
}

const PROGRESS_TRACK_STYLE = {
  position: 'absolute' as const,
  top: 0,
  left: 0,
  right: 0,
  height: 3,
  background: 'transparent',
}

const ProgressFill = styled.div<{ $pct: number }>`
  height: 100%;
  width: ${(p) => Math.min(100, Math.max(0, p.$pct))}%;
  background: var(--ig-color-accent);
  transition: width var(--ig-motion-normal);
`

const ROW_STYLE = { minHeight: 72, padding: 'var(--ig-space-7)' }

const SELECTION_ROW_STYLE = {
  padding: 'var(--ig-space-3) var(--ig-space-7)',
  borderTop: 'var(--ig-border-1px) solid var(--ig-color-border-subtle)',
}

const SELECTION_ROW_ACTIVE_STYLE = {
  ...SELECTION_ROW_STYLE,
  background: 'var(--ig-color-accent-soft-surface)',
}

const SPACER_STYLE = { flex: 1 }

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
      <Text as="span" size="var(--ig-font-size-sm)" tone="secondary">
        {hasSelection
          ? `${selectionCount}${typeof totalCount === 'number' ? ` of ${totalCount}` : ''} ${itemLabel}${selectionCount === 1 ? '' : 's'} selected`
          : `${totalCount ?? 0} ${itemLabel}${(totalCount ?? 0) === 1 ? '' : 's'}`}
      </Text>
      {hiddenCount > 0 && totalCount ? (
        <TextButton tone="accent" size="sm" onClick={onSelectAllVisible}>Select all {totalCount}</TextButton>
      ) : null}
      {hasSelection ? selectionActions : null}
      <Box style={SPACER_STYLE} />
      {viewMode}
    </>
  )

  return (
    <Stack gap={0} data-ig-component="GalleryToolbar" data-ig-layer="patterns" style={BAR_STYLE}>
      {typeof uploadProgress === 'number' && uploadProgress > 0 && uploadProgress < 100 ? (
        <div style={PROGRESS_TRACK_STYLE}>
          <ProgressFill $pct={uploadProgress} aria-label={`Upload progress ${uploadProgress}%`} />
        </div>
      ) : null}
      <Inline gap={3} style={ROW_STYLE}>
        {leftStart}
        {search}
        {filters}
        <Box style={SPACER_STYLE} />
        {actions}
      </Inline>
      <Inline gap={3} style={hasSelection ? SELECTION_ROW_ACTIVE_STYLE : SELECTION_ROW_STYLE}>{selectionBar}</Inline>
    </Stack>
  )
}
