// BBoxCanvasView scene — labeling 모드 캔버스 + images 모달 캔버스에서 공유.
import { useState } from 'react'
import { BBoxCanvasView, type BBox } from '@ingradient/edge-pages'
import {
  SAMPLE_IMAGE_DATA_URL,
  SAMPLE_CLASSES_FULL,
  SAMPLE_BBOXES,
} from '../../../../fixtures/edge/0.0.1/sample-images'

const BBOX_LABELS = {
  save: 'Save', skip: 'Skip', retry: 'Retry', reset: 'Reset',
  enterFullscreen: 'Fullscreen', exitFullscreen: 'Exit fullscreen',
  bboxCount: (n: number) => `${n} bbox`,
  blockMsgRequireLabel: 'At least 1 bbox required',
  blockMsgRequireMinBbox: (n: number) => `At least ${n} bboxes required`,
  hint: 'Drag to draw a bbox · click bbox to select',
  showAnnotations: 'Show annotations',
  hideAnnotations: 'Hide annotations',
  cursorMode: 'Cursor mode',
  bboxMode: 'Draw bbox',
}

export function BBoxCanvasScene({
  initialBboxes = SAMPLE_BBOXES,
  readOnly = false,
  imageSrc = SAMPLE_IMAGE_DATA_URL,
  inModal = false,
  editMode: editModeProp,
  annotationsVisible,
  onBboxesChange,
}: {
  initialBboxes?: typeof SAMPLE_BBOXES
  readOnly?: boolean
  imageSrc?: string
  /** modal 안 사용 — 자체 chrome(hint / overlay controls / toolbar) 모두 숨김 */
  inModal?: boolean
  /** controlled — modal 등 외부에서 제어 시 전달 */
  editMode?: 'cursor' | 'bbox'
  annotationsVisible?: boolean
  onBboxesChange?: (bboxes: typeof SAMPLE_BBOXES) => void
}): JSX.Element {
  const [selectedClassId, setSelectedClassId] = useState<string | null>('c1')
  const [internalMode, setInternalMode] = useState<'cursor' | 'bbox'>(readOnly ? 'cursor' : 'bbox')
  const effectiveMode = editModeProp ?? internalMode
  const hideChrome = inModal || readOnly
  return (
    <BBoxCanvasView
      imageDataUrl={imageSrc}
      classes={SAMPLE_CLASSES_FULL}
      selectedClassId={selectedClassId}
      editMode={effectiveMode}
      initialBboxes={initialBboxes}
      options={{ require_labeling: false, require_min_bbox_count: 0, block_next_without_labeling: false }}
      hideActions={hideChrome}
      hideHint={hideChrome}
      hideOverlayControls={inModal}
      annotationsVisible={annotationsVisible}
      labels={BBOX_LABELS}
      onSave={() => undefined}
      onSkip={() => undefined}
      onRetry={() => undefined}
      onEditModeChange={editModeProp || readOnly ? undefined : setInternalMode}
      onSelectionChange={(_, classId) => { if (classId) setSelectedClassId(classId) }}
      onBboxesChange={onBboxesChange as (bboxes: BBox[]) => void}
    />
  )
}
