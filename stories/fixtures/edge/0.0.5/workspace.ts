// 촬영 화면(Workspace) fixture — 탭·로그·패턴 미리보기·클래스.
import {
  buildPatternLabels,
  type CaptureLabels, type LogPanelEntry, type LogPanelLabels,
  type PanelClassInfo, type RightPanelLabels,
  type WorkspaceLabels, type WorkspaceTabItem,
} from '@ingradient/edge-pages'
import { CLASSES } from './datasets'

export const WORKSPACE_TABS: WorkspaceTabItem[] = [
  { value: 'capture', label: 'Capture' },
  { value: 'images', label: 'Images' },
  { value: 'statics', label: 'Statics' },
  { value: 'setup', label: 'Setup' },
]

export const WORKSPACE_LABELS: WorkspaceLabels = {
  saving: 'Saving...',
  sequenceFailed: 'Sequence Failed',
  errorCode: 'Error Code:',
  cancel: 'Cancel',
  retry: 'Retry',
}

export const CAPTURE_LABELS: CaptureLabels = {
  ready: 'Ready',
  controls: 'Controls',
  grid: 'Grid',
  capture: 'Capture',
  liveStream: 'Live Stream',
  noPattern: 'No pattern',
  cameraReconnecting: 'Reconnecting camera…',
  reconnectStream: 'Reconnect Stream',
  waitingFrames: 'Waiting for camera frames…',
  loadingStream: 'Loading stream...',
  connecting: 'Connecting...',
  noCamera: 'No Camera Connected',
  exitFullscreen: 'Exit fullscreen',
  enterFullscreen: 'Enter fullscreen',
  savingPreviousCapture: 'Saving previous capture — please wait',
  brightness: 'Brightness',
  contrast: 'Contrast',
  focus: 'Focus',
  overPct: 'Over %',
  underPct: 'Under %',
  captureStepText: 'Capturing...',
}

export const LOG_PANEL_LABELS: LogPanelLabels = {
  title: 'Logs',
  filterButton: 'Filter',
  filterByDate: 'Date',
  filterLogType: 'Log type',
  filterProgress: 'Progress',
  filterConnections: 'Connections',
  filterDebug: 'Debug',
  dateAll: 'All',
  dateToday: 'Today',
  dateLast7: 'Last 7 days',
  dateLast30: 'Last 30 days',
  dateCustom: 'Custom range',
  dateFrom: 'From',
  dateTo: 'To',
  noActivity: 'No activity yet.',
  hoverHint: 'Hover over a log entry to see details and capture preview.',
  openSavedImage: 'Open saved image',
}

export const RIGHT_PANEL_LABELS: RightPanelLabels = {
  classLabel: 'CLASS',
  noClasses: 'No classes in dataset',
  noClassMatches: 'No matching classes',
  searchClasses: 'Search classes',
  patternPreview: 'Pattern Preview',
  samRoi: 'ROI',
  samRoiActive: 'ROI — drawing',
  samRoiViewer: 'ROI viewer',
  samRoiViewerActive: 'ROI viewer — on',
  samRoiHint: 'Segment a region with SAM. Drag a bbox to start.',
  samRoiViewerHint: 'Show the saved ROI mask.',
}

export const PANEL_CLASSES: PanelClassInfo[] = CLASSES.map((c) => ({
  class_id: c.class_id as string,
  class_name: c.name,
  color: c.color,
}))

/** 16스텝 · X/Y 양방향 · solid 포함 = 33장. 현장 기본 설정이다. */
export const PATTERN_LABELS = buildPatternLabels({
  schema_version: '1',
  phase_shift_count: 16,
  capture_directions: 'both',
  include_solid: true,
  include_black: false,
  fringe_period_default: 24,
  exposure_per_pattern: 'same',
  sequence_retry_policy: 1,
  min_fringe_contrast: 0.02,
  max_saturation_pct: 1,
})

/** 촬영 한 번이 로그 한 줄. 시간 표기는 촬영이 끝난 시각이다. */
const SEQUENCE_TIMES = [
  '01:06:26', '01:02:11', '00:55:31', '00:48:39', '00:45:34', '00:42:18',
  '00:37:48', '00:32:45', '00:27:54', '00:24:36', '00:20:38', '00:09:02',
  '00:05:11', '00:02:01', '23:53:24', '23:42:51', '23:39:33', '23:33:55',
  '23:30:13', '23:26:38', '23:22:33', '23:19:04', '23:15:44', '23:03:00',
]

const SEQUENCE_IDS = [
  '5c492e', 'b34d7a', '1ba280', 'c7a021', '008331', 'a13215',
  '3b4904', '9f92a7', '98e47c', 'f98fae', 'd634d1', '688180',
  '9df7c3', '692551', '825214', 'd76c95', 'bb05a2', 'c270f8',
  '5d3de6', 'c2be51', '838153', '67d0d4', '23bab7', '205c6e',
]

function detailFor(id: string): string {
  return [
    `시퀀스 ${id}`,
    '1. 준비: 3.21s (셋업 + 첫 패턴 x_phase_0_of_16)',
    '2. 촬영: 41.02s (33장)',
    '  x_phase_1_of_16: 1.24s',
    '  x_phase_2_of_16: 1.23s',
    '  x_phase_3_of_16: 1.26s',
    '3. 영상처리: 2.08s',
    '총: 46.31s',
  ].join('\n')
}

// 시각은 메시지 앞머리 `[HH:MM:SS]` 에서 뽑아 왼쪽 칸에 세운다 — 앱이 쓰는 형식 그대로다.
export const SAMPLE_LOG_ENTRIES: LogPanelEntry[] = SEQUENCE_IDS.map((id, i) => ({
  msg: `[${SEQUENCE_TIMES[i]}] [SEQ success id=${id}] 준비 3.2s · 촬영 33장 41.0s · 영상처리 2.1s · 총 46.3s`,
  type: 'success',
  createdAt: `2026-09-02T${SEQUENCE_TIMES[i] ?? '00:00:00'}`,
  detail: detailFor(id),
}))
