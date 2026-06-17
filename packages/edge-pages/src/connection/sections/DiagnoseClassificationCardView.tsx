import styled from 'styled-components'
import type { DiagnoseClassificationCardViewProps } from '../types'

const Card = styled.div<{ $ok: boolean }>`
  padding: var(--ig-space-4);
  border-radius: var(--ig-radius-sm);
  border: var(--ig-border-1px) solid ${({ $ok }) => ($ok ? 'var(--ig-color-success)' : 'var(--ig-color-warning)')};
  background: ${({ $ok }) => ($ok ? 'var(--ig-color-green-tint-success-soft)' : 'var(--ig-color-amber-tint-warning-soft)')};
  font-size: var(--ig-font-size-sm);
  color: var(--ig-color-text-primary);
`

export function DiagnoseClassificationCardView({ classification, labels }: DiagnoseClassificationCardViewProps): JSX.Element {
  const isOk = classification === 'success'
  return (
    <Card $ok={isOk}>
      {labels.classificationMessages[classification]}
    </Card>
  )
}
