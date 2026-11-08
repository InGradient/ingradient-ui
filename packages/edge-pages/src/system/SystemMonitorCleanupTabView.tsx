import styled from 'styled-components'
import { Button, Checkbox, EmptyState, Spinner } from '@ingradient/ui'
import { KeyValueRow } from '@ingradient/ui/components'
import type { SystemMonitorCleanupTabViewProps } from './types'
import { Stack, Text } from '@ingradient/ui/primitives'

const SuccessMsg = styled.div`color: var(--ig-color-success); font-size: var(--ig-text-body-sm);
  line-height: var(--ig-text-body-sm-leading);`

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`
  return `${(bytes / 1024 ** 3).toFixed(2)} GB`
}

const CATEGORIES = ['datasets', 'sessions', 'logs', 'thumbs'] as const

export function SystemMonitorCleanupTabView(props: SystemMonitorCleanupTabViewProps): JSX.Element {
  const { stats, loading, running, result, selectedCategories, labels, onToggleCategory, onRun, onRefresh } = props

  if (loading && !stats) return <Stack gap="var(--ig-spacing-12)"><Spinner /> {labels.loading}</Stack>
  if (!stats) return <Stack gap="var(--ig-spacing-12)"><EmptyState>{labels.empty}</EmptyState></Stack>

  return (
    <Stack gap="var(--ig-spacing-12)">
      <KeyValueRow label={labels.totalSize} value={formatBytes(stats.totalSize)} />
      {stats.oldestEntry && (
        <KeyValueRow label={labels.oldestEntry} value={stats.oldestEntry} />
      )}
      <div>
        <Text as="div" size="var(--ig-text-body)" weight="bold">{labels.categories}</Text>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ig-spacing-8)', marginTop: 'var(--ig-spacing-8)' }}>
          {CATEGORIES.map((cat) => (
            <Checkbox
              key={cat}
              checked={selectedCategories.has(cat)}
              disabled={running}
              onChange={() => onToggleCategory(cat)}
              label={`${labels[cat]} (${stats.itemCounts[cat]})`}
            />
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 'var(--ig-spacing-8)' }}>
        <Button size="sm" variant="solid" onClick={onRun} disabled={running || selectedCategories.size === 0}>
          {running && <Spinner size="sm" tone="white" />}
          {running ? labels.running : labels.run}
        </Button>
        <Button size="sm" variant="secondary" onClick={onRefresh} disabled={loading || running}>{labels.refresh}</Button>
      </div>
      {result?.ok && <SuccessMsg>{labels.freed(formatBytes(result.freedBytes))}</SuccessMsg>}
    </Stack>
  )
}
