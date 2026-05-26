import { useMemo, useRef, useState } from 'react'
import {
  Eraser, Eye, EyeOff, Maximize2, Minimize2, MousePointer2, Save, SkipForward, Square,
} from 'lucide-react'
import { useDrawingCanvas } from '@ingradient/ui/components'
import { useZoomPan } from '@ingradient/ui'
import { LabelingCanvas } from '@ingradient/ui/patterns'
import { useFullscreen } from '../capture/use-fullscreen'
import {
  Wrap, Toolbar, CenterActions, RightActions, IconBtn, BBoxCount,
  BlockMsg,
  Header, HeaderLeft, HeaderSpacer, HeaderIconBtn,
  HintBar, ModeToggleGroup, ModeToggleBtn,
} from './BBoxCanvasView.styles'
import { toDrawingObjects, toBboxes, type BBox } from './canvas-helpers'
import type { BBoxCanvasViewProps } from './types'

export function BBoxCanvasView(props: BBoxCanvasViewProps): JSX.Element {
  const {
    imageDataUrl, displayImageUrl,
    classes, selectedClassId, editMode, initialBboxes = [],
    options, hideActions, hideHint, hideOverlayControls,
    annotationsVisible: annotationsVisibleProp, onAnnotationsVisibleChange,
    labels,
    onSave, onSkip, onEditModeChange, onSelectionChange, onBboxesChange,
  } = props

  const classMap = useMemo(() => Object.fromEntries(classes.map((c) => [c.class_id, c])), [classes])
  const [bboxes, setBboxes] = useState<BBox[]>(initialBboxes)
  const wrapRef = useRef<HTMLDivElement>(null)
  const imageAreaRef = useRef<HTMLDivElement>(null)
  const { isFullscreen, toggle: toggleFullscreen } = useFullscreen<HTMLDivElement>(wrapRef)
  const [imageAspect, setImageAspect] = useState(1)
  const [annotationsVisibleInternal, setAnnotationsVisibleInternal] = useState(true)
  const annotationsVisible = annotationsVisibleProp ?? annotationsVisibleInternal
  const setAnnotationsVisible = (next: boolean) => {
    if (annotationsVisibleProp === undefined) setAnnotationsVisibleInternal(next)
    onAnnotationsVisibleChange?.(next)
  }
  const { zoom, pan, handleWheel } = useZoomPan({ minZoom: 1, maxZoom: 8 })

  const drawingMode: 'cursor' | 'rect' = editMode === 'cursor' ? 'cursor' : 'rect'
  const drawingObjects = useMemo(() => toDrawingObjects(bboxes, classMap), [bboxes, classMap])

  const updateBboxes = (next: BBox[]) => {
    setBboxes(next)
    onBboxesChange?.(next)
  }

  const { selectedId, drawingPreview, cursor, bindings } = useDrawingCanvas({
    objects: drawingObjects,
    mode: drawingMode,
    onObjectsChange: (objs) => updateBboxes(toBboxes(objs, bboxes, selectedClassId)),
    onSelectionChange: (id) => {
      const idx = id ? drawingObjects.findIndex((o) => o.id === id) : null
      onSelectionChange?.(idx, idx != null ? bboxes[idx]?.classId : undefined)
    },
  })

  const minBbox = options?.require_min_bbox_count ?? 0
  const canSave = !options?.require_labeling || bboxes.length >= Math.max(minBbox, 1)
  const blockMsg = !canSave
    ? (minBbox > 1 ? labels.blockMsgRequireMinBbox(minBbox) : labels.blockMsgRequireLabel)
    : null

  const renderedObjects = annotationsVisible ? drawingObjects : []
  const renderedSelected = annotationsVisible ? selectedId : null
  const showHeader = !hideOverlayControls
  const showModeToggle = !!onEditModeChange

  return (
    <Wrap ref={wrapRef}>
      {showHeader && (
        <Header>
          <HeaderSpacer />
          <HeaderLeft>
            <HeaderIconBtn
              type="button"
              $active={annotationsVisible}
              onClick={() => setAnnotationsVisible(!annotationsVisible)}
              title={annotationsVisible ? labels.hideAnnotations : labels.showAnnotations}
              aria-label={annotationsVisible ? labels.hideAnnotations : labels.showAnnotations}
            >
              {annotationsVisible ? <Eye size={16} /> : <EyeOff size={16} />}
            </HeaderIconBtn>
            <HeaderIconBtn
              type="button"
              onClick={toggleFullscreen}
              title={isFullscreen ? labels.exitFullscreen : labels.enterFullscreen}
              aria-label={isFullscreen ? labels.exitFullscreen : labels.enterFullscreen}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </HeaderIconBtn>
          </HeaderLeft>
        </Header>
      )}
      <LabelingCanvas
        wrapRef={wrapRef}
        imageAreaRef={imageAreaRef}
        imageUrl={displayImageUrl || imageDataUrl}
        alt="Capture for labeling"
        imageAspect={imageAspect}
        onImageLoad={(w, h) => setImageAspect(w / h)}
        zoom={zoom}
        pan={pan}
        onWheel={handleWheel}
        objects={renderedObjects}
        preview={annotationsVisible ? drawingPreview : null}
        selectedId={renderedSelected}
        showHandles={editMode === 'cursor'}
        showLabels
        mouseHandlers={bindings}
        cursor={cursor}
        floatingOverlays={blockMsg ? <BlockMsg>{blockMsg}</BlockMsg> : undefined}
      />
      {!hideHint && <HintBar>{labels.hint}</HintBar>}
      {!hideActions && (
        <Toolbar>
          {showModeToggle && (
            <ModeToggleGroup>
              <ModeToggleBtn
                type="button"
                $active={editMode === 'cursor'}
                onClick={() => onEditModeChange?.('cursor')}
                title={labels.cursorMode}
                aria-label={labels.cursorMode}
              >
                <MousePointer2 size={16} />
              </ModeToggleBtn>
              <ModeToggleBtn
                type="button"
                $active={editMode === 'bbox'}
                onClick={() => onEditModeChange?.('bbox')}
                title={labels.bboxMode}
                aria-label={labels.bboxMode}
              >
                <Square size={16} />
              </ModeToggleBtn>
            </ModeToggleGroup>
          )}
          <CenterActions>
            {!options?.block_next_without_labeling && (
              <IconBtn $variant="danger" onClick={onSkip} title={labels.skip} aria-label={labels.skip}>
                <SkipForward size={18} />
              </IconBtn>
            )}
            <IconBtn
              $variant="primary"
              onClick={() => onSave(bboxes)}
              disabled={!canSave}
              title={canSave ? labels.save : (blockMsg ?? labels.save)}
              aria-label={labels.save}
            >
              <Save size={18} />
            </IconBtn>
          </CenterActions>
          <RightActions>
            <BBoxCount>{labels.bboxCount(bboxes.length)}</BBoxCount>
            <IconBtn
              $variant="secondary"
              onClick={() => { updateBboxes([]); onSelectionChange?.(null) }}
              title={labels.reset}
              aria-label={labels.reset}
            >
              <Eraser size={18} />
            </IconBtn>
          </RightActions>
        </Toolbar>
      )}
    </Wrap>
  )
}
