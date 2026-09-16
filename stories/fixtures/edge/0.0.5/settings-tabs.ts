// 아직 화면을 옮기기 전(0.0.1 때 추출된) 설정 탭들의 라벨 + mock 로그.
// 0.0.5 화면 스토리가 탭 10개를 모두 눌러 볼 수 있도록 함께 싣는다.
import type {
  AboutTabLabels, BackendLogsLabels, CameraParamsTabLabels, DataTabLabels,
  FieldTestTabLabels, FrontendLogsLabels, LogEntry, ServerTabLabels,
  UnifiedLogsTabLabels, UpdateSectionLabels,
} from '@ingradient/edge-pages'

export const SERVER_TAB_LABELS: ServerTabLabels = {
  baseUrl: 'Base URL',
  runtimeMode: 'Runtime Mode',
  modeAuto: 'Auto',
  modeOnline: 'Online',
  modeOffline: 'Offline',
  save: 'Save',
  saving: 'Saving...',
  saved: 'Saved',
  saveError: 'Failed to save settings.',
  connectivityCheck: 'Checking connectivity...',
  connected: 'Connected to server.',
  noConnect: 'Could not reach the server.',
  hint: 'Enter the server endpoint the device should talk to.',
}

export const ABOUT_TAB_LABELS: AboutTabLabels = {
  hero: 'Ingradient Edge',
  versionLabel: 'Version',
  licenseTitle: 'License',
  licenseStatus: 'Status',
  licenseValid: 'Valid',
  licenseExpired: 'Expired',
  licenseMissing: 'Missing',
  expiresAt: 'Expires At',
  fingerprint: 'Device Fingerprint',
  deactivateButton: 'Deactivate License',
  deactivating: 'Deactivating...',
  deactivationCodeTitle: 'Deactivation Code',
  deactivationCodeHint: 'Send this code to your administrator to complete deactivation.',
  releaseTitle: 'Release',
  copyrightLine: '© 2026 Ingradient. All rights reserved.',
}

export const DATA_TAB_LABELS: DataTabLabels = {
  title: 'Data',
  dataDirLabel: 'Data Directory',
  totalSpace: 'Total Space',
  freeSpace: 'Free Space',
  cacheLabel: 'Cache Size',
  cleanCache: 'Clean Cache',
  cleaning: 'Cleaning...',
  cleanupComplete: 'Cache cleared.',
  openDataDir: 'Open Data Directory',
}

export const CAMERA_PARAMS_TAB_LABELS: CameraParamsTabLabels = {
  title: 'Camera Parameters',
  dllPath: 'cvsCam DLL Path',
  applyDllPath: 'Apply',
  reload: 'Reset to Factory Defaults',
  saved: 'Saved',
  save: 'Save',
  exposure: 'Exposure',
  gain: 'Gain',
  blackLevel: 'Black Level',
  sharpness: 'Sharpness',
  gamma: 'Gamma',
}

export const FIELD_TEST_TAB_LABELS: FieldTestTabLabels = {
  title: 'Field Test',
  description: 'Run a diagnostic capture sequence to validate device behavior.',
  run: 'Run',
  running: 'Running...',
  cancel: 'Cancel',
  reset: 'Reset',
  export: 'Export',
  noResults: 'No results yet.',
}

export const UNIFIED_LOGS_TAB_LABELS: UnifiedLogsTabLabels = {
  backend: 'Backend',
  frontend: 'Frontend',
}

const LOGS_LABELS = {
  search: 'Filter (message, module...)',
  level: 'Minimum log level',
  all: 'All',
  info: 'Info',
  warn: 'Warn',
  error: 'Error',
  refresh: 'Refresh',
  clear: 'Clear',
  export: 'Copy all',
  empty: 'No logs',
}

export const BACKEND_LOGS_LABELS: BackendLogsLabels = { ...LOGS_LABELS }
export const FRONTEND_LOGS_LABELS: FrontendLogsLabels = { ...LOGS_LABELS }

export const UPDATE_SECTION_LABELS: UpdateSectionLabels = {
  title: 'Updates',
  currentVersion: 'Current Version',
  checkForUpdates: 'Check for Updates',
  checking: 'Checking for updates...',
  available: (version: string) => `Version ${version} is available.`,
  download: 'Download',
  downloading: 'Downloading...',
  downloaded: 'Update downloaded.',
  install: 'Install & Restart',
  noUpdate: 'You are up to date.',
  error: 'Update check failed.',
}

export const SAMPLE_BACKEND_LOGS: LogEntry[] = [
  { timestamp: '2026-09-02 09:22:30', level: 'info', message: 'capture-agent started (pid 18244).', source: 'backend' },
  { timestamp: '2026-09-02 09:22:32', level: 'info', message: 'cvsCam device opened — MG-A121M-9.', source: 'backend' },
  { timestamp: '2026-09-02 09:22:32', level: 'info', message: 'GevSCPD=10202 (calibrated), RXPacketPoolSize=2048.', source: 'backend' },
  { timestamp: '2026-09-02 09:41:07', level: 'warn', message: 'frame interval 0.42s — exposure 100ms caps at 2.4fps.', source: 'backend' },
  { timestamp: '2026-09-02 10:06:26', level: 'success', message: 'sequence 5c492e saved — 33 images.', source: 'backend' },
]

export const SAMPLE_FRONTEND_LOGS: LogEntry[] = [
  { timestamp: '2026-09-02 09:22:28', level: 'info', message: 'UI mounted.', source: 'frontend' },
  { timestamp: '2026-09-02 09:22:36', level: 'info', message: 'dataset 26.09.02 New Raw Material opened.', source: 'frontend' },
  { timestamp: '2026-09-02 10:06:26', level: 'info', message: '[SEQ success id=5c492e] 총 46.3s', source: 'frontend' },
]
