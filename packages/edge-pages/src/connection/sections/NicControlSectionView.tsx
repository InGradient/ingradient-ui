import { Button, SectionTitle, Spinner } from '@ingradient/ui'
import { Inline, Stack } from '@ingradient/ui/primitives'
import { NicStatusCardView } from './NicStatusCardView'
import type { NicControlSectionViewProps } from '../types'

export function NicControlSectionView(props: NicControlSectionViewProps): JSX.Element | null {
  const { nicStatus, isApplying, labels, onEnable, onDisable, onRestart } = props
  if (!nicStatus) return null
  return (
    <Stack as="section" gap="var(--ig-spacing-12)" style={{ marginBottom: 'var(--ig-spacing-16)' }}>
      <SectionTitle>{labels.nicControlTitle}</SectionTitle>
      <NicStatusCardView status={nicStatus} labels={labels} />
      <Inline gap="var(--ig-spacing-8)" wrap="nowrap" style={{ marginTop: 'var(--ig-spacing-8)' }}>
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
      </Inline>
    </Stack>
  )
}
