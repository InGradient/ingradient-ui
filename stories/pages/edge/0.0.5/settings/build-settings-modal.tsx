// System Settings 다이얼로그 — 탭 10개를 edge 앱과 같은 순서로 세운다.
import { useState } from 'react'
import { CameraSettingsDialogView, type SettingsTab, type LightingMode } from '@ingradient/edge-pages'
import { SETTINGS_DIALOG_LABELS } from '../../../../fixtures/edge/0.0.5'
import { ConnectionTabContent } from './build-connection-content'
import {
  AboutTabContent, CameraParamsTabContent, DataTabContent, FieldTestTabContent,
  LogsTabContent, ServerTabContent,
} from './tabs-legacy'
import { ExperimentsTabContent, GeneralTabContent, LightingTabContent, type SettingsDraft, type MockAction } from './tabs-moved'

export function SettingsModal({ initialTab = 'connection', onClose, draft, onMockAction, mockMessageResult, lightingMode = 'deflectometry' }: {
  initialTab?: SettingsTab
  lightingMode?: LightingMode
  draft: SettingsDraft
  onMockAction: MockAction
  mockMessageResult?: 'ok' | 'failed'
  onClose: () => void
}): JSX.Element {
  const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab)

  return (
    <CameraSettingsDialogView
      activeTab={activeTab}
      currentUserRole="owner"
      labels={SETTINGS_DIALOG_LABELS}
      generalContent={<GeneralTabContent draft={draft} onMockAction={onMockAction} mockMessageResult={mockMessageResult} />}
      connectionContent={<ConnectionTabContent draft={draft} onMockAction={onMockAction} />}
      cameraContent={<CameraParamsTabContent draft={draft} onMockAction={onMockAction} />}
      lightingContent={<LightingTabContent draft={draft} mode={lightingMode} onMockAction={onMockAction} />}
      serverContent={<ServerTabContent draft={draft} onMockAction={onMockAction} />}
      dataContent={<DataTabContent draft={draft} onMockAction={onMockAction} />}
      logsContent={<LogsTabContent draft={draft} onMockAction={onMockAction} />}
      experimentsContent={<ExperimentsTabContent draft={draft} />}
      fieldTestContent={<FieldTestTabContent draft={draft} onMockAction={onMockAction} />}
      aboutContent={<AboutTabContent draft={draft} onMockAction={onMockAction} />}
      onClose={onClose}
      onSetActiveTab={setActiveTab}
    />
  )
}
