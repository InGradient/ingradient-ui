import { useState } from 'react'
import { Button, IngradientGlobalStyle, PresetProvider, edgeV001 } from '@ingradient/ui'
import {
  CameraSettingsDialogView, WorkspaceView,
  type CameraSettingsDialogLabels, type SettingsTab, type WorkspaceTab,
} from '@ingradient/edge-pages'

const settingsLabels: CameraSettingsDialogLabels = {
  title: 'Packed Edge settings', close: 'Close', tabGeneral: 'General', tabConnection: 'Connection',
  tabCamera: 'Camera', tabLighting: 'Lighting', tabServer: 'Server', tabData: 'Data',
  tabLogs: 'Logs', tabExperiments: 'Experiments', tabFieldTest: 'Field test', tabAbout: 'About',
}

/** No source aliases, fixtures or services: exercise the installed public view contracts. */
export function EdgeWorkspaceFlow() {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('capture')
  const [settingsTab, setSettingsTab] = useState<SettingsTab>('general')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [status, setStatus] = useState('Local workspace callback smoke test')
  return <PresetProvider preset={edgeV001}>
    <IngradientGlobalStyle />
    <main>
      <h1>Packed Edge workspace</h1>
      <p role="status">{status}</p>
      <Button onClick={() => setSettingsOpen(true)}>Open settings</Button>
      <WorkspaceView
        mode="main" isCapturing={false} capturingStatusText="" sequenceFailure={null}
        labels={{ saving: 'Saving', sequenceFailed: 'Failed', errorCode: 'Code', cancel: 'Cancel', retry: 'Retry' }}
        onSequenceFailureCancel={() => setStatus('Cancel callback received')}
        onSequenceFailureRetry={() => setStatus('Retry callback received')}
        selectedDatasetId="smoke-dataset" activeTab={activeTab}
        tabItems={[{ value: 'capture', label: 'Capture' }, { value: 'images', label: 'Images' }]}
        onTabChange={tab => { setActiveTab(tab); setStatus(`Workspace tab: ${tab}`) }}
        isSetupMode={false} setupPanelTarget={null} isSavingLabel={false}
        captureContent={<p>Capture slot from the consumer</p>}
        imagesContent={<p>Images slot from the consumer</p>}
      />
      {settingsOpen && <CameraSettingsDialogView
        activeTab={settingsTab} currentUserRole="owner" labels={settingsLabels}
        onSetActiveTab={setSettingsTab} onClose={() => setSettingsOpen(false)}
        generalContent={<p>General slot from the consumer</p>}
        connectionContent={<p>Connection slot from the consumer</p>}
      />}
    </main>
  </PresetProvider>
}
