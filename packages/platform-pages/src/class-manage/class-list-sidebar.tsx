import styled from 'styled-components'
import { Button, LabeledSwatchRow } from '@ingradient/ui/components'
import { stateCenteredLayout, stateTitleText } from '@ingradient/ui/primitives'

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
  font-weight: 600;
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
  onSelectClass?: (id: string) => void
  onAddClass?: () => void
}

export function ClassListSidebar({
  classes, selectedClassId, loading, flush = false, title = 'Classes',
  emptyText = 'No classes yet.',
  addClassLabel = '+ Add',
  onSelectClass, onAddClass,
}: ClassListSidebarProps) {
  return (
    <Sidebar $flush={flush}>
      <Header>
        <Title>{title}</Title>
        <Button variant="solid" size="sm" type="button" onClick={onAddClass}>
          {addClassLabel}
        </Button>
      </Header>
      {loading ? (
        <Placeholder>Loading…</Placeholder>
      ) : classes.length === 0 ? (
        <Placeholder>{emptyText}</Placeholder>
      ) : (
        <List role="listbox" aria-label="Classes">
          {classes.map((c) => (
            <LabeledSwatchRow
              key={c.id}
              id={c.id}
              label={c.name}
              color={c.color}
              count={c.image_count}
              selected={selectedClassId === c.id}
              onClick={onSelectClass}
            />
          ))}
        </List>
      )}
    </Sidebar>
  )
}
