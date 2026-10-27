import styled from 'styled-components'

export const ExportSection = styled.div`
  margin-bottom: var(--ig-spacing-12);
`

export const ExportSectionLabel = styled.div`
  margin-bottom: var(--ig-spacing-8);
  font-size: var(--ig-text-caption);
  font-weight: var(--ig-font-weight-bold);
  letter-spacing: var(--ig-letter-spacing-normal);
  text-transform: uppercase;
  color: var(--ig-color-text-soft);
`

export const ExportOptionHint = styled.span`
  font-size: var(--ig-text-caption);
  color: var(--ig-color-text-soft);
`

export const ExportProgressMeta = styled.div`
  display: flex;
  justify-content: space-between;
  gap: var(--ig-spacing-8);
  margin-bottom: var(--ig-spacing-8);
  font-size: var(--ig-text-body-sm);
  color: var(--ig-color-text-soft);
`

export const ExportStatusText = styled.div`
  font-size: var(--ig-text-body-sm);
  color: var(--ig-color-text-primary);
`

export const ExportErrorText = styled.div`
  margin-top: var(--ig-spacing-8);
  padding: var(--ig-spacing-8) var(--ig-spacing-8);
  border-radius: var(--ig-radius-md);
  background: var(--ig-color-alert-danger-bg);
  border: var(--ig-border-1px) solid var(--ig-color-alert-danger-border);
  color: var(--ig-color-danger);
  font-size: var(--ig-text-body-sm);
`

export const DialogRow = styled.div`
  margin-bottom: var(--ig-spacing-8);
  label {
    display: block;
    margin-bottom: var(--ig-spacing-8);
    font-size: var(--ig-text-body-sm);
    color: var(--ig-color-text-muted);
  }
`

export function exportStageLabel(stage: string): string {
  switch (stage) {
    case 'queued':
    case 'preparing_export':
      return 'Preparing export'
    case 'collecting_samples':
      return 'Collecting samples'
    case 'collecting_labels':
      return 'Collecting labels'
    case 'packaging_zip':
      return 'Packaging ZIP'
    case 'starting_download':
      return 'Starting download'
    case 'failed':
      return 'Export failed'
    default:
      return 'Exporting data'
  }
}
