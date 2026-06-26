import { Inline, Stack, Text } from '@ingradient/ui/primitives'
import { DialogShell } from '@ingradient/ui/components'
import { Button } from '@ingradient/ui/components'
import { ProgressBar } from '@ingradient/ui/components'
import { Spinner } from '@ingradient/ui/components'

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
      width="min(var(--ig-popup-2xl-wide), 100%)"
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
        {busy ? <ProgressBar value={progress} /> : null}
        {phase === 'ready' && downloadUrl ? (
          <Text as="a" tone="accent" size="var(--ig-font-size-sm)" href={downloadUrl} download={filename} style={LINK_STYLE}>Download {filename}</Text>
        ) : null}
      </Stack>
    </DialogShell>
  )
}
