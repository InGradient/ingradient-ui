import React from 'react'
import styled, { css } from 'styled-components'
import { Checkbox, IconButton } from '../../components/inputs'
import { SelectableListItem } from '../../components/data-display/selectable-list-item'
import { DatasetTaskTag, type DatasetTaskType } from '../../components/data-display/dataset-task-tag'
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

const Item = styled(SelectableListItem)<{ $menuOpen: boolean }>`
  ${(p) =>
    p.$menuOpen &&
    css`
      && {
        background: var(--ig-color-blue-tint-12);
        box-shadow: inset -2px 0 0 var(--ig-color-accent);
      }

      &&:hover:not(:disabled) {
        background: var(--ig-color-blue-tint-14);
      }
    `}
`

const MenuButton = styled(IconButton).attrs({
  variant: 'secondary' as const,
  size: 'sm' as const,
})<{ $active: boolean }>`
  && {
    border-color: ${(p) => (p.$active ? 'var(--ig-color-accent-border-strong)' : 'transparent')};
    background: ${(p) => (p.$active ? 'var(--ig-color-blue-tint-18)' : 'transparent')};
    color: ${(p) => (p.$active ? 'var(--ig-color-accent)' : 'var(--ig-color-text-muted)')};
  }

  &&:hover:not(:disabled) {
    border-color: ${(p) => (p.$active ? 'var(--ig-color-accent-border-strong)' : 'var(--ig-color-border-subtle)')};
    background: ${(p) =>
      p.$active ? 'var(--ig-color-accent-soft-surface-hover)' : 'var(--ig-color-surface-interactive-hover)'};
    color: var(--ig-color-text-primary);
  }
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
      variant="flat"
      selected={current}
      dragOver={dragOver}
      $menuOpen={menuOpen}
      onClick={() => onSelectCurrent?.(id)}
      data-dataset-id={id}
    >
      <Row>
        <Checkbox
          checked={selected ?? false}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => onToggleSelect?.(id, e.target.checked)}
          aria-label={`Select dataset ${name}`}
        />
        <Name title={name}>{name}</Name>
        <DatasetTaskTag taskType={taskType} />
        <MenuButton
          ref={menuBtnRef}
          aria-label={`Open menu for ${name}`}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          $active={menuOpen}
          onClick={(e) => {
            e.stopPropagation()
            if (menuBtnRef.current) onOpenMenu?.(id, menuBtnRef.current)
          }}
        >
          <KebabIcon size={18} />
        </MenuButton>
      </Row>
    </Item>
  )
}
