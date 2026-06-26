import { AlertTriangleIcon } from '@ingradient/ui/components'
import { DialogShell, iconSizeNumbers } from '@ingradient/ui'
import { ConfirmButton, FailureCode } from './WorkspaceView.styles'
import type { SequenceFailureInfo, WorkspaceLabels } from './types'

interface SequenceFailureDialogProps {
  info: SequenceFailureInfo
  labels: Pick<WorkspaceLabels, 'sequenceFailed' | 'errorCode' | 'cancel' | 'retry'>
  onCancel: () => void
  onRetry: () => void
}

export function SequenceFailureDialog(props: SequenceFailureDialogProps): JSX.Element {
  const { info, labels, onCancel, onRetry } = props
  return (
    <DialogShell
      title={
        <>
          <AlertTriangleIcon size={iconSizeNumbers.lg} color="var(--ig-color-danger)" style={{ marginRight: 'var(--ig-space-2)' }} />
          {labels.sequenceFailed}
        </>
      }
      description={
        <>
          {info.message}
          <FailureCode>{labels.errorCode} {info.errorCode}</FailureCode>
        </>
      }
      onClose={onCancel}
      width="min(var(--ig-popup-xl), 100%)"
      actions={
        <>
          <ConfirmButton type="button" onClick={onCancel}>{labels.cancel}</ConfirmButton>
          <ConfirmButton type="button" $danger onClick={onRetry}>{labels.retry}</ConfirmButton>
        </>
      }
    />
  )
}
