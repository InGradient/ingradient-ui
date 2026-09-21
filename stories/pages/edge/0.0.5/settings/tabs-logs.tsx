import { BackendLogsContentView, FrontendLogsContentView, UnifiedLogsTabView } from '@ingradient/edge-pages'
import { BACKEND_LOGS_LABELS, FRONTEND_LOGS_LABELS, SAMPLE_BACKEND_LOGS, SAMPLE_FRONTEND_LOGS, UNIFIED_LOGS_TAB_LABELS } from '../../../../fixtures/edge/0.0.5'
import type { SettingsContentProps } from './tabs-device'

export function LogsTabContent({ draft: { logs }, onMockAction }: SettingsContentProps) {
  const [source, setSource] = logs.source
  const [query, setQuery] = logs.query
  const [level, setLevel] = logs.level
  const [result, setResult] = logs.result
  const [entries, setEntries] = source === 'backend' ? logs.backend : logs.frontend
  const severity: Record<string, number> = { all: 0, info: 1, success: 1, warn: 2, error: 3 }
  const filtered = entries.filter((entry) => (level === 'all' || (severity[entry.level] ?? 0) >= (severity[level] ?? 0)) && `${entry.message} ${entry.timestamp} ${entry.source ?? ''}`.toLowerCase().includes(query.toLowerCase()))
  const props = {
    logs: filtered, refreshing: false, searchQuery: query, levelFilter: level,
    onSearchChange: (value: string) => { setQuery(value); setResult('') }, onLevelFilterChange: (value: string) => { setLevel(value); setResult('') },
    onRefresh: () => { setEntries(source === 'backend' ? SAMPLE_BACKEND_LOGS : SAMPLE_FRONTEND_LOGS); setResult(`Mock ${source} logs refreshed from fixture.`); onMockAction('settings-logs-refresh', source) },
    onClear: () => { setEntries([]); setResult(`Mock ${source} logs cleared in session.`); onMockAction('settings-logs-clear', source) },
    onExport: () => { setResult(`Mock export prepared: ${filtered.length} ${source} entries. No file written.`); onMockAction('settings-logs-export', { source, entries: filtered }) },
  }
  return <><UnifiedLogsTabView source={source} labels={UNIFIED_LOGS_TAB_LABELS} onSetSource={(value) => { setSource(value); setResult('') }}
    backendLogsContent={<BackendLogsContentView {...props} loading={false} labels={BACKEND_LOGS_LABELS} />}
    frontendLogsContent={<FrontendLogsContentView {...props} labels={FRONTEND_LOGS_LABELS} />} />
    <p role="status">{result || `${filtered.length} matching mock entries`}</p></>
}
