import React from 'react'
import styled from 'styled-components'
import { DialogShell } from '../../components/overlays/dialog-shell'
import { Button } from '../../components/inputs/button'
import { Spinner } from '../../components/feedback/spinner'

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-4);
`

const ProgressTrack = styled.div`
  width: 100%;
  height: 8px;
  border-radius: var(--ig-radius-pill);
  background: var(--ig-color-progress-track);
  overflow: hidden;
`

const ProgressFill = styled.div<{ $pct: number }>`
  height: 100%;
  width: ${(p) => Math.min(100, Math.max(0, p.$pct))}%;
  background: var(--ig-color-accent);
  transition: width var(--ig-motion-normal);
`

const StatusLine = styled.span`
  display: inline-flex;
  align-items: center;
  gap: var(--ig-space-2);
  font-size: var(--ig-font-size-sm);
  color: var(--ig-color-text-secondary);
`

const Link = styled.a`
  color: var(--ig-color-accent);
  text-decoration: none;
  font-size: var(--ig-font-size-sm);
  &:hover { text-decoration: underline; }
`

export type IgpExportPhase = 'preparing' | 'compressing' | 'ready' | 'error'

export interface IgpExportModalProps {
  open: boolean
  onClose: () => void
  phase: IgpExportPhase
  progress?: number
  downloadUrl?: string
  filename?: string
  errorMessage?: string
}

const PHASE_LABEL: Record<IgpExportPhase, string> = {
  preparing: 'Preparing export…',
  compressing: 'Compressing files…',
  ready: 'Export ready',
  error: 'Export failed',
}

export function IgpExportModal({
  open, onClose, phase, progress = 0, downloadUrl, filename = 'dataset.igp', errorMessage,
}: IgpExportModalProps) {
  if (!open) return null
  const busy = phase === 'preparing' || phase === 'compressing'

  return (
    <DialogShell
      title="Export (.igp)"
      description={`Export the dataset as a single .igp archive containing images, labels, and metadata.`}
      onClose={onClose}
      width="min(520px, 100%)"
      actions={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>{phase === 'ready' ? 'Close' : 'Cancel'}</Button>
          {phase === 'ready' && downloadUrl ? (
            <a href={downloadUrl} download={filename} style={{ textDecoration: 'none' }}>
              <Button type="button" variant="accent">Download {filename}</Button>
            </a>
          ) : null}
        </>
      }
    >
      <Wrap>
        <StatusLine>
          {busy ? <Spinner size="sm" /> : null}
          {phase === 'error' && errorMessage ? errorMessage : PHASE_LABEL[phase]}
        </StatusLine>
        {busy ? (
          <ProgressTrack>
            <ProgressFill $pct={progress} />
          </ProgressTrack>
        ) : null}
        {phase === 'ready' && downloadUrl ? (
          <Link href={downloadUrl} download={filename}>Download {filename}</Link>
        ) : null}
      </Wrap>
    </DialogShell>
  )
}
