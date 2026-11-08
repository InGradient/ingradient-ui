import styled from 'styled-components'
import { Button } from '@ingradient/ui'
import { CodeBlock, KeyValueRow } from '@ingradient/ui/components'
import type { DataTabViewProps } from '../types'
import { Stack, Text } from '@ingradient/ui/primitives'


const Success = styled.div`
  color: var(--ig-color-success);
  font-size: var(--ig-text-body-sm);
  line-height: var(--ig-text-body-sm-leading);
`

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`
  return `${(bytes / 1024 ** 3).toFixed(2)} GB`
}

export function DataTabView(props: DataTabViewProps): JSX.Element {
  const {
    dataDirPath, totalBytes, freeBytes, cacheSize,
    isCleaningCache, cleanupCompleted, labels,
    onCleanCache, onOpenDataDir,
  } = props
  return (
    <Stack gap="var(--ig-spacing-16)">
      <div>
        <Text size="var(--ig-text-body-sm)" tone="muted" style={{ display: 'block', marginBottom: 'var(--ig-spacing-8)' }}>{labels.dataDirLabel}</Text>
        <CodeBlock>{dataDirPath}</CodeBlock>
        <div style={{ marginTop: 'var(--ig-spacing-8)' }}>
          <Button size="sm" variant="secondary" onClick={onOpenDataDir}>{labels.openDataDir}</Button>
        </div>
      </div>
      <KeyValueRow label={labels.totalSpace} value={formatBytes(totalBytes)} />
      <KeyValueRow label={labels.freeSpace} value={formatBytes(freeBytes)} />
      <KeyValueRow label={labels.cacheLabel} value={formatBytes(cacheSize)} />
      <div>
        <Button variant="secondary" size="sm" onClick={onCleanCache} disabled={isCleaningCache || cacheSize <= 0}>
          {isCleaningCache ? labels.cleaning : labels.cleanCache}
        </Button>
        {cleanupCompleted && <Success style={{ marginTop: 'var(--ig-spacing-8)' }}>{labels.cleanupComplete}</Success>}
      </div>
    </Stack>
  )
}
