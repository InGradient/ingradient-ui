// 설정 다이얼로그 fixture — 탭 라벨과 옮긴 탭(일반·조명·실험)의 문구.
// 문구는 edge 의 en.json 값을 그대로 옮긴 것이다.
import type {
  CaptureTabLabels, CaptureTabOption,
  CameraSettingsDialogLabels, ExperimentsTabLabels, GeneralTabLabels,
  LightingTabLabels, MonitorPickerLabels, PsLightPanelLabels,
} from '@ingradient/edge-pages'

export const SETTINGS_DIALOG_LABELS: CameraSettingsDialogLabels = {
  title: 'System Settings',
  close: 'Close',
  tabGeneral: 'General',
  tabConnection: 'Connection',
  tabCamera: 'Camera',
  tabCapture: 'Capture',
  tabLighting: 'Lighting',
  tabServer: 'Server',
  tabData: 'Data',
  tabLogs: 'Logs',
  tabExperiments: 'Experiments',
  tabFieldTest: 'Field Test',
  tabAbout: 'About',
}

export const GENERAL_TAB_LABELS: GeneralTabLabels = {
  title: 'General',
  captureDoneSection: 'Capture complete alert',
  captureDoneDesc: 'Alerts you once capture and image processing have both finished. Works for every project type.',
  soundLabel: 'Alert sound',
  soundDesc: 'Play a sound when the capture finishes.',
  soundPreview: 'Preview',
  volumeLabel: 'Alert volume',
  volumeDesc: 'Volume of the synthesized alert sound',
  volumeSystemHint: 'The Windows default sound is played by the OS — adjust it in Windows sound settings',
  messageLabel: 'Notification message',
  messageDesc: 'Show a Windows notification when the capture finishes.',
  messageTest: 'Send test notification',
  messageTestFailed: 'Could not send the notification.',
  messageHint: 'Windows Focus Assist or per-app notification settings can hide this notification.',
}

export const SOUND_OPTIONS = [
  { id: 'chime', label: 'Chime' },
  { id: 'ding', label: 'Ding' },
  { id: 'arpeggio', label: 'Arpeggio' },
  { id: 'doubleBeep', label: 'Double beep' },
  { id: 'longChime', label: 'Long chime (repeats)' },
  { id: 'twoToneAlarm', label: 'Two-tone alarm (most noticeable)' },
  { id: 'risingRepeat', label: 'Rising repeat' },
  { id: 'windows_default', label: 'Windows default sound' },
]

export const LIGHTING_TAB_LABELS: LightingTabLabels = {
  title: 'Lighting',
  noProject: 'Select a project first.',
  noSettings: 'This project type has nothing to configure here.',
  capturingHint: 'Cannot change while capturing.',
}

export const MONITOR_PICKER_LABELS: MonitorPickerLabels = {
  section: 'Pattern monitor',
  desc: 'In deflectometry the monitor is the light source. Pick the display that shows the fringe pattern.',
  auto: 'Auto (prefer secondary)',
  primaryBadge: 'Primary',
  disconnected: 'Not connected',
  disconnectedHint: 'The saved monitor is not connected right now. Capture will fail as-is.',
  revertAuto: 'Revert to auto',
  singleMonitorHint: 'Only one monitor detected — the pattern shows in a window on this screen.',
  identify: 'Identify',
  identifying: 'Showing...',
  identifyHint: 'Briefly shows a white screen on the selected monitor.',
  unreachable: 'Could not load the monitor list. Check that the backend is running.',
  retry: 'Retry',
}

export const PS_LIGHT_LABELS: PsLightPanelLabels = {
  statusSection: 'Light controller',
  portOpen: 'Port open',
  connected: 'Connected',
  openFailed: 'Could not open the light controller port. Check the USB serial adapter.',
  unreachable: 'Could not reach the backend.',
  reopen: 'Reconnect',
  detectHint: 'Press Reconnect after re-plugging the adapter. An open port does not prove the link.',
  channelSection: 'Channel test',
  channelDesc: 'Check which physical light is which channel. A wrong mapping invalidates the result.',
  channel: (n) => `Channel ${n}`,
  allOn: 'All on',
  allOff: 'All off',
  pwmSection: 'Brightness',
  pwmDesc: 'Brightness used for capture (0-1023). Lower it to reduce saturation.',
  idleSection: 'Idle lights',
  idleLights: 'All channels on while idle',
  idleDesc: 'Turn off to leave the lights off after capture.',
  sequenceBusy: 'Cannot control the lights while a capture is running.',
}

export const MONITORS = [
  { id: 'DISPLAY1', label: 'Dell U2720Q', width: 3840, height: 2160, isPrimary: true },
  { id: 'DISPLAY2', label: 'LG 27UL500', width: 3840, height: 2160 },
]

export const EXPERIMENTS_TAB_LABELS: ExperimentsTabLabels = {
  title: 'Experiments',
  enabledLabel: 'Multi-period experiment',
  enabledDesc: 'Capture every fringe period in one run to build a comparison dataset.',
  disabledHint: 'Captures follow the Setup config (directions, solid, phase step count).',
  periodsSection: 'Fringe periods',
  duplicate: 'duplicate — merged when capturing',
  primaryBadge: 'analysis',
  addPeriod: 'Add period',
  removePeriod: 'Remove period',
  periodAria: (position) => `Period ${position}`,
  periodsHint: '4 or more, up to 6. Analysis uses only the Setup fringe period set.',
  compositeLabel: 'Composite frames',
  compositeDesc: 'Combined X/Y pattern. Uses the fringe periods above; only the step count is set here.',
  compositeSteps: 'Steps',
  total: '42 frames per capture',
}

/** 문구는 edge 의 `settings.capture.*` / `setup.aiPattern*` / `setup.aiFallback*` 값 그대로. */
export const CAPTURE_TAB_LABELS: CaptureTabLabels = {
  title: 'Capture',
  aiModeLabel: 'AI mode',
  aiModeDesc: 'Captures one pattern and predicts phase with a model. Much faster and far fewer '
    + 'images, but less precise than the multi-shot method.',
  classicHint: 'Captures several fringe patterns and computes phase by phase shifting. '
    + 'The way it has worked so far.',
  aiSection: 'AI capture',
  aiPattern: 'Pattern',
  aiPatternHint: 'A 2D crossed grid with pitch 24, captured in one shot. Must match what the '
    + 'model was trained on — a different pitch needs retraining.',
  aiFallback: 'When the model is unavailable',
  capturingHint: 'Cannot change while capturing.',
}

export const CAPTURE_PATTERN_OPTIONS: CaptureTabOption[] = [
  { value: 'composite_p24', label: 'Grid · pitch 24' },
]

/** 자동 전환이 현장 기본값이다 — 모델이 안 떠도 촬영이 멈추지 않는 쪽. */
export const CAPTURE_FALLBACK_OPTIONS: CaptureTabOption[] = [
  { value: 'classic', label: 'Switch to phase shifting', hint: 'Captures the usual way and keeps going.' },
  { value: 'block', label: 'Stop and notify', hint: 'Stops the sequence so the problem is not missed.' },
]
