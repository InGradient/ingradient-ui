import { WorkspaceLabelingShell } from './WorkspaceLabelingShell'
import { WorkspaceShell } from './WorkspaceShell'
import type { WorkspaceViewProps } from './types'
import { SurfaceDepthProvider } from '@ingradient/ui/primitives'

function WorkspaceViewContent(props: WorkspaceViewProps): JSX.Element {
  if (props.mode === 'labeling') {
    return <WorkspaceLabelingShell {...props} />
  }
  return <WorkspaceShell {...props} />
}

/**
 * Edge uses the same surface rules as Platform: a rounded surface inside another rounded
 * surface is always less rounded than its parent (DESIGN.draft.md §5).
 */
export function WorkspaceView(props: WorkspaceViewProps) {
  return (
    <SurfaceDepthProvider>
      <WorkspaceViewContent {...props} />
    </SurfaceDepthProvider>
  )
}
