// Workspace 좌측 Activity(Log) 패널 mock 엔트리.
// createdAt 은 결정성을 위해 ISO 리터럴 사용.

export interface SampleLogEntry {
  msg: string
  type: 'success' | 'info' | 'error'
  createdAt: string
  detail?: string
}

export const SAMPLE_LOG_ENTRIES: SampleLogEntry[] = [
  { msg: '[12:30:21] Camera connected', type: 'success', createdAt: '2026-05-20T12:30:21.000Z' },
  { msg: '[12:30:45] Low frame rate detected', type: 'info', createdAt: '2026-05-20T12:30:45.000Z' },
  {
    msg: '[12:31:02] Capture saved. 6 patterns',
    type: 'success',
    createdAt: '2026-05-20T12:31:02.000Z',
    detail: 'sequence_id: seq-001\npatterns: 6\nduration_ms: 4810\nbboxes: 3',
  },
  { msg: '[12:31:30] [DEBUG] frame buffer rotated', type: 'info', createdAt: '2026-05-20T12:31:30.000Z' },
  {
    msg: '[12:32:11] Capture failed: GVCP timeout',
    type: 'error',
    createdAt: '2026-05-20T12:32:11.000Z',
    detail: 'error_code: SEQ-0421\nfailed_step: 3\nfailed_pattern: y_phase_2',
  },
]
