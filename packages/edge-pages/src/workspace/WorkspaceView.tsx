import { WorkspaceLabelingShell } from './WorkspaceLabelingShell'
import { WorkspaceShell } from './WorkspaceShell'
import type { WorkspaceViewProps } from './types'

export function WorkspaceView(props: WorkspaceViewProps): JSX.Element {
  if (props.mode === 'labeling') {
    return <WorkspaceLabelingShell {...props} />
  }
  return <WorkspaceShell {...props} />
}
