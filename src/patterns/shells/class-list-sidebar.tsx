import styled from 'styled-components'
import { Button } from '../../components/inputs/button'
import { stateCenteredLayout, stateTitleText } from '../../primitives'
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
  padding: 16px 16px 12px;
  border-bottom: 1px solid var(--ig-color-border-subtle);
  flex-shrink: 0;
`

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 8px 0;
  overflow-y: auto;
  min-height: 0;
  flex: 1;
`

const Placeholder = styled.div`
  ${stateTitleText}
  ${stateCenteredLayout}
  padding: 20px 14px;
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
              onClick={onSelectClass}
            />
          ))}
        </List>
      )}
    </Sidebar>
  )
}
