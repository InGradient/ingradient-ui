// System Settings 다이얼로그 — 탭 10개를 edge 앱과 같은 순서로 세운다.
import { useState } from 'react'
import { CameraSettingsDialogView, type SettingsTab } from '@ingradient/edge-pages'
import { SETTINGS_DIALOG_LABELS } from '../../../../fixtures/edge/0.0.5'
import { ConnectionTabContent } from './build-connection-content'
import {
  AboutTabContent, CameraParamsTabContent, DataTabContent, FieldTestTabContent,
  LogsTabContent, ServerTabContent,
} from './tabs-legacy'
import { ExperimentsTabContent, GeneralTabContent, LightingTabContent } from './tabs-moved'

export function SettingsModal({ initialTab = 'connection', onClose }: {
  initialTab?: SettingsTab
  onClose: () => void
}): JSX.Element {
  const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab)

  return (
    <CameraSettingsDialogView
      activeTab={activeTab}
      currentUserRole="owner"
      labels={SETTINGS_DIALOG_LABELS}
      generalContent={<GeneralTabContent />}
      connectionContent={<ConnectionTabContent />}
      cameraContent={CameraParamsTabContent}
      lightingContent={<LightingTabContent />}
      serverContent={ServerTabContent}
      dataContent={DataTabContent}
      logsContent={<LogsTabContent />}
      experimentsContent={<ExperimentsTabContent />}
      fieldTestContent={FieldTestTabContent}
      aboutContent={AboutTabContent}
      onClose={onClose}
      onSetActiveTab={setActiveTab}
    />
  )
}
