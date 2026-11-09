import { useState } from 'react'
import {
  BBoxCanvasView, CaptureReviewFullscreen, DerivedCalculateOverlayView, RightPanelCollapsedView,
  RightPanelCommentSection, RightPanelView, SequencePatternPanelView, WorkspaceLabelingShell,
  type BBox, type CommentItem, type DerivedCalcState, type SequenceViewMode,
} from '@ingradient/edge-pages'
import { Button, Inline, Stack } from '@ingradient/ui'
import { SurfaceDepthProvider } from '@ingradient/ui/primitives'
import { PANEL_CLASSES, RIGHT_PANEL_LABELS, WORKSPACE_LABELS } from '../../../../fixtures/edge/0.0.5'
import { LABELING_BOXES, LABELING_LABELS, SYNTHETIC_CAPTURE } from './capture-fixtures'

export interface CaptureBranchesProps {
  initialBranch?: 'review' | 'derived' | 'labeling'
  initiallyCollapsed?: boolean
  initialDerivedState?: DerivedCalcState
  /** Show the sequence-failure dialog over the labeling shell on first render. */
  initialSequenceFailure?: boolean
  onMockAction?: (action: string) => void
}

/** Dedicated U9 controller. Backend completion is explicit, deterministic, and synthetic. */
/** Story harness: the app shell provides surface depth in the product, so the harness does too. */
export function CaptureBranches(props: CaptureBranchesProps): JSX.Element {
  return <SurfaceDepthProvider><CaptureBranchesBody {...props} /></SurfaceDepthProvider>
}
export function CaptureBranchesBody({ initialBranch = 'review', initiallyCollapsed = false, initialDerivedState = 'idle', initialSequenceFailure = false, onMockAction }: CaptureBranchesProps): JSX.Element {
  const [branch, setBranch] = useState(initialBranch)
  const [collapsed, setCollapsed] = useState(initiallyCollapsed)
  const [derivedState, setDerivedState] = useState<DerivedCalcState>(initialDerivedState)
  const [derivedReady, setDerivedReady] = useState(false)
  const [sequenceFailure, setSequenceFailure] = useState(initialSequenceFailure)
  const [viewMode, setViewMode] = useState<SequenceViewMode>('originals')
  const [activeImage, setActiveImage] = useState('original')
  const [classId, setClassId] = useState<string | null>('c1')
  const [search, setSearch] = useState('')
  const [roi, setRoi] = useState(false)
  const [editMode, setEditMode] = useState<'cursor' | 'bbox'>('cursor')
  const [boxes, setBoxes] = useState<BBox[]>(LABELING_BOXES)
  const [pendingSave, setPendingSave] = useState<BBox[] | null>(null)
  const [selectedBox, setSelectedBox] = useState<number | null>(null)
  const [pendingClassChange, setPendingClassChange] = useState<{ bboxIdx: number; classId: string } | null>(null)
  const [pendingComment, setPendingComment] = useState('')
  const [comments, setComments] = useState<CommentItem[]>([])
  const [status, setStatus] = useState('Simulation: synthetic capture; no device, inference, or persistence')
  const record = (message: string) => { setStatus(`Simulation: ${message}`); onMockAction?.(message) }
  const selectClass = (id: string) => {
    setClassId(id)
    if (selectedBox !== null) setPendingClassChange({ bboxIdx: selectedBox, classId: id })
    else setEditMode('bbox')
    record(`class selected ${id}`)
  }
  const panel = collapsed ? (
    <RightPanelCollapsedView classes={PANEL_CLASSES.map((cls) => ({ id: cls.class_id, name: cls.class_name, color: cls.color }))} selectedClassId={classId} labels={{ expand: 'Expand class panel' }} onClassClick={selectClass} onExpand={() => setCollapsed(false)} />
  ) : (
    <Stack style={{ width: 'var(--ig-layout-size-side-panel)', minWidth: 'var(--ig-layout-size-side-panel)' }}>
      <RightPanelView workspaceTab="capture" classes={PANEL_CLASSES} selectedClassId={classId} showPatternPreview={false} patternLabels={[]} previewPatternLabel={null} showRoiButton isDerivedViewActive={branch === 'derived'} samActive={roi} samViewerActive={roi} classSearch={search} labels={{ ...RIGHT_PANEL_LABELS, samRoiHint: 'Simulation: draw a box as an ROI; no SAM inference', samRoiViewerHint: 'Simulation: toggle ROI viewer state; no inferred mask' }} onSetClassSearch={setSearch} onSelectClass={selectClass} onTogglePattern={() => record('pattern preview not available in labeling')} onToggleCollapsed={() => setCollapsed(true)} onToggleSamRoi={() => { setRoi(!roi); setEditMode(roi ? 'cursor' : 'bbox'); record(roi ? 'ROI drawing disabled' : 'ROI drawing enabled; boxes simulate ROI, no SAM inference') }} commentSection={(
        <RightPanelCommentSection comments={comments} pendingComment={pendingComment} isSending={false} labels={{ title: 'Comments', placeholder: 'Add a simulation comment', send: 'Send comment', sending: 'Sending', empty: 'No comments' }} onPendingCommentChange={setPendingComment} onSend={() => {
          if (!pendingComment.trim()) return
          setComments((current) => [...current, { id: `comment-${current.length}`, author: 'Simulation operator', text: pendingComment.trim(), timestamp: '12:00', synced: false }])
          setPendingComment(''); record('comment stored locally; not synced')
        }} />
      )} />
    </Stack>
  )

  return (
    <Stack gap="var(--ig-spacing-8)" style={{ height: '100vh', padding: 'var(--ig-spacing-8)' }}>
      <Inline gap="var(--ig-spacing-8)">
        <Button variant="secondary" disabled={pendingSave !== null} onClick={() => setBranch('review')}>Review capture</Button>
        <Button variant="secondary" disabled={pendingSave !== null} onClick={() => setBranch('derived')}>Derived views</Button>
        <Button variant="secondary" disabled={pendingSave !== null} onClick={() => setBranch('labeling')}>Label capture</Button>
      </Inline>
      <div role="status">{status}</div>
      {pendingSave && <Inline gap="var(--ig-spacing-8)">
        <Button variant="secondary" onClick={() => { record(`${pendingSave.length} labels saved locally`); setPendingSave(null) }}>Complete simulated label save</Button>
        <Button variant="secondary" onClick={() => { record('label save cancelled'); setPendingSave(null) }}>Cancel simulated label save</Button>
      </Inline>}
      {branch === 'review' ? (
        <CaptureReviewFullscreen src={SYNTHETIC_CAPTURE} showSkip labels={{ enterFullscreen: 'Enter fullscreen', exitFullscreen: 'Exit fullscreen', skip: 'Skip simulated capture', save: 'Save simulated capture' }} onSkip={() => record('capture skipped')} onSave={() => { record('capture saved locally; labeling opened'); setBranch('labeling') }} />
      ) : branch === 'derived' ? (
        <>
          <Inline gap="var(--ig-spacing-8)">
            <Button variant="secondary" disabled={derivedState !== 'running'} onClick={() => { setDerivedReady(true); setDerivedState('idle'); record('derived calculation completed with synthetic image') }}>Complete simulated calculation</Button>
            <Button variant="secondary" disabled={derivedState !== 'running'} onClick={() => { setDerivedState('error'); record('derived calculation failed') }}>Fail simulated calculation</Button>
          </Inline>
          <Inline style={{ flex: 1, minHeight: 0 }} align="stretch" gap="var(--ig-spacing-8)">
            <SequencePatternPanelView images={[{ imageId: 'original', patternLabel: 'x_orig', sequenceStep: 0, width: 640, height: 480 }, { imageId: 'derived', patternLabel: 'derived_gradient_x', sequenceStep: null, width: 640, height: 480 }]} activeImageId={activeImage} viewMode={viewMode} enabledFeatures={{}} labels={{ originals: 'Originals', derived: 'Derived', noOriginals: 'No originals', noDerived: 'No derived images', patternHint: {} }} onSelectImage={(id) => { setActiveImage(id); record(`image selected ${id}`) }} onSetViewMode={setViewMode} />
            <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>
              <img src={SYNTHETIC_CAPTURE} alt="Synthetic derived capture" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              {!derivedReady && <DerivedCalculateOverlayView state={derivedState} reason={derivedState === 'unavailable' ? 'Simulation: original sequence is unavailable' : 'Simulation: calculation failed; retry is available'} labels={{ calculate: 'Calculate synthetic derived view', calculating: 'Calculating simulation' }} onCalculate={() => { setDerivedState('running'); record('derived calculation running') }} />}
            </div>
            {panel}
          </Inline>
        </>
      ) : (
        <Inline style={{ flex: 1, minHeight: 0 }} align="stretch" gap="var(--ig-spacing-8)">
          <WorkspaceLabelingShell mode="labeling" isCapturing={false} capturingStatusText="" sequenceFailure={sequenceFailure ? { message: 'Could not start the capture sequence. Nothing was captured.', errorCode: 'SEQ-0421' } : null} labels={WORKSPACE_LABELS} onSequenceFailureCancel={() => { setSequenceFailure(false); record('failure cancelled') }} onSequenceFailureRetry={() => { setSequenceFailure(false); record('retry requested') }} selectedDatasetId="simulation" activeTab="capture" tabItems={[]} onTabChange={() => record('tab changed')} isSetupMode={false} setupPanelTarget={null} isSavingLabel={pendingSave !== null} labelingContent={(
            <BBoxCanvasView imageDataUrl={SYNTHETIC_CAPTURE} classes={PANEL_CLASSES} selectedClassId={classId} editMode={editMode} initialBboxes={LABELING_BOXES} pendingClassChange={pendingClassChange} options={{ require_labeling: true, require_min_bbox_count: 1, block_next_without_labeling: false }} labels={LABELING_LABELS} onEditModeChange={setEditMode} onSelectionChange={(index) => setSelectedBox(index)} onBboxesChange={setBoxes} onSave={(result) => { setPendingSave(result); record('label save pending; complete or cancel the simulation') }} onSkip={() => { setBranch('review'); record('labeling skipped') }} onRetry={() => record('labeling retry requested')} />
          )} />
          <div style={{ display: 'contents' }} ref={(node) => node?.toggleAttribute('inert', pendingSave !== null)}>{panel}</div>
          <Stack>
            <output aria-label="Label count">{boxes.length} labels</output>
            <output aria-label="Selected box">{selectedBox === null ? 'None' : `Box ${selectedBox + 1}: ${boxes[selectedBox]?.classId ?? ''}`}</output>
          </Stack>
        </Inline>
      )}
    </Stack>
  )
}
