import { CameraParamsTabView, ServerTabView } from '@ingradient/edge-pages'
import { CAMERA_PARAMS_TAB_LABELS, SERVER_TAB_LABELS } from '../../../../fixtures/edge/0.0.5'
import { DEFAULT_DLL, isMockServerUrl } from './settings-drafts'
import type { SettingsDraft, MockAction } from './tabs-moved'

export interface SettingsContentProps { draft: SettingsDraft; onMockAction: MockAction }

export function ServerTabContent({ draft: { device }, onMockAction }: SettingsContentProps) {
  const [baseUrl, setBaseUrl] = device.baseUrl
  const [runtimeMode, setRuntimeMode] = device.runtimeMode
  const [result, setResult] = device.serverResult
  return <ServerTabView baseUrl={baseUrl} runtimeMode={runtimeMode} saving={false}
    saveResult={result} saveMessage={result === 'error' ? 'Enter a valid HTTP or HTTPS URL.' : result ? 'Mock settings saved in this session; no connection was attempted.' : null}
    connectivityResult={null} labels={SERVER_TAB_LABELS}
    onBaseUrlChange={(value) => { setBaseUrl(value); setResult(null) }}
    onRuntimeModeChange={(value) => { setRuntimeMode(value); setResult(null) }}
    onSave={() => { const valid = isMockServerUrl(baseUrl); setResult(valid ? 'connected' : 'error'); onMockAction('server-save', { baseUrl, runtimeMode, valid, synthetic: true }) }} />
}

export function CameraParamsTabContent({ draft: { device }, onMockAction }: SettingsContentProps) {
  const [path, setPath] = device.dllPath
  const [result, setResult] = device.cameraResult
  const [message, setMessage] = device.result
  const apply = (action: string) => {
    const valid = /\.dll$/i.test(path.trim())
    setResult(valid ? (action === 'save' ? 'success' : null) : 'error')
    setMessage(valid ? `Mock camera ${action} complete; no DLL was loaded or device changed.` : 'Enter a path ending in .dll.')
    onMockAction(`camera-${action}`, { path, valid, synthetic: true })
  }
  return <><CameraParamsTabView isConnected cvsCamDllPath={path} fetching={false} saving={false}
    saveResult={result} labels={CAMERA_PARAMS_TAB_LABELS}
    onDllPathChange={(value) => { setPath(value); setResult(null); setMessage('') }}
    onApplyDllPath={() => apply('apply')} onSave={() => apply('save')}
    onReset={() => { setPath(DEFAULT_DLL); setResult(null); setMessage('Mock camera defaults restored.'); onMockAction('camera-reset') }} />
    {message && <p role="status">{message}</p>}</>
}
