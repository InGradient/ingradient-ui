import styled from 'styled-components'
import { Text } from '../../primitives'
import { Button } from '../../components/inputs/button'
import { ClassListRow } from './class-list-row'

const Sidebar = styled.aside`
  width: 280px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: var(--ig-color-surface-panel);
  border-radius: var(--ig-radius-xl);
  border: 1px solid var(--ig-color-border-subtle);
  height: 100%;
  min-height: 0;
  overflow: hidden;
`

const Header = styled.div`
  padding: var(--ig-space-7) var(--ig-space-7) var(--ig-space-5);
  border-bottom: 1px solid var(--ig-color-border-subtle);
  flex-shrink: 0;
`

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: var(--ig-space-3) 0;
  overflow-y: auto;
  min-height: 0;
  flex: 1;
`

const PLACEHOLDER_STYLE = { padding: 'var(--ig-space-9) var(--ig-space-6)' }

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
  emptyText?: string
  addClassLabel?: string
  onSelectClass?: (id: string) => void
  onAddClass?: () => void
}

export function ClassListSidebar({
  classes, selectedClassId, loading,
  emptyText = 'No classes yet.',
  addClassLabel = '+ Add class',
  onSelectClass, onAddClass,
}: ClassListSidebarProps) {
  return (
    <Sidebar>
      <Header>
        <Button variant="accent" type="button" onClick={onAddClass}>
          {addClassLabel}
        </Button>
      </Header>
      {loading ? (
        <Text tone="muted" align="center" size="14px" style={PLACEHOLDER_STYLE}>Loading…</Text>
      ) : classes.length === 0 ? (
        <Text tone="muted" align="center" size="14px" style={PLACEHOLDER_STYLE}>{emptyText}</Text>
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
              onClick={onSelectClass}
            />
          ))}
        </List>
      )}
    </Sidebar>
  )
}
