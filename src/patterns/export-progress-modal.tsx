import styled from 'styled-components'
import { Inline, Stack, Text } from '../primitives'
import { DialogShell } from '../components/overlays/dialog-shell'
import { Button } from '../components/inputs/button'
import { Spinner } from '../components/feedback/spinner'

const PROGRESS_TRACK_STYLE = {
  width: '100%',
  height: 8,
  borderRadius: 'var(--ig-radius-pill)',
  background: 'var(--ig-color-progress-track)',
  overflow: 'hidden' as const,
}

const ProgressFill = styled.div<{ $pct: number }>`
  height: 100%;
  width: ${(p) => Math.min(100, Math.max(0, p.$pct))}%;
  background: var(--ig-color-accent);
  transition: width var(--ig-motion-normal);
`

const LINK_STYLE = { textDecoration: 'none' }

export type ExportProgressPhase = 'preparing' | 'processing' | 'ready' | 'error'

export interface ExportProgressModalProps {
  open: boolean
  onClose: () => void
  phase: ExportProgressPhase
  progress?: number
  downloadUrl?: string
  filename?: string
  errorMessage?: string
  title?: string
  description?: string
  phaseLabel?: Partial<Record<ExportProgressPhase, string>>
}

const DEFAULT_PHASE_LABEL: Record<ExportProgressPhase, string> = {
  preparing: 'Preparing export…',
  processing: 'Processing…',
  ready: 'Export ready',
  error: 'Export failed',
}

export function ExportProgressModal({
  open, onClose, phase, progress = 0, downloadUrl, filename = 'export', errorMessage,
  title = 'Export',
  description,
  phaseLabel,
}: ExportProgressModalProps) {
  if (!open) return null
  const busy = phase === 'preparing' || phase === 'processing'
  const labelMap = { ...DEFAULT_PHASE_LABEL, ...phaseLabel }

  return (
    <DialogShell
      title={title}
      description={description}
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
      <Stack gap={4}>
        <Inline gap={2}>
          {busy ? <Spinner size="sm" /> : null}
          <Text tone="secondary" size="var(--ig-font-size-sm)">
            {phase === 'error' && errorMessage ? errorMessage : labelMap[phase]}
          </Text>
        </Inline>
        {busy ? (
          <div style={PROGRESS_TRACK_STYLE}>
            <ProgressFill $pct={progress} />
          </div>
        ) : null}
        {phase === 'ready' && downloadUrl ? (
          <Text as="a" tone="accent" size="var(--ig-font-size-sm)" href={downloadUrl} download={filename} style={LINK_STYLE}>Download {filename}</Text>
        ) : null}
      </Stack>
    </DialogShell>
  )
}
