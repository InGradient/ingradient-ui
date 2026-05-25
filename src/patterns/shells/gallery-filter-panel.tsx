import React from 'react'
import styled from 'styled-components'
import { ModeSwitcher } from '../../components/inputs/mode-switcher'
import { DateRangeField } from '../../components/inputs/date-range-field'
import { FilterSection } from './filter-section'
import { FilterClassChip } from './filter-class-chip'
import { FilterSearchableList, type FilterSearchableItem } from './filter-searchable-list'

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  width: 380px;
  max-width: 100%;
  max-height: 70vh;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-gutter: stable;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0 var(--ig-space-3);
  border-bottom: 1px solid var(--ig-color-border-subtle);
  margin-bottom: var(--ig-space-2);
`

const Title = styled.strong`
  font-size: var(--ig-font-size-sm);
  color: var(--ig-color-text-primary);
`

const ResetBtn = styled.button`
  background: none;
  border: none;
  color: var(--ig-color-accent);
  font-size: var(--ig-font-size-xs);
  cursor: pointer;
  padding: 0;
  &:hover { text-decoration: underline; }
`

const LABEL_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'labeled', label: 'Labeled' },
  { value: 'unlabeled', label: 'Unlabeled' },
]

const ARCHIVE_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'unarchived', label: 'Unarchived' },
  { value: 'archived', label: 'Archived' },
]

export interface GalleryFilterPanelState {
  uploadFrom: string
  uploadTo: string
  modifiedFrom: string
  modifiedTo: string
  labeled: 'all' | 'labeled' | 'unlabeled'
  archive: 'all' | 'unarchived' | 'archived'
  hasComments: boolean
  selectedClassIds: Set<string>
  selectedMemberIds: Set<string>
  selectedPatternIds: Set<string>
}

export interface GalleryFilterPanelProps {
  state: GalleryFilterPanelState
  onChange: (next: GalleryFilterPanelState) => void
  classItems: FilterSearchableItem[]
  memberItems: FilterSearchableItem[]
  patternItems?: FilterSearchableItem[]
  showPatterns?: boolean
  onReset?: () => void
  onSelectAllPatterns?: () => void
  onResetPatterns?: () => void
}

export function GalleryFilterPanel({
  state, onChange, classItems, memberItems, patternItems = [], showPatterns = false,
  onReset, onSelectAllPatterns, onResetPatterns,
}: GalleryFilterPanelProps) {
  const patch = (next: Partial<GalleryFilterPanelState>) => onChange({ ...state, ...next })
  const toggleSet = (key: 'selectedClassIds' | 'selectedMemberIds' | 'selectedPatternIds', id: string, checked: boolean) => {
    const set = new Set(state[key])
    if (checked) set.add(id); else set.delete(id)
    patch({ [key]: set } as Partial<GalleryFilterPanelState>)
  }

  return (
    <Panel>
      <Header>
        <Title>Filter images</Title>
        {onReset ? <ResetBtn type="button" onClick={onReset}>Reset</ResetBtn> : null}
      </Header>

      <FilterSection title="Upload date">
        <DateRangeField
          from={state.uploadFrom}
          to={state.uploadTo}
          onChange={({ from, to }) => patch({ uploadFrom: from, uploadTo: to })}
        />
      </FilterSection>

      <FilterSection title="Last modified date">
        <DateRangeField
          from={state.modifiedFrom}
          to={state.modifiedTo}
          onChange={({ from, to }) => patch({ modifiedFrom: from, modifiedTo: to })}
        />
      </FilterSection>

      <FilterSection title="Labeled">
        <ModeSwitcher
          size="sm"
          value={state.labeled}
          onChange={(v) => patch({ labeled: v as GalleryFilterPanelState['labeled'] })}
          options={LABEL_OPTIONS}
        />
      </FilterSection>

      <FilterSection title="Archive">
        <ModeSwitcher
          size="sm"
          value={state.archive}
          onChange={(v) => patch({ archive: v as GalleryFilterPanelState['archive'] })}
          options={ARCHIVE_OPTIONS}
        />
      </FilterSection>

      <FilterSection title="Commented">
        <FilterClassChip
          checked={state.hasComments}
          label="Has comments"
          onChange={(checked) => patch({ hasComments: checked })}
        />
      </FilterSection>

      <FilterSection title="Class (has annotation)">
        <FilterSearchableList
          placeholder="Search class"
          items={classItems}
          selectedIds={state.selectedClassIds}
          onToggle={(id, checked) => toggleSet('selectedClassIds', id, checked)}
          emptyMessage="No classes."
        />
      </FilterSection>

      <FilterSection title="Labeled by">
        <FilterSearchableList
          placeholder="Search member"
          items={memberItems}
          selectedIds={state.selectedMemberIds}
          onToggle={(id, checked) => toggleSet('selectedMemberIds', id, checked)}
          emptyMessage="No members."
        />
      </FilterSection>

      {showPatterns ? (
        <FilterSection
          title="Pattern labels"
          actions={<>
            <ResetBtn type="button" onClick={onSelectAllPatterns}>Select all</ResetBtn>
            <ResetBtn type="button" onClick={onResetPatterns}>Reset</ResetBtn>
          </>}
        >
          <FilterSearchableList
            placeholder="Search pattern"
            items={patternItems}
            selectedIds={state.selectedPatternIds}
            onToggle={(id, checked) => toggleSet('selectedPatternIds', id, checked)}
            emptyMessage="No patterns."
          />
        </FilterSection>
      ) : null}
    </Panel>
  )
}

export function emptyGalleryFilterPanelState(): GalleryFilterPanelState {
  return {
    uploadFrom: '', uploadTo: '',
    modifiedFrom: '', modifiedTo: '',
    labeled: 'all', archive: 'all',
    hasComments: false,
    selectedClassIds: new Set(),
    selectedMemberIds: new Set(),
    selectedPatternIds: new Set(),
  }
}
