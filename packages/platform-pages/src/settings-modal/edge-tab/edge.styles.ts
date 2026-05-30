import styled from 'styled-components'
import { Alert, InlineMessage, NumberField, StatusPill as UiStatusPill } from '@ingradient/ui/components'
import { FormSection, PageContent as UiPageContent } from '@ingradient/ui/patterns'

export const TabContent = styled(UiPageContent)`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-11);
`

export const Section = FormSection

export const SectionTitle = styled.h3`
  font-size: var(--ig-font-size-sm);
  font-weight: var(--ig-font-weight-semibold);
  color: var(--ig-color-text-secondary);
  margin: 0 0 14px;
  text-transform: uppercase;
  letter-spacing: var(--ig-letter-spacing-wide);
`

export const SectionTitleMt = styled(SectionTitle)`
  margin-top: 12px;
`

export const CheckList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-3);
`

export const CheckItem = styled.label`
  display: flex;
  align-items: center;
  gap: var(--ig-space-3);
  font-size: var(--ig-font-size-sm);
  color: var(--ig-color-text-primary);
  cursor: pointer;
  input[type='checkbox'] {
    width: 15px;
    height: 15px;
    cursor: pointer;
  }
`

export const CheckDivider = styled.div`
  height: 1px;
  background: var(--ig-color-border-subtle);
  margin: var(--ig-space-1) 0 2px;
`

export const FieldRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ig-space-5);
  margin-top: 12px;
  flex-wrap: wrap;
`

export const Label = styled.label`
  font-size: var(--ig-font-size-sm);
  color: var(--ig-color-text-muted);
  white-space: nowrap;
`

export const NumberInput = styled(NumberField)`
  width: 80px;
`

export const Hint = styled.p`
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-text-muted);
  margin: 6px 0 0;
`

export const ErrorHint = styled(InlineMessage).attrs({ $tone: 'danger' as const })`
  margin-top: 8px;
`

export const ErrorHintInline = styled(InlineMessage).attrs({ $tone: 'danger' as const })`
  margin-top: 0;
`

export const WarningBox = styled(Alert).attrs({ $tone: 'warning' as const })`
  margin-top: 8px;
`

export const ProgressNote = styled.span`
  margin-left: 8px;
  font-size: var(--ig-font-size-2xs);
  color: var(--ig-color-text-muted);
`

export const UserEmailNote = styled.span`
  color: var(--ig-color-text-muted);
  margin-left: 4px;
`

export const StatusPill = UiStatusPill

export const StatusPillMb = styled(StatusPill)`
  margin-bottom: 12px;
`

export const ReportBox = styled.div`
  padding: var(--ig-space-7);
  background: var(--ig-color-bg-canvas);
  border: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  border-radius: var(--ig-radius-md);
  font-size: var(--ig-font-size-sm);
`

export const ReportGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--ig-space-5);
  margin-bottom: 12px;
`

export const ReportStat = styled.div`
  text-align: center;
  span:first-child {
    display: block;
    font-size: 22px;
    font-weight: var(--ig-font-weight-bold);
    color: var(--ig-color-text-primary);
  }
  span:last-child {
    font-size: var(--ig-font-size-2xs);
    color: var(--ig-color-text-muted);
  }
`
