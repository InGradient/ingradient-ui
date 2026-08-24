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

const SECTION_TITLE_STYLE = { marginTop: 'var(--ig-space-7)', marginBottom: 'var(--ig-space-3)' }
const FIRST_TITLE_STYLE = { marginTop: 0, marginBottom: 0 }
const ROW_STYLE = {
  padding: 'var(--ig-space-5) 0',
  borderBottom: 'var(--ig-border-1px) solid var(--ig-color-border-strong)',
}
const LABEL_STYLE = { cursor: 'pointer' as const }
const INPUT_STYLE = { minWidth: 'var(--ig-popup-list-min)' }
const INPUT_FLEX_STYLE = { minWidth: 0 }
const NESTED_FIELD_STYLE = { flex: 1, minWidth: 0 }

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

      <Inline gap="var(--ig-space-3)" wrap="wrap">
        <Text as="h4" tone="muted" size="var(--ig-font-size-sm)" weight="semibold" uppercase letterSpacing="normal" style={FIRST_TITLE_STYLE}>Project name</Text>
        <ProjectTypeTag tone={projectType} />
      </Inline>
      <Inline justify="space-between" gap="var(--ig-space-7)" wrap="wrap" style={ROW_STYLE}>
        <TextField value={name} onChange={(e) => onChangeName(e.target.value)} placeholder="Project name" aria-label="Project name" disabled={!canEdit} style={INPUT_STYLE} />
      </Inline>

      <Text as="h4" tone="muted" size="var(--ig-font-size-sm)" weight="semibold" uppercase letterSpacing="normal" style={SECTION_TITLE_STYLE}>Description</Text>
      <Inline justify="space-between" gap="var(--ig-space-7)" wrap="wrap" style={ROW_STYLE}>
        <Textarea minHeight={80} value={description} onChange={(e) => onChangeDescription(e.target.value)} placeholder="Project description (optional)" aria-label="Project description" rows={3} disabled={!canEdit} />
      </Inline>

      <Text as="h4" tone="muted" size="var(--ig-font-size-sm)" weight="semibold" uppercase letterSpacing="normal" style={SECTION_TITLE_STYLE}>Data grouping</Text>
      <Inline justify="space-between" gap="var(--ig-space-7)" wrap="wrap" style={ROW_STYLE}>
        <Text as="label" htmlFor="multi-image-group" size="var(--ig-font-size-md)" style={LABEL_STYLE}>Group multiple images as one item (for labeling)</Text>
        <Checkbox id="multi-image-group" checked={groupEnabled} onChange={(e) => onChangeGroupEnabled(e.target.checked)} disabled={!canEdit} />
      </Inline>
      {groupEnabled && (
        <>
          <Inline justify="space-between" gap="var(--ig-space-7)" wrap="wrap" style={ROW_STYLE}>
            <Stack gap="var(--ig-space-2)" style={NESTED_FIELD_STYLE}>
              <Text as="label" htmlFor="group-key-regex" size="var(--ig-font-size-md)" style={LABEL_STYLE}>Group key pattern (regex with one capture group)</Text>
              <TextField id="group-key-regex" value={groupRegex} onChange={(e) => onChangeGroupRegex(e.target.value)} placeholder="e.g. ^([^_]+_[^_]+)_" disabled={!canEdit} style={INPUT_FLEX_STYLE} />
              <Text as="p" tone="soft" size="var(--ig-font-size-xs)" style={{ margin: 0, lineHeight: 'var(--ig-line-height-relaxed)' }}>File name is matched against this regex; the first captured group becomes the group key.</Text>
            </Stack>
          </Inline>
          <Inline justify="space-between" gap="var(--ig-space-7)" wrap="wrap" style={ROW_STYLE}>
            <Stack gap="var(--ig-space-2)" style={NESTED_FIELD_STYLE}>
              <Text as="label" htmlFor="group-representative-regex" size="var(--ig-font-size-md)" style={LABEL_STYLE}>Representative image pattern (optional regex)</Text>
              <TextField id="group-representative-regex" value={groupRepRegex} onChange={(e) => onChangeGroupRepRegex(e.target.value)} placeholder="e.g. _x_orig\.png$" disabled={!canEdit} style={INPUT_FLEX_STYLE} />
              <Text as="p" tone="soft" size="var(--ig-font-size-xs)" style={{ margin: 0, lineHeight: 'var(--ig-line-height-relaxed)' }}>If set, the matching file becomes the representative image for each group.</Text>
            </Stack>
          </Inline>
        </>
      )}

      <Text as="h4" tone="muted" size="var(--ig-font-size-sm)" weight="semibold" uppercase letterSpacing="normal" style={SECTION_TITLE_STYLE}>Upload</Text>
      <Inline justify="space-between" gap="var(--ig-space-7)" wrap="wrap" style={ROW_STYLE}>
        <Text as="label" htmlFor="allow-duplicate-filenames" size="var(--ig-font-size-md)" style={LABEL_STYLE}>Allow duplicate file names</Text>
        <Checkbox id="allow-duplicate-filenames" checked={allowDup} onChange={(e) => onChangeAllowDup(e.target.checked)} disabled={!canEdit} />
      </Inline>

      <Text as="h4" tone="muted" size="var(--ig-font-size-sm)" weight="semibold" uppercase letterSpacing="normal" style={SECTION_TITLE_STYLE}>Display</Text>
      <Inline justify="space-between" gap="var(--ig-space-7)" wrap="wrap" style={ROW_STYLE}>
        <Text as="label" htmlFor="show-filename-in-gallery" size="var(--ig-font-size-md)" style={LABEL_STYLE}>Show file name below each thumbnail in Catalog</Text>
        <Checkbox id="show-filename-in-gallery" checked={showFilenameInGallery} onChange={(e) => onChangeShowFilenameInGallery(e.target.checked)} disabled={!canEdit} />
      </Inline>
      <Inline justify="space-between" gap="var(--ig-space-7)" wrap="wrap" style={ROW_STYLE}>
        <Text as="label" htmlFor="show-bbox-class-names-in-detail" size="var(--ig-font-size-md)" style={LABEL_STYLE}>Show class name on bbox in Image Detail</Text>
        <Checkbox id="show-bbox-class-names-in-detail" checked={showBboxClassNamesInDetail} onChange={(e) => onChangeShowBboxClassNamesInDetail(e.target.checked)} disabled={!canEdit} />
      </Inline>

      {isOwner && (
        <>
          <Text as="h4" tone="muted" size="var(--ig-font-size-sm)" weight="semibold" uppercase letterSpacing="normal" style={SECTION_TITLE_STYLE}>Group visibility (owner only)</Text>
          <Inline justify="space-between" gap="var(--ig-space-7)" wrap="wrap" style={ROW_STYLE}>
            <Text as="label" htmlFor="group-visible-owner-only" size="var(--ig-font-size-md)" style={LABEL_STYLE}>Only owner can see all images in group</Text>
            <Checkbox
              id="group-visible-owner-only"
              checked={groupVisible !== 'all'}
              onChange={(e) => onChangeGroupVisible(e.target.checked ? 'owner' : 'all')}
              disabled={!canEdit}
            />
          </Inline>
          {groupVisible !== 'all' && (
            <Inline justify="space-between" gap="var(--ig-space-7)" wrap="wrap" style={ROW_STYLE}>
              <Text as="label" htmlFor="group-visible-include-manager" size="var(--ig-font-size-md)" style={LABEL_STYLE}>Include manager</Text>
              <Checkbox
                id="group-visible-include-manager"
                checked={groupVisible === 'owner_and_manager'}
                onChange={(e) => onChangeGroupVisible(e.target.checked ? 'owner_and_manager' : 'owner')}
                disabled={!canEdit}
              />
            </Inline>
          )}
        </>
      )}
    </>
  )
}
