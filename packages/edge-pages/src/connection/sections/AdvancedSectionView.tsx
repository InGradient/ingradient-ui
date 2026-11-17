import { useId } from 'react'
import { CollapsibleSectionHeader } from '@ingradient/ui/components'
import { Stack } from '@ingradient/ui/primitives'
import type { AdvancedSectionViewProps } from '../types'

export function AdvancedSectionView(props: AdvancedSectionViewProps): JSX.Element {
  const { expanded, children, labels, onToggleExpanded } = props
  const panelId = useId()
  return (
    <Stack as="section" gap="var(--ig-spacing-12)" style={{ marginBottom: 'var(--ig-spacing-16)' }}>
      <CollapsibleSectionHeader
        title={labels.advancedTitle}
        open={expanded}
        onClick={onToggleExpanded}
        controls={expanded ? panelId : undefined}
      />
      {expanded && <div id={panelId}>{children}</div>}
    </Stack>
  )
}
