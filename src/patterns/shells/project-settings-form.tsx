import styled from 'styled-components'
import { Checkbox } from '../../components/inputs/toggles'
import { TextField } from '../../components/inputs/text-fields'
import { AutoSaveStatus, type AutoSaveState } from './auto-save-status'
import { ProjectTypeTag, type ProjectTypeTone } from './project-type-tag'

const SectionTitle = styled.h4`
  margin: var(--ig-space-7) 0 var(--ig-space-3);
  font-size: 13px;
  font-weight: 600;
  color: var(--ig-color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  &:first-of-type { margin-top: 0; }
`

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ig-space-3);
  flex-wrap: wrap;
`

const Row = styled.div`
  padding: var(--ig-space-5) 0;
  border-bottom: 1px solid var(--ig-color-border-strong);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ig-space-7);
  flex-wrap: wrap;
`

const Label = styled.label`
  color: var(--ig-color-text-primary);
  font-size: 14px;
  cursor: pointer;
`

const Input = styled(TextField)`
  min-width: 200px;
`

const Textarea = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: var(--ig-space-3) var(--ig-space-5);
  font-size: 14px;
  color: var(--ig-color-text-primary);
  background: var(--ig-color-surface-raised);
  border: 1px solid var(--ig-color-border-subtle);
  border-radius: var(--ig-radius-xs);
  resize: vertical;
  box-sizing: border-box;
  &:focus {
    outline: none;
    border-color: var(--ig-color-accent);
  }
`

const Hint = styled.p`
  margin: 0;
  color: var(--ig-color-text-soft);
  font-size: 12px;
  line-height: 1.5;
`

const NestedField = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-2);
  flex: 1;
  min-width: 0;
