import styled from 'styled-components'
import { Card } from '@ingradient/ui'
import type { DiagnoseClassificationCardViewProps } from '../types'

// success(green)/warning(amber) tint — 라이브러리 Card tone(danger/default)으로 표현 불가하여
// 라이브러리 Card 표면 위에 tint 만 얹는 thin styled(Card).
const ClassificationCard = styled(Card)<{ $ok: boolean }>`
  border-color: ${({ $ok }) => ($ok ? 'var(--ig-color-success)' : 'var(--ig-color-warning)')};
  background: ${({ $ok }) => ($ok ? 'var(--ig-color-green-tint-success-soft)' : 'var(--ig-color-amber-tint-warning-soft)')};
  font-size: var(--ig-text-body-sm);
  line-height: var(--ig-text-body-sm-leading);
  color: var(--ig-color-text-primary);
`

export function DiagnoseClassificationCardView({ classification, labels }: DiagnoseClassificationCardViewProps): JSX.Element {
  const isOk = classification === 'success'
  return (
    <ClassificationCard $ok={isOk} flat padding="var(--ig-spacing-8)">
      {labels.classificationMessages[classification]}
    </ClassificationCard>
  )
}
