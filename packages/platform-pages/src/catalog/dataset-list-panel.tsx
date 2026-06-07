import { iconSizeNumbers } from '@ingradient/ui'
import React from 'react'
import styled from 'styled-components'
import { Inline, Stack, Text, stateCenteredLayout, stateTitleText } from '@ingradient/ui/primitives'
import { Button, Checkbox, IconButton } from '@ingradient/ui/components'
import { Spinner } from '@ingradient/ui/components'
import { ClosePanelIcon } from '@ingradient/ui/components'
import { DatasetListItem } from './dataset-list-item'
import type { DatasetTaskType } from './dataset-task-tag'

const Placeholder = styled.div`
  ${stateTitleText}
  ${stateCenteredLayout}
  padding: var(--ig-space-7);
`

const PANEL_STYLE = {
  height: '100%',
  background: 'var(--ig-color-surface-panel)',
  borderRight: 'var(--ig-border-1px) solid var(--ig-catalog-divider-color, var(--ig-color-border-subtle))',
}

const HEADER_STYLE = {
  minHeight: 'var(--ig-layout-sidebar-header)',
  padding: '0 var(--ig-space-7)',
  borderBottom: 'var(--ig-border-1px) solid var(--ig-catalog-divider-color, var(--ig-color-border-subtle))',
  flexShrink: 0,
}

const SELECT_ALL_ROW_STYLE = {
  padding: 'var(--ig-space-4) var(--ig-space-6)',
  borderBottom: 'var(--ig-border-1px) solid var(--ig-catalog-divider-color, var(--ig-color-border-subtle))',
}

const LIST_STYLE = {
  flex: 1,
  minHeight: 0,
  overflowY: 'auto' as const,
  padding: 'var(--ig-space-2)',
  gap: 'var(--ig-space-2px)',
}

const PLACEHOLDER_STYLE = {
  padding: 'var(--ig-space-7)',
}

const TITLE_STYLE = { overflow: 'hidden' as const, textOverflow: 'ellipsis' as const, whiteSpace: 'nowrap' as const }
const SELECTED_COUNT_STYLE = { color: 'var(--ig-color-text-muted)', fontSize: 'var(--ig-font-size-xs)' }

export interface DatasetListPanelDataset {
  id: string
  name: string
  task_type: DatasetTaskType
}

export interface DatasetListPanelProps {
  datasets: DatasetListPanelDataset[]
  selectedIds: Set<string>
  currentId?: string
  openMenuId?: string
  loading?: boolean
  noProject?: boolean
  dragOverDatasetId?: string
  title?: string
  onSelectAll?: (checked: boolean) => void
  onToggleSelect?: (id: string, checked: boolean) => void
  onSelectCurrent?: (id: string) => void
  onAddDataset?: () => void
  onOpenDatasetMenu?: (id: string, anchor: HTMLElement) => void
  onCollapse?: () => void
}

export function DatasetListPanel({
  datasets, selectedIds, currentId, openMenuId, loading, noProject, dragOverDatasetId,
  title = 'Datasets',
  onSelectAll, onToggleSelect, onSelectCurrent, onAddDataset, onOpenDatasetMenu, onCollapse,
}: DatasetListPanelProps) {
  const allSelected = datasets.length > 0 && datasets.every((d) => selectedIds.has(d.id))
  const someSelected = datasets.some((d) => selectedIds.has(d.id))

  return (
    <Stack as="aside" gap={0} data-ig-component="DatasetListPanel" data-ig-layer="patterns" style={PANEL_STYLE}>
      <Inline justify="space-between" gap="var(--ig-space-4)" style={HEADER_STYLE}>
        <Text as="h2" size="var(--ig-font-size-lg)" weight={600} style={TITLE_STYLE}>{title}</Text>
        <Inline gap="var(--ig-space-2)">
          <Button
            variant="solid"
            size="sm"
            onClick={onAddDataset}
            disabled={noProject}
            data-ig-component="DatasetListPanel.AddButton"
          >
            + Add
          </Button>
          {onCollapse ? (
            <IconButton
              variant="ghost"
              size="sm"
              type="button"
              aria-label="Collapse sidebar"
              onClick={onCollapse}
              data-ig-component="DatasetListPanel.CollapseButton"
            >
              <ClosePanelIcon size={iconSizeNumbers.md} />
            </IconButton>
          ) : null}
        </Inline>
      </Inline>
      {!noProject && !loading && datasets.length > 0 ? (
        <Inline justify="space-between" gap="var(--ig-space-5)" style={SELECT_ALL_ROW_STYLE}>
          <Checkbox
            checked={allSelected}
            indeterminate={!allSelected && someSelected}
            onChange={(e) => onSelectAll?.(e.target.checked)}
            label={allSelected ? 'Deselect all' : 'Select all'}
          />
          {selectedIds.size > 0 ? (
            <span style={SELECTED_COUNT_STYLE}>
              {selectedIds.size} selected
            </span>
          ) : null}
        </Inline>
      ) : null}
      <Stack gap={0} style={LIST_STYLE}>
        {noProject ? (
          <Placeholder>No project selected</Placeholder>
        ) : loading ? (
          <Inline justify="center" style={PLACEHOLDER_STYLE}><Spinner size="md" /></Inline>
        ) : datasets.length === 0 ? (
          <Placeholder>No datasets</Placeholder>
        ) : (
          datasets.map((d) => (
            <DatasetListItem
              key={d.id}
              id={d.id}
              name={d.name}
              taskType={d.task_type}
              selected={selectedIds.has(d.id)}
              current={currentId === d.id}
              dragOver={dragOverDatasetId === d.id}
              menuOpen={openMenuId === d.id}
              onToggleSelect={onToggleSelect}
              onSelectCurrent={onSelectCurrent}
              onOpenMenu={onOpenDatasetMenu}
            />
          ))
        )}
      </Stack>
    </Stack>
  )
}
