export const statusToneStyles = {
  running: { background: 'var(--ig-color-status-running-bg)', color: 'var(--ig-color-status-running-text)' },
  completed: { background: 'var(--ig-color-status-completed-bg)', color: 'var(--ig-color-status-completed-text)' },
  queued: { background: 'var(--ig-color-status-queued-bg)', color: 'var(--ig-color-status-queued-text)' },
  draft: { background: 'var(--ig-color-status-draft-bg)', color: 'var(--ig-color-status-draft-text)' },
  failed: { background: 'var(--ig-color-status-failed-bg)', color: 'var(--ig-color-status-failed-text)' },
  stopped: { background: 'var(--ig-color-status-stopped-bg)', color: 'var(--ig-color-status-stopped-text)' },
  interrupted: { background: 'var(--ig-color-status-interrupted-bg)', color: 'var(--ig-color-status-interrupted-text)' },
  warning: { background: 'var(--ig-color-status-warning-bg)', color: 'var(--ig-color-status-warning-text)' },
  idle: { background: 'var(--ig-color-status-idle-bg)', color: 'var(--ig-color-status-idle-text)' },
} as const

export type StatusTone = keyof typeof statusToneStyles
