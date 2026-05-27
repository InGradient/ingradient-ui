import { StateChip, type StateChipStyle } from '@ingradient/ui/components'

export type SyncState = 'synced' | 'uploading' | 'upload_failed' | 'local_only'
export type SyncStatusChipVariant = 'soft' | 'opaque'

const SOFT_STATE_STYLES: Record<SyncState, StateChipStyle & { label: string }> = {
  synced: { bg: 'var(--ig-color-badge-success)', color: 'var(--ig-color-success)', label: 'Synced' },
  uploading: { bg: 'var(--ig-color-badge-warning)', color: 'var(--ig-color-warning)', label: 'Uploading' },
  upload_failed: { bg: 'var(--ig-color-badge-danger)', color: 'var(--ig-color-danger)', label: 'Failed' },
  local_only: { bg: 'var(--ig-color-badge-neutral)', color: 'var(--ig-color-text-muted)', label: 'Local' },
}

const OPAQUE_STATE_STYLES: Record<SyncState, StateChipStyle & { label: string }> = {
  synced: { bg: 'var(--ig-color-sync-chip-synced-bg)', color: 'var(--ig-color-sync-chip-on-text)', label: 'Synced' },
  uploading: { bg: 'var(--ig-color-sync-chip-uploading-bg)', color: 'var(--ig-color-sync-chip-on-text)', label: 'Uploading' },
  upload_failed: { bg: 'var(--ig-color-sync-chip-failed-bg)', color: 'var(--ig-color-sync-chip-on-text)', label: 'Failed' },
  local_only: { bg: 'var(--ig-color-sync-chip-local-bg)', color: 'var(--ig-color-sync-chip-on-text)', label: 'Local' },
}

export interface SyncStatusChipProps {
  state: SyncState
  label?: string
  variant?: SyncStatusChipVariant
  showDot?: boolean
  className?: string
}

export function SyncStatusChip({
  state, label, variant = 'soft', showDot = true, className,
}: SyncStatusChipProps) {
  const styles = variant === 'opaque' ? OPAQUE_STATE_STYLES : SOFT_STATE_STYLES
  return (
    <StateChip
      state={state}
      label={label ?? styles[state].label}
      stateStyles={styles}
      showDot={showDot}
      className={className}
      aria-label={`Sync state: ${state}`}
    />
  )
}
