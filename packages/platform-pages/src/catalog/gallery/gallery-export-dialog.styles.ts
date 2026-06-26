import styled from 'styled-components'

export const ExportSection = styled.div`
  margin-bottom: var(--ig-space-6);
`

export const ExportSectionLabel = styled.div`
  margin-bottom: var(--ig-space-3);
  font-size: var(--ig-font-size-xs);
  font-weight: var(--ig-font-weight-bold);
  letter-spacing: var(--ig-letter-spacing-normal);
  text-transform: uppercase;
  color: var(--ig-color-text-soft);
`

export const ExportOption = styled.label<{ $active?: boolean; $disabled?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: var(--ig-space-3);
  padding: var(--ig-space-5);
  margin-bottom: var(--ig-space-3);
  border-radius: var(--ig-radius-lg);
  border: var(--ig-border-1px) solid
    ${(p) => (p.$active ? 'var(--ig-color-accent)' : 'var(--ig-color-border-subtle)')};
  background: ${(p) => (p.$active ? 'var(--ig-color-accent-soft-surface)' : 'var(--ig-color-white-04)')};
  color: ${(p) => (p.$disabled ? 'var(--ig-color-text-soft)' : 'var(--ig-color-text-primary)')};
  opacity: ${(p) => (p.$disabled ? 0.55 : 1)};
  cursor: ${(p) => (p.$disabled ? 'not-allowed' : 'pointer')};
`

export const ExportOptionRadio = styled.input.attrs({ type: 'radio' })`
  margin-top: var(--ig-space-2px);
  accent-color: var(--ig-color-accent);
`

export const ExportOptionBody = styled.span`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-1);
  min-width: 0;
`

export const ExportOptionTitle = styled.span`
  font-size: var(--ig-font-size-sm);
  font-weight: var(--ig-font-weight-semibold);
`

export const ExportOptionHint = styled.span`
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-text-soft);
`

export const ExportRegexInput = styled.input`
  width: 100%;
  margin-top: var(--ig-space-3);
  padding: var(--ig-space-3) var(--ig-space-4);
  border-radius: var(--ig-radius-md);
  border: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  background: var(--ig-color-white-04);
  color: var(--ig-color-text-primary);
  font-size: var(--ig-font-size-sm);
  font-family: var(--ig-font-mono);
  &:focus {
    outline: none;
    border-color: var(--ig-color-accent);
  }
`


export const ExportProgressMeta = styled.div`
  display: flex;
  justify-content: space-between;
  gap: var(--ig-space-3);
  margin-bottom: var(--ig-space-2);
  font-size: var(--ig-font-size-sm);
  color: var(--ig-color-text-soft);
`

export const ExportStatusText = styled.div`
  font-size: var(--ig-font-size-sm);
  color: var(--ig-color-text-primary);
`

export const ExportErrorText = styled.div`
  margin-top: var(--ig-space-3);
  padding: var(--ig-space-3) var(--ig-space-4);
  border-radius: var(--ig-radius-md);
  background: var(--ig-color-alert-danger-bg);
  border: var(--ig-border-1px) solid var(--ig-color-alert-danger-border);
  color: var(--ig-color-danger);
  font-size: var(--ig-font-size-sm);
`

export const DialogRow = styled.div`
  margin-bottom: var(--ig-space-3);
  label {
    display: block;
    margin-bottom: var(--ig-space-2);
    font-size: var(--ig-font-size-sm);
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
