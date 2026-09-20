// 설정 > 연결 탭 전체 — 6단계 진단 + Scan/Connect/진단/NIC/고급.
import { useState } from 'react'
import { Stack } from '@ingradient/ui'
import { ConnectionTabView, type AnyCamera, type NicCandidate } from '@ingradient/edge-pages'
import {
  CONNECTION_LABELS, SAMPLE_CAMERAS, SAMPLE_GUIDE_STATE,
  SAMPLE_NIC_CANDIDATES, SAMPLE_NIC_STATUS,
} from '../../../../fixtures/edge/0.0.5'
import { CameraSetupPanel } from './build-camera-setup'

const noop = (): undefined => undefined

export function ConnectionTabContent(): JSX.Element {
  const [selectedCamera, setSelectedCamera] = useState<AnyCamera | null>(SAMPLE_CAMERAS[0] ?? null)
  const [selectedNic, setSelectedNic] = useState<NicCandidate | null>(SAMPLE_NIC_CANDIDATES[0] ?? null)
  const [advancedExpanded, setAdvancedExpanded] = useState(false)

  return (
    <Stack gap="var(--ig-space-5)">
      <CameraSetupPanel />
      <ConnectionTabView
        labels={CONNECTION_LABELS}
        scan={{
          isScanning: false,
          discoveredDevices: SAMPLE_CAMERAS,
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
          isConnected: true,
          connectionError: null,
          canConnect: false,
          onConnect: noop,
          onDisconnect: noop,
        }}
        autoSetup={{ visible: false, isRunning: false, onRun: noop }}
        diagnostics={{
          isRunning: false,
          classification: 'success',
          failureCode: null,
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
        guide={{ visible: false, state: SAMPLE_GUIDE_STATE }}
      />
    </Stack>
  )
}
