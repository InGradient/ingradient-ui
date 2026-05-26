import { Box, Inline, Text } from '@ingradient/ui/primitives'
import { Button } from '@ingradient/ui/components'
import { TextField } from '@ingradient/ui/components'

const WRAP_STYLE = {
  marginTop: 'var(--ig-space-11)',
  paddingTop: 'var(--ig-space-9)',
  borderTop: '1px solid var(--ig-color-border-subtle)',
}

const SUBSECTION_TITLE_STYLE = { marginBottom: 'var(--ig-space-3)' }
const HINT_STYLE = { marginBottom: 'var(--ig-space-3)' }
const ROW_STYLE = { marginTop: 'var(--ig-space-3)' }
const CONFIRM_INPUT_STYLE = { minWidth: 200, flex: 1 }

export interface DeleteProjectSectionProps {
  projectName: string
  confirmInput: string
  onChangeConfirmInput: (value: string) => void
  pending?: boolean
  onDelete: () => void
  title?: string
  hintTemplate?: (projectName: string) => string
}

const DEFAULT_HINT = (name: string) => `Type the project name "${name}" to confirm, then click Delete.`

export function DeleteProjectSection({
  projectName, confirmInput, onChangeConfirmInput, pending, onDelete,
  title = 'Delete project',
  hintTemplate = DEFAULT_HINT,
}: DeleteProjectSectionProps) {
  const disabled = confirmInput !== projectName || !!pending
  return (
    <Box style={WRAP_STYLE}>
      <Text as="h4" tone="muted" size="13px" weight={600} uppercase letterSpacing="0.04em" style={SUBSECTION_TITLE_STYLE}>{title}</Text>
      <Text as="p" tone="soft" size="14px" style={HINT_STYLE}>{hintTemplate(projectName)}</Text>
      <Inline gap={3} wrap="wrap" style={ROW_STYLE}>
        <TextField
          type="text"
          value={confirmInput}
          onChange={(e) => onChangeConfirmInput(e.target.value)}
          placeholder={projectName}
          aria-label="Type project name to confirm delete"
          style={CONFIRM_INPUT_STYLE}
        />
        <Button type="button" variant="secondary" tone="danger" disabled={disabled} onClick={onDelete}>
          {pending ? 'Deleting…' : 'Delete project'}
        </Button>
      </Inline>
    </Box>
  )
}
