import { Inline, Stack, Text } from '@ingradient/ui/primitives'
import { ModeSwitcher } from '@ingradient/ui/components'
import { TextButton } from '@ingradient/ui/components'
import { DateRangeField } from '@ingradient/ui/patterns'
import { FilterSection } from '@ingradient/ui/patterns'
import { ColorChip } from '@ingradient/ui/components'
import { FilterSearchableList, type FilterSearchableItem } from '@ingradient/ui/patterns'

const PANEL_STYLE = { width: 320, maxHeight: '70vh', overflowY: 'auto' as const }

const HEADER_STYLE = {
  padding: '0 0 var(--ig-space-3)',
  borderBottom: 'var(--ig-border-1px) solid var(--ig-color-border-subtle)',
  marginBottom: 'var(--ig-space-2)',
}

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
    <Stack gap={0} style={PANEL_STYLE}>
      <Inline justify="space-between" gap={3} style={HEADER_STYLE}>
        <Text as="strong" size="var(--ig-font-size-sm)">Filter images</Text>
        {onReset ? <TextButton tone="accent" size="xs" onClick={onReset}>Reset</TextButton> : null}
      </Inline>

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
    </Stack>
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
