// Synthetic network/device actions only; drafts live in the Workspace session.
import { useState } from 'react'
import { Stack } from '@ingradient/ui'
import { ConnectionTabView, ForceIpDialogView, type GigEDevice } from '@ingradient/edge-pages'
import { CONNECTION_LABELS, SAMPLE_GUIDE_STATE, SAMPLE_NIC_CANDIDATES, SAMPLE_NIC_STATUS } from '../../../../fixtures/edge/0.0.5'
import { CameraSetupPanel } from './build-camera-setup'
import { isIpv4, isSubnet } from './settings-drafts'
import type { SettingsContentProps } from './tabs-device'

export function ConnectionTabContent({ draft: { connection }, onMockAction }: SettingsContentProps): JSX.Element {
  const [selectedCamera, setSelectedCamera] = connection.camera
  const [selectedNic, setSelectedNic] = connection.nic
  const [cameras, setCameras] = connection.cameras
  const [connected, setConnected] = connection.connected
  const [nicEnabled, setNicEnabled] = connection.nicEnabled
  const [result, setResult] = connection.result
  const [forceId, setForceId] = connection.forceId
  const [ip, setIp] = connection.ip
  const [subnet, setSubnet] = connection.subnet
  const [forceCamera, setForceCamera] = useState<GigEDevice | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [advancedExpanded, setAdvancedExpanded] = useState(false)
  const action = (name: string) => { setResult(`Mock ${name} complete; no device or network changes.`); onMockAction(`connection-${name}`) }
  return <Stack gap="var(--ig-space-5)">
    <CameraSetupPanel onMockAction={onMockAction} />
    <ConnectionTabView labels={CONNECTION_LABELS}
      scan={{ isScanning: false, discoveredDevices: cameras, nicCandidates: SAMPLE_NIC_CANDIDATES, isLoadingCandidates: false, selectedCamera, selectedNic, isBlocked: false,
        onScan: () => action('scan'), onSelectCamera: setSelectedCamera, onSelectNic: setSelectedNic,
        onRequestForceIp: (camera) => { setForceCamera(camera); if (forceId !== camera.mac) { setForceId(camera.mac); setIp(camera.ip) } setError(null) } }}
      connect={{ isConnecting: false, isConnected: connected, connectionError: null, canConnect: !connected && Boolean(selectedCamera) && nicEnabled,
        onConnect: () => { setConnected(true); action('connect') }, onDisconnect: () => { setConnected(false); action('disconnect') } }}
      autoSetup={{ visible: false, isRunning: false, onRun: () => action('auto-setup') }}
      diagnostics={{ isRunning: false, classification: nicEnabled ? 'success' : 'no_nic', failureCode: null, recoveryFailure: null, onRunDiagnose: () => action('diagnose') }}
      nicControl={{ nicStatus: { ...SAMPLE_NIC_STATUS, isAdminUp: nicEnabled, isLinkUp: nicEnabled }, isApplying: false,
        onEnable: () => { setNicEnabled(true); action('enable-nic') }, onDisable: () => { setNicEnabled(false); setConnected(false); action('disable-nic') }, onRestart: () => { setNicEnabled(true); action('restart-nic') } }}
      profile={{ profileName: 'default', isLoading: false, isSaving: false, onLoad: () => action('load-profile'), onSave: () => action('save-profile') }}
      advanced={{ expanded: advancedExpanded, onToggleExpanded: () => setAdvancedExpanded((value) => !value) }} guide={{ visible: false, state: SAMPLE_GUIDE_STATE }} />
    {result && <p role="status">{result}</p>}
    {forceCamera && <ForceIpDialogView cameraId={forceCamera.mac} currentIp={forceCamera.ip} newIp={ip} newSubnet={subnet} applying={false} error={error} labels={CONNECTION_LABELS}
      onIpChange={setIp} onSubnetChange={setSubnet} onCancel={() => setForceCamera(null)} onApply={() => {
        if (!isIpv4(ip) || !isSubnet(subnet)) { setError('Enter a valid IPv4 address and contiguous subnet mask.'); return }
        const next = { ...forceCamera, ip, reachable: true }
        setCameras((previous) => previous.map((camera) => camera.type === 'gige' && camera.mac === next.mac ? next : camera))
        if (selectedCamera?.type === 'gige' && selectedCamera.mac === next.mac) setSelectedCamera(next)
        setForceCamera(null); action('force-ip'); onMockAction('force-ip-applied', { ip, subnet, synthetic: true })
      }} />}
  </Stack>
}