`

export type GroupVisible = 'owner' | 'owner_and_manager' | 'all'

export interface ProjectSettingsFormProps {
  projectType: ProjectTypeTone
  canEdit: boolean
  isOwner: boolean
  saveState: AutoSaveState
  saveErrorMessage?: string | null
  nameInvalid: boolean

  name: string
  onChangeName: (value: string) => void
  description: string
  onChangeDescription: (value: string) => void

  groupEnabled: boolean
  onChangeGroupEnabled: (value: boolean) => void
  groupRegex: string
  onChangeGroupRegex: (value: string) => void
  groupRepRegex: string
  onChangeGroupRepRegex: (value: string) => void

  allowDup: boolean
  onChangeAllowDup: (value: boolean) => void

  showFilenameInGallery: boolean
  onChangeShowFilenameInGallery: (value: boolean) => void
  showBboxClassNamesInDetail: boolean
  onChangeShowBboxClassNamesInDetail: (value: boolean) => void

  groupVisible: GroupVisible
  onChangeGroupVisible: (value: GroupVisible) => void
}

export function ProjectSettingsForm({
  projectType, canEdit, isOwner, saveState, saveErrorMessage, nameInvalid,
  name, onChangeName, description, onChangeDescription,
  groupEnabled, onChangeGroupEnabled, groupRegex, onChangeGroupRegex, groupRepRegex, onChangeGroupRepRegex,
  allowDup, onChangeAllowDup,
  showFilenameInGallery, onChangeShowFilenameInGallery,
  showBboxClassNamesInDetail, onChangeShowBboxClassNamesInDetail,
  groupVisible, onChangeGroupVisible,
}: ProjectSettingsFormProps) {
  return (
    <>
      <AutoSaveStatus
        state={saveState}
        errorMessage={saveErrorMessage}
        readOnly={!canEdit}
        invalid={nameInvalid}
        invalidMessage="Project name cannot be empty."
        readOnlyMessage="You can view this project, but project settings are read-only for your role."
        savingMessage="Saving project settings…"
        savedMessage="All project changes saved."
        fallbackErrorMessage="Failed to save project settings."
      />

      <TitleRow>
        <SectionTitle style={{ marginBottom: 0 }}>Project name</SectionTitle>
        <ProjectTypeTag tone={projectType} />
      </TitleRow>
      <Row>
        <Input value={name} onChange={(e) => onChangeName(e.target.value)} placeholder="Project name" aria-label="Project name" disabled={!canEdit} />
      </Row>

      <SectionTitle>Description</SectionTitle>
      <Row>
        <Textarea value={description} onChange={(e) => onChangeDescription(e.target.value)} placeholder="Project description (optional)" rows={3} disabled={!canEdit} />
      </Row>

      <SectionTitle>Data grouping</SectionTitle>
      <Row>
        <Label htmlFor="multi-image-group">Group multiple images as one item (for labeling)</Label>
        <Checkbox id="multi-image-group" checked={groupEnabled} onChange={(e) => onChangeGroupEnabled(e.target.checked)} disabled={!canEdit} />
      </Row>
      {groupEnabled && (
        <>
          <Row>
            <NestedField>
              <Label htmlFor="group-key-regex">Group key pattern (regex with one capture group)</Label>
              <Input id="group-key-regex" value={groupRegex} onChange={(e) => onChangeGroupRegex(e.target.value)} placeholder="e.g. ^([^_]+_[^_]+)_" disabled={!canEdit} style={{ minWidth: 0 }} />
              <Hint>File name is matched against this regex; the first captured group becomes the group key.</Hint>
            </NestedField>
          </Row>
          <Row>
            <NestedField>
              <Label htmlFor="group-representative-regex">Representative image pattern (optional regex)</Label>
              <Input id="group-representative-regex" value={groupRepRegex} onChange={(e) => onChangeGroupRepRegex(e.target.value)} placeholder="e.g. _x_orig\.png$" disabled={!canEdit} style={{ minWidth: 0 }} />
              <Hint>If set, the matching file becomes the representative image for each group.</Hint>
            </NestedField>
          </Row>
        </>
      )}

      <SectionTitle>Upload</SectionTitle>
      <Row>
        <Label htmlFor="allow-duplicate-filenames">Allow duplicate file names</Label>
        <Checkbox id="allow-duplicate-filenames" checked={allowDup} onChange={(e) => onChangeAllowDup(e.target.checked)} disabled={!canEdit} />
      </Row>

      <SectionTitle>Display</SectionTitle>
      <Row>
        <Label htmlFor="show-filename-in-gallery">Show file name below each thumbnail in Catalog</Label>
        <Checkbox id="show-filename-in-gallery" checked={showFilenameInGallery} onChange={(e) => onChangeShowFilenameInGallery(e.target.checked)} disabled={!canEdit} />
      </Row>
      <Row>
        <Label htmlFor="show-bbox-class-names-in-detail">Show class name on bbox in Image Detail</Label>
        <Checkbox id="show-bbox-class-names-in-detail" checked={showBboxClassNamesInDetail} onChange={(e) => onChangeShowBboxClassNamesInDetail(e.target.checked)} disabled={!canEdit} />
      </Row>

      {isOwner && (
        <>
          <SectionTitle>Group visibility (owner only)</SectionTitle>
          <Row>
            <Label htmlFor="group-visible-owner-only">Only owner can see all images in group</Label>
            <Checkbox
              id="group-visible-owner-only"
              checked={groupVisible !== 'all'}
              onChange={(e) => onChangeGroupVisible(e.target.checked ? 'owner' : 'all')}
              disabled={!canEdit}
            />
          </Row>
          {groupVisible !== 'all' && (
            <Row>
              <Label htmlFor="group-visible-include-manager">Include manager</Label>
              <Checkbox
                id="group-visible-include-manager"
                checked={groupVisible === 'owner_and_manager'}
                onChange={(e) => onChangeGroupVisible(e.target.checked ? 'owner_and_manager' : 'owner')}
                disabled={!canEdit}
              />
            </Row>
          )}
        </>
      )}
    </>
  )
}
