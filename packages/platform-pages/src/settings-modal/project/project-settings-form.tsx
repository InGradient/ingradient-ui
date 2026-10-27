import styled from 'styled-components'
import type { ReactNode } from 'react'
import { Inline, Stack, Text } from '@ingradient/ui/primitives'
import { Badge, Checkbox, TextField, Textarea } from '@ingradient/ui/components'
import { AutoSaveStatus, type AutoSaveState } from '@ingradient/ui/patterns'

export type ProjectTypeTone = 'general' | 'deflectometry' | 'photometric_stereo'

const PROJECT_TYPE_TONE_BG: Record<ProjectTypeTone, string> = {
  general: 'var(--ig-color-project-tag-general)',
  deflectometry: 'var(--ig-color-accent-strong)',
  photometric_stereo: 'var(--ig-color-project-tag-photometric-stereo)',
}

const PROJECT_TYPE_LABELS: Record<ProjectTypeTone, string> = {
  general: 'General Project',
  deflectometry: 'Deflectometry Project',
  photometric_stereo: 'Photometric Stereo Project',
}

const PROJECT_TYPE_TAG_STYLE = {
  letterSpacing: 'var(--ig-letter-spacing-wider)',
  textTransform: 'uppercase' as const,
}

function ProjectTypeTag({ tone, children }: { tone: ProjectTypeTone; children?: ReactNode }) {
  const color = tone === 'deflectometry' ? 'var(--ig-color-on-accent)' : undefined
  return (
    <Badge $tone="neutral" style={{ ...PROJECT_TYPE_TAG_STYLE, background: PROJECT_TYPE_TONE_BG[tone], color }}>
      {children ?? PROJECT_TYPE_LABELS[tone]}
    </Badge>
  )
}

