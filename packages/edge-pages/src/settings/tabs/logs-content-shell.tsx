import type { ReactNode } from 'react'
import styled from 'styled-components'
import { Button, SearchField, DropdownSelect } from '@ingradient/ui'
import { EmptyText } from '@ingradient/ui/components'
import type { LogEntry } from '../types'

const Wrap = styled.div`display: flex; flex-direction: column; gap: var(--ig-space-4); height: 100%;`
const ToolbarRow = styled.div`display: flex; gap: var(--ig-space-3); align-items: center;`
const LogList = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  font-family: var(--ig-font-mono);
  font-size: var(--ig-font-size-xs);
  background: var(--ig-color-surface-raised);
  border: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  border-radius: var(--ig-radius-xs);
  padding: var(--ig-space-3);
`

/** 로그 한 줄 (level별 색). Backend/Frontend 의 renderEntry 에서 재사용. */
export const LogRow = styled.div<{ $level: string }>`
  padding: var(--ig-space-2px) 0;
  color: ${({ $level }) =>
    $level === 'error' ? 'var(--ig-color-danger)' :
    $level === 'warn'  ? 'var(--ig-color-warning)' :
    'var(--ig-color-text-secondary)'};
`
export const Timestamp = styled.span`color: var(--ig-color-text-muted); margin-right: var(--ig-space-2);`
export const LevelBadge = styled.span`text-transform: uppercase; font-weight: var(--ig-font-weight-bold); margin-right: var(--ig-space-2);`

export interface LogsContentShellLabels {
  search: string
  all: string
  info: string
  warn: string
  error: string
  refresh: string
  clear: string
  export: string
  empty: string
}

export interface LogsContentShellProps {
  logs: LogEntry[]
  refreshing: boolean
  searchQuery: string
  levelFilter: string
  labels: LogsContentShellLabels
  onSearchChange: (q: string) => void
  onLevelFilterChange: (level: string) => void
  onRefresh: () => void
  onClear: () => void
  onExport: () => void
  /** 로그 한 줄 렌더 — Backend(timestamp+level badge) / Frontend([ts] message) 가 다름. */
  renderEntry: (log: LogEntry, index: number) => ReactNode
}

/** Backend/Frontend 로그 뷰의 공통 shell (toolbar + 스크롤 리스트 + 빈상태). 행 렌더만 renderEntry 로 주입. */
export function LogsContentShell({
  logs, refreshing, searchQuery, levelFilter, labels,
  onSearchChange, onLevelFilterChange, onRefresh, onClear, onExport,
  renderEntry,
}: LogsContentShellProps): JSX.Element {
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
          : logs.map(renderEntry)}
      </LogList>
    </Wrap>
  )
}
