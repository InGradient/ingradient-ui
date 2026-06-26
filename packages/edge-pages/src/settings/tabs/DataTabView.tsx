import styled from 'styled-components'
import { Button } from '@ingradient/ui'
import { KeyValueRow } from '@ingradient/ui/components'
import type { DataTabViewProps } from '../types'

const Wrap = styled.div`display: flex; flex-direction: column; gap: var(--ig-space-7);`
const Label = styled.span`font-size: var(--ig-font-size-sm); color: var(--ig-color-text-muted);`
const PathBox = styled.div`
  font-family: var(--ig-font-mono);
  font-size: var(--ig-font-size-xs);
  padding: var(--ig-space-3);
  background: var(--ig-color-surface-raised);
  border-radius: var(--ig-radius-xs);
  user-select: all;
`

const Success = styled.div`
  color: var(--ig-color-success);
  font-size: var(--ig-font-size-sm);
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
    <Wrap>
      <div>
        <Label style={{ display: 'block', marginBottom: 'var(--ig-space-2)' }}>{labels.dataDirLabel}</Label>
        <PathBox>{dataDirPath}</PathBox>
        <div style={{ marginTop: 'var(--ig-space-3)' }}>
          <Button size="sm" variant="secondary" onClick={onOpenDataDir}>{labels.openDataDir}</Button>
        </div>
      </div>
      <KeyValueRow label={labels.totalSpace} value={formatBytes(totalBytes)} />
      <KeyValueRow label={labels.freeSpace} value={formatBytes(freeBytes)} />
      <KeyValueRow label={labels.cacheLabel} value={formatBytes(cacheSize)} />
      <div>
        <Button variant="secondary" size="sm" onClick={onCleanCache} disabled={isCleaningCache}>
          {isCleaningCache ? labels.cleaning : labels.cleanCache}
        </Button>
        {cleanupCompleted && <Success style={{ marginTop: 'var(--ig-space-3)' }}>{labels.cleanupComplete}</Success>}
      </div>
    </Wrap>
  )
}
