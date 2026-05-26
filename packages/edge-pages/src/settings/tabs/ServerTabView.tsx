import styled from 'styled-components'
import { Button, FieldRow, RadioCardGroup, TextField } from '@ingradient/ui'
import { FieldGroup } from '@ingradient/ui/patterns'
import type { ServerTabViewProps, ServerRuntimeMode } from '../types'

const Hint = styled.div`
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-text-muted);
  margin-top: var(--ig-space-2);
`

const Result = styled.div<{ $tone: 'success' | 'warn' | 'danger' }>`
  font-size: var(--ig-font-size-sm);
  margin-top: var(--ig-space-3);
  color: ${({ $tone }) =>
    $tone === 'success' ? 'var(--ig-color-success)' :
    $tone === 'warn' ? 'var(--ig-color-warning)' :
    'var(--ig-color-danger)'};
`

export function ServerTabView(props: ServerTabViewProps): JSX.Element {
  const {
    baseUrl, runtimeMode, saving, saveResult, saveMessage,
    connectivityResult, labels,
    onBaseUrlChange, onRuntimeModeChange, onSave,
  } = props

  return (
    <FieldGroup style={{ gap: 'var(--ig-space-7)' }}>
      <FieldRow label={labels.baseUrl}>
        <TextField
          value={baseUrl}
          onChange={(e) => onBaseUrlChange(e.target.value)}
          placeholder="https://app.ingradient.ai"
        />
        <Hint>{labels.hint}</Hint>
      </FieldRow>
      <FieldRow label={labels.runtimeMode}>
        <RadioCardGroup
          value={runtimeMode}
          onChange={(v) => onRuntimeModeChange(v as ServerRuntimeMode)}
          options={[
            { value: 'auto',    label: labels.modeAuto },
            { value: 'online',  label: labels.modeOnline },
            { value: 'offline', label: labels.modeOffline },
          ]}
        />
      </FieldRow>
      <div>
        <Button variant="accent" size="sm" type="button" onClick={onSave} disabled={saving}>
          {saving ? labels.saving : labels.save}
        </Button>
        {saveResult === 'connected' && <Result $tone="success">{saveMessage ?? labels.connected}</Result>}
        {saveResult === 'no-connect' && <Result $tone="warn">{saveMessage ?? labels.noConnect}</Result>}
        {saveResult === 'error' && <Result $tone="danger">{saveMessage ?? labels.saveError}</Result>}
        {connectivityResult === 'checking' && <Result $tone="warn">{labels.connectivityCheck}</Result>}
      </div>
    </FieldGroup>
  )
}
