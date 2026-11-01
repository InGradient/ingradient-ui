import type { CSSProperties } from 'react'
import { Button, DialogShell, ProgressBar } from '@ingradient/ui'
import type { ExportModalViewProps } from './types'

const DATASET_NAME_STYLE: CSSProperties = {
  fontSize: 'var(--ig-text-body-sm)',
  color: 'var(--ig-color-text-muted)',
  marginTop: 'calc(var(--ig-spacing-8) * -1)',
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--ig-spacing-8)',
}

const LOCAL_COUNT_STYLE: CSSProperties = {
  fontSize: 'var(--ig-text-caption)',
  color: 'var(--ig-color-text-muted)',
  marginTop: 'calc(var(--ig-spacing-8) * -1)',
}

const STATUS_MSG_STYLE: CSSProperties = {
  fontSize: 'var(--ig-text-body-sm)',
  fontWeight: 'var(--ig-font-weight-medium)',
  minHeight: 'var(--ig-spacing-20)',
}

export function ExportModalView(props: ExportModalViewProps): JSX.Element {
  const { datasetName, imageCount, localImageCount, phase, error, labels, onClose, onExport } = props
  const handleClose = () => { if (phase === 'running') props.onCancel?.(); else onClose() }
  return (
    <DialogShell
      title={labels.title}
      onClose={handleClose}
      width="min(var(--ig-popup-xl), 90vw)"
      actions={
        <>
          <Button variant="secondary" size="sm" type="button" onClick={handleClose} disabled={phase === 'running' && !props.onCancel}>
            {phase === 'done' ? labels.close : labels.cancel}
          </Button>
          {phase !== 'done' && (
            <Button variant="accent" size="sm" type="button" onClick={onExport} disabled={phase === 'running' || localImageCount === 0}>
              {phase === 'running' ? labels.exporting : labels.export}
            </Button>
          )}
        </>
      }
    >
      <div style={DATASET_NAME_STYLE}>
        {datasetName}
        <span>{labels.images(imageCount)}</span>
      </div>
      <div style={LOCAL_COUNT_STYLE}>{labels.localImages(localImageCount)}</div>
      <ProgressBar
        ariaLabel={labels.exporting}
        indeterminate={phase === 'running'}
        value={phase === 'done' || phase === 'error' ? 100 : 0}
        tone={phase === 'error' ? 'danger' : 'accent'}
      />
      <div
        role={phase === 'error' ? 'alert' : 'status'}
        style={{
          ...STATUS_MSG_STYLE,
          color: phase === 'done' ? 'var(--ig-color-success)' : 'var(--ig-color-danger)',
        }}
      >
        {phase === 'done' && labels.complete}
        {phase === 'error' && error}
      </div>
    </DialogShell>
  )
}
