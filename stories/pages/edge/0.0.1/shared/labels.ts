// Edge 앱 chrome(TitleBar / TopBar / BottomBar) 공유 라벨 + 샘플 상수.
// 4개 전체 화면 스토리(Login / License / DatasetSelect / Workspace)가 공유한다.

export const TITLE_BAR_LABELS = {
  appName: 'Ingradient Edge',
  minimize: '최소화',
  maximize: '최대화',
  restore: '복원',
  close: '닫기',
}

export const TOP_BAR_LABELS = {
  refresh: 'Refresh',
  settingsTitle: 'Settings',
  settingsDisabledTitle: 'Camera setup — permission required',
}

export const BOTTOM_BAR_LABELS = {
  deletingSimple: 'Deleting…',
  syncing: (n: number) => `Syncing ${n}…`,
  syncDone: 'Synced',
  syncFailed: (n: number) => `${n} failed`,
  openMonitor: 'Open monitor',
  connected: 'Connected',
  disconnected: 'Disconnected',
  diskUsage: (p: string) => `Disk: ${p}`,
  cpuUsage: (p: string) => `CPU: ${p}`,
  memoryUsage: (p: string) => `Memory: ${p}`,
}

export const SAMPLE_USER = { name: 'Mina Park', email: 'mina@line-a.local' }

export const SAMPLE_PROJECT_NAME = 'Line A · Surface Inspection'
export const SAMPLE_DATASET_NAME = '2026-05-19 morning shift'
