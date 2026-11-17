import { Button, Spinner } from '@ingradient/ui'
import { Stack } from '@ingradient/ui/primitives'
import type { AutoSetupSectionViewProps } from '../types'

export function AutoSetupSectionView(props: AutoSetupSectionViewProps): JSX.Element | null {
  const { visible, isRunning, labels, onRun } = props
  if (!visible) return null
  return (
    <Stack as="section" gap="var(--ig-spacing-12)" style={{ marginBottom: 'var(--ig-spacing-16)' }}>
      <Button size="sm" variant="accent" onClick={onRun} disabled={isRunning}>
        {isRunning && <Spinner size="sm" tone="muted" />}
        Auto setup
      </Button>
      <div style={{ marginLeft: 'var(--ig-spacing-8)', fontSize: 'var(--ig-text-caption)', color: 'var(--ig-color-text-muted)' }}>
        {labels.scanHint}
      </div>
    </Stack>
  )
}
