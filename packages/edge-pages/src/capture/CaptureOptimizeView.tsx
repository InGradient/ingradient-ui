import ReactDOM from 'react-dom'
import styled from 'styled-components'
import { Button, DialogShell, iconSizeNumbers } from '@ingradient/ui'
import { AlertTriangleIcon, ProgressBar } from '@ingradient/ui/components'
import { FieldHint } from '@ingradient/ui/patterns'
import { Stack, Text } from '@ingradient/ui/primitives'
import type { CaptureOptimizeViewProps, OptimizeRow, OptimizeTimes } from './types'

const Warn = styled.div`
  display: flex;
  align-items: flex-start;
  gap: var(--ig-spacing-8);
  padding: calc(var(--ig-spacing-8) - var(--ig-border-1px)) calc(var(--ig-spacing-12) - var(--ig-border-1px));
  border: var(--ig-border-1px) solid var(--ig-color-alert-warning-border, var(--ig-color-warning));
  border-radius: var(--ig-radius-sm);
  background: var(--ig-color-alert-warning-bg, transparent);
  color: var(--ig-color-text-primary);
  font-size: var(--ig-text-body-sm);
  line-height: var(--ig-text-body-sm-leading);
  & > svg { flex-shrink: 0; margin-top: var(--ig-spacing-2); color: var(--ig-color-warning); }
`

const Grid = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: var(--ig-text-caption);
  line-height: var(--ig-text-caption-leading);
  font-variant-numeric: tabular-nums;
  th, td {
    height: var(--ig-control-height-xs);
    padding: 0 var(--ig-spacing-4);
    text-align: right;
    box-shadow: inset 0 var(--ig-space-neg-1px) 0 var(--ig-color-border-subtle);
    white-space: nowrap;
  }
  th:first-child, td:first-child { text-align: left; }
  th { color: var(--ig-color-text-soft); font-weight: var(--ig-font-weight-medium); }
  tr[data-best='true'] td { background: var(--ig-color-accent-soft-surface); }
  tr[data-ok='false'] td { color: var(--ig-color-text-soft); }
`

const Scroll = styled.div`
  max-height: var(--ig-layout-size-preview-height);
  overflow: auto;
