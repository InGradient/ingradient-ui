// CameraSettingsDialogView 의 탭별 content 슬롯 합성 scene.
import { useState } from 'react'
import type { ReactNode } from 'react'
import {
  AboutTabView,
  BackendLogsContentView,
  CameraParamsTabView,
  CameraSettingsDialogView,
  DataTabView,
  FieldTestTabView,
  FrontendLogsContentView,
  ServerTabView,
  UnifiedLogsTabView,
  UpdateSectionView,
} from '@ingradient/edge-pages'
import type { LogsSource, SettingsTab } from '@ingradient/edge-pages'
import {
  ABOUT_TAB_LABELS,
  BACKEND_LOGS_LABELS,
  CAMERA_PARAMS_TAB_LABELS,
  DATA_TAB_LABELS,
  FIELD_TEST_TAB_LABELS,
  FRONTEND_LOGS_LABELS,
  SAMPLE_BACKEND_LOGS,
  SAMPLE_FRONTEND_LOGS,
  SERVER_TAB_LABELS,
  SETTINGS_DIALOG_LABELS,
  UNIFIED_LOGS_TAB_LABELS,
  UPDATE_SECTION_LABELS,
} from '../../../../fixtures/edge/0.0.1/settings-data'

const noop = (): void => undefined

export function SettingsModalContent(props: {
  activeTab?: SettingsTab
  connectionContent?: ReactNode
}): JSX.Element {
  const [activeTab, setActiveTab] = useState<SettingsTab>(props.activeTab ?? 'server')
  const [logsSource, setLogsSource] = useState<LogsSource>('backend')

  const serverContent = (
    <ServerTabView
      baseUrl="https://app.ingradient.ai"
      runtimeMode="auto"
      saving={false}
      saveResult={null}
      saveMessage={null}
      connectivityResult={null}
      labels={SERVER_TAB_LABELS}
      onBaseUrlChange={noop}
      onRuntimeModeChange={noop}
      onSave={noop}
    />
  )

  const aboutContent = (
    <AboutTabView
      appVersion="0.0.1"
      licenseStatus="valid"
      licenseExpiresAt="2027-01-01"
      fingerprint="A1B2-C3D4-E5F6-7890"
      deactivationCode={null}
      deactivateError={null}
      isDeactivating={false}
      labels={ABOUT_TAB_LABELS}
      updateSection={
        <UpdateSectionView
          currentVersion="0.0.1"
          status="idle"
          availableVersion={null}
          progress={0}
          error={null}
          labels={UPDATE_SECTION_LABELS}
          onCheckForUpdates={noop}
          onDownloadUpdate={noop}
          onInstallUpdate={noop}
        />
      }
      onOpenDeactivateConfirm={noop}
      onCloseDeactivationCode={noop}
    />
  )

  const dataContent = (
    <DataTabView
      dataDirPath="/var/lib/ingradient/data"
      totalBytes={512 * 1024 ** 3}
      freeBytes={210 * 1024 ** 3}
      cacheSize={3 * 1024 ** 3}
      isCleaningCache={false}
      cleanupCompleted={false}
      labels={DATA_TAB_LABELS}
      onCleanCache={noop}
      onOpenDataDir={noop}
    />
  )

  const cameraContent = (
    <CameraParamsTabView
      isConnected={false}
      cvsCamDllPath="/opt/cvsCam/cvsCam.dll"
      fetching={false}
      saving={false}
      saveResult={null}
      labels={CAMERA_PARAMS_TAB_LABELS}
      onDllPathChange={noop}
      onApplyDllPath={noop}
      onSave={noop}
      onReset={noop}
    />
  )

  const fieldTestContent = (
    <FieldTestTabView
      running={false}
      progress={0}
      hasResults={false}
      log={[]}
      labels={FIELD_TEST_TAB_LABELS}
      onRun={noop}
      onCancel={noop}
      onReset={noop}
      onExport={noop}
    />
  )

  const logsContent = (
    <UnifiedLogsTabView
      source={logsSource}
      labels={UNIFIED_LOGS_TAB_LABELS}
      onSetSource={setLogsSource}
      backendLogsContent={
        <BackendLogsContentView
          logs={SAMPLE_BACKEND_LOGS}
          loading={false}
          refreshing={false}
          searchQuery=""
          levelFilter="all"
          labels={BACKEND_LOGS_LABELS}
          onSearchChange={noop}
          onLevelFilterChange={noop}
          onRefresh={noop}
          onClear={noop}
          onExport={noop}
        />
      }
      frontendLogsContent={
        <FrontendLogsContentView
          logs={SAMPLE_FRONTEND_LOGS}
          labels={FRONTEND_LOGS_LABELS}
          onClear={noop}
          onExport={noop}
        />
      }
    />
  )

  return (
    <CameraSettingsDialogView
      activeTab={activeTab}
      currentUserRole="admin"
      labels={SETTINGS_DIALOG_LABELS}
      connectionContent={props.connectionContent}
      serverContent={serverContent}
      aboutContent={aboutContent}
      dataContent={dataContent}
      cameraContent={cameraContent}
      fieldTestContent={fieldTestContent}
      logsContent={logsContent}
      onClose={noop}
      onSetActiveTab={setActiveTab}
    />
  )
}
