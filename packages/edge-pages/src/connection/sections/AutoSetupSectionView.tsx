import { Button, Spinner } from '@ingradient/ui'
import { FlatSection } from '../ConnectionTabView.styles'
import type { AutoSetupSectionViewProps } from '../types'

export function AutoSetupSectionView(props: AutoSetupSectionViewProps): JSX.Element | null {
  const { visible, isRunning, labels, onRun } = props
  if (!visible) return null
  return (
    <FlatSection>
      <Button size="sm" variant="accent" onClick={onRun} disabled={isRunning}>
        {isRunning && <Spinner size="sm" tone="muted" />}
        Auto setup
      </Button>
      <div style={{ marginLeft: 'var(--ig-space-2)', fontSize: 'var(--ig-font-size-xs)', color: 'var(--ig-color-text-muted)' }}>
        {labels.scanHint}
      </div>
    </FlatSection>
  )
}
