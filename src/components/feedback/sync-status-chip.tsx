import styled, { css } from 'styled-components'

export type SyncState = 'synced' | 'uploading' | 'upload_failed' | 'local_only'
export type SyncStatusChipVariant = 'soft' | 'opaque'

const softStateStyles: Record<SyncState, { bg: string; color: string; label: string }> = {
  synced: { bg: 'var(--ig-color-badge-success)', color: 'var(--ig-color-success)', label: 'Synced' },
  uploading: { bg: 'var(--ig-color-badge-warning)', color: 'var(--ig-color-warning)', label: 'Uploading' },
  upload_failed: { bg: 'var(--ig-color-badge-danger)', color: 'var(--ig-color-danger)', label: 'Failed' },
  local_only: { bg: 'var(--ig-color-badge-neutral)', color: 'var(--ig-color-text-muted)', label: 'Local' },
}

const opaqueStateStyles: Record<SyncState, { bg: string; color: string; label: string }> = {
  synced: { bg: 'var(--ig-color-sync-chip-synced-bg)', color: 'var(--ig-color-sync-chip-on-text)', label: 'Synced' },
  uploading: { bg: 'var(--ig-color-sync-chip-uploading-bg)', color: 'var(--ig-color-sync-chip-on-text)', label: 'Uploading' },
  upload_failed: { bg: 'var(--ig-color-sync-chip-failed-bg)', color: 'var(--ig-color-sync-chip-on-text)', label: 'Failed' },
  local_only: { bg: 'var(--ig-color-sync-chip-local-bg)', color: 'var(--ig-color-sync-chip-on-text)', label: 'Local' },
}

const Chip = styled.span<{ $state: SyncState; $variant: SyncStatusChipVariant }>`
  ${({ $state, $variant }) => {
    const map = $variant === 'opaque' ? opaqueStateStyles : softStateStyles
    const s = map[$state]
    return css`
      background: ${s.bg};
      color: ${s.color};
    `
  }}
  display: inline-flex;
  align-items: center;
  gap: var(--ig-space-1);
  height: 20px;
  padding: 0 var(--ig-space-3);
  border-radius: var(--ig-radius-pill);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.04em;
  white-space: nowrap;
`

const Dot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
`

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
  const map = variant === 'opaque' ? opaqueStateStyles : softStateStyles
  return (
    <Chip $state={state} $variant={variant} className={className} aria-label={`Sync state: ${state}`}>
      {showDot ? <Dot /> : null}
      {label ?? map[state].label}
    </Chip>
  )
}
