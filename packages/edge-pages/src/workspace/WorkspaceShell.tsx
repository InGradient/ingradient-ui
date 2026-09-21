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
      {/* Lock only navigation/content; failure-dialog cancel and Escape stay available. */}
      <div style={{ display: 'contents' }} ref={(node) => node?.toggleAttribute('inert', isCapturing)}>
      {selectedDatasetId && (
        <>
          <Tabs
            items={tabItems}
            value={activeTab}
            onChange={(v) => { if (!isCapturing) onTabChange(v as WorkspaceTab) }}
            style={{ margin: '0 0 var(--ig-space-1)' }}
          />
          {isSetupMode && setupPanelTarget && setupPanelContent
            && ReactDOM.createPortal(setupPanelContent, setupPanelTarget)}
        </>
      )}
      {tabContent}
      </div>
      {sequenceFailure && (
        <SequenceFailureDialog
          info={sequenceFailure}
          labels={labels}
          onCancel={onSequenceFailureCancel}
          onRetry={onSequenceFailureRetry}
        />
      )}
      {isCapturing && <div role="status"><CapturingPill>{capturingStatusText}</CapturingPill></div>}
    </Container>
  )
}
