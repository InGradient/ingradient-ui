import { iconSizeNumbers } from '@ingradient/ui'
import React from 'react'
import styled, { css } from 'styled-components'
import { Grid, Inline, Text } from '@ingradient/ui/primitives'
import { Checkbox, MenuIconButton as MenuButton } from '@ingradient/ui/components'
import { SelectableListItem } from '@ingradient/ui/components'
import { DatasetTaskTag, type DatasetTaskType } from './dataset-task-tag'
import { KebabIcon } from '@ingradient/ui/components'

const RowBox = styled(Grid)`
  width: 100%;
  align-items: center;
`
const NameBox = styled(Text)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
const SlotBox = styled(Inline)`
  min-width: 0;
`

const Item = styled(SelectableListItem)<{ $menuOpen: boolean }>`
  ${(p) =>
    p.$menuOpen &&
    css`
      && {
        background: var(--ig-color-blue-tint-12);
        box-shadow: inset calc(-1 * var(--ig-border-2px)) 0 0 var(--ig-color-accent);
      }

      &&:hover:not(:disabled) {
        background: var(--ig-color-blue-tint-14);
      }
    `}
`

export interface DatasetListItemProps {
  id: string
  name: string
  taskType: DatasetTaskType
  selected?: boolean
  current?: boolean
  dragOver?: boolean
  menuOpen?: boolean
  onToggleSelect?: (id: string, checked: boolean) => void
  onSelectCurrent?: (id: string) => void
  onOpenMenu?: (id: string, anchor: HTMLElement) => void
}

export function DatasetListItem({
  id, name, taskType, selected, current, dragOver, menuOpen = false,
  onToggleSelect, onSelectCurrent, onOpenMenu,
}: DatasetListItemProps) {
  const menuBtnRef = React.useRef<HTMLButtonElement>(null)
  return (
    <Item
      forwardedAs="li"
      variant="flat"
      selected={current}
      dragOver={dragOver}
      $menuOpen={menuOpen}
      onClick={() => onSelectCurrent?.(id)}
      data-dataset-id={id}
    >
      <RowBox
        gap="var(--ig-spacing-8)"
        columns="auto 1fr auto auto"
        data-ig-component="DatasetListItem"
        data-ig-layer="patterns"
        data-ig-label={name}
      >
        <SlotBox
          forwardedAs="span"
          gap="var(--ig-space-0)"
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
        </SlotBox>
        <NameBox
          forwardedAs="span"
          title={name}
          data-ig-slot="DatasetListItem.Name"
          data-ig-kind="text"
          data-ig-label={name}
        >
          {name}
        </NameBox>
        <SlotBox
          forwardedAs="span"
          gap="var(--ig-space-0)"
          data-ig-slot="DatasetListItem.TaskTag"
          data-ig-kind="tag"
          data-ig-label={taskType}
        >
          <DatasetTaskTag taskType={taskType} data-ig-slot="DatasetListItem.TaskTag" />
        </SlotBox>
        <SlotBox
          forwardedAs="span"
          gap="var(--ig-space-0)"
          data-ig-slot="DatasetListItem.MenuButtonSlot"
          data-ig-kind="button-group"
          data-ig-label={`Actions for ${name}`}
        >
          <MenuButton
            ref={menuBtnRef}
            aria-label={`Open menu for ${name}`}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            $active={menuOpen}
            data-ig-slot="DatasetListItem.MenuButton"
            onClick={(e) => {
              e.stopPropagation()
              if (menuBtnRef.current) onOpenMenu?.(id, menuBtnRef.current)
            }}
          >
            <KebabIcon size={iconSizeNumbers.lg} />
          </MenuButton>
        </SlotBox>
      </RowBox>
    </Item>
  )
}
