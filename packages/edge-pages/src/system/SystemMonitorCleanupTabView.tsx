import styled from 'styled-components'
import { Button, Checkbox, EmptyState, Spinner } from '@ingradient/ui'
import { KeyValueRow } from '@ingradient/ui/components'
import type { SystemMonitorCleanupTabViewProps } from './types'

const Wrap = styled.div`display: flex; flex-direction: column; gap: var(--ig-space-5);`
const Title = styled.div`font-size: var(--ig-font-size-md); font-weight: var(--ig-font-weight-bold); color: var(--ig-color-text-primary);`
const SuccessMsg = styled.div`color: var(--ig-color-success); font-size: var(--ig-font-size-sm);`

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`
  return `${(bytes / 1024 ** 3).toFixed(2)} GB`
}

const CATEGORIES = ['datasets', 'sessions', 'logs', 'thumbs'] as const

export function SystemMonitorCleanupTabView(props: SystemMonitorCleanupTabViewProps): JSX.Element {
  const { stats, loading, running, result, selectedCategories, labels, onToggleCategory, onRun, onRefresh } = props

  if (loading && !stats) return <Wrap><Spinner /> {labels.loading}</Wrap>
  if (!stats) return <Wrap><EmptyState>{labels.empty}</EmptyState></Wrap>

  return (
    <Wrap>
      <KeyValueRow label={labels.totalSize} value={formatBytes(stats.totalSize)} />
      {stats.oldestEntry && (
        <KeyValueRow label={labels.oldestEntry} value={stats.oldestEntry} />
      )}
      <div>
        <Title>{labels.categories}</Title>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ig-space-2)', marginTop: 'var(--ig-space-3)' }}>
          {CATEGORIES.map((cat) => (
            <Checkbox
              key={cat}
              checked={selectedCategories.has(cat)}
              onChange={() => onToggleCategory(cat)}
              label={`${labels[cat]} (${stats.itemCounts[cat]})`}
            />
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 'var(--ig-space-3)' }}>
        <Button size="sm" variant="accent" onClick={onRun} disabled={running || selectedCategories.size === 0}>
          {running && <Spinner size="sm" tone="muted" />}
          {running ? labels.running : labels.run}
        </Button>
        <Button size="sm" variant="secondary" onClick={onRefresh} disabled={loading}>{labels.refresh}</Button>
      </div>
      {result?.ok && <SuccessMsg>{labels.freed(formatBytes(result.freedBytes))}</SuccessMsg>}
    </Wrap>
  )
}
