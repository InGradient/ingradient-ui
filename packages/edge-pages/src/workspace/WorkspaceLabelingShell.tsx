import { Spinner } from '@ingradient/ui'
import { Container, SavingOverlay } from './WorkspaceView.styles'
import { SequenceFailureDialog } from './SequenceFailureDialog'
import { CapturingPill } from './CapturingPill'
import type { WorkspaceViewProps } from './types'

export function WorkspaceLabelingShell(props: WorkspaceViewProps): JSX.Element {
  const {
    isSavingLabel, labelingContent, sequenceFailure, isCapturing, capturingStatusText,
    labels, onSequenceFailureCancel, onSequenceFailureRetry,
  } = props
  return (
    <Container $row data-ig-component="WorkspaceLabelingShell" data-ig-layer="pages">
      {isSavingLabel && (
        <SavingOverlay>
          <Spinner tone="white" />
          {labels.saving}
        </SavingOverlay>
      )}
      <Container style={{ flex: 1, minWidth: 0 }}>
        {labelingContent}
      </Container>
      {sequenceFailure && (
        <SequenceFailureDialog
          info={sequenceFailure}
          labels={labels}
          onCancel={onSequenceFailureCancel}
          onRetry={onSequenceFailureRetry}
        />
      )}
      {isCapturing && <CapturingPill>{capturingStatusText}</CapturingPill>}
    </Container>
  )
}
