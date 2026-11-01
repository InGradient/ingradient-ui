import styled from 'styled-components'
import { Button, SectionTitle, Spinner } from '@ingradient/ui'
import { Stack } from '@ingradient/ui/primitives'
import { DiagnoseClassificationCardView } from './DiagnoseClassificationCardView'
import type { DiagnosticsSectionViewProps } from '../types'

const FailureLine = styled.div`
  margin-top: var(--ig-spacing-8);
  font-size: var(--ig-text-caption);
  color: var(--ig-color-danger);
  font-family: var(--ig-font-mono);
`

const RecoveryHint = styled.div`
  margin-top: var(--ig-spacing-8);
  font-size: var(--ig-text-body-sm);
  color: var(--ig-color-text-muted);
`

export function DiagnosticsSectionView(props: DiagnosticsSectionViewProps): JSX.Element {
  const { isRunning, classification, failureCode, recoveryFailure, labels, onRunDiagnose } = props
  return (
    <Stack as="section" gap="var(--ig-spacing-12)" style={{ marginBottom: 'var(--ig-spacing-16)' }}>
      <SectionTitle>{labels.diagnosticsTitle}</SectionTitle>
      <Button size="sm" variant="secondary" onClick={onRunDiagnose} disabled={isRunning}>
        {isRunning && <Spinner size="sm" tone="muted" />}
        {isRunning ? labels.diagnosing : labels.runDiagnose}
      </Button>
      {classification && (
        <div style={{ marginTop: 'var(--ig-spacing-8)' }}>
          <DiagnoseClassificationCardView classification={classification} labels={labels} />
        </div>
      )}
      {failureCode && <FailureLine>Failure code: {failureCode}</FailureLine>}
      {recoveryFailure && <RecoveryHint>{recoveryFailure}</RecoveryHint>}
    </Stack>
  )
}
