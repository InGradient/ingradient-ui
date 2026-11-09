import { useId } from 'react'
import styled from 'styled-components'
import { Button, FieldRow, RadioCardGroup, TextField } from '@ingradient/ui'
import { FieldGroup } from '@ingradient/ui/patterns'
import type { ServerTabViewProps, ServerRuntimeMode } from '../types'

const Hint = styled.div`
  font-size: var(--ig-text-caption);
  line-height: var(--ig-text-caption-leading);
  color: var(--ig-color-text-muted);
  margin-top: var(--ig-spacing-8);
`

const Result = styled.div<{ $tone: 'success' | 'warn' | 'danger' }>`
  font-size: var(--ig-text-body-sm);
  line-height: var(--ig-text-body-sm-leading);
  margin-top: var(--ig-spacing-8);
  color: ${({ $tone }) =>
    $tone === 'success' ? 'var(--ig-color-success)' :
    $tone === 'warn' ? 'var(--ig-color-warning)' :
    'var(--ig-color-danger)'};
`

export function ServerTabView(props: ServerTabViewProps): JSX.Element {
  const urlId = useId()
  const {
    baseUrl, runtimeMode, saving, saveResult, saveMessage,
    connectivityResult, labels,
    onBaseUrlChange, onRuntimeModeChange, onSave,
  } = props

  return (
    <FieldGroup style={{ gap: 'var(--ig-spacing-16)' }}>
      <FieldRow label={labels.baseUrl} htmlFor={urlId}>
        <TextField
          id={urlId}
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
          orientation="horizontal"
          options={[
            { value: 'auto',    label: labels.modeAuto },
            { value: 'online',  label: labels.modeOnline },
            { value: 'offline', label: labels.modeOffline },
          ]}
        />
      </FieldRow>
      <div>
        <Button variant="solid" size="sm" type="button" onClick={onSave} disabled={saving}>
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
