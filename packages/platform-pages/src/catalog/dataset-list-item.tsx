import { iconSizeNumbers } from '@ingradient/ui'
import React from 'react'
import { Grid, Inline, Text } from '@ingradient/ui/primitives'
import { Checkbox, IconButton } from '@ingradient/ui/components'
import { SelectableListItem } from '@ingradient/ui/components'
import { DatasetTaskTag, type DatasetTaskType } from './dataset-task-tag'
import { KebabIcon } from '@ingradient/ui/components'

const ROW_STYLE = { width: '100%', alignItems: 'center' }
const NAME_STYLE = {
  overflow: 'hidden' as const,
  textOverflow: 'ellipsis' as const,
  whiteSpace: 'nowrap' as const,
}
const SLOT_STYLE = { minWidth: 0 }

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
      <Grid
        gap={3}
        columns="auto 1fr auto auto"
        style={ROW_STYLE}
        data-ig-component="DatasetListItem"
        data-ig-layer="patterns"
        data-ig-label={name}
      >
        <Inline
          as="span"
          gap={0}
          style={SLOT_STYLE}
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
        </Inline>
        <Text
          as="span"
          title={name}
          style={NAME_STYLE}
          data-ig-slot="DatasetListItem.Name"
          data-ig-kind="text"
          data-ig-label={name}
        >
          {name}
        </Text>
        <Inline
          as="span"
          gap={0}
          style={SLOT_STYLE}
          data-ig-slot="DatasetListItem.TaskTag"
          data-ig-kind="tag"
          data-ig-label={taskType}
        >
          <DatasetTaskTag taskType={taskType} data-ig-slot="DatasetListItem.TaskTag" />
        </Inline>
        <Inline
          as="span"
          gap={0}
          style={SLOT_STYLE}
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
            <KebabIcon size={iconSizeNumbers.lg} />
          </IconButton>
        </Inline>
      </Grid>
    </SelectableListItem>
  )
}
