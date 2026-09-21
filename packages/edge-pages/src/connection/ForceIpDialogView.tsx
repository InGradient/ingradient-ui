import { useId } from 'react'
import { Button, DialogShell, TextField } from '@ingradient/ui'
import type { ForceIpDialogViewProps } from './types'

export function ForceIpDialogView(props: ForceIpDialogViewProps): JSX.Element {
  const id = useId()
  const {
    cameraId, currentIp, newIp, newSubnet, applying, error, labels,
    onIpChange, onSubnetChange, onApply, onCancel,
  } = props
  return (
    <DialogShell
      title={labels.forceIpDialogTitle}
      onClose={onCancel}
      width="min(var(--ig-popup-2xl-narrow), 90vw)"
      actions={
        <>
          <Button size="sm" variant="secondary" type="button" onClick={onCancel}>{labels.forceIpCancel}</Button>
          <Button size="sm" variant="accent" type="button" onClick={onApply} disabled={applying || !newIp.trim() || !newSubnet.trim()}>
            {applying ? labels.forceIpApplying : labels.forceIpApply}
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ig-space-4)' }}>
        <div style={{ fontSize: 'var(--ig-font-size-sm)', color: 'var(--ig-color-text-muted)' }}>
          {cameraId} · current {currentIp ?? '—'}
        </div>
        <div>
          <label htmlFor={`${id}-ip`} style={{ fontSize: 'var(--ig-font-size-xs)', color: 'var(--ig-color-text-muted)', display: 'block', marginBottom: 'var(--ig-space-1)' }}>
            {labels.forceIpStaticIp}
          </label>
          <TextField id={`${id}-ip`} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} value={newIp} onChange={(e) => onIpChange(e.target.value)} placeholder="192.168.1.10" />
        </div>
        <div>
          <label htmlFor={`${id}-subnet`} style={{ fontSize: 'var(--ig-font-size-xs)', color: 'var(--ig-color-text-muted)', display: 'block', marginBottom: 'var(--ig-space-1)' }}>
            {labels.forceIpSubnet}
          </label>
          <TextField id={`${id}-subnet`} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} value={newSubnet} onChange={(e) => onSubnetChange(e.target.value)} placeholder="255.255.255.0" />
        </div>
        {error && <div id={`${id}-error`} role="alert" style={{ fontSize: 'var(--ig-font-size-sm)', color: 'var(--ig-color-danger)' }}>{error}</div>}
      </div>
    </DialogShell>
  )
}
