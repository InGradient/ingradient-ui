import { useMemo, useRef, useState } from 'react'
import { IconButton, MenuIconButton, EraserIcon, EyeIcon, EyeOffIcon, ExpandIcon, CollapseIcon, PointerIcon, SaveIcon, SkipForwardIcon, SquareIcon } from '@ingradient/ui/components'
import { useDrawingCanvas, useZoomPan, iconSizeNumbers } from '@ingradient/ui'
import { LabelingCanvas } from '@ingradient/ui/patterns'
import { useFullscreen } from '../capture/use-fullscreen'
import {
  Wrap, Toolbar, CenterActions, RightActions, BBoxCount,
  BlockMsg,
  Header, HeaderLeft, HeaderSpacer,
  HintBar, ModeToggleGroup,
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
            <MenuIconButton
              $active={annotationsVisible}
              onClick={() => setAnnotationsVisible(!annotationsVisible)}
              title={annotationsVisible ? labels.hideAnnotations : labels.showAnnotations}
              aria-label={annotationsVisible ? labels.hideAnnotations : labels.showAnnotations}
            >
              {annotationsVisible ? <EyeIcon size={iconSizeNumbers.md} /> : <EyeOffIcon size={iconSizeNumbers.md} />}
            </MenuIconButton>
            <MenuIconButton
              $active={false}
              onClick={toggleFullscreen}
              title={isFullscreen ? labels.exitFullscreen : labels.enterFullscreen}
              aria-label={isFullscreen ? labels.exitFullscreen : labels.enterFullscreen}
            >
              {isFullscreen ? <CollapseIcon size={iconSizeNumbers.md} /> : <ExpandIcon size={iconSizeNumbers.md} />}
            </MenuIconButton>
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
              <MenuIconButton
                $active={editMode === 'cursor'}
                onClick={() => onEditModeChange?.('cursor')}
                title={labels.cursorMode}
                aria-label={labels.cursorMode}
              >
                <PointerIcon size={iconSizeNumbers.md} />
              </MenuIconButton>
              <MenuIconButton
                $active={editMode === 'bbox'}
                onClick={() => onEditModeChange?.('bbox')}
                title={labels.bboxMode}
                aria-label={labels.bboxMode}
              >
                <SquareIcon size={iconSizeNumbers.md} />
              </MenuIconButton>
            </ModeToggleGroup>
          )}
          <CenterActions>
            {!options?.block_next_without_labeling && (
              <IconButton tone="danger" onClick={onSkip} title={labels.skip} aria-label={labels.skip}>
                <SkipForwardIcon size={iconSizeNumbers.lg} />
              </IconButton>
            )}
            <IconButton
              variant="accent"
              onClick={() => onSave(bboxes)}
              disabled={!canSave}
              title={canSave ? labels.save : (blockMsg ?? labels.save)}
              aria-label={labels.save}
            >
              <SaveIcon size={iconSizeNumbers.lg} />
            </IconButton>
          </CenterActions>
          <RightActions>
            <BBoxCount>{labels.bboxCount(bboxes.length)}</BBoxCount>
            <IconButton
              variant="secondary"
              onClick={() => { updateBboxes([]); onSelectionChange?.(null) }}
              title={labels.reset}
              aria-label={labels.reset}
            >
              <EraserIcon size={iconSizeNumbers.lg} />
            </IconButton>
          </RightActions>
        </Toolbar>
      )}
    </Wrap>
  )
}
