import { iconSizeNumbers } from '@ingradient/ui'
import { Maximize2, Minimize2 } from 'lucide-react'
import { useFullscreen } from './use-fullscreen'
import {
  CaptureReview, CaptureReviewFullscreenBtn, CapturePreviewImg,
  CaptureReviewActions, CaptureReviewSkipBtn, CaptureReviewSaveBtn,
} from './CaptureReviewFullscreen.styles'
import type { CaptureReviewFullscreenProps } from './types'

export function CaptureReviewFullscreen(props: CaptureReviewFullscreenProps): JSX.Element {
  const { src, showSkip, labels, onSkip, onSave } = props
  const { ref, isFullscreen, toggle } = useFullscreen<HTMLDivElement>()

  return (
    <CaptureReview ref={ref}>
      <CaptureReviewFullscreenBtn
        type="button"
        onClick={toggle}
        title={isFullscreen ? labels.exitFullscreen : labels.enterFullscreen}
        aria-label={isFullscreen ? labels.exitFullscreen : labels.enterFullscreen}
      >
        {isFullscreen ? <Minimize2 size={iconSizeNumbers.lg} /> : <Maximize2 size={iconSizeNumbers.lg} />}
      </CaptureReviewFullscreenBtn>
      <CapturePreviewImg src={src} alt="Captured" />
      <CaptureReviewActions>
        {showSkip && (
          <CaptureReviewSkipBtn type="button" onClick={onSkip}>{labels.skip}</CaptureReviewSkipBtn>
        )}
        <CaptureReviewSaveBtn type="button" onClick={onSave}>{labels.save}</CaptureReviewSaveBtn>
      </CaptureReviewActions>
    </CaptureReview>
  )
}
