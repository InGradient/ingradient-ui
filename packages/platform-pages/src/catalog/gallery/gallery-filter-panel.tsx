import styled from 'styled-components'
import { Inline, Stack, Text } from '@ingradient/ui/primitives'
import { ModeSwitcher } from '@ingradient/ui/components'
import { TextButton } from '@ingradient/ui/components'
import { DateRangeField } from '@ingradient/ui/patterns'
import { FilterSection } from '@ingradient/ui/patterns'
import { ColorChip } from '@ingradient/ui/components'
import { FilterSearchableList, type FilterSearchableItem } from '@ingradient/ui/patterns'

const PanelBox = styled(Stack)`
  width: var(--ig-popup-filter-panel);
  max-width: 100%;
  max-height: 70vh;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-gutter: stable;
`

const HeaderBox = styled(Inline)`
  padding: 0 0 var(--ig-spacing-8);
  border-bottom: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  margin-bottom: var(--ig-spacing-8);
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
    <PanelBox gap="var(--ig-space-0)">
      <HeaderBox justify="space-between" gap="var(--ig-spacing-8)">
        <Text as="strong" size="var(--ig-text-body-sm)">Filter images</Text>
        {onReset ? <TextButton tone="accent" size="xs" onClick={onReset}>Reset</TextButton> : null}
      </HeaderBox>

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
        <ColorChip
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
            <TextButton tone="accent" size="xs" onClick={onSelectAllPatterns}>Select all</TextButton>
            <TextButton tone="accent" size="xs" onClick={onResetPatterns}>Reset</TextButton>
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
    </PanelBox>
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
