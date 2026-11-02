import { AlertTriangleIcon } from '@ingradient/ui/components'
import { Button, DialogShell, iconSizeNumbers } from '@ingradient/ui'
import { FailureCode } from './WorkspaceView.styles'
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
          <AlertTriangleIcon size={iconSizeNumbers.lg} color="var(--ig-color-danger)" style={{ marginRight: 'var(--ig-spacing-8)' }} />
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
          <Button type="button" variant="secondary" onClick={onCancel}>{labels.cancel}</Button>
          <Button type="button" variant="solid" onClick={onRetry}>{labels.retry}</Button>
        </>
      }
    />
  )
}
