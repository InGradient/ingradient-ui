import { useId, type CSSProperties, type ReactNode } from 'react'
import styled from 'styled-components'
import { X, ZoomIn, ZoomOut } from 'lucide-react'
import { IconButton } from '../../components/inputs/icon-button'
import { Spinner } from '../../components/feedback/spinner'

// ─── CanvasZoomCloseControls ──────────────────────────────────────────────────

const ZoomCloseGroup = styled.div`
  position: absolute;
  top: var(--ig-space-2);
  right: var(--ig-space-4);
  z-index: 20;
  display: flex;
  align-items: center;
  gap: var(--ig-space-2);
`

export interface CanvasZoomCloseControlsProps {
  zoom: number
  onZoomIn: () => void
  onZoomOut: () => void
  onClose: () => void
  /** Minimum zoom — disables zoom-out when reached. Default 1. */
  minZoom?: number
  className?: string
}

/**
 * Canvas 우상단 floating 컨트롤 — zoom out / zoom in / close.
 * platform 의 `TopRightFloatingControls` 의 generic 추출.
 */
export function CanvasZoomCloseControls({
  zoom,
  onZoomIn,
  onZoomOut,
  onClose,
  minZoom = 1,
  className,
}: CanvasZoomCloseControlsProps) {
  return (
    <ZoomCloseGroup className={className}>
      <IconButton
        variant="secondary"
        aria-label="Zoom out"
        title="Zoom out"
        disabled={zoom <= minZoom}
        onClick={(e) => {
          e.stopPropagation()
          onZoomOut()
        }}
      >
        <ZoomOut size={18} />
      </IconButton>
      <IconButton
        variant="secondary"
        aria-label="Zoom in"
        title="Zoom in"
        onClick={(e) => {
          e.stopPropagation()
          onZoomIn()
        }}
      >
        <ZoomIn size={18} />
      </IconButton>
      <IconButton
        variant="secondary"
        aria-label="Close"
        title="Close"
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
      >
        <X size={18} />
      </IconButton>
    </ZoomCloseGroup>
  )
}

// ─── CanvasImageLoadingOverlay ────────────────────────────────────────────────

const ImageLoadingOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ig-color-canvas-overlay-soft);
  pointer-events: none;
`

export interface CanvasImageLoadingOverlayProps {
  className?: string
}

/**
 * 전체 영역 dim + 중앙 스피너 — image 로딩 중 표시.
 * LabelingCanvas 의 overlays slot 안에 사용.
 */
export function CanvasImageLoadingOverlay({ className }: CanvasImageLoadingOverlayProps) {
  return (
    <ImageLoadingOverlay className={className}>
      <Spinner size="md" tone="white" />
    </ImageLoadingOverlay>
  )
}

// ─── CanvasHiResLoadingPill ───────────────────────────────────────────────────

const HiResPill = styled.div`
  position: absolute;
  top: var(--ig-space-3);
  right: var(--ig-space-3);
  z-index: 4;
  display: flex;
  align-items: center;
  gap: var(--ig-space-2);
  padding: var(--ig-space-2) var(--ig-space-3);
  border-radius: var(--ig-radius-pill);
  background: var(--ig-color-canvas-overlay-strong);
  color: var(--ig-color-text-primary);
  font-size: var(--ig-font-size-xs);
  line-height: 1;
  pointer-events: none;
`

export interface CanvasHiResLoadingPillProps {
  /** Default: "Loading hi-res…". */
  label?: ReactNode
  className?: string
}

/**
 * Canvas 우상단 fix pill — hi-res 원본 prefetch 중 표시.
 * preview 이미지는 그대로 보여주면서 lossless 원본 로딩 진행 알림.
 */
export function CanvasHiResLoadingPill({
  label = 'Loading hi-res…',
  className,
}: CanvasHiResLoadingPillProps) {
  return (
    <HiResPill role="status" aria-live="polite" className={className}>
      <Spinner size="sm" tone="white" />
      <span>{label}</span>
    </HiResPill>
  )
}

// ─── ArchivedImageOverlay ─────────────────────────────────────────────────────

const DIM_FILL = 'rgba(0, 0, 0, 0.3)'
const STRIPE_COLOR = 'rgba(0, 0, 0, 0.5)'
const STRIPE_WIDTH = 2
const PATTERN_SIZE = 4
const PATTERN_ROTATION = 45

export interface ArchivedImageOverlayProps {
  className?: string
  /** Caller 의 컨텍스트별 추가 스타일 (borderRadius, zIndex 등). */
  style?: CSSProperties
}

/**
 * Archived 이미지 위에 덧씌우는 dim + diagonal hatch overlay (SVG).
 * Gallery thumb / image detail / group thumb strip 등에서 공유 사용.
 * parent 가 position:relative 여야 inset:0 가 의도대로 동작.
 *
 * 같은 페이지에 여러 번 렌더될 때 SVG <pattern> id 충돌을 피하려고
 * `useId()` 로 인스턴스마다 고유 id 부여.
 */
export function ArchivedImageOverlay({ className, style }: ArchivedImageOverlayProps) {
  const rawId = useId()
  const patternId = `archived-hatch-${rawId.replace(/:/g, '')}`
  return (
    <svg
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        ...style,
      }}
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <pattern
          id={patternId}
          width={PATTERN_SIZE}
          height={PATTERN_SIZE}
          patternUnits="userSpaceOnUse"
          patternTransform={`rotate(${PATTERN_ROTATION})`}
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2={PATTERN_SIZE}
            stroke={STRIPE_COLOR}
            strokeWidth={STRIPE_WIDTH}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={DIM_FILL} />
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  )
}
