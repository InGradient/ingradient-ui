import ReactDOM from 'react-dom'
import { Tabs } from '@ingradient/ui'
import { Container } from './WorkspaceView.styles'
import { SequenceFailureDialog } from './SequenceFailureDialog'
import { CapturingPill } from './CapturingPill'
import type { WorkspaceViewProps, WorkspaceTab } from './types'

export function WorkspaceShell(props: WorkspaceViewProps): JSX.Element {
  const {
    selectedDatasetId, activeTab, tabItems, onTabChange,
    isSetupMode, setupPanelTarget, setupPanelContent,
    captureContent, imagesContent, staticsContent,
    sequenceFailure, isCapturing, capturingStatusText, labels,
    onSequenceFailureCancel, onSequenceFailureRetry,
  } = props

  const tabContent = activeTab === 'images' && selectedDatasetId
    ? imagesContent
    : activeTab === 'statics'
      ? staticsContent
      : captureContent

  return (
    <Container data-ig-component="WorkspaceShell" data-ig-layer="pages">
      {selectedDatasetId && (
        <>
          <Tabs
            items={tabItems}
            value={activeTab}
            onChange={(v) => onTabChange(v as WorkspaceTab)}
            style={{ margin: '0 0 4px' }}
          />
          {isSetupMode && setupPanelTarget && setupPanelContent
            && ReactDOM.createPortal(setupPanelContent, setupPanelTarget)}
        </>
      )}
      {tabContent}
      {sequenceFailure && (
        <SequenceFailureDialog
          info={sequenceFailure}
          labels={labels}
          onCancel={onSequenceFailureCancel}
          onRetry={onSequenceFailureRetry}
        />
      )}
      {isCapturing && <CapturingPill>{capturingStatusText}</CapturingPill>}
    </Container>
  )
}
