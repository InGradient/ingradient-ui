import styled from 'styled-components'
import { Alert, InlineMessage, NumberField, StatusPill as UiStatusPill } from '@ingradient/ui/components'

import { PageContent as UiPageContent } from '@ingradient/ui/patterns'

export const TabContent = styled(UiPageContent)`
  flex: 0 0 auto;
  min-height: auto;
  padding: 0;
  overflow: visible;
  display: flex;
  flex-direction: column;
  gap: var(--ig-spacing-8);
`

/** Same as the SettingsSection title on the other tabs (no band, sentence case). */
export const SectionTitle = styled.h3`
  margin: 0;
  font-size: var(--ig-text-body);
  font-weight: var(--ig-font-weight-semibold);
  color: var(--ig-color-text-primary);
`

export const SectionTitleMt = styled(SectionTitle)`
  margin: var(--ig-spacing-8) 0 0;
`

/** Same as SettingsSection: a heading and rows separated by a 1px line, not a box. */
export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: var(--ig-spacing-12);
  & + & {
    margin-top: var(--ig-spacing-16);
    padding-top: var(--ig-spacing-24);
    border-top: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  }
`

export const CheckList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-spacing-8);
`

export const CheckItem = styled.div`
  display: flex;
  align-items: center;
`

export const CheckDivider = styled.div`
  height: var(--ig-space-1px);
  background: var(--ig-color-border-subtle);
  margin: var(--ig-spacing-8) 0;
`

export const ControlRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ig-spacing-8);
  margin-top: var(--ig-spacing-8);
  flex-wrap: wrap;
`

export const Label = styled.label`
  font-size: var(--ig-text-body-sm);
  color: var(--ig-color-text-muted);
  white-space: nowrap;
`

export const NumberInput = styled(NumberField)`
  width: calc(var(--ig-spacing-24) * 2);
`

export const Hint = styled.p`
  font-size: var(--ig-text-caption);
  color: var(--ig-color-text-muted);
  margin: var(--ig-spacing-8) 0 0;
`

export const ErrorHint = styled(InlineMessage).attrs({ $tone: 'danger' as const })`
  margin-top: var(--ig-spacing-8);
`

export const ErrorHintInline = styled(InlineMessage).attrs({ $tone: 'danger' as const })`
  margin-top: 0;
`

export const WarningBox = styled(Alert).attrs({ $tone: 'warning' as const })`
  margin-top: var(--ig-spacing-8);
`

export const ProgressNote = styled.span`
  margin-left: var(--ig-spacing-8);
  font-size: var(--ig-text-micro);
  color: var(--ig-color-text-muted);
`

export const UserEmailNote = styled.span`
  color: var(--ig-color-text-muted);
  margin-left: var(--ig-spacing-4);
`

export const StatusPill = UiStatusPill

export const StatusPillMb = styled(StatusPill)`
  margin-bottom: var(--ig-spacing-8);
`

export const ReportBox = styled.div`
  padding: var(--ig-spacing-12);
  background: var(--ig-color-bg-canvas);
  border: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  border-radius: var(--ig-radius-md);
  font-size: var(--ig-text-body-sm);
`

export const ReportGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--ig-spacing-8);
  margin-bottom: var(--ig-spacing-8);
`

export const ReportStat = styled.div`
  text-align: center;
  span:first-child {
    display: block;
    font-size: var(--ig-text-title);
    font-weight: var(--ig-font-weight-bold);
    color: var(--ig-color-text-primary);
  }
  span:last-child {
    font-size: var(--ig-text-micro);
    color: var(--ig-color-text-muted);
  }
`

export const ActionsRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--ig-spacing-8);
`

export const ProgressWrap = styled.div`
  width: 100%;
  max-width: var(--ig-popup-2xl-narrow);
  margin: var(--ig-spacing-8) auto 0;
`

export const ProgressLabel = styled.div`
  margin-top: var(--ig-spacing-8);
  font-size: var(--ig-text-caption);
  color: var(--ig-color-text-muted);
  font-variant-numeric: tabular-nums;
`

export const DropzoneWrap = styled.div`
  margin-top: var(--ig-spacing-8);
`

export const CancelAction = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: var(--ig-spacing-8);
`

export const InlineActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: var(--ig-spacing-8);
  flex-wrap: wrap;
`
