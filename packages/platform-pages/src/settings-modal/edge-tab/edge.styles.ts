import styled from 'styled-components'
import { Alert, InlineMessage, NumberField, StatusPill as UiStatusPill } from '@ingradient/ui/components'
import { FormSection, PageContent as UiPageContent } from '@ingradient/ui/patterns'

export const TabContent = styled(UiPageContent)`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
`

export const Section = FormSection

export const SectionTitle = styled.h3`
  font-size: 13px;
  font-weight: 600;
  color: var(--ig-color-text-secondary);
  margin: 0 0 14px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

export const SectionTitleMt = styled(SectionTitle)`
  margin-top: 12px;
`

export const CheckList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const CheckItem = styled.div`
  display: flex;
  align-items: center;
`

export const CheckDivider = styled.div`
  height: 1px;
  background: var(--ig-color-border-subtle);
  margin: 4px 0 2px;
`

export const FieldRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
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
  padding: 16px;
  background: var(--ig-color-bg-canvas);
  border: 1px solid var(--ig-color-border-subtle);
  border-radius: 8px;
  font-size: 13px;
`

export const ReportGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 12px;
`

export const ReportStat = styled.div`
  text-align: center;
  span:first-child {
    display: block;
    font-size: 22px;
    font-weight: 700;
    color: var(--ig-color-text-primary);
  }
  span:last-child {
    font-size: 11px;
    color: var(--ig-color-text-muted);
  }
`
