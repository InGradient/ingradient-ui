import { IconButton, SelectableListItem, iconSizeNumbers } from '@ingradient/ui'
import {
  ColorSwatch, EmptyState, SearchField, ScissorsIcon, PanelRightCloseIcon,
} from '@ingradient/ui/components'
import {
  Container, Section, SectionHeader, GrowSection, Label, ClassList,
  SetupSlot, PatternGrid, PatternButton, RoiPrimaryButton,
} from './RightPanelView.styles'
import { patternLabelToUI } from '../capture/pattern-helpers'
import type { RightPanelViewProps } from './types'

export function RightPanelView(props: RightPanelViewProps): JSX.Element {
  const {
    workspaceTab, classes, selectedClassId,
    showPatternPreview, patternLabels, previewPatternLabel,
    showRoiButton, isDerivedViewActive, samActive, samViewerActive,
    classSearch, setupSlotId, commentSection, labels,
    onSetClassSearch, onSelectClass, onTogglePattern, onToggleSamRoi, onToggleCollapsed,
  } = props

  if (workspaceTab === 'setup') {
    return <SetupSlot id={setupSlotId ?? 'edge-deflectometry-panel-slot'} />
  }

  const normalizedSearch = classSearch.trim().toLowerCase()
  const filteredClasses = normalizedSearch
    ? classes.filter((c) => c.class_name.toLowerCase().includes(normalizedSearch))
    : classes

  const roiButtonActive = isDerivedViewActive ? samViewerActive : samActive
  const roiButtonLabel = isDerivedViewActive
    ? (samViewerActive ? labels.samRoiViewerActive : labels.samRoiViewer)
    : (samActive ? labels.samRoiActive : labels.samRoi)
  const roiButtonHint = isDerivedViewActive ? labels.samRoiViewerHint : labels.samRoiHint

  return (
    <Container>
      {showPatternPreview && (
        <Section>
          <SectionHeader>
            <Label>{labels.patternPreview}</Label>
            {onToggleCollapsed && (
              <IconButton
                size="xs"
                variant="ghost"
                title={labels.collapsePanel}
                aria-label={labels.collapsePanel}
                onClick={onToggleCollapsed}
              >
                <PanelRightCloseIcon size={iconSizeNumbers.sm} />
              </IconButton>
            )}
          </SectionHeader>
          <PatternGrid>
            {patternLabels.map((label) => (
              <PatternButton
                key={label}
                $active={previewPatternLabel === label}
                onClick={() => onTogglePattern(label)}
              >
                {patternLabelToUI(label)}
              </PatternButton>
            ))}
          </PatternGrid>
        </Section>
      )}

      {showRoiButton && (
        <Section>
          <RoiPrimaryButton
            type="button"
            $active={roiButtonActive}
            onClick={onToggleSamRoi}
            title={roiButtonHint}
          >
            <ScissorsIcon size={iconSizeNumbers.sm} />
            {roiButtonLabel}
          </RoiPrimaryButton>
        </Section>
      )}

      <GrowSection>
        <Label>{labels.classLabel}</Label>
        {classes.length === 0 ? (
          <EmptyState>{labels.noClasses}</EmptyState>
        ) : (
          <>
            <SearchField
              value={classSearch}
              onChange={(e) => onSetClassSearch(e.target.value)}
              onClear={() => onSetClassSearch('')}
              placeholder={labels.searchClasses}
              size="sm"
            />
            {filteredClasses.length === 0 ? (
              <EmptyState>{labels.noClassMatches}</EmptyState>
            ) : (
              <ClassList>
                {filteredClasses.map((cls) => (
                  <SelectableListItem
                    key={cls.class_id}
                    variant="card"
                    selected={selectedClassId === cls.class_id}
                    onClick={() => onSelectClass(cls.class_id)}
                    title={cls.class_name}
                  >
                    <ColorSwatch $color={cls.color} $size="sm" $shape="square" />
                    {cls.class_name}
                  </SelectableListItem>
                ))}
              </ClassList>
            )}
          </>
        )}
      </GrowSection>

      {commentSection}
    </Container>
  )
}
