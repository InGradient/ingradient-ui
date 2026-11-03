import { useState, type ReactNode } from 'react'
import { AutoInspectView, TitleBarView, TopBarView, type ConnectionStatus, type PlcStatusTone } from '@ingradient/edge-pages'
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
  /** PLC link state; `null` hides the PLC icon and auto-inspect (PLC UI off). Default: no PLC address. */
  plc?: PlcStatusTone | null
}

const PLC_TITLE: Record<PlcStatusTone, string> = {
  connected: 'PLC connected: 192.168.0.10:502',
  disconnected: 'PLC not responding: 192.168.0.10:502',
  unconfigured: 'No PLC address — Settings > PLC',
}
const AUTO_INSPECT_LABELS = { start: 'Auto inspect', stop: 'Stop', starting: 'Starting…' }

/** Synthetic auto-inspect: no PLC or camera; Start runs, Stop ends with the mock count. */
function AutoInspectRuntime({ onMockAction }: { onMockAction?: MockAction }) {
  const [running, setRunning] = useState(false)
  return <AutoInspectView running={running} caption={running ? '0 captured' : undefined} labels={AUTO_INSPECT_LABELS}
    onStart={() => { setRunning(true); onMockAction?.('auto-inspect-start') }}
    onStop={() => { setRunning(false); onMockAction?.('auto-inspect-stop') }} />
}
export function TopBarRuntime(opts: TopBarOptions) {
  const [result, setResult] = useState('')
  const action = (name: string) => { setResult(`Mock ${name} requested; no navigation or network call.`); opts.onMockAction?.(name) }
  const plc = opts.plc === undefined ? 'unconfigured' : opts.plc
  return <><TopBarView selectedProjectName={opts.project} selectedDatasetName={opts.dataset}
    connectionStatus={opts.connectionStatus ?? 'connected'} connectionTitle={opts.connectionStatus === 'disconnected' ? 'Camera disconnected' : 'Camera connected'} isRefreshing={false} canSetupCamera={Boolean(opts.onOpenSettings)} labels={TOP_BAR_LABELS}
    plcStatus={plc === null ? undefined : { tone: plc, title: PLC_TITLE[plc], onOpen: () => action('open-plc-settings') }}
    autoInspect={plc === null ? undefined : <AutoInspectRuntime onMockAction={opts.onMockAction} />}
    langSelector={opts.langSelector ?? <LanguageRuntime onMockAction={opts.onMockAction} />}
    accountMenu={opts.accountMenu ?? <AccountRuntime onMockAction={opts.onMockAction} />} settingsDialog={opts.settingsDialog ?? null}
    onBackToDatasets={() => action('back-to-datasets')} onRefresh={() => action('refresh')}
    onOpenSettings={() => opts.onOpenSettings?.()} />
    {result && <div role="status">{result}</div>}</>
}
