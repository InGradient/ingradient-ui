// CameraSettingsDialogView 스토리용 라벨 + mock 데이터.
import type {
  AboutTabLabels,
  BackendLogsLabels,
  CameraParamsTabLabels,
  CameraSettingsDialogLabels,
  DataTabLabels,
  FieldTestTabLabels,
  FrontendLogsLabels,
  LogEntry,
  ServerTabLabels,
  UnifiedLogsTabLabels,
  UpdateSectionLabels,
} from '@ingradient/edge-pages'

export const SETTINGS_DIALOG_LABELS: CameraSettingsDialogLabels = {
  title: 'Settings',
  close: 'Close',
  tabConnection: 'Connection',
  tabCamera: 'Camera',
  tabServer: 'Server',
  tabData: 'Data',
  tabLogs: 'Logs',
  tabFieldTest: 'Field Test',
  tabAbout: 'About',
}

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
  reload: 'Reload',
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

export const BACKEND_LOGS_LABELS: BackendLogsLabels = {
  search: 'Search logs',
  level: 'Level',
  all: 'All',
  info: 'Info',
  warn: 'Warn',
  error: 'Error',
  refresh: 'Refresh',
  clear: 'Clear',
  export: 'Export',
  empty: 'No backend logs.',
}

export const FRONTEND_LOGS_LABELS: FrontendLogsLabels = {
  search: 'Search logs',
  level: 'Level',
  all: 'All',
  info: 'Info',
  warn: 'Warn',
  error: 'Error',
  refresh: 'Refresh',
  clear: 'Clear',
  export: 'Export',
  empty: 'No frontend logs.',
}

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
  { timestamp: '2026-06-19 09:12:03', level: 'info', message: 'Backend service started.', source: 'backend' },
  { timestamp: '2026-06-19 09:12:05', level: 'info', message: 'Camera driver loaded.', source: 'backend' },
  { timestamp: '2026-06-19 09:13:41', level: 'warn', message: 'Slow response from server (820ms).', source: 'backend' },
  { timestamp: '2026-06-19 09:14:10', level: 'error', message: 'Capture timeout on device 2.', source: 'backend' },
  { timestamp: '2026-06-19 09:14:12', level: 'success', message: 'Recovered after retry.', source: 'backend' },
]

export const SAMPLE_FRONTEND_LOGS: LogEntry[] = [
  { timestamp: '2026-06-19 09:12:01', level: 'info', message: 'UI mounted.', source: 'frontend' },
  { timestamp: '2026-06-19 09:12:30', level: 'info', message: 'Workspace tab opened.', source: 'frontend' },
  { timestamp: '2026-06-19 09:15:22', level: 'warn', message: 'Image cache near limit.', source: 'frontend' },
]
