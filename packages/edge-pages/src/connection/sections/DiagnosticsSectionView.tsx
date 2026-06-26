import styled from 'styled-components'
import { Button, SectionTitle, Spinner } from '@ingradient/ui'
import { FlatSection } from '../ConnectionTabView.styles'
import { DiagnoseClassificationCardView } from './DiagnoseClassificationCardView'
import type { DiagnosticsSectionViewProps } from '../types'

const FailureLine = styled.div`
  margin-top: var(--ig-space-3);
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-danger);
  font-family: var(--ig-font-mono);
`

const RecoveryHint = styled.div`
  margin-top: var(--ig-space-2);
  font-size: var(--ig-font-size-sm);
  color: var(--ig-color-text-muted);
`

export function DiagnosticsSectionView(props: DiagnosticsSectionViewProps): JSX.Element {
  const { isRunning, classification, failureCode, recoveryFailure, labels, onRunDiagnose } = props
  return (
    <FlatSection>
      <SectionTitle>{labels.diagnosticsTitle}</SectionTitle>
      <Button size="sm" variant="secondary" onClick={onRunDiagnose} disabled={isRunning}>
        {isRunning && <Spinner size="sm" tone="muted" />}
        {isRunning ? labels.diagnosing : labels.runDiagnose}
      </Button>
      {classification && (
        <div style={{ marginTop: 'var(--ig-space-3)' }}>
          <DiagnoseClassificationCardView classification={classification} labels={labels} />
        </div>
      )}
      {failureCode && <FailureLine>Failure code: {failureCode}</FailureLine>}
      {recoveryFailure && <RecoveryHint>{recoveryFailure}</RecoveryHint>}
    </FlatSection>
  )
}