const SectionTitleBox = styled(Text)`
  margin-top: var(--ig-spacing-16);
  margin-bottom: var(--ig-spacing-8);
`
const FirstTitleBox = styled(Text)`
  margin-top: 0;
  margin-bottom: 0;
`
const RowBox = styled(Inline)`
  padding: var(--ig-spacing-12) 0;
  border-bottom: var(--ig-border-1px) solid var(--ig-color-border-strong);
`
const LabelBox = styled(Text)`
  cursor: pointer;
`
const InputBox = styled(TextField)`
  min-width: var(--ig-layout-size-field-md);
`
const InputFlexBox = styled(TextField)`
  min-width: 0;
`
const NestedFieldBox = styled(Stack)`
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

      <Inline gap="var(--ig-spacing-8)" wrap="wrap">
        <FirstTitleBox forwardedAs="h4" tone="muted" size="var(--ig-text-body-sm)" weight="semibold">Project name</FirstTitleBox>
        <ProjectTypeTag tone={projectType} />
      </Inline>
      <RowBox justify="space-between" gap="var(--ig-spacing-16)" wrap="wrap">
        <InputBox value={name} onChange={(e) => onChangeName(e.target.value)} placeholder="Project name" aria-label="Project name" disabled={!canEdit} />
      </RowBox>

      <SectionTitleBox forwardedAs="h4" tone="muted" size="var(--ig-text-body-sm)" weight="semibold">Description</SectionTitleBox>
      <RowBox justify="space-between" gap="var(--ig-spacing-16)" wrap="wrap">
        <Textarea minHeight={80} value={description} onChange={(e) => onChangeDescription(e.target.value)} placeholder="Project description (optional)" aria-label="Project description" rows={3} disabled={!canEdit} />
      </RowBox>

      <SectionTitleBox forwardedAs="h4" tone="muted" size="var(--ig-text-body-sm)" weight="semibold">Data grouping</SectionTitleBox>
      <RowBox justify="space-between" gap="var(--ig-spacing-16)" wrap="wrap">
        <LabelBox forwardedAs="label" htmlFor="multi-image-group" size="var(--ig-text-body)">Group multiple images as one item (for labeling)</LabelBox>
        <Checkbox id="multi-image-group" checked={groupEnabled} onChange={(e) => onChangeGroupEnabled(e.target.checked)} disabled={!canEdit} />
      </RowBox>
      {groupEnabled && (
        <>
          <RowBox justify="space-between" gap="var(--ig-spacing-16)" wrap="wrap">
            <NestedFieldBox gap="var(--ig-spacing-8)">
              <LabelBox forwardedAs="label" htmlFor="group-key-regex" size="var(--ig-text-body)">Group key pattern (regex with one capture group)</LabelBox>
              <InputFlexBox id="group-key-regex" value={groupRegex} onChange={(e) => onChangeGroupRegex(e.target.value)} placeholder="e.g. ^([^_]+_[^_]+)_" disabled={!canEdit} />
              <Text as="p" tone="soft" size="var(--ig-text-caption)" style={{ margin: 0, lineHeight: 'var(--ig-line-height-relaxed)' }}>File name is matched against this regex; the first captured group becomes the group key.</Text>
            </NestedFieldBox>
          </RowBox>
          <RowBox justify="space-between" gap="var(--ig-spacing-16)" wrap="wrap">
            <NestedFieldBox gap="var(--ig-spacing-8)">
              <LabelBox forwardedAs="label" htmlFor="group-representative-regex" size="var(--ig-text-body)">Representative image pattern (optional regex)</LabelBox>
              <InputFlexBox id="group-representative-regex" value={groupRepRegex} onChange={(e) => onChangeGroupRepRegex(e.target.value)} placeholder="e.g. _x_orig\.png$" disabled={!canEdit} />
              <Text as="p" tone="soft" size="var(--ig-text-caption)" style={{ margin: 0, lineHeight: 'var(--ig-line-height-relaxed)' }}>If set, the matching file becomes the representative image for each group.</Text>
            </NestedFieldBox>
          </RowBox>
        </>
      )}

      <SectionTitleBox forwardedAs="h4" tone="muted" size="var(--ig-text-body-sm)" weight="semibold">Upload</SectionTitleBox>
      <RowBox justify="space-between" gap="var(--ig-spacing-16)" wrap="wrap">
        <LabelBox forwardedAs="label" htmlFor="allow-duplicate-filenames" size="var(--ig-text-body)">Allow duplicate file names</LabelBox>
        <Checkbox id="allow-duplicate-filenames" checked={allowDup} onChange={(e) => onChangeAllowDup(e.target.checked)} disabled={!canEdit} />
      </RowBox>

      <SectionTitleBox forwardedAs="h4" tone="muted" size="var(--ig-text-body-sm)" weight="semibold">Display</SectionTitleBox>
      <RowBox justify="space-between" gap="var(--ig-spacing-16)" wrap="wrap">
        <LabelBox forwardedAs="label" htmlFor="show-filename-in-gallery" size="var(--ig-text-body)">Show file name below each thumbnail in Catalog</LabelBox>
        <Checkbox id="show-filename-in-gallery" checked={showFilenameInGallery} onChange={(e) => onChangeShowFilenameInGallery(e.target.checked)} disabled={!canEdit} />
      </RowBox>
      <RowBox justify="space-between" gap="var(--ig-spacing-16)" wrap="wrap">
        <LabelBox forwardedAs="label" htmlFor="show-bbox-class-names-in-detail" size="var(--ig-text-body)">Show class name on bbox in Image Detail</LabelBox>
        <Checkbox id="show-bbox-class-names-in-detail" checked={showBboxClassNamesInDetail} onChange={(e) => onChangeShowBboxClassNamesInDetail(e.target.checked)} disabled={!canEdit} />
      </RowBox>

      {isOwner && (
        <>
          <SectionTitleBox forwardedAs="h4" tone="muted" size="var(--ig-text-body-sm)" weight="semibold">Group visibility (owner only)</SectionTitleBox>
          <RowBox justify="space-between" gap="var(--ig-spacing-16)" wrap="wrap">
            <LabelBox forwardedAs="label" htmlFor="group-visible-owner-only" size="var(--ig-text-body)">Only owner can see all images in group</LabelBox>
            <Checkbox
              id="group-visible-owner-only"
              checked={groupVisible !== 'all'}
              onChange={(e) => onChangeGroupVisible(e.target.checked ? 'owner' : 'all')}
              disabled={!canEdit}
            />
          </RowBox>
          {groupVisible !== 'all' && (
            <RowBox justify="space-between" gap="var(--ig-spacing-16)" wrap="wrap">
              <LabelBox forwardedAs="label" htmlFor="group-visible-include-manager" size="var(--ig-text-body)">Include manager</LabelBox>
              <Checkbox
                id="group-visible-include-manager"
                checked={groupVisible === 'owner_and_manager'}
                onChange={(e) => onChangeGroupVisible(e.target.checked ? 'owner_and_manager' : 'owner')}
                disabled={!canEdit}
              />
            </RowBox>
          )}
        </>
      )}
    </>
  )
}
