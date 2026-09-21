// Capture 탭 가운데 — 라이브 프리뷰와 촬영 버튼.
// 프레임이 아직 화면에 안 실린 상태(검은 화면 + 그리드)가 현장 대기 모습이다.
import { useState } from 'react'
import { CaptureReviewFullscreen, CaptureView, type PreviewPatternLabel } from '@ingradient/edge-pages'
import { SYNTHETIC_CAPTURE } from './capture-fixtures'
import { CAPTURE_LABELS } from '../../../../fixtures/edge/0.0.5'

export function CaptureContent({
  isCapturing = false,
  isSetupMode = false,
  isConnected = true,
  previewPatternLabel = null,
  onCapture,
}: { isCapturing?: boolean; isSetupMode?: boolean; isConnected?: boolean; previewPatternLabel?: PreviewPatternLabel | null; onCapture?: () => void } = {}): JSX.Element {
  const [showGrid, setShowGrid] = useState(true)
  const [showControls, setShowControls] = useState(false)
  const [review, setReview] = useState(false)
  const [status, setStatus] = useState('Simulation — no camera commands')

  if (review) return <CaptureReviewFullscreen src={SYNTHETIC_CAPTURE} showSkip labels={{ enterFullscreen: 'Enter fullscreen', exitFullscreen: 'Exit fullscreen', skip: 'Skip simulated capture', save: 'Save simulated capture' }} onSkip={() => { setReview(false); setStatus('Simulation: capture skipped') }} onSave={() => { setReview(false); setStatus('Simulation: capture saved in story only') }} />

  return (
    <CaptureView
      isConnected={isConnected}
      isConnecting={false}
      isCapturing={isCapturing}
      isSetupMode={isSetupMode}
      isSetupBusy={false}
      isSavingSequence={false}
      liveFrameSrc={null}
      previewSrc={null}
      frozenFrameSrc={null}
      hasReceivedSnapshot={false}
      snapshotError={null}
      progressText={isCapturing ? 'Capturing... 12/33' : CAPTURE_LABELS.ready}
      captureStep={isCapturing ? 11 : null}
      captureTotalSteps={isCapturing ? 33 : null}
      setupMetrics={null}
      previewPatternLabel={previewPatternLabel}
      setupPatternLabel={previewPatternLabel}
      captureDisabledReason={null}
      captureStatusHint={status}
      showGrid={showGrid}
      showControls={showControls}
      labels={CAPTURE_LABELS}
      onCapture={() => { if (onCapture) onCapture(); else setReview(true) }}
      onReconnect={() => setStatus('Simulation: reconnect requested; no camera commands')}
      onToggleGrid={() => setShowGrid((v) => !v)}
      onToggleControls={() => setShowControls((v) => !v)}
    />
  )
}
