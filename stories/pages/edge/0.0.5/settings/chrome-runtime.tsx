import { useState, type ReactNode } from 'react'
import { TitleBarView, TopBarView, type ConnectionStatus } from '@ingradient/edge-pages'
import { TITLE_BAR_LABELS, TOP_BAR_LABELS } from '../../../../fixtures/edge/0.0.5'
import { AccountRuntime, LanguageRuntime } from './account-runtime'
import type { MockAction } from './tabs-moved'

export function TitleBarRuntime() {
  const [maximized, setMaximized] = useState(false)
  const [result, setResult] = useState('')
  return <><TitleBarView isMaximized={maximized} labels={TITLE_BAR_LABELS}
    onMinimize={() => setResult('Mock minimize requested; window unchanged.')}
    onMaximize={() => { setMaximized((value) => !value); setResult('Mock maximize toggled; window unchanged.') }}
    onClose={() => setResult('Mock close requested; application remains open.')} />
    {result && <div role="status">{result}</div>}</>
}

export interface TopBarOptions {
  project: string; dataset: string; connectionStatus?: ConnectionStatus
  settingsDialog?: ReactNode; onOpenSettings?: () => void
  onMockAction?: MockAction; langSelector?: ReactNode; accountMenu?: ReactNode
}
export function TopBarRuntime(opts: TopBarOptions) {
  const [result, setResult] = useState('')
  const action = (name: string) => { setResult(`Mock ${name} requested; no navigation or network call.`); opts.onMockAction?.(name) }
  return <><TopBarView selectedProjectName={opts.project} selectedDatasetName={opts.dataset}
    connectionStatus={opts.connectionStatus ?? 'connected'} connectionTitle={opts.connectionStatus === 'disconnected' ? 'Offline' : 'Online'} isRefreshing={false} canSetupCamera={Boolean(opts.onOpenSettings)} labels={TOP_BAR_LABELS}
    langSelector={opts.langSelector ?? <LanguageRuntime onMockAction={opts.onMockAction} />}
    accountMenu={opts.accountMenu ?? <AccountRuntime onMockAction={opts.onMockAction} />} settingsDialog={opts.settingsDialog ?? null}
    onBackToDatasets={() => action('back-to-datasets')} onRefresh={() => action('refresh')}
    onOpenSettings={() => opts.onOpenSettings?.()} />
    {result && <div role="status">{result}</div>}</>
}
