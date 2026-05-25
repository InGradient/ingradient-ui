import styled from 'styled-components'
import { Text } from '../../primitives'
import { Button } from '../../components/inputs/button'
import { TextField } from '../../components/inputs/text-fields'

const Wrap = styled.div`
  margin-top: var(--ig-space-11);
  padding-top: var(--ig-space-9);
  border-top: 1px solid var(--ig-color-border-subtle);
`

const SUBSECTION_TITLE_STYLE = { marginBottom: 'var(--ig-space-3)' }

const Hint = styled.p`
  color: var(--ig-color-text-soft);
  font-size: 14px;
  margin: 0 0 var(--ig-space-3);
`

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ig-space-3);
  flex-wrap: wrap;
  margin-top: var(--ig-space-3);
`

const ConfirmInput = styled(TextField)`
  min-width: 200px;
  flex: 1;
`

const DangerButton = styled(Button).attrs({ variant: 'secondary' as const, tone: 'danger' as const })``

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
    <Wrap>
      <Text as="h4" tone="muted" size="13px" weight={600} uppercase letterSpacing="0.04em" style={SUBSECTION_TITLE_STYLE}>{title}</Text>
      <Hint>{hintTemplate(projectName)}</Hint>
      <Row>
        <ConfirmInput
          type="text"
          value={confirmInput}
          onChange={(e) => onChangeConfirmInput(e.target.value)}
          placeholder={projectName}
          aria-label="Type project name to confirm delete"
        />
        <DangerButton type="button" disabled={disabled} onClick={onDelete}>
          {pending ? 'Deleting…' : 'Delete project'}
        </DangerButton>
      </Row>
    </Wrap>
  )
}
