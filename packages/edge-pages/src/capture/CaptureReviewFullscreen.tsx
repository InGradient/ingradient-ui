import { iconSizeNumbers } from '@ingradient/ui'
import { Button, IconButton, ExpandIcon, CollapseIcon } from '@ingradient/ui/components'
import { Inline } from '@ingradient/ui/primitives'
import { useFullscreen } from './use-fullscreen'
import {
  CaptureReview, CapturePreviewImg,
} from './CaptureReviewFullscreen.styles'
import type { CaptureReviewFullscreenProps } from './types'

export function CaptureReviewFullscreen(props: CaptureReviewFullscreenProps): JSX.Element {
  const { src, showSkip, labels, onSkip, onSave } = props
  const { ref, isFullscreen, toggle } = useFullscreen<HTMLDivElement>()

  return (
    <CaptureReview ref={ref}>
      <IconButton
        variant="secondary"
        size="sm"
        onClick={toggle}
        title={isFullscreen ? labels.exitFullscreen : labels.enterFullscreen}
        aria-label={isFullscreen ? labels.exitFullscreen : labels.enterFullscreen}
        style={{ position: 'absolute', top: 'var(--ig-spacing-8)', right: 'var(--ig-spacing-8)', zIndex: 'var(--ig-z-capture-super)' }}
      >
        {isFullscreen ? <CollapseIcon size={iconSizeNumbers.lg} /> : <ExpandIcon size={iconSizeNumbers.lg} />}
      </IconButton>
      <CapturePreviewImg src={src} alt="Captured" />
      <Inline align="center" gap="var(--ig-spacing-8)" wrap="nowrap" style={{ flexShrink: 0 }}>
        {showSkip && (
          <Button variant="secondary" type="button" onClick={onSkip}>{labels.skip}</Button>
        )}
        <Button variant="solid" type="button" onClick={onSave}>{labels.save}</Button>
      </Inline>
    </CaptureReview>
  )
}
