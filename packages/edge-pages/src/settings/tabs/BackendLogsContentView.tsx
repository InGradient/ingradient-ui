import styled from 'styled-components'
import { Button, SearchField, DropdownSelect } from '@ingradient/ui'
import type { BackendLogsContentViewProps } from '../types'

const Wrap = styled.div`display: flex; flex-direction: column; gap: var(--ig-space-4); height: 100%;`
const ToolbarRow = styled.div`display: flex; gap: var(--ig-space-3); align-items: center;`
const LogList = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  font-family: 'Courier New', monospace;
  font-size: var(--ig-font-size-xs);
  background: var(--ig-color-surface-raised);
  border: 1px solid var(--ig-color-border-subtle);
  border-radius: var(--ig-radius-xs);
  padding: var(--ig-space-3);
`
const LogRow = styled.div<{ $level: string }>`
  padding: 2px 0;
  color: ${({ $level }) =>
    $level === 'error' ? 'var(--ig-color-danger)' :
    $level === 'warn'  ? 'var(--ig-color-warning)' :
    'var(--ig-color-text-secondary)'};
`
const Timestamp = styled.span`color: var(--ig-color-text-muted); margin-right: var(--ig-space-2);`
const LevelBadge = styled.span`text-transform: uppercase; font-weight: 700; margin-right: var(--ig-space-2);`
const EmptyText = styled.div`text-align: center; padding: var(--ig-space-9) 0; color: var(--ig-color-text-muted);`

export function BackendLogsContentView(props: BackendLogsContentViewProps): JSX.Element {
  const {
    logs, refreshing, searchQuery, levelFilter, labels,
    onSearchChange, onLevelFilterChange, onRefresh, onClear, onExport,
  } = props
  return (
    <Wrap>
      <ToolbarRow>
        <SearchField
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={labels.search}
          style={{ flex: 1 }}
        />
        <DropdownSelect
          value={levelFilter}
          onChange={onLevelFilterChange}
          options={[
            { value: 'all',  label: labels.all },
            { value: 'info', label: labels.info },
            { value: 'warn', label: labels.warn },
            { value: 'error', label: labels.error },
          ]}
        />
        <Button size="sm" variant="secondary" onClick={onRefresh} disabled={refreshing}>{labels.refresh}</Button>
        <Button size="sm" variant="secondary" onClick={onClear}>{labels.clear}</Button>
        <Button size="sm" variant="secondary" onClick={onExport}>{labels.export}</Button>
      </ToolbarRow>
      <LogList>
        {logs.length === 0
          ? <EmptyText>{labels.empty}</EmptyText>
          : logs.map((log, i) => (
            <LogRow key={i} $level={log.level}>
              <Timestamp>{log.timestamp}</Timestamp>
              <LevelBadge>{log.level}</LevelBadge>
              {log.message}
            </LogRow>
          ))}
      </LogList>
    </Wrap>
  )
}
