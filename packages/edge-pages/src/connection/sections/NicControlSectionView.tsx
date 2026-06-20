import { Button, SectionTitle, Spinner } from '@ingradient/ui'
import { FlatSection } from '../ConnectionTabView.styles'
import { NicStatusCardView } from './NicStatusCardView'
import type { NicControlSectionViewProps } from '../types'

export function NicControlSectionView(props: NicControlSectionViewProps): JSX.Element | null {
  const { nicStatus, isApplying, labels, onEnable, onDisable, onRestart } = props
  if (!nicStatus) return null
  return (
    <FlatSection>
      <SectionTitle>{labels.nicControlTitle}</SectionTitle>
      <NicStatusCardView status={nicStatus} labels={labels} />
      <div style={{ display: 'flex', gap: 'var(--ig-space-3)', marginTop: 'var(--ig-space-3)' }}>
        <Button size="sm" variant="secondary" onClick={() => onEnable(nicStatus.nicId)} disabled={isApplying || nicStatus.isAdminUp}>
          {isApplying && <Spinner size="sm" tone="muted" />}
          {labels.nicEnable}
        </Button>
        <Button size="sm" variant="secondary" onClick={() => onDisable(nicStatus.nicId)} disabled={isApplying || !nicStatus.isAdminUp}>
          {labels.nicDisable}
        </Button>
        <Button size="sm" variant="secondary" onClick={() => onRestart(nicStatus.nicId)} disabled={isApplying}>
          {labels.nicRestart}
        </Button>
      </div>
    </FlatSection>
  )
}
