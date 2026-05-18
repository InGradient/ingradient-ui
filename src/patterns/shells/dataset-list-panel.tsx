import React from 'react'
import styled from 'styled-components'
import { Button, Checkbox } from '../../components/inputs'
import { Spinner } from '../../components/feedback/spinner'
import { ClosePanelIcon } from '../../components/icons/catalog-icons'
import { DatasetListItem } from './dataset-list-item'
import type { DatasetTaskType } from '../../components/data-display/dataset-task-tag'

const Panel = styled.aside`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--ig-color-surface-panel);
  border-right: 1px solid var(--ig-color-border-subtle);
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 72px;
  padding: 0 var(--ig-space-7);
  gap: var(--ig-space-4);
  border-bottom: 1px solid var(--ig-color-border-subtle);
  flex-shrink: 0;
`

const Title = styled.h2`
  font-size: var(--ig-font-size-lg);
  font-weight: 600;
  margin: 0;
  color: var(--ig-color-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const SelectAllRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ig-space-5);
  padding: var(--ig-space-4) var(--ig-space-6);
  border-bottom: 1px solid var(--ig-color-border-subtle);
`

const List = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: var(--ig-space-2);
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const CollapseBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  border-radius: var(--ig-radius-sm);
  color: var(--ig-color-text-muted);
  cursor: pointer;
  &:hover { background: var(--ig-color-surface-interactive-hover); color: var(--ig-color-text-primary); }
`

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ig-space-2);
`

const Placeholder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--ig-space-7);
  color: var(--ig-color-text-muted);
  font-size: var(--ig-font-size-sm);
  text-align: center;
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

  return (
    <Panel>
      <Header>
        <Title>{title}</Title>
        <HeaderActions>
          <Button variant="accent" size="sm" onClick={onAddDataset} disabled={noProject}>
            + Add
          </Button>
          {onCollapse ? (
            <CollapseBtn type="button" aria-label="Collapse sidebar" onClick={onCollapse}>
              <ClosePanelIcon size={16} />
            </CollapseBtn>
          ) : null}
        </HeaderActions>
      </Header>
      {!noProject && !loading && datasets.length > 0 ? (
        <SelectAllRow>
          <Checkbox
            checked={allSelected}
            indeterminate={!allSelected && someSelected}
            onChange={(e) => onSelectAll?.(e.target.checked)}
            label={allSelected ? 'Deselect all' : 'Select all'}
          />
          {selectedIds.size > 0 ? (
            <span style={{ color: 'var(--ig-color-text-muted)', fontSize: 'var(--ig-font-size-xs)' }}>
              {selectedIds.size} selected
            </span>
          ) : null}
        </SelectAllRow>
      ) : null}
      <List>
        {noProject ? (
          <Placeholder>No project selected</Placeholder>
        ) : loading ? (
          <Placeholder><Spinner size="md" /></Placeholder>
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
      </List>
    </Panel>
  )
}
