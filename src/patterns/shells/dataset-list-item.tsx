import React from 'react'
import styled from 'styled-components'
import { Checkbox, IconButton } from '../../components/inputs'
import { SelectableListItem } from '../../components/data-display/selectable-list-item'
import { DatasetTaskTag, type DatasetTaskType } from './dataset-task-tag'
import { KebabIcon } from '../../components/icons/catalog-icons'

const Row = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  align-items: center;
  gap: var(--ig-space-3);
  width: 100%;
`

const Name = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const Slot = styled.span`
  display: inline-flex;
  align-items: center;
  min-width: 0;
`

export interface DatasetListItemProps {
  id: string
  name: string
  taskType: DatasetTaskType
  selected?: boolean
  current?: boolean
  dragOver?: boolean
  onToggleSelect?: (id: string, checked: boolean) => void
  onSelectCurrent?: (id: string) => void
  onOpenMenu?: (id: string, anchor: HTMLElement) => void
}

export function DatasetListItem({
  id, name, taskType, selected, current, dragOver,
  onToggleSelect, onSelectCurrent, onOpenMenu,
}: DatasetListItemProps) {
  const menuBtnRef = React.useRef<HTMLButtonElement>(null)
  return (
    <SelectableListItem
      variant="flat"
      selected={current}
      dragOver={dragOver}
      onClick={() => onSelectCurrent?.(id)}
      data-dataset-id={id}
    >
      <Row data-ig-component="DatasetListItem" data-ig-layer="patterns" data-ig-label={name}>
        <Slot
          data-ig-slot="DatasetListItem.Checkbox"
          data-ig-kind="checkbox"
          data-ig-label={`Select dataset ${name}`}
        >
          <Checkbox
            checked={selected ?? false}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => onToggleSelect?.(id, e.target.checked)}
            aria-label={`Select dataset ${name}`}
            data-ig-slot="DatasetListItem.Checkbox"
          />
        </Slot>
        <Name
          title={name}
          data-ig-slot="DatasetListItem.Name"
          data-ig-kind="text"
          data-ig-label={name}
        >
          {name}
        </Name>
        <Slot
          data-ig-slot="DatasetListItem.TaskTag"
          data-ig-kind="tag"
          data-ig-label={taskType}
        >
          <DatasetTaskTag taskType={taskType} data-ig-slot="DatasetListItem.TaskTag" />
        </Slot>
        <Slot
          data-ig-slot="DatasetListItem.MenuButtonSlot"
          data-ig-kind="button-group"
          data-ig-label={`Actions for ${name}`}
        >
          <IconButton
            ref={menuBtnRef}
            aria-label={`Open menu for ${name}`}
            data-ig-slot="DatasetListItem.MenuButton"
            onClick={(e) => {
              e.stopPropagation()
              if (menuBtnRef.current) onOpenMenu?.(id, menuBtnRef.current)
            }}
            size="sm"
          >
            <KebabIcon size={18} />
          </IconButton>
        </Slot>
      </Row>
    </SelectableListItem>
  )
}
