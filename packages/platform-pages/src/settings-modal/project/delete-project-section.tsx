import styled from 'styled-components'
import { Box, Inline, Text } from '@ingradient/ui/primitives'
import { Button } from '@ingradient/ui/components'
import { TextField } from '@ingradient/ui/components'

const WrapBox = styled(Box)`
  margin-top: var(--ig-spacing-24);
  padding-top: var(--ig-spacing-20);
  border-top: var(--ig-border-1px) solid var(--ig-color-border-subtle);
`

const SubsectionTitleBox = styled(Text)`
  margin-bottom: var(--ig-spacing-8);
`
const HintBox = styled(Text)`
  margin-bottom: var(--ig-spacing-8);
`
const RowBox = styled(Inline)`
  margin-top: var(--ig-spacing-8);
`
const ConfirmInputBox = styled(TextField)`
  min-width: var(--ig-popup-list-min);
  flex: 1;
`

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
    <WrapBox>
      <SubsectionTitleBox forwardedAs="h4" tone="muted" size="var(--ig-text-body-sm)" weight="semibold">{title}</SubsectionTitleBox>
      <HintBox forwardedAs="p" tone="soft" size="var(--ig-text-body)">{hintTemplate(projectName)}</HintBox>
      <RowBox gap="var(--ig-spacing-8)" wrap="wrap">
        <ConfirmInputBox
          type="text"
          value={confirmInput}
          onChange={(e) => onChangeConfirmInput(e.target.value)}
          placeholder={projectName}
          aria-label="Type project name to confirm delete"
        />
        <Button type="button" variant="secondary" tone="danger" disabled={disabled} onClick={onDelete}>
          {pending ? 'Deleting…' : 'Delete project'}
        </Button>
      </RowBox>
    </WrapBox>
  )
}
