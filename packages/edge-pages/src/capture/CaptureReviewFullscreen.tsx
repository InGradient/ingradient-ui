import { Button, iconSizeNumbers } from '@ingradient/ui'
import { ExpandIcon, CollapseIcon } from '@ingradient/ui/components'
import { useFullscreen } from './use-fullscreen'
import {
  CaptureReview, CaptureReviewFullscreenBtn, CapturePreviewImg,
  CaptureReviewActions,
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
        {isFullscreen ? <CollapseIcon size={iconSizeNumbers.lg} /> : <ExpandIcon size={iconSizeNumbers.lg} />}
      </CaptureReviewFullscreenBtn>
      <CapturePreviewImg src={src} alt="Captured" />
      <CaptureReviewActions>
        {showSkip && (
          <Button variant="secondary" type="button" onClick={onSkip}>{labels.skip}</Button>
        )}
        <Button variant="accent" type="button" onClick={onSave}>{labels.save}</Button>
      </CaptureReviewActions>
    </CaptureReview>
  )
}
