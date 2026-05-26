import type { CSSProperties } from 'react'
import { Button, DialogShell } from '@ingradient/ui'
import { ProgressBarTrack, ProgressBarFill } from './ExportModalView.styles'
import type { ExportModalViewProps } from './types'

const DATASET_NAME_STYLE: CSSProperties = {
  fontSize: 'var(--ig-font-size-sm)',
  color: 'var(--ig-color-text-muted)',
  marginTop: '-6px',
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--ig-space-3)',
}

const IMAGE_COUNT_STYLE: CSSProperties = { opacity: 0.6 }

const LOCAL_COUNT_STYLE: CSSProperties = {
  fontSize: 'var(--ig-font-size-xs)',
  color: 'var(--ig-color-text-muted)',
  marginTop: '-8px',
}

const STATUS_MSG_STYLE: CSSProperties = {
  fontSize: 'var(--ig-font-size-sm)',
  fontWeight: 500,
  minHeight: 20,
}

export function ExportModalView(props: ExportModalViewProps): JSX.Element {
  const { datasetName, imageCount, localImageCount, phase, error, labels, onClose, onExport } = props
  const handleClose = () => { if (phase !== 'running') onClose() }
  return (
    <DialogShell
      title={labels.title}
      onClose={handleClose}
      width="min(480px, 90vw)"
      actions={
        <>
          <Button variant="secondary" size="sm" type="button" onClick={handleClose} disabled={phase === 'running'}>
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
        <span style={IMAGE_COUNT_STYLE}>{labels.images(imageCount)}</span>
      </div>
      <div style={LOCAL_COUNT_STYLE}>{labels.localImages(localImageCount)}</div>
      <ProgressBarTrack>
        <ProgressBarFill
          $done={phase === 'done'}
          $error={phase === 'error'}
          style={{ display: phase === 'idle' ? 'none' : undefined }}
        />
      </ProgressBarTrack>
      <div
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
