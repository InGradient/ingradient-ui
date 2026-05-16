import styled from 'styled-components'
import { Button } from '../../components/inputs/button'
import { TextField } from '../../components/inputs/text-fields'

const Wrap = styled.div`
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--ig-color-border-subtle);
`

const SubsectionTitle = styled.h4`
  margin: 0 0 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--ig-color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
`

const Hint = styled.p`
  color: var(--ig-color-text-soft);
  font-size: 14px;
  margin: 0 0 8px;
`

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 8px;
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
      <SubsectionTitle>{title}</SubsectionTitle>
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
