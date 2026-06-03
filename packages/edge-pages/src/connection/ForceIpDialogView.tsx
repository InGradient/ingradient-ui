import { Button, DialogShell, TextField } from '@ingradient/ui'
import type { ForceIpDialogViewProps } from './types'

export function ForceIpDialogView(props: ForceIpDialogViewProps): JSX.Element {
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
          <label style={{ fontSize: 'var(--ig-font-size-xs)', color: 'var(--ig-color-text-muted)', display: 'block', marginBottom: 4 }}>
            {labels.forceIpStaticIp}
          </label>
          <TextField value={newIp} onChange={(e) => onIpChange(e.target.value)} placeholder="192.168.1.10" />
        </div>
        <div>
          <label style={{ fontSize: 'var(--ig-font-size-xs)', color: 'var(--ig-color-text-muted)', display: 'block', marginBottom: 4 }}>
            {labels.forceIpSubnet}
          </label>
          <TextField value={newSubnet} onChange={(e) => onSubnetChange(e.target.value)} placeholder="255.255.255.0" />
        </div>
        {error && <div style={{ fontSize: 'var(--ig-font-size-sm)', color: 'var(--ig-color-danger)' }}>{error}</div>}
      </div>
    </DialogShell>
  )
}