`

const sec = (v: number) => `${v.toFixed(1)}s`
const same = (a: OptimizeRow, b: OptimizeRow | null) =>
  !!b && a.exposure_ms === b.exposure_ms && a.avg === b.avg && a.brightness_max === b.brightness_max

function TimeRow({ label, t }: { label: string; t: OptimizeTimes }) {
  return <tr><td>{label}</td><td>{sec(t.capture_s)}</td><td>{sec(t.save_s)}</td><td>{sec(t.judge_s)}</td><td><strong>{sec(t.total_s)}</strong></td></tr>
}

/**
 * "Find the best capture settings": a button under Camera Tuning and its dialogs
 * (confirm → running with progress and Stop only → result to apply, or error). The caller owns the run.
 */
export function CaptureOptimizeView(props: CaptureOptimizeViewProps): JSX.Element {
  const { phase, isConnected, isSetupBusy, setupDirty, progress, result, error, labels: l, onOpen, onCancel, onStart, onStop, onApply } = props
  const hint = !isConnected ? l.needCamera : setupDirty ? l.needSave : l.desc
  const doNotTouch = <Warn role="alert"><AlertTriangleIcon size={iconSizeNumbers.md} />{l.doNotTouch}</Warn>
  const best = result?.best ?? null

  const dialog = (() => {
    if (phase === 'confirm') {
      return (
        <DialogShell title={l.title} onClose={onCancel} width="min(var(--ig-popup-xl), 100%)"
          actions={<><Button variant="secondary" onClick={onCancel}>{l.cancel}</Button><Button variant="solid" onClick={onStart}>{l.start}</Button></>}>
          <Stack gap="var(--ig-spacing-12)"><Text as="p" size="var(--ig-text-body-sm)">{l.confirmBody}</Text>{doNotTouch}</Stack>
        </DialogShell>
      )
    }
    if (phase === 'running') {
      // No close button and no Escape: only Stop ends the run.
      return (
        <DialogShell title={l.runningTitle} width="min(var(--ig-popup-xl), 100%)"
          actions={<Button variant="secondary" tone="danger" onClick={onStop}>{l.stop}</Button>}>
          <Stack gap="var(--ig-spacing-12)">
            {doNotTouch}
            <ProgressBar value={progress?.percent ?? 0} ariaLabel={l.runningTitle} />
            <Text as="div" size="var(--ig-text-body-sm)" tone="muted" tabularNums>{progress ? `${progress.percent}% · ${progress.stage}` : ''}</Text>
          </Stack>
        </DialogShell>
      )
    }
    if (phase === 'result' && result) {
      return (
        <DialogShell title={l.resultTitle} onClose={onCancel} width="min(var(--ig-layout-size-form), 100%)"
          actions={<><Button variant="secondary" onClick={onCancel}>{l.cancel}</Button><Button variant="solid" onClick={onApply} disabled={!best}>{l.apply}</Button></>}>
          <Stack gap="var(--ig-spacing-12)">
            {best && !best.ok && <Warn role="alert"><AlertTriangleIcon size={iconSizeNumbers.md} />{l.notOk}</Warn>}
            {result.warnings.map((w) => <Warn key={w} role="alert"><AlertTriangleIcon size={iconSizeNumbers.md} />{l.warn[w] ?? w}</Warn>)}
            {best && (
              <Grid>
                <thead><tr><td aria-hidden="true" /><th scope="col">{l.current}</th><th scope="col">{l.next}</th></tr></thead>
                <tbody>
                  <tr><td>{l.exposure}</td><td>{result.current.exposure_ms ?? '-'} ms</td><td><strong>{best.exposure_ms} ms</strong></td></tr>
                  <tr><td>{l.avg}</td><td>{result.current.avg}</td><td><strong>{best.avg}</strong></td></tr>
                  <tr><td>{l.brightnessMax}</td><td>{result.current.brightness_max}</td><td><strong>{best.brightness_max}</strong></td></tr>
                </tbody>
              </Grid>
            )}
            {best && (
              <Grid>
                <thead><tr><th scope="col">{l.timeTitle}</th><th scope="col">{l.tCapture}</th><th scope="col">{l.tSave}</th><th scope="col">{l.tJudge}</th><th scope="col">{l.tTotal}</th></tr></thead>
                <tbody>
                  <TimeRow label={l.manual(result.manual_frames)} t={best.manual} />
                  <TimeRow label={l.auto(result.auto_frames)} t={best.auto} />
                </tbody>
              </Grid>
            )}
            <Scroll tabIndex={0} role="region" aria-label={l.resultTitle}>
              <Grid>
                <thead><tr>
                  <th scope="col">{l.exposure}</th><th scope="col">{l.avg}</th><th scope="col">{l.brightnessMax}</th><th scope="col">{l.snr}</th>
                  <th scope="col">{l.sat}</th><th scope="col">{l.brightnessA}</th><th scope="col">{l.verdict}</th><th scope="col">{l.auto(result.auto_frames)}</th>
                </tr></thead>
                <tbody>
                  {result.rows.map((r) => (
                    <tr key={`${r.exposure_ms}-${r.avg}-${r.brightness_max}`} data-ok={String(r.ok)} data-best={String(same(r, best))}>
                      <td>{r.exposure_ms} ms</td><td>{r.avg}</td><td>{r.brightness_max}</td><td>{r.snr.toFixed(1)}</td>
                      <td>{r.sat_pct == null ? '-' : `${r.sat_pct.toFixed(2)}%`}</td><td>{r.brightness_A == null ? '-' : Math.round(r.brightness_A)}</td>
                      <td>{r.ok ? l.pass : r.fails.map((f) => l.fail[f] ?? f).join(', ')}</td><td>{sec(r.auto.total_s)}</td>
                    </tr>
                  ))}
                </tbody>
              </Grid>
            </Scroll>
            <FieldHint>{l.note(result.thresholds.snr_min)}</FieldHint>
            <FieldHint>{l.applyHint}</FieldHint>
          </Stack>
        </DialogShell>
      )
    }
    if (phase === 'error' && error) {
      return (
        <DialogShell title={l.errorTitle} description={error.message} onClose={onCancel} width="min(var(--ig-popup-xl), 100%)"
          actions={<Button variant="secondary" onClick={onCancel}>{l.close}</Button>}>
          {error.detail ? <Text as="p" size="var(--ig-text-caption)" tone="soft">{error.detail}</Text> : null}
        </DialogShell>
      )
    }
    return null
  })()

  return (
    <Stack gap="var(--ig-spacing-4)">
      <Button variant="secondary" size="sm" type="button" onClick={onOpen}
        disabled={!isConnected || isSetupBusy || setupDirty || phase !== 'idle'}>
        {l.title}
      </Button>
      <FieldHint>{hint}</FieldHint>
      {dialog && typeof document !== 'undefined' ? ReactDOM.createPortal(dialog, document.body) : dialog}
    </Stack>
  )
}
