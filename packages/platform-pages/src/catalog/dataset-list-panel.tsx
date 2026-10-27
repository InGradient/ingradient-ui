import styled from 'styled-components'
import { iconSizeNumbers } from '@ingradient/ui'
import React from 'react'
import { Inline, Stack, Text } from '@ingradient/ui/primitives'
import { Button, Checkbox, EmptyText, IconButton } from '@ingradient/ui/components'
import { Spinner } from '@ingradient/ui/components'
import { PanelLeftCloseIcon } from '@ingradient/ui/components'
import { DatasetListItem } from './dataset-list-item'
import type { DatasetTaskType } from './dataset-task-tag'

const PanelBox = styled(Stack)`
  height: 100%;
  background: var(--ig-color-surface-panel);
  border-right: var(--ig-border-1px) solid var(--ig-catalog-divider-color, var(--ig-color-border-subtle));
`

const HeaderBox = styled(Inline)`
  min-height: var(--ig-layout-sidebar-header);
  padding: 0 var(--ig-spacing-16);
  border-bottom: var(--ig-border-1px) solid var(--ig-catalog-divider-color, var(--ig-color-border-subtle));
  flex-shrink: 0;
`

const SelectAllRowBox = styled(Inline)`
  padding: var(--ig-spacing-8) var(--ig-spacing-12);
  border-bottom: var(--ig-border-1px) solid var(--ig-catalog-divider-color, var(--ig-color-border-subtle));
`

const ListBox = styled(Stack)`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: var(--ig-spacing-8);
  gap: var(--ig-spacing-2);
  margin: 0;
  list-style: none;
`

const PLACEHOLDER_STYLE = {
  padding: 'var(--ig-spacing-16)',
}

const TitleBox = styled(Text)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

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
  const showItems = !noProject && !loading && datasets.length > 0

  return (
    <PanelBox
      forwardedAs="aside"
      aria-label={title}
      gap="var(--ig-space-0)"
      data-ig-component="DatasetListPanel"
      data-ig-layer="patterns"
    >
      <HeaderBox justify="space-between" gap="var(--ig-spacing-8)">
        <TitleBox forwardedAs="h2" size="var(--ig-text-title-sm)" weight="semibold">{title}</TitleBox>
        <Inline gap="var(--ig-spacing-8)">
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
              <PanelLeftCloseIcon size={iconSizeNumbers.md} />
            </IconButton>
          ) : null}
        </Inline>
      </HeaderBox>
      {!noProject && !loading && datasets.length > 0 ? (
        <SelectAllRowBox justify="space-between" gap="var(--ig-spacing-12)">
          <Checkbox
            checked={allSelected}
            indeterminate={!allSelected && someSelected}
            onChange={(e) => onSelectAll?.(e.target.checked)}
            label={allSelected ? 'Deselect all' : 'Select all'}
          />
          {selectedIds.size > 0 ? (
            <Text as="span" tone="muted" size="var(--ig-text-caption)">
              {selectedIds.size} selected
            </Text>
          ) : null}
        </SelectAllRowBox>
      ) : null}
      <ListBox forwardedAs={showItems ? 'ul' : undefined} gap="var(--ig-space-0)">
        {noProject ? (
          <EmptyText style={PLACEHOLDER_STYLE}>No project selected</EmptyText>
        ) : loading ? (
          <Inline justify="center" style={PLACEHOLDER_STYLE}><Spinner size="md" /></Inline>
        ) : datasets.length === 0 ? (
          <EmptyText style={PLACEHOLDER_STYLE}>No datasets</EmptyText>
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
      </ListBox>
    </PanelBox>
  )
}
