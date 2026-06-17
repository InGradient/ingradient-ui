import styled from 'styled-components'
import { iconSizeNumbers } from '@ingradient/ui'
import { Button } from '@ingradient/ui/components'
import { ClosePanelIcon } from '@ingradient/ui/components'
import { stateCenteredLayout, stateTitleText } from '@ingradient/ui/primitives'
import { ClassListRow } from './class-list-row'

const Sidebar = styled.aside<{ $flush: boolean }>`
  width: ${(p) => (p.$flush ? '100%' : 'var(--ig-popup-sm)')};
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: var(--ig-color-surface-panel);
  border-radius: ${(p) => (p.$flush ? 0 : 'var(--ig-radius-xl)')};
  border: ${(p) => (p.$flush ? 'none' : 'var(--ig-border-1px) solid var(--ig-color-border-subtle)')};
  border-right: ${(p) =>
    p.$flush ? 'var(--ig-border-1px) solid var(--ig-catalog-divider-color, var(--ig-color-border-subtle))' : undefined};
  height: 100%;
  min-height: 0;
  overflow: hidden;
`

const Header = styled.div`
  min-height: var(--ig-layout-sidebar-header);
  padding: 0 var(--ig-space-7);
  border-bottom: var(--ig-border-1px) solid var(--ig-catalog-divider-color, var(--ig-color-border-subtle));
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ig-space-4);
`

const Title = styled.h2`
  margin: 0;
  color: var(--ig-color-text-primary);
  font-size: var(--ig-font-size-lg);
  font-weight: var(--ig-font-weight-semibold);
`

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ig-space-2);
`

const CollapseButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--ig-control-height-xs);
  height: var(--ig-control-height-xs);
  border: none;
  background: transparent;
  border-radius: var(--ig-radius-sm);
  color: var(--ig-color-text-muted);
  cursor: pointer;
  &:hover {
    background: var(--ig-color-surface-interactive-hover);
    color: var(--ig-color-text-primary);
  }
`

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: var(--ig-space-2);
  overflow-y: auto;
  min-height: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-2px);
`

const Placeholder = styled.div`
  ${stateTitleText}
  ${stateCenteredLayout}
  padding: var(--ig-space-9) var(--ig-space-6);
`

export interface ClassListSidebarClass {
  id: string
  name: string
  color: string
  image_count?: number
}

export interface ClassListSidebarProps {
  classes: ClassListSidebarClass[]
  selectedClassId?: string | null
  loading?: boolean
  flush?: boolean
  title?: string
  emptyText?: string
  addClassLabel?: string
  openMenuId?: string
  onSelectClass?: (id: string) => void
  onAddClass?: () => void
  onCollapse?: () => void
  onOpenClassMenu?: (id: string, anchor: HTMLElement) => void
}

export function ClassListSidebar({
  classes, selectedClassId, loading, flush = false, title = 'Classes',
  emptyText = 'No classes yet.',
  addClassLabel = '+ Add',
  openMenuId,
  onSelectClass, onAddClass, onCollapse, onOpenClassMenu,
}: ClassListSidebarProps) {
  return (
    <Sidebar $flush={flush}>
      <Header>
        <Title>{title}</Title>
        <HeaderActions>
          <Button variant="solid" size="sm" type="button" onClick={onAddClass}>
            {addClassLabel}
          </Button>
          {onCollapse ? (
            <CollapseButton type="button" aria-label="Collapse sidebar" onClick={onCollapse}>
              <ClosePanelIcon size={iconSizeNumbers.md} />
            </CollapseButton>
          ) : null}
        </HeaderActions>
      </Header>
      {loading ? (
        <Placeholder>Loading…</Placeholder>
      ) : classes.length === 0 ? (
        <Placeholder>{emptyText}</Placeholder>
      ) : (
        <List role="listbox" aria-label="Classes">
          {classes.map((c) => (
            <ClassListRow
              key={c.id}
              id={c.id}
              name={c.name}
              color={c.color}
              count={c.image_count}
              selected={selectedClassId === c.id}
              menuOpen={openMenuId === c.id}
              onClick={onSelectClass}
              onOpenMenu={onOpenClassMenu}
            />
          ))}
        </List>
      )}
    </Sidebar>
  )
}
