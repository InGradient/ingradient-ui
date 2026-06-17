import type { BBox, ClassInfo, EdgeOptions } from './canvas-helpers'

export type { BBox, ClassInfo, EdgeOptions }

export interface BBoxCanvasLabels {
  save: string
  skip: string
  retry: string
  reset: string
  enterFullscreen: string
  exitFullscreen: string
  bboxCount: (count: number) => string
  blockMsgRequireLabel: string
  blockMsgRequireMinBbox: (count: number) => string
  hint: string
  showAnnotations: string
  hideAnnotations: string
  cursorMode: string
  bboxMode: string
}

export interface BBoxCanvasViewProps {
  imageDataUrl: string
  displayImageUrl?: string | null

  classes: ClassInfo[]
  selectedClassId: string | null
  editMode: 'cursor' | 'bbox'
  initialBboxes?: BBox[]
  options?: EdgeOptions | null
  pendingClassChange?: { bboxIdx: number; classId: string } | null

  hideActions?: boolean
  hideHint?: boolean
  /** floatingOverlays 의 AnnotationToggleBtn + FullscreenBtn 숨김. modal 안에서 사용 시 true. */
  hideOverlayControls?: boolean

  /** Controlled annotations visibility. undefined 면 view 안 state 로 관리. */
  annotationsVisible?: boolean
  onAnnotationsVisibleChange?: (visible: boolean) => void

  labels: BBoxCanvasLabels

  onSave: (bboxes: BBox[]) => void
  onSkip: () => void
  onRetry: () => void
  /** editMode 토글 활성화 — 제공 시 toolbar 좌측에 Cursor/BBox 토글 버튼 표시 */
  onEditModeChange?: (mode: 'cursor' | 'bbox') => void
  onSelectionChange?: (idx: number | null, classId?: string | null) => void
  onBboxesChange?: (bboxes: BBox[]) => void
}
