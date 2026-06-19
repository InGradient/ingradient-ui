// CameraSettingsDialog 의 'connection' 탭 내용(ConnectionTabView) scene.
import { useState } from 'react'
import { ConnectionTabView } from '@ingradient/edge-pages'
import type { AnyCamera, NicCandidate } from '@ingradient/edge-pages'
import {
  CONNECTION_LABELS,
  SAMPLE_DISCOVERED_DEVICES,
  SAMPLE_GUIDE_STATE,
  SAMPLE_NIC_CANDIDATES,
  SAMPLE_NIC_STATUS,
} from '../../../../fixtures/edge/0.0.1/connection-data'

const noop = (): undefined => undefined

export function ConnectionTabContent(): JSX.Element {
  const [selectedCamera, setSelectedCamera] = useState<AnyCamera | null>(
    SAMPLE_DISCOVERED_DEVICES[0] ?? null,
  )
  const [selectedNic, setSelectedNic] = useState<NicCandidate | null>(
    SAMPLE_NIC_CANDIDATES[0] ?? null,
  )
  const [advancedExpanded, setAdvancedExpanded] = useState(false)

  return (
    <ConnectionTabView
      labels={CONNECTION_LABELS}
      scan={{
        isScanning: false,
        discoveredDevices: SAMPLE_DISCOVERED_DEVICES,
        nicCandidates: SAMPLE_NIC_CANDIDATES,
        isLoadingCandidates: false,
        selectedCamera,
        selectedNic,
        isBlocked: false,
        onScan: noop,
        onSelectCamera: setSelectedCamera,
        onSelectNic: setSelectedNic,
        onRequestForceIp: noop,
      }}
      connect={{
        isConnecting: false,
        isConnected: false,
        connectionError: null,
        canConnect: selectedCamera !== null && selectedNic !== null,
        onConnect: noop,
        onDisconnect: noop,
      }}
      autoSetup={{
        visible: true,
        isRunning: false,
        onRun: noop,
      }}
      diagnostics={{
        isRunning: false,
        classification: 'subnet_mismatch',
        failureCode: 'E_SUBNET',
        recoveryFailure: null,
        onRunDiagnose: noop,
      }}
      nicControl={{
        nicStatus: SAMPLE_NIC_STATUS,
        isApplying: false,
        onEnable: noop,
        onDisable: noop,
        onRestart: noop,
      }}
      profile={{
        profileName: 'default',
        isLoading: false,
        isSaving: false,
        onLoad: noop,
        onSave: noop,
      }}
      advanced={{
        expanded: advancedExpanded,
        onToggleExpanded: () => setAdvancedExpanded((v) => !v),
      }}
      guide={{
        visible: true,
        state: SAMPLE_GUIDE_STATE,
      }}
    />
  )
}
