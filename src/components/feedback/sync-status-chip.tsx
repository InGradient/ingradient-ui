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

const Chip = styled.span<{ $state: SyncState; $variant: SyncStatusChipVariant; $collapseUntilHover: boolean }>`
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
  justify-content: center;
  gap: var(--ig-space-1);
  height: 20px;
  padding: 0 var(--ig-space-3);
  border-radius: var(--ig-radius-pill);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.04em;
  white-space: nowrap;
  overflow: hidden;
  transition:
    max-width var(--ig-motion-fast),
    padding var(--ig-motion-fast),
    border-radius var(--ig-motion-fast);

  ${({ $collapseUntilHover }) =>
    $collapseUntilHover
      ? css`
          max-width: 20px;
          min-width: 20px;
          padding: 0;

          &:hover,
          &:focus-visible,
          :where([data-sync-chip-hover-scope='true']:hover) &,
          :where([data-sync-chip-hover-scope='true']:focus-within) & {
            max-width: 120px;
            padding: 0 var(--ig-space-3);
          }
        `
      : css`
          max-width: 120px;
        `}
`

const Dot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
`

const Label = styled.span<{ $collapseUntilHover: boolean }>`
  display: inline-block;
  overflow: hidden;
  transition:
    opacity var(--ig-motion-fast),
    max-width var(--ig-motion-fast);

  ${({ $collapseUntilHover }) =>
    $collapseUntilHover
      ? css`
          max-width: 0;
          opacity: 0;

          ${Chip}:hover &,
          ${Chip}:focus-visible &,
          :where([data-sync-chip-hover-scope='true']:hover) ${Chip} &,
          :where([data-sync-chip-hover-scope='true']:focus-within) ${Chip} & {
            max-width: 96px;
            opacity: 1;
          }
        `
      : css`
          max-width: 96px;
        `}
`

export interface SyncStatusChipProps {
  state: SyncState
  label?: string
  variant?: SyncStatusChipVariant
  showDot?: boolean
  collapseUntilHover?: boolean
  className?: string
}

export function SyncStatusChip({
  state, label, variant = 'soft', showDot = true, collapseUntilHover = false, className,
}: SyncStatusChipProps) {
  const map = variant === 'opaque' ? opaqueStateStyles : softStateStyles
  const statusLabel = label ?? map[state].label
  return (
    <Chip
      $state={state}
      $variant={variant}
      $collapseUntilHover={collapseUntilHover}
      className={className}
      aria-label={`Sync state: ${statusLabel}`}
      tabIndex={collapseUntilHover ? 0 : undefined}
    >
      {showDot ? <Dot /> : null}
      <Label $collapseUntilHover={collapseUntilHover}>{statusLabel}</Label>
    </Chip>
  )
}
