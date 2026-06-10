import styled from 'styled-components'
import { Alert, InlineMessage, NumberField, StatusPill as UiStatusPill } from '@ingradient/ui/components'
import { surfaceRaised } from '@ingradient/ui/primitives'
import { PageContent as UiPageContent } from '@ingradient/ui/patterns'

export const TabContent = styled(UiPageContent)`
  flex: 0 0 auto;
  min-height: auto;
  padding: 0;
  overflow: visible;
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-4);
`

export const SectionTitle = styled.h3`
  margin: calc(var(--ig-space-5) * -1) calc(var(--ig-space-5) * -1) 0;
  padding: var(--ig-space-4) var(--ig-space-5);
  border-bottom: 1px solid var(--ig-color-border-subtle);
  background: var(--ig-color-surface-interactive);
  font-size: var(--ig-font-size-sm);
  font-weight: 600;
  color: var(--ig-color-text-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

export const SectionTitleMt = styled(SectionTitle)`
  margin: var(--ig-space-4) 0 0;
  padding: 0;
  border: 0;
  background: transparent;
`

export const Section = styled.section`
  ${surfaceRaised}
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-4);
  padding: var(--ig-space-5);
  border-radius: var(--ig-radius-lg);
`

export const CheckList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-3);
`

export const CheckItem = styled.div`
  display: flex;
  align-items: center;
`

export const CheckDivider = styled.div`
  height: 1px;
  background: var(--ig-color-border-subtle);
  margin: var(--ig-space-2) 0;
`

export const FieldRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ig-space-4);
  margin-top: var(--ig-space-3);
  flex-wrap: wrap;
`

export const Label = styled.label`
  font-size: var(--ig-font-size-sm);
  color: var(--ig-color-text-muted);
  white-space: nowrap;
`

export const NumberInput = styled(NumberField)`
  width: calc(var(--ig-space-10) * 2);
`

export const Hint = styled.p`
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-text-muted);
  margin: var(--ig-space-2) 0 0;
`

export const ErrorHint = styled(InlineMessage).attrs({ $tone: 'danger' as const })`
  margin-top: var(--ig-space-3);
`

export const ErrorHintInline = styled(InlineMessage).attrs({ $tone: 'danger' as const })`
  margin-top: 0;
`

export const WarningBox = styled(Alert).attrs({ $tone: 'warning' as const })`
  margin-top: var(--ig-space-3);
`

export const ProgressNote = styled.span`
  margin-left: var(--ig-space-3);
  font-size: var(--ig-font-size-2xs);
  color: var(--ig-color-text-muted);
`

export const UserEmailNote = styled.span`
  color: var(--ig-color-text-muted);
  margin-left: var(--ig-space-1);
`

export const StatusPill = UiStatusPill

export const StatusPillMb = styled(StatusPill)`
  margin-bottom: var(--ig-space-4);
`

export const ReportBox = styled.div`
  padding: var(--ig-space-5);
  background: var(--ig-color-bg-canvas);
  border: 1px solid var(--ig-color-border-subtle);
  border-radius: var(--ig-radius-md);
  font-size: var(--ig-font-size-sm);
`

export const ReportGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--ig-space-4);
  margin-bottom: var(--ig-space-4);
`

export const ReportStat = styled.div`
  text-align: center;
  span:first-child {
    display: block;
    font-size: var(--ig-font-size-3xl);
    font-weight: 700;
    color: var(--ig-color-text-primary);
  }
  span:last-child {
    font-size: var(--ig-font-size-2xs);
    color: var(--ig-color-text-muted);
  }
`

export const ActionsRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--ig-space-3);
`

export const ProgressWrap = styled.div`
  width: 100%;
  max-width: 420px;
  margin: var(--ig-space-3) auto 0;
`

export const ProgressLabel = styled.div`
  margin-top: var(--ig-space-2);
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-text-muted);
  font-variant-numeric: tabular-nums;
`

export const DropzoneWrap = styled.div`
  margin-top: var(--ig-space-4);
`

export const CancelAction = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: var(--ig-space-4);
`

export const InlineActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: var(--ig-space-3);
  flex-wrap: wrap;
`
