import { useId } from 'react'
import styled from 'styled-components'
import { Button, TextField } from '@ingradient/ui'
import type { CameraParamsTabViewProps } from '../types'
import { Stack, Text } from '@ingradient/ui/primitives'

const SectionTitle = styled.h3`
  font-size: var(--ig-text-body);
  font-weight: var(--ig-font-weight-bold);
  margin: 0;
  color: var(--ig-color-text-primary);
`
const Status = styled.div<{ $tone: 'success' | 'danger' }>`
  font-size: var(--ig-text-body-sm);
  color: ${({ $tone }) => $tone === 'success' ? 'var(--ig-color-success)' : 'var(--ig-color-danger)'};
`

export function CameraParamsTabView(props: CameraParamsTabViewProps): JSX.Element {
  const pathId = useId()
  const {
    isConnected, cvsCamDllPath, fetching, saving, saveResult, labels,
    onDllPathChange, onApplyDllPath, onSave, onReset,
  } = props

  return (
    <Stack gap="var(--ig-spacing-16)">
      <Stack gap="var(--ig-spacing-8)">
        <SectionTitle>{labels.title}</SectionTitle>
        <Text as="label" size="var(--ig-text-caption)" weight="semibold" tone="muted" uppercase letterSpacing="wide" htmlFor={pathId}>{labels.dllPath}</Text>
        <TextField
          id={pathId}
          value={cvsCamDllPath}
          onChange={(e) => onDllPathChange(e.target.value)}
          placeholder="/path/to/cvsCam.dll"
        />
        <div style={{ display: 'flex', gap: 'var(--ig-spacing-8)' }}>
          <Button size="sm" variant="secondary" onClick={onApplyDllPath}>{labels.applyDllPath}</Button>
          <Button size="sm" variant="secondary" onClick={onReset}>{labels.reload}</Button>
        </div>
      </Stack>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--ig-spacing-8)' }}>
        <Button size="sm" variant="accent" onClick={onSave} disabled={saving || !isConnected || fetching}>
          {saving ? '...' : (saveResult === 'success' ? labels.saved : labels.save)}
        </Button>
      </div>
      {saveResult === 'success' && <Status $tone="success">{labels.saved}</Status>}
      {saveResult === 'error' && <Status $tone="danger">Error</Status>}
    </Stack>
  )
}
